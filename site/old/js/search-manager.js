/**
 * SearchManager - Unified search implementation for CLI Tool Context
 * Consolidates Web Worker, fallback, and main thread search into a single system
 */

class SearchManager {
    constructor() {
        this.lunrIndex = null;
        this.tools = [];
        this.isReady = false;
        this.cache = new Map();
        this.cacheTimeout = 5000; // 5 second TTL
        this.abortController = null;
    }

    /**
     * Initialize the search index with tool data
     * @param {Array} tools - Array of tool objects
     * @returns {Promise<void>}
     */
    async initialize(tools) {
        try {
            if (!tools || !Array.isArray(tools) || tools.length === 0) {
                throw new Error('Invalid tools data for search initialization');
            }

            this.tools = tools;
            
            // Set tokenizer globally before building
            lunr.tokenizer.separator = /[\s\-_]+/;
            
            // Build Lunr index synchronously
            this.lunrIndex = lunr(function() {
                // Configure fields with boosts
                this.field('name', { boost: 10 });
                this.field('description', { boost: 5 });
                this.field('category', { boost: 3 });
                this.field('examples');
                this.field('alternatives');
                this.field('tags');
                
                // Add documents
                tools.forEach((tool, idx) => {
                    this.add({
                        id: idx,
                        name: tool.name || '',
                        description: tool.description || '',
                        category: tool.category || '',
                        examples: Array.isArray(tool.examples) ? tool.examples.map(ex => (typeof ex === 'string' ? ex : (ex.command || ex.description || ''))).join(' ') : '',
                        alternatives: Array.isArray(tool.alternatives) ? tool.alternatives.join(' ') : '',
                        tags: Array.isArray(tool.tags) ? tool.tags.join(' ') : ''
                    });
                });
            });
            
            this.isReady = true;
            
            // Dispatch ready event for compatibility
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('searchReady', { 
                    detail: { ready: true, toolCount: tools.length }
                }));
            }
            
            // Log success
            if (window.debugHelper) {
                window.debugHelper.log('search', 'SearchManager initialized', {
                    toolCount: tools.length,
                    indexSize: JSON.stringify(this.lunrIndex).length
                });
            }
            
        } catch (error) {
            console.error('Failed to initialize search index:', error);
            this.isReady = false;
            
            if (window.debugHelper) {
                window.debugHelper.logError('search', 'Initialization failed', error);
            }
            
            throw error;
        }
    }

    /**
     * Perform a search query
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @returns {Array} Search results
     */
    search(query, options = {}) {
        const { limit = 50, useCache = true } = options;
        
        if (!query || typeof query !== 'string') {
            return [];
        }
        
        // Normalize query
        query = query.trim().toLowerCase();
        
        if (query.length < 2) {
            return [];
        }
        
        // Check cache
        if (useCache) {
            const cached = this.getCached(query);
            if (cached) {
                return cached.slice(0, limit);
            }
        }
        
        // AbortController logic removed - not needed for synchronous search
        
        let results = [];
        
        try {
            if (this.lunrIndex && this.isReady) {
                // Use Lunr.js search
                results = this.searchWithLunr(query, limit);
            } else {
                // Fallback to simple search
                results = this.simpleSearch(query, limit);
            }
            
            // Cache results
            if (useCache && results.length > 0) {
                this.setCached(query, results);
            }
            
        } catch (error) {
            console.error('Search error:', error);
            
            // Fallback to simple search on error
            try {
                results = this.simpleSearch(query, limit);
            } catch (fallbackError) {
                console.error('Fallback search error:', fallbackError);
                results = [];
            }
        }
        
        return results;
    }

    /**
     * Search using Lunr.js index
     * @private
     */
    searchWithLunr(query, limit) {
        const processedQuery = this.preprocessQuery(query);
        
        let lunrResults;
        try {
            // Try exact search first
            lunrResults = this.lunrIndex.search(processedQuery);
            
            // If no results, try fuzzy search
            if (lunrResults.length === 0 && !processedQuery.includes('*')) {
                const fuzzyQuery = processedQuery.split(' ')
                    .map(term => term + '~1')
                    .join(' ');
                lunrResults = this.lunrIndex.search(fuzzyQuery);
            }
        } catch (error) {
            // If Lunr query fails, try a simpler query
            const simpleQuery = query.replace(/[^a-z0-9\s]/gi, ' ').trim();
            lunrResults = this.lunrIndex.search(simpleQuery);
        }
        
        // Convert Lunr results to our format
        const results = lunrResults
            .slice(0, limit)
            .map(result => {
                const tool = this.tools[parseInt(result.ref)];
                if (!tool) return null;
                
                return {
                    tool: tool,
                    score: result.score,
                    highlights: this.generateHighlights(tool, query)
                };
            })
            .filter(Boolean);
        
        return results;
    }

    /**
     * Simple fallback search without Lunr.js
     * @private
     */
    simpleSearch(query, limit) {
        const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
        
        const results = [];
        
        for (const tool of this.tools) {
            if (results.length >= limit) break;
            
            const searchText = [
                tool.name,
                tool.description,
                tool.category,
                ...(tool.examples || []),
                ...(tool.alternatives || []),
                ...(tool.tags || [])
            ].join(' ').toLowerCase();
            
            // Check if all query terms are present
            const matches = queryTerms.every(term => searchText.includes(term));
            
            if (matches) {
                // Calculate simple relevance score
                let score = 0;
                queryTerms.forEach(term => {
                    if (tool.name && tool.name.toLowerCase().includes(term)) score += 10;
                    if (tool.description && tool.description.toLowerCase().includes(term)) score += 5;
                    if (tool.category && tool.category.toLowerCase().includes(term)) score += 3;
                });
                
                results.push({
                    tool: tool,
                    score: score,
                    highlights: this.generateHighlights(tool, query)
                });
            }
        }
        
        // Sort by score
        results.sort((a, b) => b.score - a.score);
        
        return results.slice(0, limit);
    }

    /**
     * Preprocess query for Lunr.js
     * @private
     */
    preprocessQuery(query) {
        // Handle exact match quotes
        const exactMatches = [];
        let processedQuery = query.replace(/"([^"]+)"/g, (match, p1) => {
            exactMatches.push(p1);
            return p1;
        });
        
        // Clean special characters that might break Lunr
        processedQuery = processedQuery
            .replace(/[^\w\s\-\*\~\+]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Add wildcards for partial matching
        if (!processedQuery.includes('*') && !processedQuery.includes('~')) {
            processedQuery = processedQuery
                .split(' ')
                .map(term => term.length > 2 ? term + '*' : term)
                .join(' ');
        }
        
        return processedQuery;
    }

    /**
     * Generate highlights for search results
     * @private
     */
    generateHighlights(tool, query) {
        const highlights = {};
        const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
        
        // Highlight in name
        if (tool.name) {
            highlights.name = this.highlightText(tool.name, queryTerms);
        }
        
        // Highlight in description (first 200 chars)
        if (tool.description) {
            const truncated = tool.description.substring(0, 200);
            highlights.description = this.highlightText(truncated, queryTerms);
            if (tool.description.length > 200) {
                highlights.description += '...';
            }
        }
        
        // Highlight in category
        if (tool.category) {
            highlights.category = this.highlightText(tool.category, queryTerms);
        }
        
        return highlights;
    }

    /**
     * Highlight matching terms in text
     * @private
     */
    highlightText(text, terms) {
        let highlighted = text;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });
        
        return highlighted;
    }

    /**
     * Escape regex special characters
     * @private
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Get cached results
     * @private
     */
    getCached(query) {
        const entry = this.cache.get(query);
        if (!entry) return null;
        
        const age = Date.now() - entry.timestamp;
        if (age > this.cacheTimeout) {
            this.cache.delete(query);
            return null;
        }
        
        return entry.results;
    }

    /**
     * Set cached results
     * @private
     */
    setCached(query, results) {
        // Limit cache size
        if (this.cache.size > 100) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(query, {
            results: results,
            timestamp: Date.now()
        });
    }

    /**
     * Clear the search cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Perform health check on search system
     * @returns {Object} Health status
     */
    healthCheck() {
        const status = {
            ready: this.isReady,
            indexPresent: !!this.lunrIndex,
            toolCount: this.tools.length,
            cacheSize: this.cache.size,
            canSearch: this.isReady || this.tools.length > 0
        };
        
        // Test search functionality
        try {
            const testResults = this.search('test', { limit: 1, useCache: false });
            status.searchFunctional = true;
            status.testResultCount = testResults.length;
        } catch (error) {
            status.searchFunctional = false;
            status.searchError = error.message;
        }
        
        return status;
    }

    /**
     * Destroy the search manager and clean up resources
     */
    destroy() {
        this.lunrIndex = null;
        this.tools = [];
        this.isReady = false;
        this.cache.clear();
    }
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.SearchManager = SearchManager;
}

// For module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchManager;
}