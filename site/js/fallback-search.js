/* global window, document, console, lunr, Fuse, requestIdleCallback, requestAnimationFrame */
/* eslint-env browser */
/**
 * Enhanced Fallback Search System for CLI Tool Context website
 * Provides robust client-side search when Web Worker search fails
 */

// Comment 3: Consistent minimum query length across all search modules
const MIN_SEARCH_QUERY_LENGTH = 2;

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
     * Helper to get platforms array from tool (uses shared utility)
     */
    getPlatforms(tool) {
        // Comment 9: Use shared platform extraction utility from main.js to avoid duplication
        if (typeof window.extractPlatforms === 'function') {
            return window.extractPlatforms(tool);
        }
        
        // Fallback implementation if shared utility is not available
        if (!tool) return [];
        const platformField = tool.platforms || tool.platform;
        if (!platformField) return [];
        
        if (Array.isArray(platformField)) {
            return platformField.filter(p => typeof p === 'string' && p.length > 0);
        }
        
        if (typeof platformField === 'string') {
            return platformField.includes(',') 
                ? platformField.split(',').map(p => p.trim()).filter(Boolean)
                : [platformField];
        }
        
        return [];
    }

    /**
     * Initialize the fallback search system with enhanced validation and error recovery
     */
    async initialize(toolsData) {
        try {
            if (window.debugHelper) {
                window.debugHelper.logInfo('Fallback Search', 'Initializing fallback search system');
                window.debugHelper.startTimer('fallback-search-init');
            }

            // Reset state
            this.searchIndex = null;
            this.simpleIndex = null;
            this.isReady = false;

            // Validate tools data
            if (!toolsData) {
                const errorMsg = 'No tools data provided to fallback search';
                console.warn(errorMsg);
                if (window.debugHelper) {
                    window.debugHelper.logWarn('Fallback Search', errorMsg);
                }
                return false;
            }
            
            if (!Array.isArray(toolsData)) {
                const errorMsg = `Tools data must be an array, got ${typeof toolsData}`;
                console.warn(errorMsg);
                if (window.debugHelper) {
                    window.debugHelper.logWarn('Fallback Search', errorMsg);
                }
                return false;
            }
            
            if (toolsData.length === 0) {
                if (window.debugHelper) {
                    window.debugHelper.logWarn('Fallback Search', 'Empty tools data array');
                }
                // Still initialize with empty data for consistency
                this.toolsData = [];
                this.isReady = true;
                return true;
            }
            
            // Validate and normalize tools with better error handling
            const validTools = [];
            const invalidIndices = [];
            
            for (let i = 0; i < toolsData.length; i++) {
                const tool = toolsData[i];
                if (tool && typeof tool === 'object') {
                    // Ensure tool has required fields
                    if (!tool.id) {
                        if (tool.name) {
                            tool.id = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        } else {
                            tool.id = `tool-${i}`;
                        }
                    }
                    
                    // Ensure tool has a name
                    if (!tool.name) {
                        tool.name = tool.id || `Tool ${i}`;
                    }
                    
                    // Ensure tool has a description
                    if (!tool.description) {
                        tool.description = '';
                    }
                    
                    validTools.push(tool);
                } else {
                    invalidIndices.push(i);
                    const debug = window.debugHelper?.isDebugMode;
                    if (debug) console.warn(`Invalid tool at index ${i}:`, tool);
                }
            }
            
            const debug = window.debugHelper?.isDebugMode;
            if (invalidIndices.length > 0 && debug && window.debugHelper) {
                window.debugHelper.logWarn('Fallback Search', `Found ${invalidIndices.length} invalid tools at indices: ${invalidIndices.join(', ')}`);
            }
            
            if (validTools.length === 0) {
                throw new Error('No valid tools found in data');
            }
            
            toolsData = validTools;

            // Build multiple search indexes for different scenarios
            // Use requestIdleCallback for non-critical index builds to avoid main-thread jank
            const buildIndexes = async () => {
                // Build Lunr index first (most important) with timeout
                const lunrTimeout = setTimeout(() => {
                    console.warn('Lunr index build timeout, proceeding without it');
                    if (window.debugHelper) {
                        window.debugHelper.logWarn('Fallback Search', 'Lunr index build timeout');
                    }
                }, 3000);
                
                await this.buildLunrIndex(toolsData);
                clearTimeout(lunrTimeout);
                
                // Build simple index immediately for fast fallback
                this.buildSimpleIndex(toolsData);
                
                // Defer fuzzy index build if requestIdleCallback is available
                if (typeof requestIdleCallback !== 'undefined') {
                    requestIdleCallback(() => {
                        this.buildFuseIndex(toolsData);
                    }, { timeout: 2000 }); // Max 2 seconds wait
                } else {
                    // Build fuzzy index in background
                    setTimeout(() => this.buildFuseIndex(toolsData), 100);
                }
            };
            
            await buildIndexes();

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
     * Dynamically load Lunr.js if not already loaded
     */
    async loadLunrJS() {
        if (typeof lunr !== 'undefined') {
            return true; // Already loaded
        }
        
        try {
            // Try to dynamically load Lunr.js from local path first
            const script = document.createElement('script');
            script.src = 'lib/lunr.min.js';
            
            const loadPromise = new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = () => {
                    // Try CDN fallback - pinned to version 2.3.9 to match worker
                    const cdnScript = document.createElement('script');
                    cdnScript.src = 'https://unpkg.com/lunr@2.3.9/lunr.min.js';
                    cdnScript.onload = resolve;
                    cdnScript.onerror = reject;
                    document.head.appendChild(cdnScript);
                };
            });
            
            document.head.appendChild(script);
            await loadPromise;
            
            if (window.debugHelper) {
                window.debugHelper.logInfo('Fallback Search', 'Lunr.js loaded dynamically');
            }
            
            return typeof lunr !== 'undefined';
        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logWarn('Fallback Search', 'Failed to load Lunr.js', error);
            }
            return false;
        }
    }

    /**
     * Build Lunr.js search index (if available)
     * Dynamically loads Lunr.js when needed to reduce initial bandwidth
     */
    async buildLunrIndex(toolsData) {
        try {
            // Try to load Lunr.js dynamically if not available
            if (typeof lunr === 'undefined') {
                const loaded = await this.loadLunrJS();
                if (!loaded) {
                    if (window.debugHelper) {
                        window.debugHelper.logWarn('Fallback Search', 'Lunr.js not available, skipping Lunr index');
                    }
                    return;
                }
            }

            const self = this; // Capture the class instance
            
            // For small datasets, build synchronously
            if (toolsData.length <= 50) {
                this.lunrIndex = this.buildLunrIndexSync(toolsData);
            } else {
                // For larger datasets, build in scheduled slices to avoid jank
                await this.buildLunrIndexAsync(toolsData);
            }
            
            // Create result cache for performance
            this.lunrResultCache = new Map();
            this.maxCacheSize = 100;

            this.toolsData = toolsData; // Store reference for result retrieval
            this.toolById = new Map(toolsData.map(t => [t.id, t])); // Create ID to tool mapping

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
     * Build Lunr index synchronously (for small datasets)
     */
    buildLunrIndexSync(toolsData) {
        const self = this;
        
        // Comment 5: Set tokenizer separator for consistency with worker and main thread
        if (typeof lunr !== 'undefined' && lunr.tokenizer) {
            lunr.tokenizer.separator = /[\s\-\_\.]+/;
        }
        
        return lunr(function() {
            const builder = this;
            builder.ref('id');
            builder.field('name', { boost: 10 });
            builder.field('description', { boost: 5 });
            builder.field('category', { boost: 3 });
            builder.field('tags', { boost: 2 });
            builder.field('platform');
            builder.field('installation');

            toolsData.forEach((tool, index) => {
                try {
                    const doc = {
                        id: tool.id || index.toString(),
                        name: tool.name || '',
                        description: tool.description || '',
                        category: tool.category || '',
                        tags: Array.isArray(tool.tags) ? tool.tags.join(' ') : (tool.tags || ''),
                        platform: self.getPlatforms(tool).join(' '),
                        installation: typeof tool.installation === 'object' && tool.installation !== null
                            ? (tool.installation.primary || Object.keys(tool.installation).join(' '))
                            : (tool.installation || '')
                    };
                    builder.add(doc);
                } catch (err) {
                    console.warn(`Failed to add tool ${tool.id || index} to Lunr index:`, err);
                }
            });
        });
    }

    /**
     * Build Lunr index asynchronously with yielding to maintain UI responsiveness
     * Note: Lunr doesn't support incremental building, so we prepare documents first,
     * then yield control before building the complete index at once
     */
    async buildLunrIndexAsync(toolsData) {
        const self = this;
        
        return new Promise((resolve) => {
            const documents = [];
            
            // First, prepare all documents synchronously
            toolsData.forEach((tool, index) => {
                try {
                    documents.push({
                        id: tool.id || index.toString(),
                        name: tool.name || '',
                        description: tool.description || '',
                        category: tool.category || '',
                        tags: Array.isArray(tool.tags) ? tool.tags.join(' ') : (tool.tags || ''),
                        platform: self.getPlatforms(tool).join(' '),
                        installation: typeof tool.installation === 'object' && tool.installation !== null
                            ? (tool.installation.primary || Object.keys(tool.installation).join(' '))
                            : (tool.installation || '')
                    });
                } catch (err) {
                    console.warn(`Failed to prepare tool ${tool.id || index} for Lunr index:`, err);
                }
            });
            
            // Build the complete index after yielding control to maintain UI responsiveness
            const buildIndex = () => {
                requestAnimationFrame(() => {
                    // Comment 5: Set tokenizer separator for consistency with worker and main thread
                    if (typeof lunr !== 'undefined' && lunr.tokenizer) {
                        lunr.tokenizer.separator = /[\s\-\_\.]+/;
                    }
                    
                    this.lunrIndex = lunr(function() {
                        const builder = this;
                        builder.ref('id');
                        builder.field('name', { boost: 10 });
                        builder.field('description', { boost: 5 });
                        builder.field('category', { boost: 3 });
                        builder.field('tags', { boost: 2 });
                        builder.field('platform');
                        builder.field('installation');
                        
                        documents.forEach(doc => {
                            try {
                                builder.add(doc);
                            } catch (err) {
                                console.warn(`Failed to add document to Lunr index:`, err);
                            }
                        });
                    });
                    resolve();
                });
            };
            
            // Start processing after yielding control
            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(buildIndex, { timeout: 1000 });
            } else {
                setTimeout(buildIndex, 0);
            }
        });
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
     * Create searchable text from tool object with better normalization
     */
    createSearchableText(tool) {
        if (!tool || typeof tool !== 'object') {
            return '';
        }
        
        const parts = [
            tool.name || '',
            tool.description || '',
            tool.category || '',
            Array.isArray(tool.tags) ? tool.tags.join(' ') : (tool.tags || ''),
            this.getPlatforms(tool).join(' '),
            typeof tool.installation === 'object' && tool.installation !== null
                ? (tool.installation.primary || Object.keys(tool.installation).join(' '))
                : (tool.installation || ''),
            tool.usage || '',
            Array.isArray(tool.aliases) ? tool.aliases.join(' ') : ''
        ];

        return parts.filter(Boolean).join(' ').toLowerCase();
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
        // Comment 3: Use consistent minimum query length
        if (!this.isReady || !query || query.trim().length < MIN_SEARCH_QUERY_LENGTH) {
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
            const mappedResults = searchResults
                .slice(0, options.limit)
                .map(result => {
                    const ref = result.ref;
                    const item = this.toolById?.get(ref) ?? (Number.isFinite(+ref) ? this.toolsData[+ref] : undefined);
                    if (!item) return null;
                    
                    // Generate highlighted text if matches available
                    let highlightedName = item.name;
                    let highlightedDescription = item.description;
                    
                    if (result.matchData && result.matchData.metadata) {
                        const metadata = Object.values(result.matchData.metadata)[0];
                        if (metadata && metadata.name) {
                            highlightedName = this.highlightMatch(item.name, metadata.name.position);
                        }
                        if (metadata && metadata.description) {
                            highlightedDescription = this.highlightMatch(item.description, metadata.description.position);
                        }
                    }
                    
                    return {
                        // Comment 4: Use 'item' consistently for result shape normalization
                        item: item,
                        score: result.score,
                        highlightedName: highlightedName,
                        highlightedDescription: highlightedDescription
                    };
                })
                .filter(Boolean); // Filter out null entries
                
            // Cache successful results
            const cacheKey = `${query}_${options.limit}`;
            if (this.lunrResultCache) {
                if (this.lunrResultCache.size >= this.maxCacheSize) {
                    // Remove oldest entry
                    const firstKey = this.lunrResultCache.keys().next().value;
                    this.lunrResultCache.delete(firstKey);
                }
                this.lunrResultCache.set(cacheKey, mappedResults);
            }
            
            return mappedResults;
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
                .map(result => {
                    const tool = result.item;
                    let highlightedName = tool.name;
                    let highlightedDescription = tool.description;
                    
                    // Process Fuse.js matches for highlighting
                    if (result.matches) {
                        result.matches.forEach(match => {
                            if (match.key === 'name' && match.indices) {
                                highlightedName = this.highlightFuseMatch(tool.name, match.indices);
                            }
                            if (match.key === 'description' && match.indices) {
                                highlightedDescription = this.highlightFuseMatch(tool.description, match.indices);
                            }
                        });
                    }
                    
                    return {
                        // Comment 4: Use 'item' consistently for result shape normalization
                        item: tool,
                        score: result.score,
                        highlightedName: highlightedName,
                        highlightedDescription: highlightedDescription
                    };
                });
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
                let highlightedName = entry.tool.name;
                let highlightedDescription = entry.tool.description;

                for (const word of queryWords) {
                    const exactMatches = entry.keywords.filter(keyword => keyword === word).length;
                    const partialMatches = entry.keywords.filter(keyword => keyword.includes(word)).length;
                    
                    score += exactMatches * 5 + partialMatches * 2;
                    
                    // Add simple highlighting
                    if (exactMatches > 0 || partialMatches > 0) {
                        highlightedName = this.simpleHighlight(entry.tool.name, word);
                        if (entry.tool.description && entry.tool.description.toLowerCase().includes(word)) {
                            highlightedDescription = this.simpleHighlight(entry.tool.description, word);
                        }
                    }
                }

                if (score > 0) {
                    results.push({
                        // Comment 4: Use 'item' consistently for result shape normalization
                        item: entry.tool,
                        score: score / 10, // Normalize score
                        highlightedName: highlightedName,
                        highlightedDescription: highlightedDescription
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
            const item = result.tool || result.item || result;
            if (!item) return null;
            const highlightedResult = { ...result, item };
            // Only add highlighting if not already set by more precise search methods
            if (item.name && !result.highlightedName) {
                highlightedResult.highlightedName = this.highlightText(item.name, queryWords);
            }
            if (item.description && !result.highlightedDescription) {
                highlightedResult.highlightedDescription = this.highlightText(item.description, queryWords);
            }
            return highlightedResult;
        }).filter(r => r);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Highlight match positions from Lunr
     */
    highlightMatch(text, positions) {
        if (!text || !positions || positions.length === 0) return this.escapeHtml(text || '');
        
        let result = '';
        let lastEnd = 0;
        
        positions.forEach(([start, length]) => {
            result += this.escapeHtml(text.slice(lastEnd, start));
            result += '<mark>' + this.escapeHtml(text.slice(start, start + length)) + '</mark>';
            lastEnd = start + length;
        });
        
        result += this.escapeHtml(text.slice(lastEnd));
        return result;
    }

    /**
     * Highlight Fuse.js match indices
     */
    highlightFuseMatch(text, indices) {
        if (!text || !indices || indices.length === 0) return this.escapeHtml(text || '');
        
        let result = '';
        let lastEnd = 0;
        
        indices.forEach(([start, end]) => {
            result += this.escapeHtml(text.slice(lastEnd, start));
            result += '<mark>' + this.escapeHtml(text.slice(start, end + 1)) + '</mark>';
            lastEnd = end + 1;
        });
        
        result += this.escapeHtml(text.slice(lastEnd));
        return result;
    }

    /**
     * Simple highlight for basic text matching
     */
    simpleHighlight(text, query) {
        if (!text || !query) return this.escapeHtml(text || '');
        
        // Escape the text first
        const escapedText = this.escapeHtml(text);
        // Escape special regex characters in query
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapedText.replace(regex, '<mark>$1</mark>');
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
        // Don't record empty queries
        if (!query || query.trim().length === 0) {
            return;
        }
        
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
        // Comment 3: Use consistent minimum query length  
        if (!partialQuery || partialQuery.length < MIN_SEARCH_QUERY_LENGTH) {
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
    // Return tool objects from the consistent result shape
    return results.map(r => r.tool || r.item || r);
};

window.getSearchSuggestions = (partialQuery, limit) => {
    return window.fallbackSearch.getSuggestions(partialQuery, limit);
};