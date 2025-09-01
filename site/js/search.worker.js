/* global self, importScripts, lunr, performance */
/* eslint-env worker */
/* eslint no-useless-escape: "off" */
/**
 * Search Web Worker
 * Builds Lunr.js search index in background thread to prevent UI blocking
 */

// Import Lunr.js with comprehensive error handling for different path scenarios
let lunrLoaded = false;
let loadError = null;
let loadRetries = 0;
const maxLoadRetries = 3;

// Function to validate URL resolution
function getAbsolutePath(path) {
    try {
        // Get the worker's location
        const workerLocation = self.location.href;
        const url = new URL(path, workerLocation);
        return url.href;
    } catch (e) {
        return path;
    }
}

// CDN fallback URLs for Lunr.js - Use multiple CDNs for better reliability
// IMPORTANT: Pin to version 2.3.9 across all contexts to prevent version skew
// The local lib/lunr.min.js should also be version 2.3.9
// Comment 10: Removed Skypack URL as it provides ESM incompatible with importScripts
const cdnUrls = [
    'https://unpkg.com/lunr@2.3.9/lunr.min.js',
    'https://cdn.jsdelivr.net/npm/lunr@2.3.9/lunr.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js'
];

// Try loading Lunr.js from various paths
const pathsToTry = [
    '../lib/lunr.min.js',  // Relative to worker location
    './lib/lunr.min.js',   // Same directory structure
    '/lib/lunr.min.js',    // Absolute from root
    'lib/lunr.min.js',     // Relative without prefix
    '/site/lib/lunr.min.js', // Full site path
    ...cdnUrls // Add CDN URLs as fallback
];

// Retry logic for loading Lunr.js with async fallback
async function attemptLoadLunr() {
    for (const path of pathsToTry) {
        if (lunrLoaded) break;
        
        try {
            const absolutePath = path.startsWith('http') ? path : getAbsolutePath(path);
            const debug = self.debugHelper?.isDebugMode;
            if (debug) console.log('Attempting to load Lunr.js from:', absolutePath);
            
            // Add timeout for importScripts
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Load timeout')), 3000)
            );
            
            const loadPromise = new Promise((resolve, reject) => {
                try {
                    importScripts(absolutePath);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
            
            await Promise.race([loadPromise, timeoutPromise]);
            
            // Validate that lunr is actually available
            if (typeof lunr !== 'undefined') {
                lunrLoaded = true;
                const debug = self.debugHelper?.isDebugMode;
                if (debug) console.log('Successfully loaded Lunr.js from:', path);
                break;
            }
        } catch (error) {
            loadError = error;
            const debug = self.debugHelper?.isDebugMode;
            if (debug) console.warn(`Failed to load Lunr.js from ${path}:`, error.message);
        }
    }
    
    // Retry if failed and under retry limit
    if (!lunrLoaded && loadRetries < maxLoadRetries) {
        loadRetries++;
        console.log(`Retrying Lunr.js load (attempt ${loadRetries}/${maxLoadRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * loadRetries));
        return attemptLoadLunr(); // Recursive retry with exponential backoff
    }
    
    return lunrLoaded;
}

// Use async IIFE to properly await Lunr loading before posting status
(async () => {
    const loaded = await attemptLoadLunr();
    
    if (!loaded) {
        const errorMsg = 'Failed to load Lunr.js from any path. Last error: ' + (loadError ? loadError.message : 'Unknown');
        console.error(errorMsg);
        self.postMessage({
            type: 'WORKER_ERROR',
            error: errorMsg
        });
    } else if (typeof lunr === 'undefined') {
        // Final validation
        lunrLoaded = false;
        self.postMessage({
            type: 'WORKER_ERROR',
            error: 'Lunr.js loaded but lunr object not available'
        });
    } else {
        // Successfully loaded - post WORKER_READY immediately
        console.log('Lunr.js loaded successfully in worker');
        self.postMessage({ type: 'WORKER_READY', ready: true });
    }
})();

let searchIndex = null;
let indexedData = [];
let toolByRef = new Map();
let indexBuildProgress = 0;
// Comment 11: Minimized worker cache - main cache is in performSearch
let resultCache = new Map();
const maxCacheSize = 20; // Reduced from 100 to minimize duplication
let currentSearchRequestId = null;
let searchCancelled = false;

// Handle messages from main thread
self.onmessage = function(event) {
    const { type, data } = event.data;

    switch (type) {
        case 'BUILD_INDEX':
            if (!lunrLoaded) {
                self.postMessage({
                    type: 'INDEX_ERROR',
                    error: 'Search library not loaded'
                });
                return;
            }
            buildSearchIndex(data);
            break;
        case 'SEARCH':
            if (!lunrLoaded || !searchIndex) {
                self.postMessage({
                    type: 'SEARCH_ERROR',
                    error: 'Search not available',
                    requestId: data.requestId
                });
                return;
            }
            performSearch(data.query, data.limit || 10, data.requestId);
            break;
        case 'CANCEL_SEARCH':
            if (data.requestId && data.requestId === currentSearchRequestId) {
                searchCancelled = true;
            }
            break;
        case 'PING':
        case 'health-check':
        case 'HEALTH_CHECK':
            // Standardize health-check response to single message type
            // Main thread should handle HEALTH_CHECK_RESPONSE
            const healthResponse = { 
                type: 'HEALTH_CHECK_RESPONSE',
                ready: lunrLoaded && searchIndex !== null,
                diagnostics: {
                    lunrLoaded,
                    indexReady: searchIndex !== null,
                    toolCount: toolByRef.size,
                    cacheSize: resultCache.size,
                    indexProgress: indexBuildProgress
                }
            };
            self.postMessage(healthResponse);
            // Also send PING_RESPONSE for backward compatibility
            self.postMessage({ 
                type: 'PING_RESPONSE',
                ready: lunrLoaded && searchIndex !== null,
                diagnostics: healthResponse.diagnostics
            });
            break;
        default:
            console.warn('Unknown message type:', type);
    }
};

/**
 * Build the search index from tools data with validation and chunked processing
 */
function buildSearchIndex(tools) {
    try {
        // Validate tools data structure
        if (!tools) {
            throw new Error('No tools data provided');
        }
        
        if (!Array.isArray(tools)) {
            throw new Error('Invalid tools data: expected array, got ' + typeof tools);
        }
        
        if (tools.length === 0) {
            console.warn('Building search index with empty tools array');
            // Create empty Lunr index so SEARCH doesn't error
            searchIndex = lunr(function () {
                this.ref('id');
                this.field('name');
                this.field('description');
            });
            self.postMessage({
                type: 'INDEX_READY',
                ready: true,
                indexSize: 0,
                toolCount: 0
            });
            return;
        }
        
        // Report progress for large datasets
        const totalTools = tools.length;
        if (totalTools > 100) {
            self.postMessage({
                type: 'INDEX_PROGRESS',
                progress: 0,
                total: totalTools
            });
        }
        
        const debug = self.debugHelper?.isDebugMode;
        if (debug) console.log('Building search index with', tools.length, 'tools');
        
        // Validate and filter tools with required fields
        const validTools = tools.filter((tool, index) => {
            if (!tool || typeof tool !== 'object') {
                console.warn(`Invalid tool at index ${index}: not an object`);
                return false;
            }
            if (!tool.id && !tool.name) {
                console.warn(`Tool at index ${index} missing both id and name`);
                return false;
            }
            return true;
        });
        
        if (validTools.length === 0) {
            console.warn('No valid tools found after validation - creating empty index');
            // Create empty Lunr index so SEARCH doesn't error
            searchIndex = lunr(function () {
                this.ref('id');
                this.field('name');
                this.field('description');
            });
            self.postMessage({
                type: 'INDEX_READY',
                ready: true,
                indexSize: 0,
                toolCount: 0
            });
            return;
        }
        
        console.log(`${validTools.length} valid tools after validation`);
        
        // Store the data for search results
        indexedData = validTools;
        
        // Build tool reference map for O(1) lookup
        toolByRef = new Map();
        
        // Build the Lunr index with chunked processing for large datasets
        const chunkSize = 50;
        let processedCount = 0;
        
        // Set tokenizer separator globally for Lunr 2.x
        lunr.tokenizer.separator = /[\s\-\_\.]+/;
        
        searchIndex = lunr(function () {
            this.ref('id');
            this.field('name', { boost: 10 });
            this.field('description', { boost: 5 });
            this.field('category', { boost: 3 });
            this.field('usage', { boost: 2 });
            this.field('examples');
            this.field('searchFields');

            validTools.forEach(function (tool, idx) {
                // Validate tool has required fields
                if (!tool || typeof tool !== 'object') {
                    console.warn(`Skipping invalid tool at index ${idx}`);
                    return;
                }
                
                // Use tool ID as the reference, fall back to name if ID not available
                const toolRef = tool.id || tool.name || String(idx);
                
                // Store in reference map for O(1) lookup
                toolByRef.set(toolRef, tool);
                
                // Ensure all fields exist with fallbacks
                const name = tool.name || '';
                const description = tool.description || '';
                const category = tool.category || '';
                const usage = tool.usage || '';
                
                // Normalize examples to handle both string arrays and object arrays
                const exampleTexts = Array.isArray(tool.examples)
                    ? tool.examples.map(ex => {
                        if (typeof ex === 'string') return ex;
                        if (ex && typeof ex === 'object' && ex.command) return ex.command;
                        return '';
                    }).filter(Boolean).join(' ')
                    : '';
                
                // Use optimized searchFields if available, fallback to building searchText
                const searchFields = tool.searchFields || [
                    name,
                    description,
                    category,
                    usage,
                    exampleTexts,
                    ...(tool.tags || [])
                ];
                const searchText = searchFields.filter(Boolean).join(' ');
                
                try {
                    this.add({
                        id: toolRef,
                        name: name,
                        description: description,
                        category: category,
                        usage: usage,
                        examples: exampleTexts,
                        searchFields: searchText
                    });
                    
                    // Report progress for large datasets
                    processedCount++;
                    if (processedCount % chunkSize === 0 && validTools.length > 100) {
                        self.postMessage({
                            type: 'INDEX_PROGRESS',
                            progress: processedCount,
                            total: validTools.length
                        });
                    }
                } catch (addError) {
                    console.warn(`Failed to add tool ${toolRef} to index:`, addError.message);
                }
            }, this);
        });

        // Notify main thread that index is ready
        self.postMessage({
            type: 'INDEX_READY',
            ready: true,
            indexSize: validTools.length,
            toolCount: validTools.length
        });
        
    } catch (error) {
        self.postMessage({
            type: 'INDEX_ERROR',
            error: error.message
        });
    }
}

/**
 * Perform search using the built index with caching and query preprocessing
 */
function performSearch(query, limit = 10, requestId = null) {
    if (!searchIndex) {
        self.postMessage({
            type: 'SEARCH_ERROR',
            error: 'Search index not ready',
            requestId: requestId
        });
        return;
    }

    // Track current search request
    currentSearchRequestId = requestId;
    searchCancelled = false;

    try {
        const start = performance.now();
        
        // Check cache for repeated queries
        const cacheKey = `${query}_${limit}`;
        if (resultCache.has(cacheKey)) {
            const cached = resultCache.get(cacheKey);
            // Check if search was cancelled
            if (searchCancelled && requestId === currentSearchRequestId) {
                return;
            }
            self.postMessage({
                type: 'SEARCH_RESULTS',
                results: cached,
                query: query,
                cached: true,
                duration: 0,
                requestId: requestId
            });
            return;
        }
        
        // Preprocess query to handle special characters
        const processedQuery = query
            .replace(/[\-\_\.]/g, ' ')  // Replace separators with spaces
            .replace(/[^\w\s\*\+\-\~\^]/g, '') // Remove special chars except Lunr operators
            .trim();
        
        // Add timeout for long-running searches
        let searchTimedOut = false;
        const searchTimeout = setTimeout(() => {
            searchTimedOut = true;
            // Post timeout error message instead of throwing
            self.postMessage({
                type: 'SEARCH_ERROR',
                error: 'Search timeout - query too complex',
                requestId: requestId
            });
        }, 3000);
        
        // Perform the search
        const results = searchIndex.search(processedQuery);
        clearTimeout(searchTimeout);
        
        // If search timed out or cancelled, don't send results
        if (searchTimedOut || (searchCancelled && requestId === currentSearchRequestId)) {
            return;
        }
        
        // Return lightweight references instead of full tool objects
        // This reduces payload size and postMessage overhead
        const searchResults = results.slice(0, limit).map(result => {
            // Validate the tool exists
            const tool = toolByRef.get(result.ref);
            if (!tool) return null;
            
            // Return only the reference, score, and match positions
            // Main thread will map refs back to tools
            return {
                ref: result.ref,
                score: result.score,
                positions: result.matchData ? result.matchData.metadata : null
            };
        }).filter(Boolean);

        const duration = performance.now() - start;
        
        // Cache results for repeated searches
        if (resultCache.size >= maxCacheSize) {
            // Remove oldest entry when cache is full
            const firstKey = resultCache.keys().next().value;
            resultCache.delete(firstKey);
        }
        resultCache.set(cacheKey, searchResults);

        // Final check before sending results
        if (searchCancelled && requestId === currentSearchRequestId) {
            return;
        }

        self.postMessage({
            type: 'SEARCH_RESULTS',
            results: searchResults,
            totalFound: results.length,
            query: query,
            duration: duration,
            cached: false,
            requestId: requestId
        });

    } catch (error) {
        self.postMessage({
            type: 'SEARCH_ERROR',
            error: error.message,
            requestId: requestId
        });
    }
}

// Handle errors
self.onerror = function(error) {
    self.postMessage({
        type: 'WORKER_ERROR',
        error: error.message
    });
};

// Worker ready message is now sent immediately after Lunr loads in the IIFE above