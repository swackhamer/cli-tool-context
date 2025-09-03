/* global window, document, localStorage, fetch, CustomEvent, Worker, requestIdleCallback, requestAnimationFrame, AbortController, navigator, alert, console, setTimeout, clearTimeout, performance, DOMPurify, marked */
/* eslint-env browser */
/**
 * CLI Tool Context - Main JavaScript Application
 * Handles search, filtering, tool rendering, and all interactive features
 */

(function() {
    'use strict';

    // Default filter values - exported for use by error-recovery.js
    const DEFAULT_FILTER_VALUES = {
        search: '',
        category: '',
        difficulty: '',
        platform: '',
        installation: ''
    };

    // Comment 3: Consistent minimum query length across all search functions
    const MIN_SEARCH_QUERY_LENGTH = 2;

    // Comment 9: Shared platform normalization utility to avoid duplication across modules
    // Make this available globally for other modules
    window.extractPlatforms = function extractPlatforms(tool) {
        if (!tool) return [];
        
        // Try different field names
        const platformField = tool.platforms || tool.platform;
        if (!platformField) return [];
        
        // Handle array formats
        if (Array.isArray(platformField)) {
            return platformField.filter(p => typeof p === 'string' && p.length > 0);
        }
        
        // Handle string formats
        if (typeof platformField === 'string') {
            // Check if it's a comma-separated list
            if (platformField.includes(',')) {
                return platformField.split(',').map(p => p.trim()).filter(Boolean);
            }
            return [platformField];
        }
        
        // Handle object formats (platform as an object with properties)
        if (typeof platformField === 'object' && platformField !== null) {
            // If it has a primary field
            if (platformField.primary) {
                return [platformField.primary];
            }
            // Extract string values from known platform fields
            const validPlatforms = [];
            const knownFields = ['windows', 'macos', 'linux', 'unix', 'cross-platform', 'web'];
            for (const field of knownFields) {
                if (platformField[field] === true || platformField[field] === 'true') {
                    validPlatforms.push(field);
                }
            }
            // If we found known fields, return them
            if (validPlatforms.length > 0) {
                return validPlatforms;
            }
            // Otherwise extract all string values (not keys)
            return Object.values(platformField)
                .filter(val => typeof val === 'string' && val.length > 0 && val !== 'null' && val !== 'undefined');
        }
        
        return [];
    };

    // Simple LRU Cache implementation
    class LRUCache {
        constructor(maxSize = 100) {
            this.maxSize = maxSize;
            this.cache = new Map();
        }
        
        get(key) {
            if (!this.cache.has(key)) return undefined;
            
            // Move to end (most recently used)
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        
        set(key, value) {
            // Remove if exists to re-add at end
            if (this.cache.has(key)) {
                this.cache.delete(key);
            }
            
            // Add to end
            this.cache.set(key, value);
            
            // Remove oldest if over limit
            if (this.cache.size > this.maxSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
        }
        
        has(key) {
            return this.cache.has(key);
        }
        
        clear() {
            this.cache.clear();
        }
        
        get size() {
            return this.cache.size;
        }
    }

    // Reusable debounce utility function
    function debounce(fn, delay) {
        let timeoutId;
        let lastRequestId = null;
        
        const debounced = function(...args) {
            const context = this;
            
            // Cancel previous timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            // Cancel previous search if supported
            if (lastRequestId && window.CLIApp && window.CLIApp.cancelSearch) {
                window.CLIApp.cancelSearch(lastRequestId);
            }
            
            // Generate new request ID
            lastRequestId = `debounce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            timeoutId = setTimeout(() => {
                fn.apply(context, [...args, lastRequestId]);
                lastRequestId = null;
            }, delay);
        };
        
        // Allow manual cancellation
        debounced.cancel = function() {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            if (lastRequestId && window.CLIApp && window.CLIApp.cancelSearch) {
                window.CLIApp.cancelSearch(lastRequestId);
                lastRequestId = null;
            }
        };
        
        return debounced;
    }

    // Utility function to normalize platforms field (handles all possible formats)
    function normalizePlatforms(tool) {
        // Comment 9: Use shared platform extraction utility
        const platforms = window.extractPlatforms(tool);
        if (platforms.length === 0) return [];
        
        // Platform alias mappings (Comment 7)
        const platformAliases = {
            'macOS': ['mac', 'macos', 'osx', 'os x', 'darwin', 'apple', 'macintosh'],
            'Windows': ['windows', 'win', 'win32', 'win64', 'pc', 'microsoft'],
            'Linux': ['linux', 'nix', 'unix', 'gnu', 'ubuntu', 'debian', 'fedora', 'centos', 'rhel']
        };
        
        // Function to normalize a single platform name
        const normalizeSinglePlatform = (platform) => {
            if (!platform) return null;
            const lower = platform.toLowerCase().trim();
            
            // Check if it matches a canonical name
            for (const [canonical, aliases] of Object.entries(platformAliases)) {
                if (canonical.toLowerCase() === lower || aliases.includes(lower)) {
                    return canonical;
                }
            }
            
            // Return original if no alias found (preserve 'cross-platform', 'web', etc.)
            return platform;
        };
        
        // Normalize all platforms using the extracted platform list
        return platforms.map(normalizeSinglePlatform).filter(Boolean);
    }

    // Application state
    const state = {
        tools: [],
        toolsVersion: 0, // Version counter for cache invalidation
        categories: [],
        stats: {},
        filteredTools: [],
        searchHighlights: new Map(),
        currentPage: 1,
        itemsPerPage: 20,
        searchIndex: null,
        searchManager: null,
        useFallbackSearch: false,
        searchStatus: 'unavailable', // 'ready' | 'building' | 'error' | 'unavailable'
        pendingSearchController: null, // AbortController for search cancellation
        theme: (() => { try { return localStorage.getItem('theme') || 'light'; } catch (_) { return 'light'; } })(),
        filters: { ...DEFAULT_FILTER_VALUES },
        currentSearchQueryId: 0, // Monotonically increasing ID for search cancellation
        sortBy: 'name',
        modal: {
            isOpen: false,
            lastFocusedElement: null,
            focusableElements: []
        },
        _loadRetries: 0,
        _maxLoadRetries: 3
    };

    // Configuration
    const config = {
        USE_MOCK: false // Flag to gate mock data usage
    };

    // DOM elements cache
    const elements = {};

    // Main application object
    const CLIApp = {
        initialized: false,
        searchCache: new LRUCache(50), // Global LRU cache for search results
        filterManager: null, // DebouncedFilterManager instance
        filterIndex: null, // FilterIndex instance
        virtualRenderer: null, // VirtualRenderer instance
        performanceMonitor: null, // PerformanceMonitor instance
        memoryManager: null, // MemoryManager instance
        // Ensure data is loaded before proceeding
        async ensureDataLoaded() {
            if (state.tools && state.tools.length > 0) {
                return true;
            }
            
            // Wait for data to be loaded if not ready
            if (this._dataLoadPromise) {
                await this._dataLoadPromise;
                return state.tools && state.tools.length > 0;
            }
            
            // Start loading data
            this._dataLoadPromise = this.loadData();
            await this._dataLoadPromise;
            return state.tools && state.tools.length > 0;
        },

        // Initialize the application
        async init() {
            try {
                // Log initialization start

                this.initPerformanceOptimizer();
                this.initMarked();
                this.cacheElements();
                this.initTheme();
                this.initEventListeners();
                await this.loadData();

                // Dispatch ready event for other modules
                window.dispatchEvent(new Event('cliapp:ready'));

                // Log initialization complete
            } catch (error) {
                console.error('Application initialization failed:', error);
                this.handleInitializationError(error);
            }
        },

        // Initialize performance optimization modules
        initPerformanceOptimizer() {
            // Check if PerformanceOptimizer is available
            if (window.PerformanceOptimizer) {
                this.filterManager = new window.PerformanceOptimizer.DebouncedFilterManager();
                this.filterIndex = new window.PerformanceOptimizer.FilterIndex();
                this.virtualRenderer = new window.PerformanceOptimizer.VirtualRenderer();
                this.performanceMonitor = new window.PerformanceOptimizer.PerformanceMonitor();
                this.memoryManager = new window.PerformanceOptimizer.MemoryManager();
                
                // Apply browser-specific optimizations
                if (window.BrowserCompatibility) {
                    const optimizations = window.BrowserCompatibility.getOptimizations();
                    // Apply debounce timings
                    this.filterManager.operationDelays = optimizations.debounceTimings;
                    // Apply render batch size if virtual renderer supports it
                    if (this.virtualRenderer.batchSize !== undefined) {
                        this.virtualRenderer.batchSize = optimizations.renderBatchSize;
                    }
                }
                
                // Register cleanup callbacks
                this.memoryManager.registerCleanup(() => {
                    this.filterIndex.clearCache();
                    this.virtualRenderer.clearRecycled();
                    this.searchCache.clear();
                });
                
                // Start auto cleanup
                this.memoryManager.startAutoCleanup();
                
                console.log('Performance optimization modules initialized');
            } else {
                console.log('Performance optimization modules not available, using standard mode');
            }
        },

        // Configure Marked.js for safer rendering
        initMarked() {
            if (typeof marked !== 'undefined') {
                marked.use({
                    mangle: false,
                    headerIds: false,
                    sanitize: false, // We use DOMPurify instead
                    breaks: true
                });
            }
        },

        // Safely render Markdown with DOMPurify sanitization
        renderMarkdownSafe(markdown) {
            if (!markdown || typeof markdown !== 'string') {
                return '';
            }
            
            // Sanitize HTML with DOMPurify
            if (typeof DOMPurify !== 'undefined') {
                // Parse markdown to HTML only if DOMPurify is available
                let html;
                if (typeof marked !== 'undefined') {
                    html = marked.parse(markdown);
                } else {
                    // Convert basic markdown to HTML (safe subset only)
                    html = markdown
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`(.*?)`/g, '<code>$1</code>')
                        .replace(/\n/g, '<br>');
                }
                return DOMPurify.sanitize(html);
            } else {
                console.warn('DOMPurify not available, returning escaped text');
                // When DOMPurify is unavailable, return plain escaped text, not HTML
                return this.escapeHtml(markdown).replace(/\n/g, '<br>');
            }
        },

        // Escape HTML characters for safe insertion
        escapeHtml(text) {
            if (!text || typeof text !== 'string') {
                return '';
            }
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // Validate and normalize stats schema
        validateStatsSchema(stats) {
            if (!stats || typeof stats !== 'object') {
                console.warn('Invalid stats object, using defaults');
                return this.getDefaultStats();
            }

            // Define expected schema with fallback values
            const schema = {
                totalTools: { fallback: state.tools.length || 357, type: 'number' },
                totalCategories: { fallback: state.categories.length || 37, type: 'number' },
                totalPlatforms: { fallback: 3, type: 'number' },
                totalLines: { fallback: 16000, type: 'number' },
                ready: { fallback: true, type: 'boolean' },
                websiteReady: { fallback: true, type: 'boolean' },
                lastUpdated: { fallback: new Date().toISOString(), type: 'string' },
                dataVersion: { fallback: '1.0.0', type: 'string' }
            };

            const validatedStats = {};
            const warnings = [];

            // Validate each expected field
            for (const [key, config] of Object.entries(schema)) {
                const value = stats[key];
                
                if (value === undefined || value === null) {
                    validatedStats[key] = config.fallback;
                    warnings.push(`Missing stats.${key}, using fallback: ${config.fallback}`);
                } else if (typeof value !== config.type) {
                    validatedStats[key] = config.fallback;
                    warnings.push(`Invalid type for stats.${key} (expected ${config.type}), using fallback: ${config.fallback}`);
                } else {
                    validatedStats[key] = value;
                }
            }

            // Handle legacy field mappings
            if (stats.toolsCount && !validatedStats.totalTools) {
                validatedStats.totalTools = stats.toolsCount;
                warnings.push('Mapped legacy stats.toolsCount to stats.totalTools');
            }
            
            if (stats.categoriesCount && !validatedStats.totalCategories) {
                validatedStats.totalCategories = stats.categoriesCount;
                warnings.push('Mapped legacy stats.categoriesCount to stats.totalCategories');
            }

            // Copy any additional valid fields that aren't in the schema
            for (const [key, value] of Object.entries(stats)) {
                if (!schema.hasOwnProperty(key) && value !== undefined && value !== null) {
                    validatedStats[key] = value;
                }
            }

            // Log warnings if any
            if (warnings.length > 0) {
                console.warn('Stats schema validation warnings:', warnings);
            }

            return validatedStats;
        },

        // Get default stats object
        getDefaultStats() {
            return {
                totalTools: state.tools.length || 357,
                totalCategories: state.categories.length || 37,
                totalPlatforms: 3,
                totalLines: 16000,
                ready: true,
                websiteReady: true,
                lastUpdated: new Date().toISOString(),
                dataVersion: '1.0.0'
            };
        },

        // Accessibility utility functions
        getFocusableElements(container) {
            const focusableSelectors = [
                'button:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                'a[href]',
                '[tabindex]:not([tabindex="-1"])',
                '[contenteditable="true"]'
            ].join(', ');
            
            return container.querySelectorAll(focusableSelectors);
        },

        trapFocus(container) {
            const focusableElements = this.getFocusableElements(container);
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            container.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });

            state.modal.focusableElements = focusableElements;
            return firstElement;
        },

        handleEscapeKey(e) {
            if (e.key === 'Escape' && state.modal.isOpen) {
                this.closeModal();
            }
        },

        // Cache frequently used DOM elements
        cacheElements() {
            elements.themeToggle = document.getElementById('themeToggle');
            elements.backToTop = document.getElementById('backToTop');
            elements.quickSearch = document.getElementById('quickSearch');
            elements.searchButton = document.getElementById('searchButton');
            elements.searchResults = document.getElementById('searchResults');
            elements.searchResultsList = document.getElementById('searchResultsList');
            elements.closeSearch = document.getElementById('closeSearch');

            // Tools page elements may not exist on all pages; initialize to null to avoid undefined errors
            elements.toolSearch = null;
            elements.toolSearchButton = null;
            elements.toolSearchClear = null;
            elements.categoryFilter = null;
            elements.difficultyFilter = null;
            elements.platformFilter = null;
            elements.installationFilter = null;
            elements.resetFilters = null;
            elements.sortBy = null;
            elements.toolsGrid = null;
            elements.emptyState = null;
            elements.toolsLoading = null;
            elements.loadMoreBtn = null;
            elements.toolModal = null;
            elements.closeModal = null;
        },

        

        // Initialize theme
        initTheme() {
            document.documentElement.setAttribute('data-theme', state.theme);
            if (elements.themeToggle) {
                const icon = elements.themeToggle.querySelector('.theme-toggle-icon');
                if (icon) {
                    icon.textContent = state.theme === 'dark' ? '☀️' : '🌙';
                }
            }
        },

        // Initialize event listeners
        initEventListeners() {
            // Theme toggle
            if (elements.themeToggle) {
                elements.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
            }

            // Back to top button
            if (elements.backToTop) {
                elements.backToTop.addEventListener('click', this.scrollToTop);
                window.addEventListener('scroll', this.handleScroll);
            }

            // Quick search on homepage
            if (elements.quickSearch) {
                elements.quickSearch.addEventListener('input', this.handleQuickSearch.bind(this));
                elements.quickSearch.addEventListener('keydown', this.handleSearchKeydown.bind(this));
            }

            if (elements.searchButton) {
                elements.searchButton.addEventListener('click', this.performQuickSearch.bind(this));
            }

            if (elements.closeSearch) {
                elements.closeSearch.addEventListener('click', this.closeQuickSearch.bind(this));
            }

            // Global ESC key handler for modal accessibility
            document.addEventListener('keydown', this.handleEscapeKey.bind(this));

            // Close search results when clicking outside
            document.addEventListener('click', (e) => {
                if (elements.searchResults && 
                    elements.searchResults.style.display !== 'none' &&
                    !e.target.closest('.search-box') &&
                    !e.target.closest('.search-results')) {
                    this.closeQuickSearch();
                }
            });

            // Escape key to close search
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeQuickSearch();
                    this.closeModal();
                }
            });
        },

        // Load data from JSON files using DataLoader
        async loadData() {
            try {
                // Initialize DataLoader if not already created
                if (!this.dataLoader) {
                    this.dataLoader = new window.DataLoader({
                        validateDuringLoad: true,
                        maxRetries: 1  // Reduced from 3 - SimpleErrorHandler handles retries
                    });
                    
                    // Register event listeners for DataLoader
                    this.registerDataLoaderListeners();
                }
                
                // Use SimpleErrorHandler's retry mechanism for data loading
                const loadedData = window.simpleErrorHandler 
                    ? await window.simpleErrorHandler.retryDataLoad(() => this.dataLoader.loadAll(), 'data')
                    : await this.dataLoader.loadAll();
                
                // Update state with loaded data
                this.updateToolsAndReindex(loadedData.tools || []);
                state.categories = loadedData.categories || [];
                state.stats = loadedData.stats || this.getDefaultStats();
                
                // Store validation results
                state.validationResults = this.dataLoader.validationResults;
                
                // Clear and rebuild FilterIndex cache after tools mutation
                if (this.filterIndex) {
                    this.filterIndex.clearCache();
                    this.filterIndex.buildIndexes(state.tools);
                }
                
                this.initSearch();
                this.updateDynamicCounts();

                // Publish data sources for other modules
                window.toolsData = state.tools;
                window.categoriesData = state.categories;
                window.statsData = state.stats;
                
            } catch (error) {
                // Final fallback strategies
                try {
                    // Try embedded data as fallback
                    if (await this.tryLoadEmbeddedData()) {
                        this.initSearch();
                        this.updateDynamicCounts();
                        // Publish data sources
                        window.toolsData = state.tools;
                        window.categoriesData = state.categories;
                        window.statsData = state.stats;
                        return;
                    }

                    // Use mock data if allowed
                    if (config.USE_MOCK) {
                        console.log('Using mock data due to repeated load failures');
                        await this.loadMockData();
                        this.buildSearchIndex();
                        this.updateDynamicCounts();
                        // Publish data sources
                        window.toolsData = state.tools;
                        window.categoriesData = state.categories;
                        window.statsData = state.stats;
                        return;
                    }

                    // Otherwise, handle as critical failure
                    this.handleDataLoadError(error);
                } catch (innerError) {
                    console.error('Final fallback also failed:', innerError);
                    this.handleDataLoadError(innerError);
                }
            }
        },
        
        // Try to load embedded data for file:// protocol
        async tryLoadEmbeddedData() {
            try {
                // Check if embedded data exists (will be added by build script)
                if (typeof window.EMBEDDED_CLI_DATA !== 'undefined') {
                    console.log('Loading embedded data');
                    
                    // Handle stats
                    state.stats = window.EMBEDDED_CLI_DATA.stats ? this.validateStatsSchema(window.EMBEDDED_CLI_DATA.stats) : this.getDefaultStats();
                    
                    // Handle tools - check if it's nested in a tools property
                    let toolsData = window.EMBEDDED_CLI_DATA.tools;
                    if (toolsData && typeof toolsData === 'object' && !Array.isArray(toolsData) && toolsData.tools) {
                        // Extract the nested tools array
                        toolsData = toolsData.tools;
                    }
                    this.updateToolsAndReindex(Array.isArray(toolsData) ? toolsData : []);
                    
                    // Handle categories - check if it's nested in a categories property
                    let categoriesData = window.EMBEDDED_CLI_DATA.categories;
                    if (categoriesData && typeof categoriesData === 'object' && !Array.isArray(categoriesData) && categoriesData.categories) {
                        // Extract the nested categories array
                        categoriesData = categoriesData.categories;
                    }
                    state.categories = Array.isArray(categoriesData) ? categoriesData : [];
                    
                    // Clear and rebuild FilterIndex cache after tools mutation
                    if (this.filterIndex) {
                        this.filterIndex.clearCache();
                        this.filterIndex.buildIndexes(state.tools);
                    }
                    
                    return true;
                }
                
                // Embedded data not found
                console.log('No embedded data found');
                return false;
            } catch (error) {
                console.error('Failed to load embedded data:', error);
                return false;
            }
        },
        

        // Update dynamic counts in HTML from loaded data
        updateDynamicCounts() {
            const toolCount = state.stats.totalTools || state.tools.length || 357;
            const categoryCount = state.stats.totalCategories || state.categories.length || 37;
            
            // Check if data is not ready
            const dataNotReady = (
                state.stats.ready === false ||
                state.tools.length === 0 ||
                state.categories.length === 0
            );
            
            if (dataNotReady) {
                this.showDataNotReadyMessage();
            }
            
            // Update all dynamic count elements
            const countElements = {
                'toolCount': `${toolCount}+`,           // Homepage hero
                'toolsCount': `${toolCount}+`,          // Tools page subtitle
                'cheatToolsCount': `${toolCount}+`,     // Cheatsheet page
                'statTools': `${toolCount}+`,           // Homepage stats
                'categoriesCount': `${categoryCount}+`, // Tools page subtitle
                'cheatCategoriesCount': `${categoryCount}+` // Cheatsheet page
            };
            
            for (const [elementId, value] of Object.entries(countElements)) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.textContent = value;
                    console.log(`Updated ${elementId} to ${value}`);
                }
            }
        },

        // Show data not ready message with call-to-action
        showDataNotReadyMessage() {
            const messageElements = document.querySelectorAll('.hero-subtitle, .page-subtitle');
            messageElements.forEach(element => {
                if (element) {
                    const callToAction = document.createElement('div');
                    callToAction.className = 'data-not-ready-message';
                    callToAction.style.cssText = 'margin-top: 1rem; padding: 1rem; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; color: #856404;';
                    const callToActionHTML = `
                        <strong>📊 Data Generation Required</strong><br>
                        The website data hasn't been generated yet. Run <code>scripts/generate_site_data.sh</code> to create the complete dataset.
                    `;
                    callToAction.innerHTML = typeof DOMPurify !== 'undefined' 
                        ? DOMPurify.sanitize(callToActionHTML)
                        : callToActionHTML;
                    element.appendChild(callToAction);
                }
            });
        },

        // Initialize Search System
        async initSearch() {
            try {
                // Debug logging

                // Check if SearchManager is available
                if (!window.SearchManager) {
                    console.error('SearchManager not loaded, search will be unavailable');
                    state.searchStatus = 'unavailable';
                    this.updateSearchStatus('error');
                    
                    return;
                }

                // Create new search manager
                state.searchManager = new window.SearchManager();
                
                // Mark as building
                this.updateSearchStatus('building');

                // Initialize with tools data
                if (state.tools && state.tools.length > 0) {
                    console.log('Building search index with', state.tools.length, 'tools');
                    
                    try {
                        await state.searchManager.initialize(state.tools);
                        
                        // Mark as ready
                        state.searchStatus = 'ready';
                        this.updateSearchStatus('ready');
                        
                        console.log('Search index built successfully');
                        
                        
                    } catch (initError) {
                        console.error('Failed to initialize search index:', initError);
                            state.searchStatus = 'error';
                        this.updateSearchStatus('error');
                        
                    }
                    
                } else {
                    // No tools to index yet, mark as not ready
                    state.searchStatus = 'initializing';
                    this.updateSearchStatus('not-ready');
                    
                    
                    // When tools load later, call state.searchManager.initialize(state.tools)
                }

            } catch (error) {
                console.error('Failed to initialize search system:', error);
                state.searchStatus = 'error';
                this.updateSearchStatus('error');
                
            }
        },

        // Dummy function to maintain compatibility
        initSearchWorker() {
            // Redirect to new initSearch method
            return this.initSearch();
        },

        // Legacy worker code removed - SearchManager handles all initialization


        // Update search status indicator
        updateSearchStatus(status) {
            // Comment 10: Enhanced UI feedback for search status with detailed indicators
            const indicators = document.querySelectorAll('.search-status');
            const statusIcon = document.getElementById('search-status-icon');
            const statusText = document.getElementById('search-status-text');
            
            indicators.forEach(indicator => {
                indicator.className = `search-status status-${status}`;
                switch (status) {
                    case 'ready':
                        indicator.textContent = '🔍 Search ready';
                        break;
                    case 'initializing':
                    case 'building':
                    case 'not-ready':
                        indicator.textContent = '⏳ Building search index...';
                        break;
                    case 'error':
                    case 'unavailable':
                        indicator.textContent = '⚠️ Search unavailable';
                        break;
                    default:
                        indicator.textContent = '🔄 Search initializing...';
                        break;
                }
            });
            
            // Update specific status indicators if they exist
            if (statusIcon && statusText) {
                switch (status) {
                    case 'ready':
                        statusIcon.textContent = '✅';
                        statusText.textContent = 'Ready';
                        break;
                    case 'initializing':
                    case 'building':
                    case 'not-ready':
                        statusIcon.textContent = '⏳';
                        statusText.textContent = 'Building index...';
                        break;
                    case 'error':
                        statusIcon.textContent = '❌';
                        statusText.textContent = 'Error - using simple search';
                        break;
                    case 'unavailable':
                        statusIcon.textContent = '⚠️';
                        statusText.textContent = 'Search unavailable';
                        break;
                    default:
                        statusIcon.textContent = '❓';
                        statusText.textContent = 'Unknown';
                        break;
                }
            }
        },

        // Perform search using Web Worker
        // Unified search function that handles worker, fallback, and main thread search
        async performSearch(query, limit = 50) {
            // Ensure data is loaded before searching
            await this.ensureDataLoaded();
            
            // Handle empty query - return all tools without invoking search backends
            if (!query || !query.trim()) {
                // Apply filters and return the filtered tools list
                // This ensures filter state is respected even for empty queries
                await this.applyFilters();
                // Comment 3: Ensure filtered tools are sorted per state.sortBy and return consistent shape
                const sortedTools = [...(state.filteredTools || state.tools || [])];
                // Pass through normalizeSearchResults to keep consistent return shape
                return this.normalizeSearchResults(sortedTools, 'empty');
            }

            // Comment 3: Enforce minimum query length consistency
            const trimmedQuery = query.trim();
            if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
                // Return empty results for queries that are too short
                return [];
            }
            
            // Record search performance
            const searchStartTime = performance.now();
            
            try {
                // Cancel any pending search operations
                if (this.pendingSearchController) {
                    this.pendingSearchController.abort();
                }
                this.pendingSearchController = new AbortController();
                const signal = this.pendingSearchController.signal;
                
                // Check cache for repeated searches, including filter state and sort
                const f = state.filters || {};
                const sortKey = state.sortBy || 'relevance';
                const fKey = `${f.category||''}|${f.platform||''}|${f.difficulty||''}|${f.installation||''}|${sortKey}`;
                const cacheKey = `search_${query}_${limit}_${fKey}`;
                
                const cached = this.searchCache.get(cacheKey);
                if (cached && Date.now() - cached.timestamp < 5000) { // 5 second cache
                    return cached.results;
                }
                
                // Use SearchManager for search
                if (state.searchManager && !signal.aborted) {
                    try {
                        const searchResults = state.searchManager.search(query, { limit });
                        // SearchManager already returns normalized results, use them directly
                        const result = searchResults;
                        // Cache successful results
                        if (result && result.length > 0) {
                            this.searchCache.set(cacheKey, {
                                results: result,
                                timestamp: Date.now()
                            });
                        }
                        return result;
                    } catch (e) {
                        // Search failed, log error
                        console.error('Search failed:', e);
                        // Return empty results on error
                        return [];
                    }
                }
                
                // If no search manager available, return empty results
                console.warn('No search system available');
                return [];
                
            } catch (error) {
                console.error('performSearch error:', error);
                // Use simple error handler for search errors
                if (window.simpleErrorHandler) {
                    const fallback = window.simpleErrorHandler.handleSearchError(error);
                    const simpleResults = fallback.search(query, state.tools);
                    const result = this.normalizeSearchResults(simpleResults, 'simple');
                    return result;
                } else {
                    // Fall back to simple search on error
                    const simpleResults = this.simpleSearch(query, limit);
                    const result = this.normalizeSearchResults(simpleResults, 'simple');
                    return result;
                }
            }
        },

        // Invalidate search cache (call when filters change)
        invalidateSearchCache() {
            this.searchCache.clear();
        },

        // Cancel an ongoing search
        cancelSearch(requestId) {
            // Abort any pending search controller
            if (this.pendingSearchController) {
                this.pendingSearchController.abort();
                this.pendingSearchController = null;
            }
        },


        // Simple fallback search when no index is available
        simpleSearch(query, limit = 50) {
            try {
                // Use SearchManager's simpleSearch if available
                if (state.searchManager && typeof state.searchManager.simpleSearch === 'function') {
                    return state.searchManager.simpleSearch(query, limit);
                }
                
                // Legacy implementation as last resort fallback
                const lowerQuery = query.toLowerCase().trim();
                const results = [];
                
                for (let i = 0; i < state.tools.length && results.length < limit; i++) {
                    const tool = state.tools[i];
                    if (!tool) continue;
                    
                    let score = 0;
                    const nameMatch = tool.name && tool.name.toLowerCase().includes(lowerQuery);
                    const descMatch = tool.description && tool.description.toLowerCase().includes(lowerQuery);
                    const catMatch = tool.category && tool.category.toLowerCase().includes(lowerQuery);
                    const tagMatch = tool.tags && Array.isArray(tool.tags) && 
                                     tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
                    
                    // Calculate relevance score
                    if (nameMatch) score += 3;
                    if (descMatch) score += 2;
                    if (catMatch) score += 1;
                    if (tagMatch) score += 1;
                    
                    if (score > 0) {
                        results.push({
                            tool: tool,
                            score: score / 7, // Normalize score to 0-1
                            highlights: {}
                        });
                    }
                }
                
                // Sort by score and return normalized format
                return results.sort((a, b) => b.score - a.score);
                
            } catch (error) {
                console.error('simpleSearch error:', error);
                return [];
            }
        },

        // Health check method for error recovery
        async healthCheck() {
            try {
                // Check data availability
                if (!state.tools || !Array.isArray(state.tools) || state.tools.length === 0) {
                    return false;
                }
                
                // Check SearchManager status
                if (state.searchManager) {
                    const health = state.searchManager.healthCheck();
                    return health.searchFunctional === true;
                }
                
                // Check main thread search index
                
                return false; // No search method available
                
            } catch (error) {
                return false;
            }
        },

        // Public method to refresh app state and UI after data recovery
        async refreshAppState(toolsData, categoriesData, statsData) {
            try {
                
                // Update state with recovered data
                if (Array.isArray(toolsData)) {
                    this.updateToolsAndReindex(toolsData);
                    // Comment 11: Clear search cache when tools change
                    if (this.searchCache) {
                        this.searchCache.clear();
                    }
                    // Clear and rebuild FilterIndex cache after tools mutation
                    if (this.filterIndex) {
                        this.filterIndex.clearCache();
                        this.filterIndex.buildIndexes(state.tools);
                    }
                }
                if (Array.isArray(categoriesData)) {
                    state.categories = categoriesData;
                }
                if (typeof statsData === 'object' && statsData !== null) {
                    state.stats = statsData;
                }
                
                // Update global references
                window.toolsData = state.tools;
                window.categoriesData = state.categories;
                window.statsData = state.stats;
                
                // Legacy fallback code removed - SearchManager handles all searches
                
                // Reinitialize SearchManager if needed
                if (state.tools.length > 0 && !state.searchManager) {
                    this.initSearch();
                }
                
                // Refresh UI components
                this.populateFilters();
                this.updateDynamicCounts();
                await this.applyFilters();
                
                
                return true;
            } catch (error) {
                return false;
            }
        },

        // Search on main thread (fallback)
        async searchOnMainThread(query, limit = 50) {
            try {
                // Legacy search code removed - SearchManager handles all searches
                if (false) {
                    const searchResults = [];
                    return searchResults.slice(0, limit).map(result => ({
                        id: result.ref,
                        score: result.score || 1.0,
                        tool: state.tools.find(t => t.id === result.ref)
                    }));
                }
                return this.simpleSearch(query, limit);
            } catch (error) {
                console.error('Main thread search error:', error);
                return this.simpleSearch(query, limit);
            }
        },

        // Process worker results from lightweight refs to full tools
        processWorkerResults(results) {
            try {
                // Comment 8: Prebuilt map for efficient ref->tool lookups, processing lightweight worker payloads
                const toolMap = new Map();
                state.tools.forEach(tool => {
                    const ref = tool.id || tool.name;
                    if (ref) toolMap.set(ref, tool);
                });
                
                return results.map(result => {
                    const tool = toolMap.get(result.ref);
                    if (!tool) {
                        console.warn(`Worker result ref "${result.ref}" not found in tool map`);
                        return null; // Filter out unmapped refs
                    }
                    
                    // Return shape matches consumer expectations: { item: tool, score, highlightedName?, highlightedDescription? }
                    const processedResult = {
                        item: tool,
                        score: result.score || 0
                    };
                    
                    // Derive highlights from positions if available
                    if (result.positions) {
                        // Process match positions to create highlights
                        // For now, we'll just mark that highlights are available
                        processedResult.highlightedName = tool.name;
                        processedResult.highlightedDescription = tool.description;
                    }
                    
                    return processedResult;
                }).filter(Boolean); // Filter out missing refs
            } catch (error) {
                console.warn('Error processing worker results:', error);
                return [];
            }
        },

        // Normalize result shapes across worker/fallback/simple paths before rendering
        normalizeSearchResults(results, source) {
            // Comment 7: Handle all result shapes and return uniform format consumed by UI
            // ALWAYS returns a consistent array of { tool, score, highlights }
            if (!Array.isArray(results)) return [];
            
            return results.map((result, index) => {
                let tool = null;
                let score = 0;
                let highlights = {};
                let recognized = false;
                
                // Handle different result formats based on source
                if (source === 'worker' && result && typeof result === 'object') {
                    if (result.item) {
                        // (a) Processed worker format from processWorkerResults
                        tool = result.item;
                        score = result.score || 0;
                        if (result.highlightedName || result.highlightedDescription) {
                            highlights = {
                                name: result.highlightedName,
                                description: result.highlightedDescription
                            };
                        }
                        recognized = true;
                    } else if (result.ref) {
                        // (a) Worker refs array - Legacy lightweight worker format
                        const toolMap = new Map();
                        state.tools.forEach(t => {
                            const ref = t.id || t.name;
                            if (ref) toolMap.set(ref, t);
                        });
                        tool = toolMap.get(result.ref);
                        if (!tool) {
                            console.warn(`Unmapped ref in normalizeSearchResults: "${result.ref}"`);
                            return null;
                        }
                        score = result.score || 0;
                        if (result.positions) {
                            highlights.hasHighlights = true;
                        }
                        recognized = true;
                    }
                } else if (source === 'fallback' && result && typeof result === 'object') {
                    if (result.item) {
                        // (b) Fallback results {item, ...} format
                        tool = result.item;
                        score = result.score || 0;
                        if (result.highlightedName || result.highlightedDescription) {
                            highlights = {
                                name: result.highlightedName,
                                description: result.highlightedDescription
                            };
                        }
                        recognized = true;
                    }
                } else if (source === 'main-index' && result && typeof result === 'object' && result.ref) {
                    // (c) Lunr main results format
                    const toolMap = new Map();
                    state.tools.forEach(t => {
                        const ref = t.id || t.name;
                        if (ref) toolMap.set(ref, t);
                    });
                    tool = toolMap.get(result.ref);
                    if (!tool) {
                        console.warn(`Unmapped ref in normalizeSearchResults (main-index): "${result.ref}"`);
                        return null;
                    }
                    score = result.score || 0;
                    recognized = true;
                } else if (source === 'simple' || source === 'empty') {
                    // (d) Simple results (tool objects) or empty query results
                    if (result && typeof result === 'object') {
                        if (result.tool) {
                            // Result with tool property
                            tool = result.tool;
                            score = result.score || 0;
                            if (result.highlightedName || result.highlightedDescription) {
                                highlights = {
                                    name: result.highlightedName,
                                    description: result.highlightedDescription
                                };
                            }
                        } else {
                            // Direct tool object
                            tool = result;
                            score = result.score || 0;
                            if (result.matches) {
                                highlights.matches = result.matches;
                            }
                        }
                        recognized = true;
                    }
                } else if (result && typeof result === 'object') {
                    // Generic fallback handling for unspecified sources
                    if (result.tool) {
                        // Alternative format with tool property
                        tool = result.tool;
                        score = result.score || 0;
                        if (result.highlightedName || result.highlightedDescription) {
                            highlights = {
                                name: result.highlightedName,
                                description: result.highlightedDescription
                            };
                        }
                        recognized = true;
                    } else if (result.name || result.id) {
                        // Direct tool object
                        tool = result;
                        score = result.score || 0;
                        if (result.matches) {
                            highlights.matches = result.matches;
                        }
                        recognized = true;
                    }
                }
                
                // Comment 7: Add console.warn for unrecognized shapes
                if (!recognized && result) {
                    console.warn('normalizeSearchResults: Unrecognized result shape', {
                        source,
                        index,
                        result,
                        resultKeys: typeof result === 'object' ? Object.keys(result) : 'not-object'
                    });
                }
                
                // Validate tool has required fields
                if (!tool || (!tool.name && !tool.id)) return null;
                
                return {
                    tool: tool,
                    score: score,
                    highlights: highlights
                };
            }).filter(Boolean);
        },

        // Handle search results from worker
        handleSearchResults(data) {
            try {
                console.log(`Search completed in ${data.duration}ms: ${data.totalFound} results`);
                
                // Normalize results to tool objects array
                let results = data.results || [];
                
                // Clear previous search highlights
                state.searchHighlights.clear();
                
                // Determine source based on result format
                let source = 'unknown';
                if (results.length > 0) {
                    if (results[0].ref !== undefined) {
                        source = 'worker';
                    } else if (results[0].item !== undefined) {
                        source = 'fallback';
                    } else if (results[0].score !== undefined) {
                        source = 'simple';
                    }
                }
                
                // Use normalizeSearchResults for consistent handling
                const normalized = this.normalizeSearchResults(results, source);
                
                // Extract tools and highlights from normalized results
                const normalizedTools = normalized.map(x => x.tool);
                normalized.forEach(item => {
                    if (item && item.tool && item.highlights && Object.keys(item.highlights).length > 0) {
                        state.searchHighlights.set(item.tool.id || item.tool.name, item.highlights);
                    }
                });
                
                // IMPORTANT: Ensure filters are applied before intersecting
                if (!state.filteredTools || state.filteredTools === null) {
                    // Apply filters if not yet applied
                    this.applyFilters();
                }
                
                // Intersect search results with active filters
                // This ensures search results respect the current filter state
                const activeFilteredIds = new Set((state.filteredTools || state.tools).map(t => t.id || t.name));
                const filteredResults = normalizedTools.filter(t => activeFilteredIds.has(t.id || t.name));
                state.filteredTools = filteredResults;
                
                // Update UI
                this.renderTools();
                this.updateResultsCount();
                
                // Dispatch results-updated event
                window.dispatchEvent(new CustomEvent('cliapp:results-updated', {
                    detail: { filteredCount: state.filteredTools?.length ?? 0 }
                }));
                
                // Also update search results display if on index page
                this.displaySearchResults(normalizedTools, data.query || '');
                
            } catch (error) {
                console.error('handleSearchResults error:', error);
            }
        },

        // Display search results in UI
        displaySearchResults(results, query) {
            // Announce results to screen readers
            const announcement = document.getElementById('searchResultsAnnouncement');
            if (announcement) {
                const count = results ? results.length : 0;
                const message = query 
                    ? `${count} results found for "${query}"`
                    : `Showing ${count} tools`;
                announcement.textContent = message;
            }
            try {
                if (!elements.searchResultsList) return;
                if (!Array.isArray(results)) results = [];

                if (results.length === 0) {
                    const noResultsHTML = `
                        <div class="search-no-results">
                            <p>No results found for "${this.escapeHtml(query)}"</p>
                            <p>Try a different search term or browse by category.</p>
                        </div>
                    `;
                    elements.searchResultsList.innerHTML = typeof DOMPurify !== 'undefined'
                        ? DOMPurify.sanitize(noResultsHTML)
                        : noResultsHTML;
                } else {
                    const resultsHTML = results.map(tool => `
                        <a href="tools.html?search=${encodeURIComponent(tool.name)}" class="search-result-item">
                            <div class="search-result-name">${this.highlightText(this.escapeHtml(tool.name), query)}</div>
                            <div class="search-result-description">${this.highlightText(this.escapeHtml(tool.description || ''), query)}</div>
                            ${typeof tool.score !== 'undefined' ? `<div class="search-result-score">Score: ${Number(tool.score).toFixed(2)}</div>` : ''}
                        </a>
                    `).join('');
                    elements.searchResultsList.innerHTML = typeof DOMPurify !== 'undefined'
                        ? DOMPurify.sanitize(resultsHTML)
                        : resultsHTML;
                }
            } catch (error) {
                console.error('displaySearchResults error:', error);
            }
        },

        // Register event listeners for DataLoader
        registerDataLoaderListeners() {
            if (!this.dataLoader) return;
            
            // Loading start event
            this.dataLoader.on('loading-start', (data) => {
            });
            
            // Status update event
            this.dataLoader.on('status-update', (data) => {
            });
            
            // Validation warning event
            this.dataLoader.on('validation-warning', (data) => {
                console.warn('Data validation warning:', data);
                
                // Show non-intrusive alert if applicable
                if (data.severity === 'high') {
                    this.showValidationAlert('warning', data.message);
                }
            });
            
            // Validation error event
            this.dataLoader.on('validation-error', (data) => {
                console.error('Data validation error:', data);
                
                // Show alert for validation errors
                this.showValidationAlert('error', data.message);
            });
            
            // Loading complete event
            this.dataLoader.on('loading-complete', (data) => {
                // Data loading complete
            });
        },
        
        // Show validation alert (non-intrusive)
        showValidationAlert(type, message) {
            // Only show if not already showing an alert
            if (this._validationAlertTimeout) return;
            
            const alertDiv = document.createElement('div');
            alertDiv.className = `validation-alert validation-alert-${type}`;
            alertDiv.textContent = message;
            alertDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                background: ${type === 'error' ? '#f44336' : '#ff9800'};
                color: white;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(alertDiv);
            
            // Auto-remove after 5 seconds
            this._validationAlertTimeout = setTimeout(() => {
                alertDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(alertDiv);
                    this._validationAlertTimeout = null;
                }, 300);
            }, 5000);
        },
        
        // Populate filter options from canonical lists
        populateFilters() {
            // Only populate on tools page
            if (!elements.platformFilter && !elements.installationFilter) return;
            
            // Populate platform filter from canonical list
            if (elements.platformFilter && window.DataNormalizer) {
                const currentValue = elements.platformFilter.value;
                elements.platformFilter.innerHTML = '<option value="">All Platforms</option>';
                
                // Add canonical platforms
                window.DataNormalizer.CANONICAL_PLATFORMS.forEach(platform => {
                    const option = document.createElement('option');
                    option.value = platform;
                    option.textContent = platform;
                    elements.platformFilter.appendChild(option);
                });
                
                // Add Unknown option if needed
                const hasUnknown = state.tools.some(tool => {
                    const platforms = window.extractPlatforms(tool);
                    return platforms.length === 0 || platforms.includes('Unknown');
                });
                if (hasUnknown) {
                    const option = document.createElement('option');
                    option.value = 'Unknown';
                    option.textContent = 'Unknown';
                    elements.platformFilter.appendChild(option);
                }
                
                // Restore previous value if it exists
                if (currentValue && elements.platformFilter.querySelector(`option[value="${currentValue}"]`)) {
                    elements.platformFilter.value = currentValue;
                }
            }
            
            // Populate installation filter from canonical list
            if (elements.installationFilter && window.DataNormalizer) {
                const currentValue = elements.installationFilter.value;
                elements.installationFilter.innerHTML = '<option value="">All Installation Methods</option>';
                
                // Add canonical installation methods
                window.DataNormalizer.CANONICAL_INSTALLATIONS.forEach(method => {
                    const option = document.createElement('option');
                    option.value = method;
                    option.textContent = method;
                    elements.installationFilter.appendChild(option);
                });
                
                // Add Unknown option if needed
                const hasUnknown = state.tools.some(tool => 
                    !tool.installation || tool.installation === 'Unknown'
                );
                if (hasUnknown) {
                    const option = document.createElement('option');
                    option.value = 'Unknown';
                    option.textContent = 'Unknown';
                    elements.installationFilter.appendChild(option);
                }
                
                // Restore previous value if it exists
                if (currentValue && elements.installationFilter.querySelector(`option[value="${currentValue}"]`)) {
                    elements.installationFilter.value = currentValue;
                }
            }
        },
        

        // DEPRECATED: Old loading functions kept for reference but not used
        // Load statistics from stats.json
        async _deprecatedLoadStats() {
            try {
                const response = await fetch('data/stats.json');
                if (!response.ok) {
                    throw new Error(`Failed to load stats.json: ${response.status}`);
                }
                const data = await response.json();
                
                // Check if data is ready
                if (data.ready === false) {
                    console.warn('Stats data not ready - data generation may be incomplete');
                    this.logMCPStatus('data_not_ready', 'Stats data marked as not ready');
                }
                
                state.stats = this.validateStatsSchema(data);
            } catch (error) {
                console.error('Error loading stats:', error);
                
                if (config.USE_MOCK) {
                    console.log('Falling back to mock stats data');
                    this.logMCPStatus('mock_fallback', 'Using mock stats data due to fetch failure');
                    const mockStats = this.getDefaultStats();
                    mockStats.totalCategories = 25; // Mock-specific value
                    mockStats.totalLines = 8500; // Mock-specific value  
                    mockStats.ready = false;
                    mockStats.mock = true;
                    state.stats = mockStats;
                } else {
                    // Provide minimal fallback stats
                    const fallbackStats = this.getDefaultStats();
                    fallbackStats.totalTools = 0;
                    fallbackStats.totalCategories = 0;
                    fallbackStats.totalLines = 0;
                    fallbackStats.ready = false;
                    state.stats = fallbackStats;
                    throw error;
                }
            }
        },

        // DEPRECATED: Load tools from tools.json with comprehensive validation
        async _deprecatedLoadTools() {
            try {
                
                const response = await fetch('data/tools.json');
                if (!response.ok) {
                    throw new Error(`Failed to load tools.json: ${response.status}`);
                }
                const data = await response.json();
                
                // Validate data structure
                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid tools.json structure');
                }
                
                // Check if data is ready
                if (data.ready === false) {
                    console.warn('Tools data not ready - data generation may be incomplete');
                    this.logMCPStatus('data_not_ready', 'Tools data marked as not ready');
                }
                
                const toolsRaw = data.tools || [];
                
                // Log raw data stats
                
                // Normalize and validate tool entries with detailed logging
                const normalizedTools = [];
                for (let i = 0; i < toolsRaw.length; i++) {
                    const normalized = this.normalizeToolEntry(toolsRaw[i], i);
                    if (normalized) {
                        normalizedTools.push(normalized);
                    }
                }
                
                this.updateToolsAndReindex(normalizedTools);

                if (state.tools.length === 0) {
                    console.warn('No valid tools found in tools.json after normalization');
                }
                
                // Log normalized data stats
            } catch (error) {
                console.error('Error loading tools:', error);
                
                if (config.USE_MOCK) {
                    console.log('Falling back to mock tools data');
                    this.logMCPStatus('mock_fallback', 'Using mock tools data due to fetch failure');
                    this.updateToolsAndReindex([
                        {
                            id: 'ls',
                            name: 'ls',
                            category: 'File Operations',
                            description: 'List directory contents',
                            usage: 'ls [options] [file...]',
                            ready: false,
                            mock: true,
                            difficulty: 1,
                            platform: ['macOS', 'Linux'],
                            installation: 'built-in',
                            tags: []
                        }
                    ]);
                } else {
                    this.updateToolsAndReindex([]);
                    throw error;
                }
            }
        },

        // DEPRECATED: Load categories from categories.json
        async _deprecatedLoadCategories() {
            try {
                const response = await fetch('data/categories.json');
                if (!response.ok) {
                    throw new Error(`Failed to load categories.json: ${response.status}`);
                }
                const data = await response.json();
                
                // Check if data is ready
                if (data.ready === false) {
                    console.warn('Categories data not ready - data generation may be incomplete');
                    this.logMCPStatus('data_not_ready', 'Categories data marked as not ready');
                }
                
                const catsRaw = data.categories || [];
                state.categories = (catsRaw.map(cat => ({
                    id: cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    name: cat.name,
                    count: cat.toolCount || 0,
                    icon: this.getCategoryIconByName(cat.name),
                    description: cat.description || ''
                })) || []);
            } catch (error) {
                console.error('Error loading categories:', error);
                
                if (config.USE_MOCK) {
                    console.log('Falling back to mock categories data');
                    this.logMCPStatus('mock_fallback', 'Using mock categories data due to fetch failure');
                    state.categories = [
                        {
                            id: 'file-operations',
                            name: 'File Operations',
                            count: 15,
                            icon: '📁',
                            description: 'Tools for managing files and directories',
                            ready: false,
                            mock: true
                        }
                    ];
                } else {
                    state.categories = [];
                    throw error;
                }
            }
        },

        // Load cheatsheet content
        async loadCheatsheet() {
            try {
                const response = await fetch('data/cheatsheet.json');
                if (!response.ok) {
                    throw new Error(`Failed to load cheatsheet.json: ${response.status}`);
                }
                const data = await response.json();
                
                // Check if data is ready
                if (data.ready === false) {
                    console.warn('Cheatsheet data not ready - data generation may be incomplete');
                    this.logMCPStatus('data_not_ready', 'Cheatsheet data marked as not ready');
                }
                
                return data;
            } catch (error) {
                console.error('Error loading cheatsheet:', error);
                
                if (config.USE_MOCK) {
                    console.log('Falling back to mock cheatsheet data');
                    this.logMCPStatus('mock_fallback', 'Using mock cheatsheet data due to fetch failure');
                    return {
                        content: '# CLI Cheat Sheet\n\n## Basic Commands\n\n- `ls` - List directory contents',
                        ready: false,
                        mock: true
                    };
                } else {
                    throw error;
                }
            }
        },

        // Log MCP status events
        logMCPStatus(event, message) {
            console.log(`[MCP Status] ${event}: ${message}`);
            // Could be extended to send events to MCP server if needed
        },

        // Handle data loading errors
        // Handle initialization errors
        handleInitializationError(error) {
            console.error('Application initialization failed:', error);
            
            // Show user-friendly error message
            const errorContainer = document.createElement('div');
            errorContainer.id = 'init-error-container';
            errorContainer.className = 'error-container critical-error';
            errorContainer.innerHTML = `
                <div class="error-content">
                    <h2>Application Failed to Load</h2>
                    <p>The CLI Tool Context application encountered an error during initialization.</p>
                    <details>
                        <summary>Technical Details</summary>
                        <pre>${error.message || 'Unknown error'}</pre>
                    </details>
                    <div class="error-actions">
                        <button onclick="location.reload()">Reload Page</button>
                        <button onclick="window.enableDebug && window.enableDebug()">Enable Debug Mode</button>
                    </div>
                </div>
            `;
            
            document.body.insertBefore(errorContainer, document.body.firstChild);
        },

        // Show message when no data is available
        showNoDataMessage() {
            if (elements.emptyState) {
                elements.emptyState.innerHTML = `
                    <div class="empty-message">
                        <h3>No Data Available</h3>
                        <p>No tools data could be loaded. This might be due to:</p>
                        <ul>
                            <li>Network connectivity issues</li>
                            <li>File access restrictions (especially on file:// protocol)</li>
                            <li>Corrupted data files</li>
                        </ul>
                        <button onclick="location.reload()" class="reload-button">Reload Page</button>
                    </div>
                `;
                elements.emptyState.style.display = 'block';
            }
        },


        handleDataLoadError(error) {
            // Use SimpleErrorHandler for consistent error handling
            if (window.simpleErrorHandler) {
                window.simpleErrorHandler.handleDataLoadError(error, null);
            } else {
                console.error('Data loading failed:', error);
                this.showNonBlockingAlert('⚠️ Unable to load site data. Try refreshing or check console for details.');
            }
        },

        // Get category icon by name
        getCategoryIconByName(categoryName) {
            const iconMap = {
                'File Operations': '📁',
                'Text Processing': '📝', 
                'System Monitoring': '📊',
                'System Administration': '⚙️',
                'Network Tools': '🌐',
                'Git Version Control': '🔀',
                'Archive & Compression': '🗜️',
                'Process Management': '⚡',
                'Development Tools': '💻',
                'Search & Find': '🔍',
                'Permission & Security': '🔒',
                'Data Processing': '📊',
                'Package Management': '📦',
                'System Information': 'ℹ️',
                'Remote Access': '🌐',
                'Backup & Sync': '💾'
            };
            return iconMap[categoryName] || '🔧';
        },

        // Load mock data (replace with actual JSON loading in production)
        async loadMockData() {
            // Mock statistics
            const mockStats = this.getDefaultStats();
            mockStats.totalLines = 16934; // Mock-specific value
            mockStats.mock = true;
            state.stats = mockStats;

            // Mock categories
            state.categories = [
                { id: 'file-operations', name: 'File & Directory Operations', count: 25, icon: '📁', description: 'Essential commands for managing files and directories' },
                { id: 'text-processing', name: 'Text Processing', count: 22, icon: '📝', description: 'Tools for searching, editing, and manipulating text' },
                { id: 'system-admin', name: 'System Administration', count: 28, icon: '⚙️', description: 'System monitoring, process management, and administration' },
                { id: 'networking', name: 'Networking', count: 18, icon: '🌐', description: 'Network tools and utilities' },
                { id: 'development', name: 'Development Tools', count: 32, icon: '💻', description: 'Programming and development utilities' },
                { id: 'security', name: 'Security & Encryption', count: 15, icon: '🔒', description: 'Security tools and encryption utilities' },
                { id: 'cloud', name: 'Cloud & Containers', count: 24, icon: '☁️', description: 'Cloud platforms and containerization tools' },
                { id: 'media', name: 'Media Processing', count: 12, icon: '🎵', description: 'Audio, video, and image processing tools' }
            ];

            // Mock tools data
            const mockTools = [
                {
                    id: 'ls',
                    name: 'ls',
                    category: 'file-operations',
                    difficulty: 2,
                    description: 'Lists directory contents with various formatting options',
                    platform: ['macOS', 'Linux', 'Windows'],
                    installation: 'built-in',
                    aliases: ['dir', 'll', 'ls-G'],
                    tags: ['essential', 'filesystem', 'files'],
                    examples: [
                        { command: 'ls -la', description: 'List all files with details' },
                        { command: 'ls -lh', description: 'Human-readable file sizes' },
                        { command: 'ls -R', description: 'List recursively' }
                    ],
                    popularity: 95
                },
                {
                    id: 'grep',
                    name: 'grep',
                    category: 'text-processing',
                    difficulty: 3,
                    description: 'Search text patterns in files using regular expressions',
                    platform: ['macOS', 'Linux', 'Windows'],
                    installation: 'built-in',
                    aliases: ['egrep', 'fgrep'],
                    tags: ['search', 'regex', 'text'],
                    examples: [
                        { command: 'grep "pattern" file.txt', description: 'Search for pattern in file' },
                        { command: 'grep -r "pattern" dir/', description: 'Recursive search' },
                        { command: 'grep -i "pattern" file.txt', description: 'Case-insensitive search' }
                    ],
                    popularity: 90
                },
                {
                    id: 'docker',
                    name: 'docker',
                    category: 'cloud',
                    difficulty: 4,
                    description: 'Container platform for developing, shipping, and running applications',
                    platform: ['macOS', 'Linux', 'Windows'],
                    installation: 'manual',
                    aliases: [],
                    tags: ['containers', 'virtualization', 'deployment'],
                    examples: [
                        { command: 'docker run hello-world', description: 'Run a test container' },
                        { command: 'docker ps', description: 'List running containers' },
                        { command: 'docker build -t myapp .', description: 'Build image from Dockerfile' }
                    ],
                    popularity: 85
                },
                {
                    id: 'git',
                    name: 'git',
                    category: 'development',
                    difficulty: 4,
                    description: 'Distributed version control system for tracking changes in source code',
                    platform: ['macOS', 'Linux', 'Windows'],
                    installation: 'homebrew',
                    aliases: [],
                    tags: ['version-control', 'development', 'collaboration'],
                    examples: [
                        { command: 'git status', description: 'Show working tree status' },
                        { command: 'git add .', description: 'Stage all changes' },
                        { command: 'git commit -m "message"', description: 'Commit with message' }
                    ],
                    popularity: 88
                },
                {
                    id: 'curl',
                    name: 'curl',
                    category: 'networking',
                    difficulty: 3,
                    description: 'Command line tool for transferring data with URLs',
                    platform: ['macOS', 'Linux', 'Windows'],
                    installation: 'built-in',
                    aliases: ['wget'],
                    tags: ['http', 'download', 'api'],
                    examples: [
                        { command: 'curl -O https://example.com/file.zip', description: 'Download file' },
                        { command: 'curl -X POST -d "data" https://api.example.com', description: 'POST request' },
                        { command: 'curl -I https://example.com', description: 'Get headers only' }
                    ],
                    popularity: 80
                },
                {
                    id: 'htop',
                    name: 'htop',
                    category: 'system-admin',
                    difficulty: 2,
                    description: 'Interactive process viewer and system monitor',
                    platform: ['macOS', 'Linux'],
                    installation: 'homebrew',
                    aliases: ['top'],
                    tags: ['monitoring', 'processes', 'performance'],
                    examples: [
                        { command: 'htop', description: 'Launch interactive process viewer' },
                        { command: 'htop -u username', description: 'Show processes for specific user' }
                    ],
                    popularity: 75
                }
            ];

            // Add more mock tools to reach a reasonable number for demo
            const additionalTools = this.generateMockTools();
            this.updateToolsAndReindex([...mockTools, ...additionalTools]);
        },

        // Generate additional mock tools for demonstration
        generateMockTools() {
            const categories = ['file-operations', 'text-processing', 'system-admin', 'networking', 'development', 'security', 'cloud', 'media'];
            const mockTools = [];
            const toolNames = ['find', 'sed', 'awk', 'tar', 'ssh', 'rsync', 'ps', 'kill', 'chmod', 'chown', 'du', 'df', 'mount', 'cron', 'vim', 'nano', 'cat', 'less', 'head', 'tail', 'sort', 'uniq', 'wc', 'diff', 'patch', 'wget', 'ping', 'netstat', 'iptables', 'sudo', 'su', 'passwd', 'useradd', 'make', 'gcc', 'node', 'npm', 'pip', 'python', 'ruby', 'java', 'mysql', 'redis', 'nginx', 'apache', 'openssl', 'gpg', 'ffmpeg', 'imagemagick'];

            toolNames.forEach((name, index) => {
                mockTools.push({
                    id: name,
                    name: name,
                    category: categories[index % categories.length],
                    difficulty: Math.floor(Math.random() * 5) + 1,
                    description: `${name} - A powerful command line tool for various operations`,
                    platform: ['macOS', 'Linux', Math.random() > 0.5 ? 'Windows' : null].filter(Boolean),
                    installation: ['built-in', 'homebrew', 'npm', 'pip'][Math.floor(Math.random() * 4)],
                    aliases: [],
                    tags: ['utility', 'cli'],
                    examples: [
                        { command: `${name} --help`, description: 'Show help information' }
                    ],
                    popularity: Math.floor(Math.random() * 100)
                });
            });

            return mockTools;
        },

        // Normalize a tool entry with comprehensive validation and type fixes  
        normalizeToolEntry(tool, index = 0) {
            // Use DataNormalizer if available
            if (window.DataNormalizer) {
                return window.DataNormalizer.normalizeToolEntry(tool);
            }
            
            // Fallback implementation
            try {
                if (!tool || typeof tool !== 'object') {
                    return null;
                }

                // Create normalized tool with fallback values
                const normalized = { ...tool };
                
                // Ensure id field exists
                if (!normalized.id) {
                    if (normalized.name) {
                        normalized.id = normalized.name.toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9-]/g, '');
                    } else {
                        normalized.id = `tool-${index}`;
                    }
                }
                
                // Ensure name field exists
                if (!normalized.name) {
                    normalized.name = normalized.id || `Tool ${index}`;
                }
                
                // Ensure category field exists
                if (!normalized.category) {
                    normalized.category = 'Uncategorized';
                }
                
                // Ensure description field exists
                if (!normalized.description) {
                    normalized.description = `${normalized.name} command line tool`;
                }

                // Normalize difficulty to integer between 1-5
                if (normalized.difficulty) {
                    const diff = parseInt(normalized.difficulty);
                    if (!isNaN(diff) && diff >= 1 && diff <= 5) {
                        normalized.difficulty = diff;
                    } else {
                        normalized.difficulty = 3; // Default medium difficulty
                    }
                } else {
                    normalized.difficulty = 3;
                }
                
                // Normalize platform field using shared utility
                const platforms = normalizePlatforms(normalized);
                normalized.platforms = platforms.length > 0 ? platforms : ['Unknown'];
                // Ensure both fields exist for compatibility
                normalized.platform = normalized.platforms;
                
                // Normalize installation field (handle both string and object)
                if (normalized.installation) {
                    if (typeof normalized.installation === 'object' && normalized.installation.primary) {
                        // Extract primary installation method from object
                        normalized.installation = normalized.installation.primary;
                    } else if (typeof normalized.installation !== 'string') {
                        // Invalid installation format, use default
                        normalized.installation = 'Native';
                    }
                } else {
                    normalized.installation = 'Native';
                }

                // Ensure arrays exist
                normalized.tags = Array.isArray(normalized.tags) ? normalized.tags.filter(Boolean) : (normalized.tags ? [normalized.tags] : []);
                normalized.aliases = Array.isArray(normalized.aliases) ? normalized.aliases.filter(Boolean) : (normalized.aliases ? [normalized.aliases] : []);
                normalized.examples = Array.isArray(normalized.examples) ? normalized.examples : (normalized.examples ? [normalized.examples] : []);

                // Validate all required fields are present
                const required = ['id', 'name', 'category', 'description'];
                for (const field of required) {
                    if (!normalized[field]) {
                        return null;
                    }
                }

                return normalized;
            } catch (error) {
                console.error('normalizeToolEntry error:', error);
                return null;
            }
        },

        // Build search index using Lunr
        buildSearchIndex() {
            if (typeof lunr === 'undefined') {
                console.warn('Lunr not available, search functionality will be limited');
                return;
            }

            // Legacy Lunr index code removed - SearchManager handles all searches
        },

        // Theme toggle functionality
        toggleTheme() {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', state.theme);
            try { 
                localStorage.setItem('theme', state.theme); 
            } catch (_) {
                console.warn('localStorage access denied for theme setting');
            }
            
            const icon = elements.themeToggle.querySelector('.theme-toggle-icon');
            if (icon) {
                icon.textContent = state.theme === 'dark' ? '☀️' : '🌙';
            }
        },

        // Scroll handling
        handleScroll() {
            const scrolled = window.scrollY > 300;
            if (elements.backToTop) {
                elements.backToTop.style.display = scrolled ? 'block' : 'none';
            }
        },

        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Quick search functionality
        handleQuickSearch(e) {
            const query = e.target.value.trim();
            // Comment 3: Use consistent minimum query length
            if (query.length >= MIN_SEARCH_QUERY_LENGTH) {
                this.performQuickSearch();
            } else {
                this.closeQuickSearch();
            }
        },

        handleSearchKeydown(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performQuickSearch();
            }
        },

        performQuickSearch() {
            const query = elements.quickSearch?.value.trim() || '';
            // Comment 3: Use consistent minimum query length
            if (!query || query.length < MIN_SEARCH_QUERY_LENGTH) return;

            let results = [];
            // Legacy search code removed
            if (false) {
                try {
                    const searchResults = [];
                    results = searchResults.slice(0, 8).map(result => {
                        return state.tools.find(tool => tool.id === result.ref);
                    }).filter(Boolean);
                } catch (error) {
                    console.error('Lunr search failed, falling back to simple search:', error);
                    results = state.tools.filter(tool => 
                        (tool.name && tool.name.toLowerCase().includes(query.toLowerCase())) ||
                        (tool.description && tool.description.toLowerCase().includes(query.toLowerCase()))
                    ).slice(0, 8);
                }
            } else {
                // Fallback search without Lunr
                results = state.tools.filter(tool => 
                    (tool.name && tool.name.toLowerCase().includes(query.toLowerCase())) ||
                    (tool.description && tool.description.toLowerCase().includes(query.toLowerCase()))
                ).slice(0, 8);
            }

            this.displayQuickSearchResults(results, query);
        },

        displayQuickSearchResults(results, query) {
            if (!elements.searchResults || !elements.searchResultsList) return;

            const count = results.length;
            const countElement = elements.searchResults.querySelector('.search-results-count');
            if (countElement) {
                countElement.textContent = `${count} result${count !== 1 ? 's' : ''} for "${query}"`;
            }

            elements.searchResultsList.innerHTML = results.map(tool => `
                <a href="tools.html?search=${encodeURIComponent(tool.name)}" class="search-result-item">
                    <div class="search-result-name">${this.highlightText(this.escapeHtml(tool.name), query)}</div>
                    <div class="search-result-description">${this.highlightText(this.escapeHtml(tool.description || ''), query)}</div>
                </a>
            `).join('');

            elements.searchResults.style.display = 'block';
        },

        escapeRegExp(s) {
            return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },
        
        highlightText(text, query) {
            if (!query) return text;
            try {
                const esc = this.escapeRegExp(query);
                const regex = new RegExp(`(${esc})`, 'gi');
                return text.replace(regex, '<mark>$1</mark>');
            } catch (error) {
                return text;
            }
        },

        closeQuickSearch() {
            if (elements.searchResults) {
                elements.searchResults.style.display = 'none';
            }
        },

        // Homepage initialization
        initHomepage() {
            try {
                this.updateHomepageStats();
                this.populatePopularCategories();
                this.populateFeaturedTools();
                this.populateFooterCategories();
            } catch (error) {
                console.error('Error initializing homepage:', error);
                this.showNonBlockingAlert('Error loading homepage content. Some features may not work properly.');
            }
        },

        updateHomepageStats() {
            const updates = [
                { id: 'toolCount', value: state.stats.totalTools + '+' },
                { id: 'categoryCount', value: state.stats.totalCategories + '+' },
                { id: 'statTools', value: state.stats.totalTools + '+' },
                { id: 'statCategories', value: state.stats.totalCategories + '+' },
                { id: 'statPlatforms', value: state.stats.totalPlatforms },
                { id: 'statLines', value: Math.round(state.stats.totalLines / 1000) + 'K+' }
            ];

            updates.forEach(({ id, value }) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });
        },

        populatePopularCategories() {
            const categoriesGrid = document.getElementById('categoriesGrid');
            if (!categoriesGrid) return;

            const popularCategories = state.categories.slice(0, 6);
            categoriesGrid.innerHTML = popularCategories.map(category => `
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-icon">${category.icon}</div>
                        <div class="category-name">${category.name}</div>
                        <div class="category-count">${category.count}</div>
                    </div>
                    <div class="category-description">${category.description}</div>
                    <div class="category-actions">
                        <a href="tools.html?category=${encodeURIComponent(category.id)}" class="btn btn-outline btn-small">
                            Browse Tools
                        </a>
                    </div>
                </div>
            `).join('');
        },

        populateFeaturedTools() {
            const featuredTools = document.getElementById('featuredTools');
            if (!featuredTools) return;

            const essential = state.tools.filter(tool => 
                (tool.tags && (tool.tags.includes('#essential') || tool.tags.includes('essential'))) || 
                tool.popularity > 80
            ).slice(0, 6);

            featuredTools.innerHTML = essential.map(tool => `
                <div class="tool-card">
                    <div class="tool-header">
                        <div class="tool-icon">${this.getCategoryIcon(tool.category)}</div>
                        <div class="tool-name">${this.escapeHtml(tool.name)}</div>
                        <div class="tool-difficulty">${'⭐'.repeat(tool.difficulty)}</div>
                    </div>
                    <div class="tool-description">${this.escapeHtml(tool.description)}</div>
                    <div class="tool-meta">
                        ${(tool.tags || []).slice(0, 3).map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="tool-actions">
                        <button data-tool-id="${tool.id}" class="btn btn-primary btn-small tool-details-btn">
                            View Details
                        </button>
                        <a href="tools.html?search=${encodeURIComponent(tool.name)}" class="btn btn-outline btn-small">
                            More Info
                        </a>
                    </div>
                </div>
            `).join('');
        },

        populateFooterCategories() {
            const footerCategories = document.getElementById('footerCategories');
            if (!footerCategories) return;

            const topCategories = state.categories.slice(0, 5);
            footerCategories.innerHTML = topCategories.map(category => `
                <li><a href="tools.html?category=${encodeURIComponent(category.id)}">${category.name}</a></li>
            `).join('');
        },

        getCategoryIcon(categoryIdOrName) {
            // Try to find by ID first, then by name
            const category = state.categories.find(cat => 
                cat.id === categoryIdOrName || cat.name === categoryIdOrName
            );
            return category ? category.icon : '🔧';
        },

        // Helper to update tools and reindex with cache invalidation
        updateToolsAndReindex(tools) {
            // Update tools in state
            state.tools = tools;
            state.toolsVersion++;
            
            // Clear and rebuild filter index if it exists
            if (this.filterIndex) {
                this.filterIndex.clearCache();
                this.filterIndex.buildIndexes(state.tools);
            }
            
            // Clear search cache as well
            if (this.searchCache) {
                this.searchCache.cache.clear();
            }
        },
        
        // Helper to manage loading state consistently
        setLoading(isLoading) {
            if (!elements.toolsLoading) return;
            
            if (isLoading) {
                elements.toolsLoading.style.display = 'block';
                elements.toolsLoading.setAttribute('aria-busy', 'true');
                elements.toolsLoading.setAttribute('aria-live', 'polite');
            } else {
                elements.toolsLoading.style.display = 'none';
                elements.toolsLoading.setAttribute('aria-busy', 'false');
            }
        },
        
        // Fallback method for normalizing installation when DataNormalizer is not available
        normalizeInstallationFallback(value) {
            if (!value) return 'unknown';
            const normalized = value.toLowerCase().trim();
            
            // Basic normalization logic
            const mappings = {
                'brew': 'homebrew',
                'apt': 'apt-get',
                'apt-get': 'apt-get', 
                'yum': 'yum',
                'dnf': 'dnf',
                'npm': 'npm',
                'pip': 'pip',
                'pip3': 'pip',
                'cargo': 'cargo',
                'gem': 'gem',
                'built-in': 'built-in',
                'builtin': 'built-in',
                'system': 'built-in',
                'manual': 'manual',
                'download': 'manual',
                'homebrew': 'homebrew'
            };
            
            return mappings[normalized] || normalized;
        },
        
        // Normalize installation method names to canonical values
        normalizeInstallation(value) {
            if (!value) return 'unknown';
            const normalized = value.toLowerCase().trim();
            
            // Map synonyms and variations to canonical values
            const mappings = {
                'built-in': ['builtin', 'built in', 'native', 'system', 'default', 'included'],
                'homebrew': ['brew', 'home-brew', 'home brew'],
                'npm': ['node', 'npm', 'npx', 'nodejs', 'node.js'],
                'pip': ['pip', 'pip3', 'python', 'pypi', 'python-pip'],
                'package-manager': ['package manager', 'pkg', 'package', 'apt', 'yum', 'dnf', 'pacman', 'zypper', 'apk'],
                'unknown': ['unknown', 'other', 'custom', 'manual', 'source']
            };
            
            // Check each canonical value's mappings
            for (const [canonical, synonyms] of Object.entries(mappings)) {
                if (synonyms.includes(normalized) || normalized === canonical) {
                    return canonical;
                }
            }
            
            // If no mapping found, return unknown
            return 'unknown';
        },

        // Get friendly display name for installation method
        getInstallationDisplayName(installation) {
            const displayNames = {
                'built-in': 'Built-in',
                'homebrew': 'Homebrew',
                'npm': 'npm',
                'pip': 'pip',
                'package-manager': 'Package Manager',
                'unknown': 'Unknown'
            };
            return displayNames[installation] || installation;
        },

        // Tools page initialization
        async initToolsPage() {
            if (this.initialized) return;
            this.initialized = true;
            
            try {
                // Ensure data is loaded before initializing page
                await this.ensureDataLoaded();
                
                this.initToolsPageElements();
                this.updateToolsPageStats();
                this.populateCategoryFilter();
                this.populateFilters(); // Populate platform and installation filters from canonical lists
                this.initToolsFilters();
                
                // Ensure filters are applied before search
                await this.applyFilters();
                
                // Initialize search only after filters are ready
                if (!state.searchManager) {
                    this.initSearch();
                }
                
                // Set global initialization flag (Comment 17)
                window.CLIApp.initialized = true;
                
                // Dispatch ready event
                window.dispatchEvent(new CustomEvent('cliapp:tools-ready'));
            } catch (error) {
                console.error('Error initializing tools page:', error);
                this.showNonBlockingAlert('Error loading tools page content. Filters and search may not work properly.');
            }
        },

        initToolsPageElements() {
            elements.toolSearch = document.getElementById('toolSearch');
            elements.toolSearchButton = document.getElementById('toolSearchButton');
            elements.toolSearchClear = document.getElementById('toolSearchClear');
            elements.categoryFilter = document.getElementById('categoryFilter');
            elements.difficultyFilter = document.getElementById('difficultyFilter');
            elements.platformFilter = document.getElementById('platformFilter');
            elements.installationFilter = document.getElementById('installationFilter');
            elements.resetFilters = document.getElementById('resetFilters');
            elements.loadMoreContainer = document.getElementById('loadMoreContainer');
            elements.sortBy = document.getElementById('sortBy');
            elements.toolsGrid = document.getElementById('toolsGrid');
            elements.emptyState = document.getElementById('emptyState');
            elements.toolsLoading = document.getElementById('toolsLoading');
            elements.loadMoreBtn = document.getElementById('loadMoreBtn');
            elements.toolModal = document.getElementById('toolModal');
            elements.closeModal = document.getElementById('closeModal');
        },

        updateToolsPageStats() {
            const updates = [
                { id: 'toolsCount', value: state.stats.totalTools + '+' },
                { id: 'categoriesCount', value: state.stats.totalCategories + '+' }
            ];

            updates.forEach(({ id, value }) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });
        },

        populateCategoryFilter() {
            if (!elements.categoryFilter) return;

            // Use category name as value since tools store category by name, not ID
            const options = state.categories.map(category => `
                <option value="${category.name}">${category.name}</option>
            `).join('');

            elements.categoryFilter.innerHTML = '<option value="">All Categories</option>' + options;
        },

        initToolsFilters() {
            // Comment 1: Initialize debouncedApplyFilters during tools page setup
            if (!this.debouncedApplyFilters) {
                this.debouncedApplyFilters = debounce(() => this.applyFilters(), 300);
            }
            
            // Initialize search suggestions
            this.initSearchSuggestions();
            
            // Search input
            if (elements.toolSearch) {
                elements.toolSearch.addEventListener('input', this.handleToolSearch.bind(this));
                elements.toolSearch.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.applyFilters();
                    }
                });
            }

            // Search clear button
            if (elements.toolSearchClear) {
                elements.toolSearchClear.addEventListener('click', () => {
                    elements.toolSearch.value = '';
                    elements.toolSearchClear.style.display = 'none';
                    state.filters.search = '';
                    this.applyFilters();
                });
            }

            // Filter dropdowns
            [
                { element: elements.categoryFilter, key: 'category' },
                { element: elements.difficultyFilter, key: 'difficulty' },
                { element: elements.platformFilter, key: 'platform' },
                { element: elements.installationFilter, key: 'installation' }
            ].forEach(({ element, key }) => {
                if (element) {
                    element.addEventListener('change', () => {
                        state.filters[key] = element.value.trim();
                        // Comment 1: Safely call debouncedApplyFilters
                        this.debouncedApplyFilters ? this.debouncedApplyFilters() : this.applyFilters();
                    });
                }
            });

            // Sort dropdown
            if (elements.sortBy) {
                elements.sortBy.addEventListener('change', () => {
                    state.sortBy = elements.sortBy.value;
                    this.applyFilters();
                });
            }

            // Reset filters button
            if (elements.resetFilters) {
                elements.resetFilters.addEventListener('click', this.resetFilters.bind(this));
            }

            // Clear all filters button (in empty state)
            const clearAllFilters = document.getElementById('clearAllFilters');
            if (clearAllFilters) {
                clearAllFilters.addEventListener('click', this.resetFilters.bind(this));
            }

            // Check system status button  
            const checkSystemStatus = document.getElementById('checkSystemStatus');
            if (checkSystemStatus) {
                checkSystemStatus.addEventListener('click', () => {
                    this.performSystemHealthCheck();
                });
            }

            // Load more button
            if (elements.loadMoreBtn) {
                elements.loadMoreBtn.addEventListener('click', () => {
                    this.loadMoreTools();
                });
            }

            // Modal close button
            if (elements.closeModal) {
                elements.closeModal.addEventListener('click', this.closeModal.bind(this));
            }

            // Close modal when clicking overlay
            if (elements.toolModal) {
                elements.toolModal.addEventListener('click', (e) => {
                    if (e.target === elements.toolModal) {
                        this.closeModal();
                    }
                });
            }
        },

        handleToolSearch(e) {
            const value = e.target.value.trim();
            state.filters.search = value;
            
            // Show/hide clear button
            if (elements.toolSearchClear) {
                elements.toolSearchClear.style.display = value ? 'block' : 'none';
            }
            
            // Show search suggestions
            this.showSearchSuggestions(value);

            // Use performance optimizer debouncing if available
            if (this.filterManager) {
                this.filterManager.queue('search', () => {
                    this.applyFilters();
                }, 'search');
            } else {
                // Fallback to standard debouncing
                if (!this.debouncedApplyFilters) {
                    this.debouncedApplyFilters = debounce((requestId) => {
                        this.applyFilters(requestId);
                    }, 300);
                }
                
                this.debouncedApplyFilters();
            }
        },

        
        // Initialize search suggestions
        initSearchSuggestions() {
            const searchInput = elements.toolSearch;
            const suggestionsContainer = document.getElementById('searchSuggestions');
            const suggestionsList = document.getElementById('suggestionsList');
            
            if (!searchInput || !suggestionsContainer || !suggestionsList) return;
            
            // Track selected suggestion index
            this.selectedSuggestionIndex = -1;
            
            // Handle keyboard navigation
            searchInput.addEventListener('keydown', (e) => {
                const suggestions = suggestionsList.querySelectorAll('li');
                
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        this.selectedSuggestionIndex = Math.min(this.selectedSuggestionIndex + 1, suggestions.length - 1);
                        this.updateSelectedSuggestion(suggestions, this.selectedSuggestionIndex);
                        break;
                        
                    case 'ArrowUp':
                        e.preventDefault();
                        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
                        this.updateSelectedSuggestion(suggestions, this.selectedSuggestionIndex);
                        break;
                        
                    case 'Enter':
                        e.preventDefault();
                        if (this.selectedSuggestionIndex >= 0 && suggestions[this.selectedSuggestionIndex]) {
                            const suggestion = suggestions[this.selectedSuggestionIndex].textContent;
                            this.selectSuggestion(suggestion);
                        } else {
                            this.applyFilters();
                        }
                        break;
                        
                    case 'Escape':
                        this.hideSuggestions();
                        break;
                }
            });
            
            // Hide suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                    this.hideSuggestions();
                }
            });
        },
        
        // Show search suggestions based on input
        showSearchSuggestions(query) {
            const suggestionsContainer = document.getElementById('searchSuggestions');
            const suggestionsList = document.getElementById('suggestionsList');
            
            if (!suggestionsContainer || !suggestionsList || !query) {
                this.hideSuggestions();
                return;
            }
            
            // Reset selected index when showing new suggestions
            this.selectedSuggestionIndex = -1;
            
            // Get suggestions from the global function
            if (typeof window.getSearchSuggestions === 'function') {
                const suggestions = window.getSearchSuggestions(query, 8);
                
                if (suggestions && suggestions.length > 0) {
                    // Clear existing suggestions
                    suggestionsList.innerHTML = '';
                    
                    // Add new suggestions
                    suggestions.forEach((suggestion, index) => {
                        const li = document.createElement('li');
                        li.className = 'suggestion-item';
                        li.setAttribute('role', 'option');
                        li.setAttribute('aria-selected', 'false');
                        
                        // Highlight matching text
                        const highlightedText = this.highlightMatch(suggestion, query);
                        li.innerHTML = `<span class="suggestion-text">${highlightedText}</span>`;
                        
                        // Handle click
                        li.addEventListener('click', () => {
                            this.selectSuggestion(suggestion);
                        });
                        
                        // Handle hover
                        li.addEventListener('mouseenter', () => {
                            this.updateSelectedSuggestion(suggestionsList.querySelectorAll('li'), index);
                        });
                        
                        suggestionsList.appendChild(li);
                    });
                    
                    // Show container
                    suggestionsContainer.style.display = 'block';
                } else {
                    this.hideSuggestions();
                }
            } else {
                console.warn('getSearchSuggestions function not available');
            }
        },
        
        // Highlight matching text in suggestion
        highlightMatch(text, query) {
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<span class="suggestion-match">$1</span>');
        },
        
        // Update selected suggestion
        updateSelectedSuggestion(suggestions, index) {
            suggestions.forEach((li, i) => {
                if (i === index) {
                    li.classList.add('selected');
                    li.setAttribute('aria-selected', 'true');
                } else {
                    li.classList.remove('selected');
                    li.setAttribute('aria-selected', 'false');
                }
            });
        },
        
        // Select a suggestion
        selectSuggestion(suggestion) {
            if (elements.toolSearch) {
                elements.toolSearch.value = suggestion;
                state.filters.search = suggestion;
                this.hideSuggestions();
                this.applyFilters();
            }
        },
        
        // Hide suggestions
        hideSuggestions() {
            const suggestionsContainer = document.getElementById('searchSuggestions');
            if (suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        },
        
        resetFilters() {
            // Reset form elements
            const filterForm = document.querySelector('.filters');
            if (filterForm) {
                const inputs = filterForm.querySelectorAll('input, select');
                inputs.forEach(input => input.value = '');
            }

            // Reset state
            state.filters = {
                search: '',
                category: '',
                difficulty: '',
                platform: '',
                installation: ''
            };
            state.sortBy = 'name';
            state.currentPage = 1;

            this.applyFilters();
        },

        // Perform system health check and display status
        performSystemHealthCheck() {
            const healthInfo = {
                dataLoaded: state.tools.length > 0,
                toolsCount: state.tools.length,
                searchWorkerReady: state.searchManager && state.searchManager.isReady(),
                searchMode: state.searchManager ? 'searchmanager' : 'simple',
                filtersActive: Object.entries(state.filters).some(([k, v]) => v && v !== ''),
                debugMode: false
            };

            // Create status message
            const statusMessages = [
                `✓ Tools loaded: ${healthInfo.toolsCount}`,
                `✓ Search mode: ${healthInfo.searchMode}`,
                healthInfo.searchWorkerReady ? '✓ Search ready' : '⚠ Search not ready',
                healthInfo.filtersActive ? '✓ Filters active' : '✓ No active filters',
                healthInfo.debugMode ? '✓ Debug mode enabled' : '✓ Debug mode disabled'
            ];

            // Show status in alert or console
            const message = 'System Health Check:\n\n' + statusMessages.join('\n');
            
            
            // Show in UI alert
            alert(message);
            
            return healthInfo;
        },

        async applyFilters() {
            // Use debounced filter manager if available
            if (this.filterManager) {
                return this.filterManager.queue('applyFilters', async () => {
                    await this._applyFiltersInternal();
                }, 'filter');
            } else {
                return this._applyFiltersInternal();
            }
        },

        async _applyFiltersInternal() {
            // Set loading state at the beginning
            this.setLoading(true);
            
            try {
                // Start performance monitoring
                if (this.performanceMonitor) {
                    this.performanceMonitor.startOperation('filter-operation');
                }
                
                // Apply filters and render
                await this.filterAndSortTools();
                this.renderTools();
                this.updateResultsCount();
                
                // End performance monitoring
                if (this.performanceMonitor) {
                    const metrics = this.performanceMonitor.endOperation('filter-operation', 'filterOperation');
                    if (metrics && metrics.duration > 300) {
                        console.log(`Filter operation took ${metrics.duration.toFixed(2)}ms`);
                    }
                }
                
                // Comment 6: Event dispatch moved to updateResultsCount to avoid duplication
                // Consumers rely on results-updated event after rendering is complete
            } catch (error) {
                console.error('Filter error:', error);
                // Use SimpleErrorHandler for filter errors
                if (window.simpleErrorHandler) {
                    window.simpleErrorHandler.handleFilterError(error).reset();
                } else {
                    this.showNonBlockingAlert('Error applying filters. Please try again.');
                }
            } finally {
                // Always hide loading state, even on errors or early returns
                this.setLoading(false);
            }
        },

        async filterAndSortTools() {
            if (!Array.isArray(state.tools)) {
                state.filteredTools = [];
                return;
            }

            // Build indexes if using FilterIndex and not yet built
            if (this.filterIndex && !this.filterIndex.indexes.has('category')) {
                this.filterIndex.buildIndexes(state.tools);
            }

            // Generate cache key for this filter combination including toolsVersion
            const cacheKey = this.filterIndex ? 
                `filter:v${state.toolsVersion}:${state.filters.search}:${state.filters.category}:${state.filters.difficulty}:${state.filters.platform}:${state.filters.installation}` : 
                null;
            
            // Check cache if available
            if (this.filterIndex && cacheKey) {
                const cachedResult = this.filterIndex.getCachedResult(cacheKey);
                if (cachedResult) {
                    // Convert cached Set back to array of tools
                    state.filteredTools = Array.from(cachedResult).map(index => state.tools[index]);
                    state.currentPage = 1;
                    return;
                }
            }

            let filteredIndexes = null;
            let filtered = [...state.tools];

            // Use optimized filtering with indexes if available
            if (this.filterIndex) {
                // Start with all tool indexes
                filteredIndexes = new Set(state.tools.map((_, index) => index));

                // Apply search filter
                const q = (state.filters.search || '').trim();
                if (q.length >= MIN_SEARCH_QUERY_LENGTH) {
                    const searchResults = await this.performSearch(q);
                    const searchIds = new Set(searchResults.map(r => r.tool?.id || r.id));
                    const searchIndexes = new Set();
                    state.tools.forEach((tool, index) => {
                        if (searchIds.has(tool.id)) {
                            searchIndexes.add(index);
                        }
                    });
                    // Intersect with search results
                    filteredIndexes = new Set([...filteredIndexes].filter(x => searchIndexes.has(x)));
                }

                // Apply category filter using index
                if (state.filters.category) {
                    const categoryIndexes = this.filterIndex.getByCategory(state.filters.category);
                    filteredIndexes = new Set([...filteredIndexes].filter(x => categoryIndexes.has(x)));
                }

                // Apply difficulty filter using index
                if (state.filters.difficulty) {
                    const difficulty = parseInt(state.filters.difficulty, 10);
                    if (Number.isInteger(difficulty)) {
                        const difficultyIndexes = this.filterIndex.getByDifficulty(difficulty, difficulty);
                        filteredIndexes = new Set([...filteredIndexes].filter(x => difficultyIndexes.has(x)));
                    }
                }

                // Apply platform filter using index with normalization
                if (state.filters.platform) {
                    // Normalize platform using DataNormalizer if available
                    const normalizedPlatform = window.DataNormalizer ? 
                        window.DataNormalizer.normalizePlatformString(state.filters.platform) : 
                        state.filters.platform;
                    const platformIndexes = this.filterIndex.getByPlatform(normalizedPlatform);
                    filteredIndexes = new Set([...filteredIndexes].filter(x => platformIndexes.has(x)));
                }

                // Apply installation filter using index with normalization
                if (state.filters.installation) {
                    // Normalize installation using DataNormalizer if available
                    const normalizedInstallation = window.DataNormalizer ? 
                        window.DataNormalizer.normalizeInstallationString(state.filters.installation) : 
                        state.filters.installation;
                    const installationIndexes = this.filterIndex.getByInstallation(normalizedInstallation);
                    filteredIndexes = new Set([...filteredIndexes].filter(x => installationIndexes.has(x)));
                }

                // Convert indexes back to tools
                filtered = Array.from(filteredIndexes).map(index => state.tools[index]);
                
                // Cache the result
                if (cacheKey) {
                    this.filterIndex.cacheResult(cacheKey, filteredIndexes);
                }
            } else {
                // Fallback to standard filtering
                // Apply search filter
                const q = (state.filters.search || '').trim();
                if (q.length >= MIN_SEARCH_QUERY_LENGTH) {
                    const searchResults = await this.performSearch(q);
                    const searchIds = searchResults.map(r => r.tool?.id || r.id);
                    filtered = filtered.filter(tool => searchIds.includes(tool.id));
                }

                // Apply category filter
                if (state.filters.category) {
                    filtered = filtered.filter(tool => {
                        const toolCategory = (tool.category || tool.categoryName || '').trim().toLowerCase();
                        return toolCategory === state.filters.category.toLowerCase();
                    });
                }

                // Apply difficulty filter
                if (state.filters.difficulty) {
                    const difficulty = parseInt(state.filters.difficulty, 10);
                    if (Number.isInteger(difficulty)) {
                        filtered = filtered.filter(tool => parseInt(tool.difficulty) === difficulty);
                    }
                }

                // Apply platform filter with normalization
                if (state.filters.platform) {
                    // Normalize the filter value using DataNormalizer if available
                    const normalizedFilterPlatform = window.DataNormalizer ? 
                        window.DataNormalizer.normalizePlatformString(state.filters.platform) : 
                        state.filters.platform;
                    filtered = filtered.filter(tool => {
                        const platforms = normalizePlatforms(tool);
                        return platforms.some(p => p.toLowerCase() === normalizedFilterPlatform.toLowerCase());
                    });
                }

                // Apply installation filter with normalization
                if (state.filters.installation) {
                    // Normalize the filter value using DataNormalizer if available
                    const normalizedFilterInstallation = window.DataNormalizer ?
                        window.DataNormalizer.normalizeInstallationString(state.filters.installation) :
                        this.normalizeInstallationFallback(state.filters.installation);
                    filtered = filtered.filter(tool => {
                        // Use DataNormalizer for tool installation if available
                        const installation = window.DataNormalizer ?
                            window.DataNormalizer.normalizeInstallationString(tool.installation) :
                            this.normalizeInstallationFallback(tool.installation);
                        return installation.toLowerCase() === normalizedFilterInstallation.toLowerCase();
                    });
                }
            }

            // Sort tools
            filtered.sort((a, b) => {
                switch (state.sortBy) {
                    case 'name': return (a.name || '').localeCompare(b.name || '');
                    case 'name-desc': return (b.name || '').localeCompare(a.name || '');
                    case 'category': {
                        // Comment 2: Consider both category and categoryName fields
                        const ac = (a.category || a.categoryName || '');
                        const bc = (b.category || b.categoryName || '');
                        const byCat = ac.localeCompare(bc);
                        return byCat !== 0 ? byCat : (a.name || '').localeCompare(b.name || '');
                    }
                    case 'difficulty': return (a.difficulty || 0) - (b.difficulty || 0) || (a.name || '').localeCompare(b.name || '');
                    default: return (a.name || '').localeCompare(b.name || '');
                }
            });

            state.filteredTools = filtered;
            state.currentPage = 1;
        },

        renderTools() {
            if (!elements.toolsGrid || !Array.isArray(state.filteredTools)) {
                console.error('Missing grid element or invalid tools data');
                return;
            }

            // Start performance monitoring
            if (this.performanceMonitor) {
                this.performanceMonitor.startOperation('render-operation');
            }

            // Calculate pagination
            const startIndex = 0;
            const endIndex = state.currentPage * state.itemsPerPage;
            const toolsToShow = state.filteredTools.slice(startIndex, endIndex);

            // Handle empty results
            if (toolsToShow.length === 0) {
                elements.toolsGrid.style.display = 'none';
                if (elements.emptyState) elements.emptyState.style.display = 'block';
                // Update results count and hide load more buttons for empty results
                this.updateResultsCount();
                if (elements.loadMoreBtn) elements.loadMoreBtn.style.display = 'none';
                if (elements.loadMoreContainer) elements.loadMoreContainer.style.display = 'none';
                
                // Update aria-live region for empty results
                const announcement = document.getElementById('searchResultsAnnouncement');
                if (announcement) {
                    announcement.textContent = 'No tools found matching your filters';
                }
                return;
            }

            // Use VirtualRenderer if available for optimized rendering
            if (this.virtualRenderer) {
                // Cancel any pending renders
                this.virtualRenderer.cancelRendering();
                
                // Recycle existing elements before clearing
                if (elements.toolsGrid.children.length > 0) {
                    this.virtualRenderer.recycleElements([...elements.toolsGrid.children]);
                }
                
                // Clear existing content
                elements.toolsGrid.innerHTML = '';
                
                // Queue optimized rendering with completion callback
                this.virtualRenderer.queueRender(
                    toolsToShow,
                    elements.toolsGrid,
                    (element, tool) => {
                        element.innerHTML = this.renderToolCard(tool);
                    },
                    () => {
                        // Update aria-live region after rendering completes
                        const announcement = document.getElementById('searchResultsAnnouncement');
                        if (announcement) {
                            const visible = Math.min(state.currentPage * state.itemsPerPage, state.filteredTools.length);
                            announcement.textContent = `Showing ${visible} of ${state.filteredTools.length} tools`;
                        }
                    }
                );
            } else {
                // Fallback to standard rendering with document fragment
                const fragment = document.createDocumentFragment();
                
                // Use requestAnimationFrame for smoother rendering
                const renderBatch = (tools, batchSize = 20) => {
                    const batch = tools.splice(0, batchSize);
                    batch.forEach(tool => {
                        const cardElement = document.createElement('div');
                        cardElement.innerHTML = this.renderToolCard(tool);
                        fragment.appendChild(cardElement.firstElementChild);
                    });
                    
                    if (tools.length > 0) {
                        requestAnimationFrame(() => renderBatch(tools, batchSize));
                    } else {
                        // All tools rendered, append to DOM
                        elements.toolsGrid.innerHTML = '';
                        elements.toolsGrid.appendChild(fragment);
                        
                        // Update aria-live region after rendering completes
                        const announcement = document.getElementById('searchResultsAnnouncement');
                        if (announcement) {
                            const visible = Math.min(state.currentPage * state.itemsPerPage, state.filteredTools.length);
                            announcement.textContent = `Showing ${visible} of ${state.filteredTools.length} tools`;
                        }
                    }
                };
                
                // Start batch rendering
                renderBatch([...toolsToShow]);
            }

            elements.toolsGrid.style.display = 'grid';
            
            if (elements.emptyState) elements.emptyState.style.display = 'none';

            // Show/hide load more button and container
            const hasMore = endIndex < state.filteredTools.length;
            if (elements.loadMoreBtn) {
                elements.loadMoreBtn.style.display = hasMore ? 'block' : 'none';
            }
            if (elements.loadMoreContainer) {
                elements.loadMoreContainer.style.display = hasMore ? 'block' : 'none';
            }

            // Update counters
            this.updateLoadMoreInfo(endIndex);
            
            // End performance monitoring
            if (this.performanceMonitor) {
                const metrics = this.performanceMonitor.endOperation('render-operation', 'renderOperation');
                if (metrics && metrics.duration > 100) {
                    console.log(`Render operation took ${metrics.duration.toFixed(2)}ms for ${toolsToShow.length} tools`);
                }
            }
        },

        // Simple load more functionality
        loadMoreTools() {
            state.currentPage++;
            this.renderTools();
        },

        // Update load more information
        updateLoadMoreInfo(loadedCount) {
            const loadedCountEl = document.getElementById('loadedCount');
            const filteredCountEl = document.getElementById('filteredCount');
            
            if (loadedCountEl) {
                loadedCountEl.textContent = Math.min(loadedCount, state.filteredTools.length);
            }
            if (filteredCountEl) {
                filteredCountEl.textContent = state.filteredTools.length;
            }
        },
        
        renderToolCard(tool) {
            try {
                // Validate tool object
                if (!tool || typeof tool !== 'object') {
                    console.warn('Invalid tool object for rendering:', tool);
                    return '';
                }

                // Ensure required fields exist
                const toolId = tool.id || 'unknown';
                const toolName = tool.name || 'Unknown Tool';
                const toolDescription = tool.description || 'No description available';
                const toolCategory = tool.category || 'Uncategorized';

                // Find category by name since tool.category is the category name
                const category = state.categories.find(cat => cat.name === toolCategory);
                const categoryName = tool.categoryName || (category ? category.name : toolCategory);
                const categoryIcon = category ? category.icon : '🔧';

                // Check for search highlights with validation
                const highlights = state.searchHighlights && state.searchHighlights.get(toolId);
                let toolNameHtml, toolDescriptionHtml;
                
                if (highlights && typeof highlights === 'object') {
                    // Use highlighted versions with DOMPurify sanitization
                    toolNameHtml = highlights.highlightedName ? 
                        (typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(highlights.highlightedName) : this.escapeHtml(toolName)) :
                        this.escapeHtml(toolName);
                    toolDescriptionHtml = highlights.highlightedDescription ?
                        (typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(highlights.highlightedDescription) : this.escapeHtml(toolDescription)) :
                        this.escapeHtml(toolDescription);
                } else {
                    // Use regular escaped text
                    toolNameHtml = this.escapeHtml(toolName);
                    toolDescriptionHtml = this.escapeHtml(toolDescription);
                }

                return `
                <div class="tool-card" data-tool-id="${tool.id}">
                    <div class="tool-header">
                        <div class="tool-icon">${categoryIcon}</div>
                        <div class="tool-name">${toolNameHtml}</div>
                        <div class="tool-difficulty" title="Difficulty: ${tool.difficulty}/5">
                            ${'⭐'.repeat(tool.difficulty)}${'☆'.repeat(5 - tool.difficulty)}
                        </div>
                    </div>
                    <div class="tool-description">${toolDescriptionHtml}</div>
                    <div class="tool-meta">
                        <span class="tool-tag">${this.escapeHtml(categoryName)}</span>
                        <span class="tool-tag">${this.getInstallationDisplayName(this.normalizeInstallation(tool.installation))}</span>
                        ${normalizePlatforms(tool).slice(0, 2).map(p => `<span class="tool-tag">${this.escapeHtml(p)}</span>`).join('')}
                    </div>
                    <div class="tool-actions">
                        <button data-tool-id="${tool.id}" class="btn btn-primary btn-small tool-details-btn">
                            View Details
                        </button>
                        <button data-command="${this.escapeHtml(tool.name)}" class="btn btn-outline btn-small copy-command-btn">
                            Copy Command
                        </button>
                    </div>
                </div>
            `;
            } catch (error) {
                console.error('Error rendering tool card:', error, tool);
                // Return a fallback card
                return `
                    <div class="tool-card error-card">
                        <div class="tool-header">
                            <div class="tool-name">Error loading tool</div>
                        </div>
                        <div class="tool-description">Unable to display this tool</div>
                    </div>
                `;
            }
        },

        updateResultsCount() {
            const resultsCount = document.getElementById('resultsCount');
            const totalCount = document.getElementById('totalCount');

            if (resultsCount) resultsCount.textContent = state.filteredTools.length;
            if (totalCount) totalCount.textContent = state.tools.length;
            
            // Dispatch event for external listeners (error recovery, etc.)
            window.dispatchEvent(new CustomEvent('cliapp:results-updated', { 
                detail: { 
                    filteredCount: state.filteredTools.length,
                    totalCount: state.tools.length 
                } 
            }));
            
            // Also dispatch simpler event name for compatibility
            document.dispatchEvent(new CustomEvent('results-updated', {
                detail: {
                    count: state.filteredTools.length
                }
            }));
        },

        // Tool modal functionality
        showToolModal(toolId) {
            const tool = state.tools.find(t => t.id === toolId);
            if (!tool || !elements.toolModal) return;

            // Store the currently focused element for restoration
            state.modal.lastFocusedElement = document.activeElement;

            // Find category by name since tool.category is the category name
            const category = state.categories.find(cat => cat.name === tool.category);
            const categoryName = tool.categoryName || (category ? category.name : tool.category);
            
            const modalContent = document.getElementById('modalContent');
            const modalToolName = document.getElementById('modalToolName');

            if (modalToolName) modalToolName.textContent = tool.name; // textContent is safe
            
            if (modalContent) {
                modalContent.innerHTML = `
                    <div class="tool-modal-content">
                        <div class="tool-modal-header">
                            <div class="tool-difficulty">${'⭐'.repeat(tool.difficulty)} (${tool.difficulty}/5)</div>
                            <div class="tool-category">${this.escapeHtml(categoryName)}</div>
                        </div>
                        
                        <div class="tool-description">
                            <h3>Description</h3>
                            <p>${this.escapeHtml(tool.description)}</p>
                        </div>

                        <div class="tool-installation">
                            <h3>Installation</h3>
                            <p><strong>Method:</strong> ${this.getInstallationDisplayName(tool.metadata?.installation || tool.installation || 'Unknown')}</p>
                            <p><strong>Platforms:</strong> ${Array.isArray(tool.metadata?.platform) ? this.escapeHtml(tool.metadata.platform.join(', ')) : (Array.isArray(tool.platform) ? this.escapeHtml(tool.platform.join(', ')) : this.escapeHtml(String(tool.metadata?.platform || tool.platform || 'Unknown')))}</p>
                        </div>

                        ${Array.isArray(tool.examples) && tool.examples.length > 0 ? `
                            <div class="tool-examples">
                                <h3>Examples</h3>
                                ${tool.examples.map(example => {
                                    // Handle both string and object formats
                                    const command = typeof example === 'string' ? example : example.command;
                                    const description = typeof example === 'object' ? example.description : '';
                                    
                                    return `
                                        <div class="example">
                                            <div class="example-command">
                                                <code>${this.escapeHtml(command)}</code>
                                                <button data-command="${this.escapeHtml(command)}" class="copy-btn copy-command-btn" title="Copy command">📋</button>
                                            </div>
                                            ${description ? `<div class="example-description">${this.escapeHtml(description)}</div>` : ''}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : ''}

                        ${(tool.metadata?.aliases || tool.aliases) && (tool.metadata?.aliases || tool.aliases).length > 0 ? `
                            <div class="tool-aliases">
                                <h3>Aliases</h3>
                                <div class="aliases-list">
                                    ${(tool.metadata?.aliases || tool.aliases).map(alias => `<code>${this.escapeHtml(alias)}</code>`).join(' ')}
                                </div>
                            </div>
                        ` : ''}

                        ${(tool.metadata?.tags || tool.tags) && (tool.metadata?.tags || tool.tags).length > 0 ? `
                            <div class="tool-tags">
                                <h3>Tags</h3>
                                <div class="tags-list">
                                    ${(tool.metadata?.tags || tool.tags).map(tag => `<span class="tool-tag">${this.escapeHtml(tag)}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            }

            // Show modal and set accessibility state
            elements.toolModal.style.display = 'flex';
            elements.toolModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            state.modal.isOpen = true;

            // Set up focus trap and focus management
            const modal = elements.toolModal.querySelector('.modal');
            if (modal) {
                const firstFocusableElement = this.trapFocus(modal);
                if (firstFocusableElement) {
                    firstFocusableElement.focus();
                }
            }
        },

        closeModal() {
            if (elements.toolModal && state.modal.isOpen) {
                elements.toolModal.style.display = 'none';
                elements.toolModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                state.modal.isOpen = false;

                // Restore focus to the previously focused element
                if (state.modal.lastFocusedElement) {
                    try {
                        state.modal.lastFocusedElement.focus();
                    } catch (e) {
                        // ignore focus restoration errors
                    }
                    state.modal.lastFocusedElement = null;
                }

                // Clear focus trap state
                state.modal.focusableElements = [];
            }
        },

        // Utility functions
        copyCommand(command) {
            if (!command) return;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(command).then(() => {
                    this.showCopyNotification();
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    this.showNonBlockingAlert('Failed to copy command to clipboard.');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = command;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    this.showCopyNotification();
                } catch (err) {
                    console.error('Failed to copy:', err);
                    this.showNonBlockingAlert('Failed to copy command to clipboard.');
                }
                document.body.removeChild(textArea);
            }
        },

        showCopyNotification() {
            let notification = document.getElementById('copyNotification');
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'copyNotification';
                notification.className = 'copy-notification';
                notification.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">Copied to clipboard!</span>';
                document.body.appendChild(notification);
            }
            
            notification.style.display = 'flex';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 2000);
        },

        // Show non-blocking alert for errors
        showNonBlockingAlert(message) {
            let alertElement = document.getElementById('nonBlockingAlert');
            if (!alertElement) {
                alertElement = document.createElement('div');
                alertElement.id = 'nonBlockingAlert';
                alertElement.className = 'non-blocking-alert';
                alertElement.innerHTML = `
                    <div class="alert-content">
                        <span class="alert-icon">⚠️</span>
                        <span class="alert-message"></span>
                        <button class="alert-close">×</button>
                    </div>
                `;
                document.body.appendChild(alertElement);
            }
            
            const messageElement = alertElement.querySelector('.alert-message');
            if (messageElement) {
                messageElement.textContent = message;
            }
            
            alertElement.style.display = 'block';
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (alertElement.style.display !== 'none') {
                    alertElement.style.display = 'none';
                }
            }, 10000);
        },

        // Cheatsheet page functionality
        initCheatsheetPage() {
            try {
                this.updateCheatsheetStats();
                this.loadCheatsheetContent();
                this.initCheatsheetSearch();
                this.initCheatsheetActions();
            } catch (error) {
                console.error('Error initializing cheatsheet page:', error);
                this.showNonBlockingAlert('Error loading cheatsheet content. Some features may not work properly.');
            }
        },

        updateCheatsheetStats() {
            const cheatToolsCount = document.getElementById('cheatToolsCount');
            const cheatCategoriesCount = document.getElementById('cheatCategoriesCount');

            if (cheatToolsCount) cheatToolsCount.textContent = state.stats.totalTools + '+';
            if (cheatCategoriesCount) cheatCategoriesCount.textContent = state.stats.totalCategories + '+';
        },

        async loadCheatsheetContent() {
            const cheatsheetContent = document.getElementById('cheatsheetContent');
            const cheatsheetLoading = document.getElementById('cheatsheetLoading');
            const tocGrid = document.getElementById('tocGrid');
            const printBtn = document.getElementById('printCheatsheet');
            const downloadBtn = document.getElementById('downloadCheatsheet');

            if (!cheatsheetContent) return;

            try {
                // Try to load real cheatsheet data first
                const cheatsheetData = await this.loadCheatsheet();
                
                if (cheatsheetLoading) cheatsheetLoading.style.display = 'none';

                // Render cheatsheet content safely
                if (cheatsheetData.content) {
                    const sanitizedHtml = this.renderMarkdownSafe(cheatsheetData.content);
                    cheatsheetContent.innerHTML = sanitizedHtml;
                } else {
                    cheatsheetContent.innerHTML = '<p>No cheatsheet content available.</p>';
                }

                // Extract headings for table of contents
                this.generateCheatsheetTOC(cheatsheetContent, tocGrid);

                // Add copy buttons to code blocks
                this.addCopyButtonsToCodeBlocks();

            } catch (error) {
                console.error('Error loading cheatsheet:', error);
                
                // Hide loading and show error message with fallback
                if (cheatsheetLoading) cheatsheetLoading.style.display = 'none';
                if (printBtn) printBtn.style.display = 'none';
                if (downloadBtn) printBtn.style.display = 'none';
                
                cheatsheetContent.innerHTML = `
                    <div class="cheatsheet-error">
                        <h2>⚠️ Unable to load cheatsheet</h2>
                        <p>The cheatsheet content could not be loaded from the JSON file.</p>
                        <p>This might be because:</p>
                        <ul>
                            <li>The cheatsheet.json file hasn't been generated yet</li>
                            <li>There's a network connectivity issue</li>
                            <li>The data generation process encountered an error</li>
                        </ul>
                        <div class="fallback-actions">
                            <a href="docs/CHEATSHEET.md" class="btn btn-primary">
                                📄 View Static Cheatsheet
                            </a>
                            <button class="btn btn-outline refresh-btn">
                                🔄 Refresh Page  
                            </button>
                        </div>
                    </div>
                `;
            }
        },

        // Generate table of contents from headings
        generateCheatsheetTOC(contentElement, tocElement) {
            if (!tocElement) return;
            
            const headings = contentElement.querySelectorAll('h1, h2, h3');
            if (headings.length === 0) return;
            
            const tocItems = Array.from(headings).map(heading => {
                const id = heading.id || heading.textContent.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                heading.id = id;
                
                return {
                    id: id,
                    title: heading.textContent,
                    level: parseInt(heading.tagName.substring(1))
                };
            });
            
            tocElement.innerHTML = tocItems.map(item => `
                <a href="#${item.id}" class="toc-item toc-level-${item.level}">
                    ${item.title}
                </a>
            `).join('');
        },

        getMockCheatsheetContent() {
            const sections = [
                { id: 'file-operations', title: 'File Operations' },
                { id: 'modern-alternatives', title: 'Modern Alternatives' },
                { id: 'text-processing', title: 'Text Processing' },
                { id: 'system-admin', title: 'System Admin' },
                { id: 'networking', title: 'Networking' },
                { id: 'development', title: 'Development' }
            ];

            const content = `
                <div class="cheat-section" id="file-operations">
                    <h2>🚀 File Operations - Quick Copy & Paste</h2>
                    <h3>Basic Operations</h3>
                    <div class="code-block">
                        <pre><code class="language-bash">ls -la                      # List all files with details
ls -lh                      # Human-readable sizes
cp -r source/ dest/         # Copy directory recursively  
mv old.txt new.txt          # Rename/move file
rm -i file.txt              # Remove with confirmation
mkdir -p path/to/dir        # Create nested directories
touch newfile.txt           # Create empty file</code></pre>
                    </div>
                </div>

                <div class="cheat-section" id="modern-alternatives">
                    <h2>⚡ Modern Alternatives (Faster & Better)</h2>
                    <div class="code-block">
                        <pre><code class="language-bash">eza -la                     # Better ls with icons/colors
fd pattern                  # Better find (respects .gitignore)
rg "search"                 # Better grep (5-10x faster)
bat file.txt                # Better cat (syntax highlighting)
dust                        # Better du (visual tree)
procs                       # Better ps (colored, formatted)
sd "old" "new" file.txt     # Better sed (intuitive syntax)</code></pre>
                    </div>
                </div>

                <div class="cheat-section" id="text-processing">
                    <h2>📝 Text Processing Essentials</h2>
                    <div class="code-block">
                        <pre><code class="language-bash">grep "pattern" file.txt     # Search in file
grep -r "pattern" dir/      # Recursive search
sed 's/old/new/g' file.txt  # Replace text
awk '{print $1}' file.txt   # Print first column
sort file.txt               # Sort lines
uniq file.txt               # Remove duplicates
wc -l file.txt              # Count lines</code></pre>
                    </div>
                </div>

                <div class="cheat-section" id="system-admin">
                    <h2>⚙️ System Administration</h2>
                    <h3>Process Management</h3>
                    <div class="code-block">
                        <pre><code class="language-bash">ps aux                      # List all processes
htop                        # Interactive process viewer
kill -9 PID                 # Force kill process
killall process_name        # Kill by name
jobs                        # List background jobs
bg %1                       # Resume job in background
fg %1                       # Bring job to foreground</code></pre>
                    </div>
                    
                    <h3>System Info</h3>
                    <div class="code-block">
                        <pre><code class="language-bash">df -h                       # Disk usage
du -sh *                    # Directory sizes
free -h                     # Memory usage
uptime                      # System uptime
uname -a                    # System information</code></pre>
                    </div>
                </div>

                <div class="cheat-section" id="networking">
                    <h2>🌐 Networking</h2>
                    <div class="code-block">
                        <pre><code class="language-bash">ping google.com             # Test connectivity
curl -I https://site.com    # Get HTTP headers
wget https://file.zip       # Download file
netstat -tulpn              # List open ports
ssh user@host               # Connect via SSH
scp file.txt user@host:~/   # Copy file over SSH</code></pre>
                    </div>
                </div>

                <div class="cheat-section" id="development">
                    <h2>💻 Development Tools</h2>
                    <div class="code-block">
                        <pre><code class="language-bash">git status                  # Check repo status
git add .                   # Stage all changes
git commit -m "message"     # Commit changes
git push origin main        # Push to remote
npm install                 # Install dependencies
npm start                   # Start development server
docker ps                   # List containers
docker build -t name .      # Build image</code></pre>
                    </div>
                </div>
            `;

            return { sections, content };
        },

        addCopyButtonsToCodeBlocks() {
            const codeBlocks = document.querySelectorAll('.code-block pre');
            codeBlocks.forEach(block => {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'code-copy-btn';
                copyBtn.textContent = 'Copy';
                copyBtn.addEventListener('click', () => {
                    const code = block.textContent;
                    this.copyCommand(code);
                });
                
                const container = block.parentElement;
                container.style.position = 'relative';
                container.appendChild(copyBtn);
            });
        },

        initCheatsheetSearch() {
            const cheatSearch = document.getElementById('cheatSearch');
            const cheatSearchClear = document.getElementById('cheatSearchClear');

            if (cheatSearch) {
                cheatSearch.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase().trim();
                    this.filterCheatsheetContent(query);
                    
                    if (cheatSearchClear) {
                        cheatSearchClear.style.display = query ? 'block' : 'none';
                    }
                });
            }

            if (cheatSearchClear) {
                cheatSearchClear.addEventListener('click', () => {
                    cheatSearch.value = '';
                    cheatSearchClear.style.display = 'none';
                    this.filterCheatsheetContent('');
                });
            }
        },

        filterCheatsheetContent(query) {
            const sections = document.querySelectorAll('.cheat-section');
            const tocItems = document.querySelectorAll('.toc-item');

            sections.forEach((section, index) => {
                const text = section.textContent.toLowerCase();
                const matches = !query || text.includes(query);
                section.style.display = matches ? 'block' : 'none';
                
                // Update TOC
                if (tocItems[index]) {
                    tocItems[index].style.opacity = matches ? '1' : '0.5';
                }
            });
        },

        initCheatsheetActions() {
            const printBtn = document.getElementById('printCheatsheet');
            const downloadBtn = document.getElementById('downloadCheatsheet');

            if (printBtn) {
                printBtn.addEventListener('click', () => {
                    window.print();
                });
            }

            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    // Use window.print() as minimal viable solution for PDF download
                    // This allows users to save as PDF through their browser's print dialog
                    window.print();
                });
            }
        }
    };

    // Expose CLIApp to global scope
    window.CLIApp = CLIApp;
    
    // Expose global alias for backward compatibility
    window.applyFilters = () => window.CLIApp.applyFilters();

    // Initialize the application when DOM is ready
    document.addEventListener('DOMContentLoaded', async () => {
        await CLIApp.init();
        
        // Event delegation for dynamically generated buttons
        document.addEventListener('click', (e) => {
            // Handle tool details buttons
            if (e.target.classList.contains('tool-details-btn')) {
                const toolId = e.target.dataset.toolId;
                if (toolId) {
                    CLIApp.showToolModal(toolId);
                }
            }
            
            // Handle copy command buttons
            if (e.target.classList.contains('copy-command-btn')) {
                const command = e.target.dataset.command;
                if (command) {
                    CLIApp.copyCommand(command);
                }
            }
            
            // Handle alert close buttons
            if (e.target.classList.contains('alert-close')) {
                const alertElement = e.target.closest('.alert');
                if (alertElement) {
                    alertElement.style.display = 'none';
                }
            }

            // Handle non-blocking alert close button
            if (e.target.classList.contains('alert-close') && e.target.closest('#nonBlockingAlert')) {
                const nb = e.target.closest('#nonBlockingAlert');
                if (nb) nb.style.display = 'none';
            }
            
            // Handle refresh buttons
            if (e.target.classList.contains('refresh-btn')) {
                location.reload();
            }
        });
    });

    // Expose key functions globally for debugging and external access
    window.DEFAULT_FILTER_VALUES = DEFAULT_FILTER_VALUES;
    window.normalizePlatforms = normalizePlatforms;
    
    // Update global data references when state changes
    Object.defineProperty(window, 'toolsData', {
        get: () => state.tools,
        configurable: true
    });
    Object.defineProperty(window, 'categoriesData', {
        get: () => state.categories,
        configurable: true
    });
    Object.defineProperty(window, 'statsData', {
        get: () => state.stats,
        configurable: true
    });
    
    // Export CLIApp for API contract
    window.CLIApp = CLIApp;

})();
