/**
 * Enhanced Fallback Search System for CLI Tool Context website
 * Provides robust client-side search when Web Worker search fails
 */

class FallbackSearch {
    constructor() {
        this.searchIndex = null;
        this.simpleIndex = null;
        this.isReady = false;
        this.searchOptions = {
            threshold: 0.3, // Fuzzy match threshold (0 = exact, 1 = very fuzzy)
            includeScore: true,
            includeMatches: true,
            minMatchCharLength: 2,
            findAllMatches: true,
            keys: [
                { name: 'name', weight: 0.4 },
                { name: 'description', weight: 0.3 },
                { name: 'tags', weight: 0.2 },
                { name: 'category', weight: 0.1 }
            ]
        };
        this.searchHistory = [];
        this.maxHistorySize = 50;
    }

    /**
     * Helper to get platforms array from tool (handles both platform and platforms fields)
     */
    getPlatforms(tool) {
        if (Array.isArray(tool.platforms)) {
            return tool.platforms;
        }
        if (Array.isArray(tool.platform)) {
            return tool.platform;
        }
        if (typeof tool.platforms === 'string') {
            return [tool.platforms];
        }
        if (typeof tool.platform === 'string') {
            return [tool.platform];
        }
        return [];
    }

    /**
     * Initialize the fallback search system
     */
    async initialize(toolsData) {
        try {
            if (window.debugHelper) {
                window.debugHelper.logInfo('Fallback Search', 'Initializing fallback search system');
                window.debugHelper.startTimer('fallback-search-init');
            }

            if (!Array.isArray(toolsData) || toolsData.length === 0) {
                if (window.debugHelper) {
                    window.debugHelper.logWarn('Fallback Search', 'No tools data available for search indexing');
                }
                return false;
            }

            // Build multiple search indexes for different scenarios
            await this.buildLunrIndex(toolsData);
            await this.buildFuseIndex(toolsData);
            this.buildSimpleIndex(toolsData);

            this.isReady = true;

            if (window.debugHelper) {
                window.debugHelper.endTimer('fallback-search-init');
                window.debugHelper.logInfo('Fallback Search', 'Fallback search system initialized', {
                    toolsCount: toolsData.length,
                    hasLunr: !!this.lunrIndex,
                    hasFuse: !!this.fuseIndex,
                    hasSimple: !!this.simpleIndex
                });
            }

            return true;

        } catch (error) {
            console.error('Failed to initialize fallback search:', error);
            if (window.debugHelper) {
                window.debugHelper.logError('Fallback Search', 'Initialization failed', error);
            }
            return false;
        }
    }

    /**
     * Build Lunr.js search index (if available)
     */
    async buildLunrIndex(toolsData) {
        try {
            if (typeof lunr === 'undefined') {
                if (window.debugHelper) {
                    window.debugHelper.logWarn('Fallback Search', 'Lunr.js not available, skipping Lunr index');
                }
                return;
            }

            const self = this; // Capture the class instance
            this.lunrIndex = lunr(function() {
                const builder = this; // Capture the Lunr builder
                builder.ref('id');
                builder.field('name', { boost: 10 });
                builder.field('description', { boost: 5 });
                builder.field('category', { boost: 3 });
                builder.field('tags', { boost: 2 });
                builder.field('platform');
                builder.field('installation');

                toolsData.forEach((tool, index) => {
                    const doc = {
                        id: index,
                        name: tool.name || '',
                        description: tool.description || '',
                        category: tool.category || '',
                        tags: Array.isArray(tool.tags) ? tool.tags.join(' ') : (tool.tags || ''),
                        platform: self.getPlatforms(tool).join(' '),
                        installation: typeof tool.installation === 'object' 
                            ? Object.keys(tool.installation).join(' ')
                            : (tool.installation || '')
                    };
                    builder.add(doc);
                });
            });

            this.toolsData = toolsData; // Store reference for result retrieval

            if (window.debugHelper) {
                window.debugHelper.logInfo('Fallback Search', 'Lunr index built successfully');
            }

        } catch (error) {
            console.warn('Failed to build Lunr index:', error);
            if (window.debugHelper) {
                window.debugHelper.logWarn('Fallback Search', 'Failed to build Lunr index', error);
            }
        }
    }

    /**
     * Build Fuse.js-style fuzzy search index
     */
    async buildFuseIndex(toolsData) {
        try {
            // Check if Fuse.js is available
            if (typeof Fuse !== 'undefined') {
                this.fuseIndex = new Fuse(toolsData, this.searchOptions);
                if (window.debugHelper) {
                    window.debugHelper.logInfo('Fallback Search', 'Fuse.js index built successfully');
                }
            } else {
                // Create our own fuzzy search implementation
                this.customFuseIndex = this.buildCustomFuzzyIndex(toolsData);
                if (window.debugHelper) {
                    window.debugHelper.logInfo('Fallback Search', 'Custom fuzzy index built successfully');
                }
            }
        } catch (error) {
            console.warn('Failed to build fuzzy search index:', error);
            if (window.debugHelper) {
                window.debugHelper.logWarn('Fallback Search', 'Failed to build fuzzy index', error);
            }
        }
    }

    /**
     * Build custom fuzzy search index when Fuse.js is not available
     */
    buildCustomFuzzyIndex(toolsData) {
        const index = toolsData.map((tool, id) => ({
            id,
            searchableText: this.createSearchableText(tool),
            tool
        }));

        return index;
    }

    /**
     * Create searchable text from tool object
     */
    createSearchableText(tool) {
        const parts = [
            tool.name || '',
            tool.description || '',
            tool.category || '',
            Array.isArray(tool.tags) ? tool.tags.join(' ') : (tool.tags || ''),
            this.getPlatforms(tool).join(' '),
            typeof tool.installation === 'object' ? Object.keys(tool.installation).join(' ') : (tool.installation || '')
        ];

        return parts.join(' ').toLowerCase();
    }

    /**
     * Build simple keyword-based index
     */
    buildSimpleIndex(toolsData) {
        this.simpleIndex = toolsData.map((tool, id) => ({
            id,
            keywords: this.extractKeywords(tool),
            tool
        }));
    }

    /**
     * Extract keywords from tool for simple search
     */
    extractKeywords(tool) {
        const text = this.createSearchableText(tool);
        return text.split(/\s+/)
            .filter(word => word.length > 2)
            .map(word => word.toLowerCase());
    }

    /**
     * Perform search using the best available method
     */
    async search(query, options = {}) {
        if (!this.isReady || !query || query.trim().length < 2) {
            return [];
        }

        const searchOptions = { ...{ limit: 20 }, ...options };
        const normalizedQuery = query.toLowerCase().trim();

        // Add to search history
        this.addToHistory(normalizedQuery);

        if (window.debugHelper) {
            window.debugHelper.logInfo('Fallback Search', `Searching for: "${query}"`);
            window.debugHelper.startTimer('fallback-search');
        }

        let results = [];

        try {
            // Try Lunr.js first (most accurate)
            if (this.lunrIndex) {
                results = await this.searchWithLunr(normalizedQuery, searchOptions);
            }
            // Try Fuse.js second (good fuzzy matching)
            else if (this.fuseIndex) {
                results = await this.searchWithFuse(normalizedQuery, searchOptions);
            }
            // Try custom fuzzy search third
            else if (this.customFuseIndex) {
                results = await this.searchWithCustomFuzzy(normalizedQuery, searchOptions);
            }
            // Fall back to simple search
            else {
                results = await this.searchSimple(normalizedQuery, searchOptions);
            }

            // Enhance results with highlighting
            results = this.addSearchHighlighting(results, query);

            if (window.debugHelper) {
                window.debugHelper.endTimer('fallback-search');
                window.debugHelper.logInfo('Fallback Search', `Search completed: ${results.length} results found`);
            }

        } catch (error) {
            console.error('Search failed:', error);
            if (window.debugHelper) {
                window.debugHelper.logError('Fallback Search', 'Search operation failed', error);
            }
            results = [];
        }

        return results;
    }

    /**
     * Search using Lunr.js
     */
    async searchWithLunr(query, options) {
        try {
            const searchResults = this.lunrIndex.search(query);
            return searchResults
                .slice(0, options.limit)
                .map(result => ({
                    item: this.toolsData[parseInt(result.ref)],
                    score: result.score,
                    matches: result.matches || []
                }));
        } catch (error) {
            console.warn('Lunr search failed:', error);
            return [];
        }
    }

    /**
     * Search using Fuse.js
     */
    async searchWithFuse(query, options) {
        try {
            const searchResults = this.fuseIndex.search(query);
            return searchResults
                .slice(0, options.limit)
                .map(result => ({
                    item: result.item,
                    score: result.score,
                    matches: result.matches || []
                }));
        } catch (error) {
            console.warn('Fuse search failed:', error);
            return [];
        }
    }

    /**
     * Search using custom fuzzy matching - limited scope for performance
     */
    async searchWithCustomFuzzy(query, options) {
        try {
            let results = [];
            const queryWords = query.split(/\s+/).filter(word => word.length > 1);

            // First try exact matching without fuzzy
            for (const entry of this.customFuseIndex) {
                let score = 0;
                let matches = 0;

                // Check if searchable text contains query
                if (entry.searchableText.includes(query)) {
                    score += 10; // Exact phrase match
                    matches++;
                }

                // Check individual words
                for (const word of queryWords) {
                    if (entry.searchableText.includes(word)) {
                        score += 3;
                        matches++;
                    }
                }

                if (matches > 0) {
                    results.push({
                        item: entry.tool,
                        score: score / Math.max(queryWords.length, 1),
                        matches: matches
                    });
                }
            }

            // If we have enough results, return them without fuzzy matching
            if (results.length >= Math.min(options.limit || 20, 10)) {
                return results
                    .sort((a, b) => b.score - a.score)
                    .slice(0, options.limit);
            }

            // Only use expensive fuzzy matching if exact matching returned few results
            for (const entry of this.customFuseIndex) {
                const existingResult = results.find(r => r.item === entry.tool);
                if (existingResult) continue; // Skip items already found

                let score = 0;
                let matches = 0;

                // Fuzzy matching for similar words (limited to first 50 words)
                const limitedSearchText = entry.searchableText.split(/\s+/).slice(0, 50).join(' ');
                for (const word of queryWords) {
                    const fuzzyMatches = this.findFuzzyMatches(word, limitedSearchText);
                    if (fuzzyMatches > 0) {
                        score += fuzzyMatches * 1;
                        matches += fuzzyMatches;
                    }
                }

                if (matches > 0) {
                    results.push({
                        item: entry.tool,
                        score: score / Math.max(queryWords.length, 1),
                        matches: matches
                    });
                }
            }

            return results
                .sort((a, b) => b.score - a.score)
                .slice(0, options.limit);

        } catch (error) {
            console.warn('Custom fuzzy search failed:', error);
            return [];
        }
    }

    /**
     * Simple keyword-based search
     */
    async searchSimple(query, options) {
        try {
            const results = [];
            const queryWords = query.split(/\s+/).filter(word => word.length > 1);

            for (const entry of this.simpleIndex) {
                let score = 0;

                for (const word of queryWords) {
                    const exactMatches = entry.keywords.filter(keyword => keyword === word).length;
                    const partialMatches = entry.keywords.filter(keyword => keyword.includes(word)).length;
                    
                    score += exactMatches * 5 + partialMatches * 2;
                }

                if (score > 0) {
                    results.push({
                        item: entry.tool,
                        score: score,
                        matches: []
                    });
                }
            }

            return results
                .sort((a, b) => b.score - a.score)
                .slice(0, options.limit);

        } catch (error) {
            console.warn('Simple search failed:', error);
            return [];
        }
    }

    /**
     * Find fuzzy matches using Levenshtein distance
     */
    findFuzzyMatches(word, text, maxDistance = 2) {
        const words = text.split(/\s+/);
        let matches = 0;

        for (const textWord of words) {
            if (Math.abs(word.length - textWord.length) <= maxDistance) {
                const distance = this.calculateLevenshteinDistance(word, textWord);
                if (distance <= maxDistance) {
                    matches++;
                }
            }
        }

        return matches;
    }

    /**
     * Calculate Levenshtein distance between two strings
     */
    calculateLevenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Add search highlighting to results
     */
    addSearchHighlighting(results, originalQuery) {
        const queryWords = originalQuery.toLowerCase().split(/\s+/).filter(word => word.length > 1);

        return results.map(result => {
            const highlightedResult = { ...result };
            
            // Highlight matches in name and description
            if (result.item.name) {
                highlightedResult.highlightedName = this.highlightText(result.item.name, queryWords);
            }
            
            if (result.item.description) {
                highlightedResult.highlightedDescription = this.highlightText(result.item.description, queryWords);
            }

            return highlightedResult;
        });
    }

    /**
     * Highlight query words in text
     */
    highlightText(text, queryWords) {
        let highlightedText = text;
        
        for (const word of queryWords) {
            const regex = new RegExp(`(${this.escapeRegExp(word)})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        }
        
        return highlightedText;
    }

    /**
     * Escape special regex characters
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Add query to search history
     */
    addToHistory(query) {
        // Remove duplicates and add to front
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        this.searchHistory.unshift(query);
        
        // Limit history size
        if (this.searchHistory.length > this.maxHistorySize) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize);
        }

        // Store in localStorage
        try {
            localStorage.setItem('cli-tools-search-history', JSON.stringify(this.searchHistory));
        } catch (e) {
            // Ignore localStorage errors
        }
    }

    /**
     * Get search history
     */
    getSearchHistory() {
        return this.searchHistory.slice(0, 10); // Return last 10 searches
    }

    /**
     * Load search history from localStorage
     */
    loadSearchHistory() {
        try {
            const stored = localStorage.getItem('cli-tools-search-history');
            if (stored) {
                this.searchHistory = JSON.parse(stored).slice(0, this.maxHistorySize);
            }
        } catch (e) {
            // Ignore localStorage errors
            this.searchHistory = [];
        }
    }

    /**
     * Clear search history
     */
    clearSearchHistory() {
        this.searchHistory = [];
        try {
            localStorage.removeItem('cli-tools-search-history');
        } catch (e) {
            // Ignore localStorage errors
        }
    }

    /**
     * Get search suggestions based on partial query
     */
    getSuggestions(partialQuery, limit = 5) {
        if (!partialQuery || partialQuery.length < 2) {
            return this.getSearchHistory().slice(0, limit);
        }

        const suggestions = new Set();
        const queryLower = partialQuery.toLowerCase();

        // Add matching history items
        for (const historyItem of this.searchHistory) {
            if (historyItem.includes(queryLower)) {
                suggestions.add(historyItem);
                if (suggestions.size >= limit) break;
            }
        }

        // Add tool names that match
        if (this.simpleIndex && suggestions.size < limit) {
            for (const entry of this.simpleIndex) {
                const toolName = entry.tool.name?.toLowerCase() || '';
                if (toolName.includes(queryLower) && !suggestions.has(entry.tool.name)) {
                    suggestions.add(entry.tool.name);
                    if (suggestions.size >= limit) break;
                }
            }
        }

        return Array.from(suggestions).slice(0, limit);
    }

    /**
     * Get system status and diagnostics
     */
    getStatus() {
        return {
            isReady: this.isReady,
            hasLunrIndex: !!this.lunrIndex,
            hasFuseIndex: !!this.fuseIndex,
            hasCustomFuzzyIndex: !!this.customFuseIndex,
            hasSimpleIndex: !!this.simpleIndex,
            toolsCount: this.toolsData?.length || 0,
            searchHistoryLength: this.searchHistory.length
        };
    }
}

// Create global fallback search instance
window.fallbackSearch = new FallbackSearch();

// Load search history on initialization
window.fallbackSearch.loadSearchHistory();

// Expose search functions globally
window.fallbackSearchQuery = async (query, options) => {
    return await window.fallbackSearch.search(query, options);
};

// Adapter for CLI consumption - returns tool objects consistently
window.fallbackSearchQueryTools = async (query, options = {}) => {
    const results = await window.fallbackSearch.search(query, options);
    return results.map(r => r.item);
};

window.getSearchSuggestions = (partialQuery, limit) => {
    return window.fallbackSearch.getSuggestions(partialQuery, limit);
};