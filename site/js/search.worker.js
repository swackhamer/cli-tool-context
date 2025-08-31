/**
 * Search Web Worker
 * Builds Lunr.js search index in background thread to prevent UI blocking
 */

// Import Lunr.js with comprehensive error handling for different path scenarios
let lunrLoaded = false;
let loadError = null;

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

// Try loading Lunr.js from various paths
const pathsToTry = [
    '../lib/lunr.min.js',  // Relative to worker location
    './lib/lunr.min.js',   // Same directory structure
    '/lib/lunr.min.js',    // Absolute from root
    'lib/lunr.min.js',     // Relative without prefix
    '/site/lib/lunr.min.js' // Full site path
];

for (const path of pathsToTry) {
    if (lunrLoaded) break;
    
    try {
        const absolutePath = getAbsolutePath(path);
        const debug = self.debugHelper?.isDebugMode;
        if (debug) console.log('Attempting to load Lunr.js from:', absolutePath);
        importScripts(absolutePath);
        
        // Validate that lunr is actually available
        if (typeof lunr !== 'undefined') {
            lunrLoaded = true;
            const debug = self.debugHelper?.isDebugMode;
            if (debug) console.log('Successfully loaded Lunr.js from:', path);
        }
    } catch (error) {
        loadError = error;
        const debug = self.debugHelper?.isDebugMode;
        if (debug) console.warn(`Failed to load Lunr.js from ${path}:`, error.message);
    }
}

// Report loading status
if (!lunrLoaded) {
    const errorMsg = 'Failed to load Lunr.js from any path. Last error: ' + (loadError ? loadError.message : 'Unknown');
    console.error(errorMsg);
    self.postMessage({
        type: 'WORKER_ERROR',
        error: errorMsg
    });
}

// Final validation
if (lunrLoaded && typeof lunr === 'undefined') {
    lunrLoaded = false;
    self.postMessage({
        type: 'WORKER_ERROR',
        error: 'Lunr.js loaded but lunr object not available'
    });
}

let searchIndex = null;
let indexedData = [];
let toolByRef = new Map();

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
                    error: 'Search not available'
                });
                return;
            }
            performSearch(data.query, data.limit || 10);
            break;
        case 'PING':
        case 'health-check':
            self.postMessage({ 
                type: event.data.type === 'health-check' ? 'health-check-response' : 'PONG',
                ready: lunrLoaded && searchIndex !== null
            });
            break;
        default:
            console.warn('Unknown message type:', type);
    }
};

/**
 * Build the search index from tools data with validation
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
            self.postMessage({
                type: 'INDEX_READY',
                ready: true,
                indexSize: 0,
                toolCount: 0
            });
            return;
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
            throw new Error('No valid tools found after validation');
        }
        
        console.log(`${validTools.length} valid tools after validation`);
        
        // Store the data for search results
        indexedData = validTools;
        
        // Build tool reference map for O(1) lookup
        toolByRef = new Map();
        
        // Build the Lunr index
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
                const searchText = searchFields.filter(Boolean).join(' ').toLowerCase();
                
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
 * Perform search using the built index
 */
function performSearch(query, limit = 10) {
    if (!searchIndex) {
        self.postMessage({
            type: 'SEARCH_ERROR',
            error: 'Search index not ready'
        });
        return;
    }

    try {
        const start = performance.now();
        
        // Perform the search
        const results = searchIndex.search(query);
        
        // Get the actual tool data for the results
        const searchResults = results.slice(0, limit).map(result => {
            // Use O(1) lookup from map
            const tool = toolByRef.get(result.ref);
            return tool ? {
                ...tool,
                score: result.score,
                matches: result.matchData
            } : null;
        }).filter(Boolean);

        const duration = performance.now() - start;

        self.postMessage({
            type: 'SEARCH_RESULTS',
            results: searchResults,
            totalFound: results.length,
            query: query,
            duration: duration
        });

    } catch (error) {
        self.postMessage({
            type: 'SEARCH_ERROR',
            error: error.message
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

// Worker is ready
self.postMessage({ type: 'WORKER_READY', ready: !!lunrLoaded });