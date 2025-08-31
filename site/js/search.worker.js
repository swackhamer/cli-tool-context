/**
 * Search Web Worker
 * Builds Lunr.js search index in background thread to prevent UI blocking
 */

// Import Lunr.js with error handling for different path scenarios
let lunrLoaded = false;
try {
    // Try multiple paths to ensure compatibility
    try {
        importScripts('../lib/lunr.min.js');
        lunrLoaded = true;
    } catch (e1) {
        // Try alternate path if first fails
        try {
            importScripts('/lib/lunr.min.js');
            lunrLoaded = true;
        } catch (e2) {
            // Try another relative path
            importScripts('./lib/lunr.min.js');
            lunrLoaded = true;
        }
    }
} catch (error) {
    console.error('Failed to load Lunr.js:', error);
    self.postMessage({
        type: 'WORKER_ERROR',
        error: 'Failed to load search library: ' + error.message
    });
}

// Validate Lunr.js loaded successfully
if (lunrLoaded && typeof lunr === 'undefined') {
    lunrLoaded = false;
    self.postMessage({
        type: 'WORKER_ERROR',
        error: 'Lunr.js loaded but not available'
    });
}

let searchIndex = null;
let indexedData = [];

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
        // Validate tools data
        if (!Array.isArray(tools)) {
            throw new Error('Invalid tools data: expected array');
        }
        
        if (tools.length === 0) {
            console.warn('Building search index with empty tools array');
        } else {
            console.log('Building search index with', tools.length, 'tools');
        }
        
        // Store the data for search results
        indexedData = tools;
        
        // Build the Lunr index
        searchIndex = lunr(function () {
            this.ref('id');
            this.field('name', { boost: 10 });
            this.field('description', { boost: 5 });
            this.field('category', { boost: 3 });
            this.field('usage', { boost: 2 });
            this.field('examples');
            this.field('searchFields');

            tools.forEach(function (tool, idx) {
                // Validate tool has required fields
                if (!tool || typeof tool !== 'object') {
                    console.warn(`Skipping invalid tool at index ${idx}`);
                    return;
                }
                
                // Use tool ID as the reference, fall back to name if ID not available
                const toolRef = tool.id || tool.name || `tool-${idx}`;
                
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
            indexSize: tools.length,
            memoryUsage: JSON.stringify(searchIndex).length
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
            // Find tool by ID first, fall back to name for backward compatibility
            const tool = indexedData.find(t => (t.id === result.ref) || (t.name === result.ref));
            return {
                ...tool,
                score: result.score,
                matches: result.matchData
            };
        });

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
self.postMessage({ type: 'WORKER_READY' });