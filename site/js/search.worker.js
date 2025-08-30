/**
 * Search Web Worker
 * Builds Lunr.js search index in background thread to prevent UI blocking
 */

// Import Lunr.js in the worker context
importScripts('../lib/lunr.min.js');

let searchIndex = null;
let indexedData = [];

// Handle messages from main thread
self.onmessage = function(event) {
    const { type, data } = event.data;

    switch (type) {
        case 'BUILD_INDEX':
            buildSearchIndex(data);
            break;
        case 'SEARCH':
            performSearch(data.query, data.limit || 10);
            break;
        case 'PING':
            self.postMessage({ type: 'PONG' });
            break;
        default:
            console.warn('Unknown message type:', type);
    }
};

/**
 * Build the search index from tools data
 */
function buildSearchIndex(tools) {
    try {
        console.log('Building search index with', tools.length, 'tools');
        
        // Store the data for search results
        indexedData = tools;
        
        // Build the Lunr index
        searchIndex = lunr(function () {
            this.ref('name');
            this.field('name', { boost: 10 });
            this.field('description', { boost: 5 });
            this.field('category', { boost: 3 });
            this.field('usage', { boost: 2 });
            this.field('examples');
            this.field('searchFields');

            tools.forEach(function (tool, idx) {
                // Normalize examples to handle both string arrays and object arrays
                const exampleTexts = Array.isArray(tool.examples)
                    ? tool.examples.map(ex => typeof ex === 'string' ? ex : ex.command).join(' ')
                    : '';
                
                // Use optimized searchFields if available, fallback to building searchText
                const searchFields = tool.searchFields || [
                    tool.name,
                    tool.description,
                    tool.category,
                    tool.usage,
                    ...(tool.examples || []).map(ex => typeof ex === 'string' ? ex : ex.command),
                    ...(tool.tags || [])
                ];
                const searchText = searchFields.join(' ').toLowerCase();
                
                this.add({
                    name: tool.name,
                    description: tool.description,
                    category: tool.category,
                    usage: tool.usage,
                    examples: exampleTexts,
                    searchFields: searchText
                });
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
            const tool = indexedData.find(t => t.name === result.ref);
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