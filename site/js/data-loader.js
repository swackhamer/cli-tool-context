/**
 * Data Loading Module
 * Centralized data loading with validation integration and robust error handling
 */

(function(window) {
    'use strict';

    class DataLoader {
        constructor(options = {}) {
            this.options = {
                maxRetries: options.maxRetries || 3,
                retryDelay: options.retryDelay || 1000,
                timeout: options.timeout || 10000,
                validateDuringLoad: options.validateDuringLoad !== false,
                useCache: options.useCache !== false,
                dataPath: options.dataPath || 'data/',
                ...options
            };
            
            this.loadingStatus = {
                stats: 'pending',
                tools: 'pending',
                categories: 'pending',
                cheatsheet: 'pending'
            };
            
            this.validationResults = {};
            this.cache = new Map();
            this.listeners = new Map();
        }

        /**
         * Register event listener
         */
        on(event, callback) {
            if (!this.listeners.has(event)) {
                this.listeners.set(event, []);
            }
            this.listeners.get(event).push(callback);
        }

        /**
         * Emit event to listeners
         */
        emit(event, data) {
            const callbacks = this.listeners.get(event) || [];
            callbacks.forEach(cb => {
                try {
                    cb(data);
                } catch (e) {
                    console.error(`Error in event listener for ${event}:`, e);
                }
            });
        }

        /**
         * Load all data with validation
         */
        async loadAll() {
            this.emit('loading-start', { timestamp: Date.now() });
            
            try {
                // Load all data in parallel
                const [stats, tools, categories, cheatsheet] = await Promise.all([
                    this.loadStatsData(),
                    this.loadToolsData(),
                    this.loadCategoriesData(),
                    this.loadCheatsheetData()
                ]);
                
                // Normalize the data
                const normalizedData = this.normalizeAllData({ stats, tools, categories, cheatsheet });
                
                // Validate if enabled
                if (this.options.validateDuringLoad) {
                    const validationResult = await this.validateData(normalizedData);
                    if (validationResult.hasErrors) {
                        this.emit('validation-error', validationResult);
                    } else if (validationResult.hasWarnings) {
                        this.emit('validation-warning', validationResult);
                    }
                    
                    // Apply auto-corrections if available
                    if (validationResult.corrections) {
                        Object.assign(normalizedData, validationResult.corrections);
                    }
                }
                
                // Reconcile data consistency
                const reconciledData = this.reconcileData(normalizedData);
                
                this.emit('loading-complete', {
                    data: reconciledData,
                    timestamp: Date.now(),
                    validationResults: this.validationResults
                });
                
                return reconciledData;
                
            } catch (error) {
                this.emit('loading-error', { error, timestamp: Date.now() });
                
                // Try fallback strategies
                return this.loadFallbackData();
            }
        }

        /**
         * Load stats data
         */
        async loadStatsData() {
            const cacheKey = 'stats';
            if (this.options.useCache && this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            this.loadingStatus.stats = 'loading';
            this.emit('status-update', { type: 'stats', status: 'loading' });
            
            try {
                const data = await this.fetchWithRetry(`${this.options.dataPath}stats.json`);
                const normalized = this.normalizeStatsData(data);
                
                if (this.options.useCache) {
                    this.cache.set(cacheKey, normalized);
                }
                
                this.loadingStatus.stats = 'loaded';
                this.emit('status-update', { type: 'stats', status: 'loaded' });
                
                return normalized;
                
            } catch (error) {
                this.loadingStatus.stats = 'error';
                this.emit('status-update', { type: 'stats', status: 'error', error });
                
                // Return default stats
                return this.getDefaultStats();
            }
        }

        /**
         * Load tools data with format detection
         */
        async loadToolsData() {
            const cacheKey = 'tools';
            if (this.options.useCache && this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            this.loadingStatus.tools = 'loading';
            this.emit('status-update', { type: 'tools', status: 'loading' });
            
            try {
                const data = await this.fetchWithRetry(`${this.options.dataPath}tools.json`);
                const normalized = this.normalizeToolsData(data);
                
                if (this.options.useCache) {
                    this.cache.set(cacheKey, normalized);
                }
                
                this.loadingStatus.tools = 'loaded';
                this.emit('status-update', { type: 'tools', status: 'loaded', count: normalized.length });
                
                return normalized;
                
            } catch (error) {
                this.loadingStatus.tools = 'error';
                this.emit('status-update', { type: 'tools', status: 'error', error });
                
                // Try embedded data
                if (window.EMBEDDED_TOOLS_DATA) {
                    return this.normalizeToolsData(window.EMBEDDED_TOOLS_DATA);
                }
                
                return [];
            }
        }

        /**
         * Load categories data with format detection
         */
        async loadCategoriesData() {
            const cacheKey = 'categories';
            if (this.options.useCache && this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            this.loadingStatus.categories = 'loading';
            this.emit('status-update', { type: 'categories', status: 'loading' });
            
            try {
                const data = await this.fetchWithRetry(`${this.options.dataPath}categories.json`);
                const normalized = this.normalizeCategoriesData(data);
                
                if (this.options.useCache) {
                    this.cache.set(cacheKey, normalized);
                }
                
                this.loadingStatus.categories = 'loaded';
                this.emit('status-update', { type: 'categories', status: 'loaded', count: normalized.length });
                
                return normalized;
                
            } catch (error) {
                this.loadingStatus.categories = 'error';
                this.emit('status-update', { type: 'categories', status: 'error', error });
                
                // Try embedded data
                if (window.EMBEDDED_CATEGORIES_DATA) {
                    return this.normalizeCategoriesData(window.EMBEDDED_CATEGORIES_DATA);
                }
                
                return [];
            }
        }

        /**
         * Load cheatsheet data
         */
        async loadCheatsheetData() {
            const cacheKey = 'cheatsheet';
            if (this.options.useCache && this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            this.loadingStatus.cheatsheet = 'loading';
            this.emit('status-update', { type: 'cheatsheet', status: 'loading' });
            
            try {
                const data = await this.fetchWithRetry(`${this.options.dataPath}cheatsheet.json`);
                
                if (this.options.useCache) {
                    this.cache.set(cacheKey, data);
                }
                
                this.loadingStatus.cheatsheet = 'loaded';
                this.emit('status-update', { type: 'cheatsheet', status: 'loaded' });
                
                return data;
                
            } catch (error) {
                this.loadingStatus.cheatsheet = 'error';
                this.emit('status-update', { type: 'cheatsheet', status: 'error', error });
                return null;
            }
        }

        /**
         * Fetch with retry logic and multiple transport methods
         */
        async fetchWithRetry(url, retries = 0) {
            // Check for file:// protocol and immediately use embedded data if available
            if (window.location.protocol === 'file:') {
                // Log file:// protocol detection
                console.warn(`File protocol detected for ${url}, checking embedded data`);
                
                // Check if embedded data is available
                if (window.EMBEDDED_DATA) {
                    console.log('Using embedded data due to file:// protocol');
                    this.emit('file-protocol-fallback', {
                        url,
                        message: 'Using embedded data due to file:// protocol restrictions'
                    });
                    
                    // Return appropriate embedded data based on URL
                    if (url.includes('tools.json')) {
                        return window.EMBEDDED_DATA.tools || [];
                    } else if (url.includes('categories.json')) {
                        return window.EMBEDDED_DATA.categories || [];
                    } else if (url.includes('stats.json')) {
                        return window.EMBEDDED_DATA.stats || this.getDefaultStats();
                    } else if (url.includes('cheatsheet.json')) {
                        return window.EMBEDDED_DATA.cheatsheet || null;
                    }
                }
                
                // Try XHR as fallback (may still fail in Chrome)
                try {
                    return await this.loadViaXHR(url);
                } catch (xhrError) {
                    console.warn('XHR failed for file:// protocol:', xhrError.message);
                    
                    // Emit specific file protocol error
                    this.emit('file-protocol-error', {
                        url,
                        error: xhrError,
                        message: 'Chrome blocks local file access. Please use a local server or Firefox.',
                        suggestions: [
                            'Run: python3 -m http.server 8000',
                            'Or use Firefox which allows local file access',
                            'Or deploy to a web server'
                        ]
                    });
                    
                    // Return embedded data if available as final fallback
                    if (window.EMBEDDED_DATA) {
                        if (url.includes('tools.json')) return window.EMBEDDED_DATA.tools || [];
                        if (url.includes('categories.json')) return window.EMBEDDED_DATA.categories || [];
                        if (url.includes('stats.json')) return window.EMBEDDED_DATA.stats || this.getDefaultStats();
                        if (url.includes('cheatsheet.json')) return window.EMBEDDED_DATA.cheatsheet || null;
                    }
                    
                    throw xhrError;
                }
            }
            
            // Normal fetch for http:// and https:// protocols
            try {
                const response = await this.fetchWithTimeout(url, this.options.timeout);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return await response.json();
            } catch (error) {
                if (retries < this.options.maxRetries) {
                    // Exponential backoff
                    const delay = this.options.retryDelay * Math.pow(2, retries);
                    await this.sleep(delay);
                    return this.fetchWithRetry(url, retries + 1);
                }
                throw error;
            }
        }

        /**
         * Fetch with timeout
         */
        fetchWithTimeout(url, timeout) {
            return Promise.race([
                fetch(url),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timeout')), timeout)
                )
            ]);
        }

        /**
         * Load via XMLHttpRequest for file:// protocol
         */
        loadViaXHR(url) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                // Add warning about Chrome CORS restrictions
                if (window.FileProtocolHelper && window.FileProtocolHelper.isChrome()) {
                    console.warn('Chrome may block XHR requests to local files due to CORS policy');
                }
                
                xhr.open('GET', url, true);
                // Use default text response type for better cross-browser compatibility
                xhr.responseType = '';
                xhr.timeout = this.options.timeout;
                
                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 0) {
                        try {
                            // Try to parse responseText as JSON
                            const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
                            if (data) {
                                resolve(data);
                            } else if (xhr.response && typeof xhr.response === 'object') {
                                // Fallback to response if already an object
                                resolve(xhr.response);
                            } else {
                                reject(new Error('XHR returned empty or invalid response'));
                            }
                        } catch (parseError) {
                            // If parsing fails, check if response is already an object
                            if (xhr.response && typeof xhr.response === 'object') {
                                resolve(xhr.response);
                            } else {
                                reject(new Error(`Failed to parse JSON: ${parseError.message}`));
                            }
                        }
                    } else {
                        reject(new Error(`XHR failed: ${xhr.status}`));
                    }
                };
                
                xhr.onerror = () => {
                    // Enhanced error message for file:// protocol
                    if (window.location.protocol === 'file:') {
                        reject(new Error('XHR network error - Chrome blocks local file access. Use a local server or Firefox.'));
                    } else {
                        reject(new Error('XHR network error'));
                    }
                };
                xhr.ontimeout = () => reject(new Error('XHR timeout'));
                
                xhr.send();
            });
        }

        /**
         * Sleep utility for delays
         */
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        /**
         * Normalize stats data
         */
        normalizeStatsData(data) {
            if (!data) return this.getDefaultStats();
            
            // Handle wrapped format
            if (data.stats) {
                data = data.stats;
            }
            
            return {
                totalTools: data.totalTools || 0,
                totalCategories: data.totalCategories || 0,
                lastUpdated: data.lastUpdated || new Date().toISOString(),
                version: data.version || '1.0.0',
                generatedAt: data.generatedAt || Date.now(),
                ...data
            };
        }

        /**
         * Normalize tools data with format detection
         */
        normalizeToolsData(data) {
            if (!data) return [];
            
            let tools = null;
            
            // Accept only {tools: []} or [] formats
            if (Array.isArray(data)) {
                // Direct array format
                tools = data;
            } else if (typeof data === 'object' && data.tools && Array.isArray(data.tools)) {
                // Standard wrapped format
                tools = data.tools;
            } else if (typeof data === 'object') {
                // Check for other known keys with warning
                const knownKeys = ['items', 'data', 'results'];
                for (const key of knownKeys) {
                    if (data[key] && Array.isArray(data[key])) {
                        tools = data[key];
                        this.emit('validation-warning', {
                            message: `Non-standard tools data format detected: using '${key}' field`,
                            details: { format: key },
                            severity: 'medium'
                        });
                        break;
                    }
                }
                
                if (!tools) {
                    // Unknown format - emit warning and return empty
                    this.emit('validation-warning', {
                        message: 'Unknown tools data format, returning empty array',
                        details: { 
                            receivedKeys: Object.keys(data),
                            expectedFormats: ['Array', '{tools: Array}']
                        },
                        severity: 'high'
                    });
                    return [];
                }
            } else {
                // Invalid data type
                this.emit('validation-error', {
                    message: 'Invalid tools data type',
                    details: { receivedType: typeof data },
                    severity: 'high'
                });
                return [];
            }
            
            // Normalize each tool entry
            if (window.DataNormalizer) {
                return tools.map(tool => window.DataNormalizer.normalizeToolEntry(tool));
            }
            
            return tools;
        }

        /**
         * Normalize categories data with format detection
         */
        normalizeCategoriesData(data) {
            if (!data) return [];
            
            let categories = data;
            
            // Handle wrapped format {categories: [...]}
            if (data.categories && Array.isArray(data.categories)) {
                categories = data.categories;
            }
            // Handle object-keyed format {"category1": {...}, "category2": {...}}
            else if (!Array.isArray(data) && typeof data === 'object') {
                categories = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    name: value.name || key,
                    ...value
                }));
            }
            
            // Normalize each category
            if (window.DataNormalizer) {
                return categories.map(cat => window.DataNormalizer.normalizeCategory(cat));
            }
            
            return categories;
        }

        /**
         * Normalize all data together
         */
        normalizeAllData(data) {
            const normalized = { ...data };
            
            // Apply cross-data normalization if DataNormalizer is available
            if (window.DataNormalizer && normalized.categories && normalized.tools) {
                normalized.categories = window.DataNormalizer.recalculateCategoryCounts(
                    normalized.categories,
                    normalized.tools
                );
            }
            
            return normalized;
        }

        /**
         * Validate data using DataValidator
         */
        async validateData(data) {
            if (!window.DataValidator) {
                return { hasErrors: false, hasWarnings: false };
            }
            
            const validator = new window.DataValidator();
            
            // Validate during load
            const results = validator.validateDuringLoad(data);
            
            // Store results
            this.validationResults = results;
            
            // Check for errors and warnings
            const hasErrors = results.errors && results.errors.length > 0;
            const hasWarnings = results.warnings && results.warnings.length > 0;
            
            // Generate corrections if possible
            const corrections = this.generateCorrections(results, data);
            
            return {
                hasErrors,
                hasWarnings,
                results,
                corrections
            };
        }

        /**
         * Generate data corrections based on validation results
         */
        generateCorrections(validationResults, data) {
            const corrections = {};
            
            // Correct stats totals
            if (validationResults.statsDiscrepancies) {
                corrections.stats = {
                    ...data.stats,
                    totalTools: data.tools.length,
                    totalCategories: data.categories.length
                };
            }
            
            // Correct category counts
            if (validationResults.categoryCountDiscrepancies) {
                const counts = {};
                data.tools.forEach(tool => {
                    if (tool.category) {
                        counts[tool.category] = (counts[tool.category] || 0) + 1;
                    }
                });
                
                corrections.categories = data.categories.map(cat => ({
                    ...cat,
                    toolCount: counts[cat.name] || counts[cat.id] || 0
                }));
            }
            
            return Object.keys(corrections).length > 0 ? corrections : null;
        }

        /**
         * Reconcile data for consistency
         */
        reconcileData(data, options = {}) {
            const reconciled = { ...data };
            const forceReconcileStats = options.forceReconcileStats || false;
            
            // Preserve original stats under stats.original
            if (reconciled.stats) {
                reconciled.stats.original = { ...reconciled.stats };
            }
            
            // Only update stats when mismatches are detected or forced
            if (reconciled.stats && reconciled.tools && reconciled.categories) {
                const actualToolCount = reconciled.tools.length;
                const actualCategoryCount = reconciled.categories.length;
                
                // Check for mismatches
                const hasToolMismatch = reconciled.stats.totalTools !== actualToolCount;
                const hasCategoryMismatch = reconciled.stats.totalCategories !== actualCategoryCount;
                
                if (hasToolMismatch || hasCategoryMismatch || forceReconcileStats) {
                    // Emit warning about mismatch
                    if (hasToolMismatch || hasCategoryMismatch) {
                        this.emit('validation-warning', {
                            message: 'Stats mismatch detected, reconciling',
                            details: {
                                totalTools: { provided: reconciled.stats.totalTools, actual: actualToolCount },
                                totalCategories: { provided: reconciled.stats.totalCategories, actual: actualCategoryCount }
                            },
                            severity: 'low'
                        });
                    }
                    
                    // Update only if mismatched or forced
                    reconciled.stats.totalTools = actualToolCount;
                    reconciled.stats.totalCategories = actualCategoryCount;
                    reconciled.stats.reconciled = true;
                    reconciled.stats.reconciledAt = Date.now();
                }
            }
            
            // Update category tool counts - resolve by categoryId first, then name
            if (reconciled.categories && reconciled.tools) {
                const toolsByCategoryId = {};
                const toolsByCategoryName = {};
                
                reconciled.tools.forEach(tool => {
                    // Try categoryId first if available
                    const catId = tool.categoryId || (tool.category && typeof tool.category === 'string' ? 
                        tool.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null);
                    const catName = tool.categoryName || tool.category;
                    
                    if (catId) {
                        toolsByCategoryId[catId] = toolsByCategoryId[catId] || [];
                        toolsByCategoryId[catId].push(tool.name);
                    }
                    if (catName) {
                        toolsByCategoryName[catName] = toolsByCategoryName[catName] || [];
                        toolsByCategoryName[catName].push(tool.name);
                    }
                });
                
                reconciled.categories = reconciled.categories.map(cat => ({
                    ...cat,
                    toolCount: (toolsByCategoryId[cat.id] || toolsByCategoryName[cat.name] || []).length,
                    tools: toolsByCategoryId[cat.id] || toolsByCategoryName[cat.name] || []
                }));
            }
            
            return reconciled;
        }

        /**
         * Load fallback data
         */
        async loadFallbackData() {
            this.emit('fallback-loading', { timestamp: Date.now() });
            
            // Check if we're on file:// protocol
            if (window.location.protocol === 'file:') {
                console.log('File protocol detected, using embedded data fallback');
                
                // Show file protocol helper warning if available
                if (window.FileProtocolHelper) {
                    window.FileProtocolHelper.showWarningBanner();
                }
                
                this.emit('file-protocol-fallback', {
                    message: 'Using embedded data due to file:// protocol',
                    hasEmbeddedData: !!window.EMBEDDED_DATA
                });
            }
            
            // Try embedded data first
            if (window.EMBEDDED_DATA) {
                console.log('Loading embedded data (303 tools available)');
                return this.normalizeAllData(window.EMBEDDED_DATA);
            }
            
            // Generate mock data as last resort
            return this.generateMockData();
        }

        /**
         * Get default stats
         */
        getDefaultStats() {
            return {
                totalTools: 0,
                totalCategories: 0,
                lastUpdated: new Date().toISOString(),
                version: '1.0.0',
                generatedAt: Date.now(),
                isDefault: true
            };
        }

        /**
         * Generate mock data for development/testing
         */
        generateMockData() {
            console.warn('Using mock data - for development only');
            
            return {
                stats: this.getDefaultStats(),
                tools: [],
                categories: [],
                cheatsheet: null,
                isMockData: true
            };
        }

        /**
         * Get current loading status
         */
        getStatus() {
            const allStatuses = Object.values(this.loadingStatus);
            
            if (allStatuses.every(s => s === 'loaded')) {
                return 'complete';
            }
            if (allStatuses.some(s => s === 'error')) {
                return 'error';
            }
            if (allStatuses.some(s => s === 'loading')) {
                return 'loading';
            }
            
            return 'pending';
        }

        /**
         * Get detailed status report
         */
        getDetailedStatus() {
            return {
                overall: this.getStatus(),
                individual: { ...this.loadingStatus },
                validationResults: this.validationResults,
                cacheStatus: {
                    size: this.cache.size,
                    keys: Array.from(this.cache.keys())
                },
                timestamp: Date.now()
            };
        }

        /**
         * Clear cache
         */
        clearCache() {
            this.cache.clear();
            this.emit('cache-cleared', { timestamp: Date.now() });
        }
    }

    // Export the DataLoader class
    window.DataLoader = DataLoader;

})(window);