/**
 * CLI Tool Context - Main JavaScript Application
 * Handles search, filtering, tool rendering, and all interactive features
 */

(function() {
    'use strict';

    // Application state
    const state = {
        tools: [],
        categories: [],
        stats: {},
        filteredTools: [],
        currentPage: 1,
        itemsPerPage: 20,
        searchIndex: null,
        searchWorker: null,
        searchIndexReady: false,
        theme: localStorage.getItem('theme') || 'light',
        filters: {
            search: '',
            category: '',
            difficulty: '',
            platform: '',
            installation: ''
        },
        sortBy: 'name',
        modal: {
            isOpen: false,
            lastFocusedElement: null,
            focusableElements: []
        }
    };

    // Configuration
    const config = {
        USE_MOCK: false // Flag to gate mock data usage
    };

    // DOM elements cache
    const elements = {};

    // Main application object
    const CLIApp = {
        // Initialize the application
        init() {
            this.initMarked();
            this.cacheElements();
            this.initTheme();
            this.initEventListeners();
            this.loadData();
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
            
            // Parse markdown to HTML
            let html;
            if (typeof marked !== 'undefined') {
                html = marked.parse(markdown);
            } else {
                // Fallback: basic escaping if marked is not available
                html = markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
            }
            
            // Sanitize HTML with DOMPurify
            if (typeof DOMPurify !== 'undefined') {
                return DOMPurify.sanitize(html);
            } else {
                console.warn('DOMPurify not available, using basic HTML escaping');
                // Basic HTML escaping as fallback
                return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

        // Load data from JSON files
        async loadData() {
            try {
                await this.loadStats();
                await this.loadTools();
                await this.loadCategories();
                this.initSearchWorker();
                this.updateDynamicCounts();
            } catch (error) {
                console.error('Error loading data:', error);
                // Fall back to empty state with user-friendly message
                this.handleDataLoadError(error);
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
                    callToAction.innerHTML = `
                        <strong>📊 Data Generation Required</strong><br>
                        The website data hasn't been generated yet. Run <code>scripts/generate_site_data.sh</code> to create the complete dataset.
                    `;
                    element.appendChild(callToAction);
                }
            });
        },

        // Initialize Search Web Worker
        initSearchWorker() {
            try {
                // Check if Web Workers are supported
                if (typeof Worker === 'undefined') {
                    console.warn('Web Workers not supported, falling back to main thread search');
                    this.buildSearchIndexMainThread();
                    return;
                }

                console.log('Initializing search worker...');
                state.searchWorker = new Worker('js/search.worker.js');

                // Handle worker messages
                state.searchWorker.onmessage = (event) => {
                    const { type, data } = event.data;
                    
                    switch (type) {
                        case 'WORKER_READY':
                            console.log('Search worker ready');
                            // Build index with current tools data
                            if (state.tools.length > 0) {
                                state.searchWorker.postMessage({
                                    type: 'BUILD_INDEX',
                                    data: state.tools
                                });
                            }
                            break;
                            
                        case 'INDEX_READY':
                            console.log('Search index built:', event.data);
                            state.searchIndexReady = true;
                            this.updateSearchStatus('ready');
                            break;
                            
                        case 'SEARCH_RESULTS':
                            this.handleSearchResults(event.data);
                            break;
                            
                        case 'INDEX_ERROR':
                        case 'SEARCH_ERROR':
                        case 'WORKER_ERROR':
                            console.error('Search worker error:', event.data.error);
                            this.updateSearchStatus('error');
                            break;
                    }
                };

                // Handle worker errors
                state.searchWorker.onerror = (error) => {
                    console.error('Search worker error:', error);
                    this.buildSearchIndexMainThread();
                };

            } catch (error) {
                console.error('Failed to initialize search worker:', error);
                this.buildSearchIndexMainThread();
            }
        },

        // Fallback to main thread search indexing
        buildSearchIndexMainThread() {
            console.log('Building search index on main thread...');
            // Simple fallback implementation
            state.searchIndex = state.tools;
            state.searchIndexReady = true;
            this.updateSearchStatus('ready');
        },

        // Update search status indicator
        updateSearchStatus(status) {
            const indicators = document.querySelectorAll('.search-status');
            indicators.forEach(indicator => {
                indicator.className = `search-status status-${status}`;
                switch (status) {
                    case 'ready':
                        indicator.textContent = '🔍 Search ready';
                        break;
                    case 'building':
                        indicator.textContent = '⏳ Building search index...';
                        break;
                    case 'error':
                        indicator.textContent = '⚠️ Search unavailable';
                        break;
                }
            });
        },

        // Perform search using Web Worker
        performSearch(query, limit = 10) {
            if (!state.searchIndexReady) {
                console.warn('Search index not ready');
                return [];
            }

            if (state.searchWorker) {
                state.searchWorker.postMessage({
                    type: 'SEARCH',
                    data: { query, limit }
                });
            } else {
                // Fallback search
                return this.simpleSearch(query, limit);
            }
        },

        // Simple fallback search
        simpleSearch(query, limit = 10) {
            const lowerQuery = query.toLowerCase();
            return state.tools
                .filter(tool => 
                    tool.name.toLowerCase().includes(lowerQuery) ||
                    tool.description.toLowerCase().includes(lowerQuery) ||
                    tool.category.toLowerCase().includes(lowerQuery)
                )
                .slice(0, limit);
        },

        // Handle search results from worker
        handleSearchResults(data) {
            console.log(`Search completed in ${data.duration}ms: ${data.totalFound} results`);
            // Update UI with search results
            this.displaySearchResults(data.results, data.query);
        },

        // Display search results in UI
        displaySearchResults(results, query) {
            if (elements.searchResultsList) {
                if (results.length === 0) {
                    elements.searchResultsList.innerHTML = `
                        <div class="search-no-results">
                            <p>No results found for "${query}"</p>
                            <p>Try a different search term or browse by category.</p>
                        </div>
                    `;
                } else {
                    elements.searchResultsList.innerHTML = results.map(tool => `
                        <a href="tools.html?search=${encodeURIComponent(tool.name)}" class="search-result-item">
                            <div class="search-result-name">${this.highlightText(tool.name, query)}</div>
                            <div class="search-result-description">${this.highlightText(tool.description, query)}</div>
                            <div class="search-result-score">Score: ${tool.score.toFixed(2)}</div>
                        </a>
                    `).join('');
                }
            }
        },

        // Load statistics from stats.json
        async loadStats() {
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

        // Load tools from tools.json
        async loadTools() {
            try {
                const response = await fetch('data/tools.json');
                if (!response.ok) {
                    throw new Error(`Failed to load tools.json: ${response.status}`);
                }
                const data = await response.json();
                
                // Check if data is ready
                if (data.ready === false) {
                    console.warn('Tools data not ready - data generation may be incomplete');
                    this.logMCPStatus('data_not_ready', 'Tools data marked as not ready');
                }
                
                state.tools = data.tools || [];
            } catch (error) {
                console.error('Error loading tools:', error);
                
                if (config.USE_MOCK) {
                    console.log('Falling back to mock tools data');
                    this.logMCPStatus('mock_fallback', 'Using mock tools data due to fetch failure');
                    state.tools = [
                        {
                            name: 'ls',
                            category: 'File Operations',
                            description: 'List directory contents',
                            usage: 'ls [options] [file...]',
                            ready: false,
                            mock: true
                        }
                    ];
                } else {
                    state.tools = [];
                    throw error;
                }
            }
        },

        // Load categories from categories.json
        async loadCategories() {
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
                
                state.categories = data.categories.map(cat => ({
                    id: cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    name: cat.name,
                    count: cat.toolCount,
                    icon: this.getCategoryIconByName(cat.name),
                    description: cat.description
                })) || [];
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
        handleDataLoadError(error) {
            console.error('Data loading failed:', error);
            
            // Show error message to user
            const errorElements = document.querySelectorAll('.data-loading-error');
            errorElements.forEach(element => {
                element.style.display = 'block';
                element.innerHTML = `
                    <div class="error-message">
                        <h3>⚠️ Unable to load data</h3>
                        <p>The website data could not be loaded. This may be because:</p>
                        <ul>
                            <li>The data files haven't been generated yet</li>
                            <li>There's a network connectivity issue</li>
                            <li>The server is not running properly</li>
                        </ul>
                        <p>Please try refreshing the page or <a href="docs/CHEATSHEET.md">view the static documentation</a>.</p>
                    </div>
                `;
            });

            // Disable UI that depends on data
            const dependentElements = document.querySelectorAll('.requires-data');
            dependentElements.forEach(element => {
                element.style.opacity = '0.5';
                element.style.pointerEvents = 'none';
            });
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
            state.tools = [
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
            state.tools = [...state.tools, ...additionalTools];
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

        // Build search index using Lunr
        buildSearchIndex() {
            if (typeof lunr === 'undefined') {
                console.warn('Lunr not available, search functionality will be limited');
                return;
            }

            state.searchIndex = lunr(function() {
                this.field('name', { boost: 10 });
                this.field('description', { boost: 5 });
                this.field('category', { boost: 3 });
                this.field('tags', { boost: 2 });
                this.ref('id');

                state.tools.forEach(tool => {
                    this.add({
                        id: tool.id,
                        name: tool.name,
                        description: tool.description,
                        category: tool.category,
                        tags: tool.tags.join(' ')
                    });
                });
            });
        },

        // Theme toggle functionality
        toggleTheme() {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', state.theme);
            localStorage.setItem('theme', state.theme);
            
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
            if (query.length > 2) {
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
            if (!query || query.length < 2) return;

            let results = [];
            if (state.searchIndex) {
                const searchResults = state.searchIndex.search(query);
                results = searchResults.slice(0, 8).map(result => {
                    return state.tools.find(tool => tool.id === result.ref);
                }).filter(Boolean);
            } else {
                // Fallback search without Lunr
                results = state.tools.filter(tool => 
                    tool.name.toLowerCase().includes(query.toLowerCase()) ||
                    tool.description.toLowerCase().includes(query.toLowerCase())
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
                    <div class="search-result-name">${this.highlightText(tool.name, query)}</div>
                    <div class="search-result-description">${this.highlightText(tool.description, query)}</div>
                </a>
            `).join('');

            elements.searchResults.style.display = 'block';
        },

        highlightText(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
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
                tool.tags.includes('essential') || tool.popularity > 80
            ).slice(0, 6);

            featuredTools.innerHTML = essential.map(tool => `
                <div class="tool-card">
                    <div class="tool-header">
                        <div class="tool-icon">${this.getCategoryIcon(tool.category)}</div>
                        <div class="tool-name">${tool.name}</div>
                        <div class="tool-difficulty">${'⭐'.repeat(tool.difficulty)}</div>
                    </div>
                    <div class="tool-description">${tool.description}</div>
                    <div class="tool-meta">
                        ${tool.tags.slice(0, 3).map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
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

        getCategoryIcon(categoryId) {
            const category = state.categories.find(cat => cat.id === categoryId);
            return category ? category.icon : '🔧';
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
        initToolsPage() {
            try {
                this.initToolsPageElements();
                this.updateToolsPageStats();
                this.populateCategoryFilter();
                this.initToolsFilters();
                this.applyFilters();
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

            const options = state.categories.map(category => `
                <option value="${category.id}">${category.name}</option>
            `).join('');

            elements.categoryFilter.innerHTML = '<option value="">All Categories</option>' + options;
        },

        initToolsFilters() {
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
                        state.filters[key] = element.value;
                        this.applyFilters();
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

            // Load more button
            if (elements.loadMoreBtn) {
                elements.loadMoreBtn.addEventListener('click', () => {
                    state.currentPage++;
                    this.renderTools();
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

            // Debounce search
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.applyFilters();
            }, 300);
        },

        resetFilters() {
            // Reset form elements
            if (elements.toolSearch) elements.toolSearch.value = '';
            if (elements.categoryFilter) elements.categoryFilter.value = '';
            if (elements.difficultyFilter) elements.difficultyFilter.value = '';
            if (elements.platformFilter) elements.platformFilter.value = '';
            if (elements.installationFilter) elements.installationFilter.value = '';
            if (elements.sortBy) elements.sortBy.value = 'name';
            if (elements.toolSearchClear) elements.toolSearchClear.style.display = 'none';

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

        applyFilters() {
            // Show loading state
            if (elements.toolsLoading) elements.toolsLoading.style.display = 'block';
            if (elements.toolsGrid) elements.toolsGrid.style.display = 'none';
            if (elements.emptyState) elements.emptyState.style.display = 'none';

            setTimeout(() => {
                this.filterAndSortTools();
                this.renderTools();
                this.updateResultsCount();
                
                // Hide loading state
                if (elements.toolsLoading) elements.toolsLoading.style.display = 'none';
                if (elements.toolsGrid) elements.toolsGrid.style.display = 'grid';
            }, 100);
        },

        filterAndSortTools() {
            let filtered = [...state.tools];

            // Apply search filter
            if (state.filters.search) {
                const query = state.filters.search.toLowerCase();
                if (state.searchIndex) {
                    const searchResults = state.searchIndex.search(query);
                    const searchIds = searchResults.map(result => result.ref);
                    filtered = filtered.filter(tool => searchIds.includes(tool.id));
                } else {
                    filtered = filtered.filter(tool => 
                        tool.name.toLowerCase().includes(query) ||
                        tool.description.toLowerCase().includes(query) ||
                        tool.tags.some(tag => tag.toLowerCase().includes(query))
                    );
                }
            }

            // Apply category filter
            if (state.filters.category) {
                filtered = filtered.filter(tool => tool.category === state.filters.category);
            }

            // Apply difficulty filter
            if (state.filters.difficulty) {
                const difficultyLevel = parseInt(state.filters.difficulty);
                filtered = filtered.filter(tool => tool.difficulty === difficultyLevel);
            }

            // Apply platform filter
            if (state.filters.platform) {
                filtered = filtered.filter(tool => tool.platform.includes(state.filters.platform));
            }

            // Apply installation filter
            if (state.filters.installation) {
                filtered = filtered.filter(tool => tool.installation === state.filters.installation);
            }

            // Sort tools
            filtered.sort((a, b) => {
                switch (state.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'category':
                        return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
                    case 'difficulty':
                        return a.difficulty - b.difficulty || a.name.localeCompare(b.name);
                    default:
                        return a.name.localeCompare(b.name);
                }
            });

            state.filteredTools = filtered;
            state.currentPage = 1;
        },

        renderTools() {
            if (!elements.toolsGrid) return;

            const startIndex = 0;
            const endIndex = state.currentPage * state.itemsPerPage;
            const toolsToShow = state.filteredTools.slice(startIndex, endIndex);

            if (toolsToShow.length === 0) {
                elements.toolsGrid.style.display = 'none';
                if (elements.emptyState) elements.emptyState.style.display = 'block';
                if (elements.loadMoreBtn) elements.loadMoreBtn.style.display = 'none';
                return;
            }

            elements.toolsGrid.innerHTML = toolsToShow.map(tool => this.renderToolCard(tool)).join('');

            // Show/hide load more button
            const hasMore = endIndex < state.filteredTools.length;
            if (elements.loadMoreBtn) {
                elements.loadMoreBtn.style.display = hasMore ? 'block' : 'none';
            }

            // Update load more info
            const loadedCount = document.getElementById('loadedCount');
            const filteredCount = document.getElementById('filteredCount');
            if (loadedCount) loadedCount.textContent = toolsToShow.length;
            if (filteredCount) filteredCount.textContent = state.filteredTools.length;
        },

        renderToolCard(tool) {
            const category = state.categories.find(cat => cat.id === tool.category);
            const categoryName = tool.categoryName || (category ? category.name : tool.category);
            const categoryIcon = category ? category.icon : '🔧';

            return `
                <div class="tool-card" data-tool-id="${tool.id}">
                    <div class="tool-header">
                        <div class="tool-icon">${categoryIcon}</div>
                        <div class="tool-name">${this.escapeHtml(tool.name)}</div>
                        <div class="tool-difficulty" title="Difficulty: ${tool.difficulty}/5">
                            ${'⭐'.repeat(tool.difficulty)}${'☆'.repeat(5 - tool.difficulty)}
                        </div>
                    </div>
                    <div class="tool-description">${this.escapeHtml(tool.description)}</div>
                    <div class="tool-meta">
                        <span class="tool-tag">${categoryName}</span>
                        <span class="tool-tag">${this.getInstallationDisplayName(tool.installation)}</span>
                        ${tool.platform.slice(0, 2).map(p => `<span class="tool-tag">${p}</span>`).join('')}
                    </div>
                    <div class="tool-actions">
                        <button data-tool-id="${tool.id}" class="btn btn-primary btn-small tool-details-btn">
                            View Details
                        </button>
                        <button data-command="${tool.name}" class="btn btn-outline btn-small copy-command-btn">
                            Copy Command
                        </button>
                    </div>
                </div>
            `;
        },

        updateResultsCount() {
            const resultsCount = document.getElementById('resultsCount');
            const totalCount = document.getElementById('totalCount');

            if (resultsCount) resultsCount.textContent = state.filteredTools.length;
            if (totalCount) totalCount.textContent = state.tools.length;
        },

        // Tool modal functionality
        showToolModal(toolId) {
            const tool = state.tools.find(t => t.id === toolId);
            if (!tool || !elements.toolModal) return;

            // Store the currently focused element for restoration
            state.modal.lastFocusedElement = document.activeElement;

            const category = state.categories.find(cat => cat.id === tool.category);
            const categoryName = tool.categoryName || (category ? category.name : tool.category);
            
            const modalContent = document.getElementById('modalContent');
            const modalToolName = document.getElementById('modalToolName');

            if (modalToolName) modalToolName.textContent = tool.name; // textContent is safe
            
            if (modalContent) {
                modalContent.innerHTML = `
                    <div class="tool-modal-content">
                        <div class="tool-modal-header">
                            <div class="tool-difficulty">${'⭐'.repeat(tool.difficulty)} (${tool.difficulty}/5)</div>
                            <div class="tool-category">${categoryName}</div>
                        </div>
                        
                        <div class="tool-description">
                            <h3>Description</h3>
                            <p>${this.escapeHtml(tool.description)}</p>
                        </div>

                        <div class="tool-installation">
                            <h3>Installation</h3>
                            <p><strong>Method:</strong> ${this.getInstallationDisplayName(tool.installation)}</p>
                            <p><strong>Platforms:</strong> ${tool.platform.join(', ')}</p>
                        </div>

                        ${tool.examples.length > 0 ? `
                            <div class="tool-examples">
                                <h3>Examples</h3>
                                ${tool.examples.map(example => `
                                    <div class="example">
                                        <div class="example-command">
                                            <code>${example.command}</code>
                                            <button data-command="${example.command}" class="copy-btn copy-command-btn" title="Copy command">📋</button>
                                        </div>
                                        <div class="example-description">${example.description}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        ${tool.aliases.length > 0 ? `
                            <div class="tool-aliases">
                                <h3>Aliases</h3>
                                <div class="aliases-list">
                                    ${tool.aliases.map(alias => `<code>${alias}</code>`).join(' ')}
                                </div>
                            </div>
                        ` : ''}

                        <div class="tool-tags">
                            <h3>Tags</h3>
                            <div class="tags-list">
                                ${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
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
                    state.modal.lastFocusedElement.focus();
                    state.modal.lastFocusedElement = null;
                }

                // Clear focus trap state
                state.modal.focusableElements = [];
            }
        },

        // Utility functions
        copyCommand(command) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(command).then(() => {
                    this.showCopyNotification();
                }).catch(err => {
                    console.error('Failed to copy:', err);
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
                    // In a real implementation, this would generate a PDF
                    alert('PDF download functionality would be implemented here.');
                });
            }
        }
    };

    // Expose CLIApp to global scope
    window.CLIApp = CLIApp;

    // Initialize the application when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        CLIApp.init();
        
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
            
            // Handle refresh buttons
            if (e.target.classList.contains('refresh-btn')) {
                location.reload();
            }
        });
    });

})();