/**
 * Comprehensive debugging utility module for CLI Tool Context website
 * Helps diagnose filtering issues and provides troubleshooting guidance
 */

class DebugHelper {
    constructor() {
        this.isDebugMode = false;
        this.debugPanel = null;
        this.logs = [];
        this.maxLogs = 1000;
        this.init();
    }

    init() {
        // Check if debug mode should be enabled
        const urlParams = new URLSearchParams(window.location.search);
        const debugParam = urlParams.get('debug');
        const debugStorage = localStorage.getItem('cli-tools-debug');
        
        this.isDebugMode = debugParam === 'true' || debugStorage === 'true';
        
        if (this.isDebugMode) {
            this.enableDebugMode();
        }

        // Add global error handler
        window.addEventListener('error', (e) => {
            this.logError('Global Error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack
            });
        });

        // Add unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Unhandled Promise Rejection', {
                reason: e.reason,
                stack: e.reason?.stack
            });
        });
    }

    enableDebugMode() {
        this.isDebugMode = true;
        localStorage.setItem('cli-tools-debug', 'true');
        this.createDebugPanel();
        this.logInfo('Debug mode enabled');
    }

    disableDebugMode() {
        this.isDebugMode = false;
        localStorage.removeItem('cli-tools-debug');
        if (this.debugPanel) {
            this.debugPanel.remove();
            this.debugPanel = null;
        }
    }

    createDebugPanel() {
        if (this.debugPanel) return;

        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'debug-panel';
        this.debugPanel.className = 'debug-panel collapsed';
        this.debugPanel.innerHTML = `
            <div class="debug-header">
                <h3>Debug Console</h3>
                <div class="debug-controls">
                    <button id="debug-clear">Clear</button>
                    <button id="debug-export">Export</button>
                    <button id="debug-collapse">−</button>
                    <button id="debug-close">×</button>
                </div>
            </div>
            <div class="debug-content">
                <div class="debug-stats">
                    <div class="debug-stat">
                        <label>Data Status:</label>
                        <span id="debug-data-status">Unknown</span>
                    </div>
                    <div class="debug-stat">
                        <label>Search Status:</label>
                        <span id="debug-search-status">Unknown</span>
                    </div>
                    <div class="debug-stat">
                        <label>Filter Status:</label>
                        <span id="debug-filter-status">Unknown</span>
                    </div>
                    <div class="debug-stat">
                        <label>Tools Count:</label>
                        <span id="debug-tools-count">0</span>
                    </div>
                </div>
                <div class="debug-logs">
                    <div id="debug-log-container"></div>
                </div>
                <div class="debug-actions">
                    <button id="debug-validate-data">Validate Data</button>
                    <button id="debug-test-filters">Test Filters</button>
                    <button id="debug-reset-state">Reset State</button>
                    <button id="debug-reload-data">Reload Data</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.debugPanel);
        this.attachDebugPanelEvents();
    }

    attachDebugPanelEvents() {
        const panel = this.debugPanel;
        
        panel.querySelector('#debug-clear').addEventListener('click', () => {
            this.clearLogs();
        });

        panel.querySelector('#debug-export').addEventListener('click', () => {
            this.exportLogs();
        });

        panel.querySelector('#debug-collapse').addEventListener('click', (e) => {
            const isCollapsed = panel.classList.toggle('collapsed');
            e.target.textContent = isCollapsed ? '+' : '−';
        });

        panel.querySelector('#debug-close').addEventListener('click', () => {
            this.disableDebugMode();
        });

        panel.querySelector('#debug-validate-data').addEventListener('click', () => {
            this.validateData();
        });

        panel.querySelector('#debug-test-filters').addEventListener('click', () => {
            this.testFilters();
        });

        panel.querySelector('#debug-reset-state').addEventListener('click', () => {
            this.resetApplicationState();
        });

        panel.querySelector('#debug-reload-data').addEventListener('click', () => {
            this.reloadData();
        });
    }

    log(level, category, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            category,
            message,
            data
        };

        this.logs.push(logEntry);
        
        // Limit log size
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        // Console output
        const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
        const consoleArgs = [`[${category}] ${message}`];
        if (data) consoleArgs.push(data);
        console[consoleMethod](...consoleArgs);

        // Update debug panel
        if (this.debugPanel && this.isDebugMode) {
            this.updateDebugPanel(logEntry);
        }
    }

    logInfo(category, message, data) {
        this.log('info', category, message, data);
    }

    logWarn(category, message, data) {
        this.log('warn', category, message, data);
    }

    logError(category, message, data) {
        this.log('error', category, message, data);
    }

    updateDebugPanel(logEntry) {
        const container = this.debugPanel.querySelector('#debug-log-container');
        const logElement = document.createElement('div');
        logElement.className = `debug-log-entry debug-${logEntry.level}`;
        logElement.innerHTML = `
            <span class="debug-timestamp">${new Date(logEntry.timestamp).toLocaleTimeString()}</span>
            <span class="debug-category">[${logEntry.category}]</span>
            <span class="debug-message">${logEntry.message}</span>
            ${logEntry.data ? `<details><summary>Data</summary><pre>${JSON.stringify(logEntry.data, null, 2)}</pre></details>` : ''}
        `;
        
        container.appendChild(logElement);
        container.scrollTop = container.scrollHeight;

        // Limit DOM entries
        const entries = container.children;
        if (entries.length > 100) {
            for (let i = 0; i < entries.length - 100; i++) {
                entries[i].remove();
            }
        }
    }

    updateStatus(type, status, details = null) {
        const statusElement = this.debugPanel?.querySelector(`#debug-${type}-status`);
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
            if (details) {
                statusElement.title = JSON.stringify(details);
            }
        }
    }

    updateToolsCount(count) {
        const countElement = this.debugPanel?.querySelector('#debug-tools-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    clearLogs() {
        this.logs = [];
        const container = this.debugPanel?.querySelector('#debug-log-container');
        if (container) {
            container.innerHTML = '';
        }
    }

    exportLogs() {
        const data = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            logs: this.logs
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    validateData() {
        this.logInfo('Debug', 'Starting data validation...');
        
        try {
            // Check if global data objects exist
            const hasTools = typeof window.toolsData !== 'undefined' && Array.isArray(window.toolsData);
            const hasCategories = typeof window.categoriesData !== 'undefined';
            const hasStats = typeof window.statsData !== 'undefined';
            
            this.logInfo('Data Validation', 'Global data availability', {
                tools: hasTools ? window.toolsData.length : 'Not available',
                categories: hasCategories ? Object.keys(window.categoriesData).length : 'Not available',
                stats: hasStats ? 'Available' : 'Not available'
            });

            if (hasTools) {
                // Validate tool structure
                const sampleTool = window.toolsData[0];
                const requiredFields = ['name', 'description', 'category', 'installation'];
                const missingFields = requiredFields.filter(field => !sampleTool[field]);
                
                if (missingFields.length > 0) {
                    this.logWarn('Data Validation', 'Sample tool missing fields', missingFields);
                } else {
                    this.logInfo('Data Validation', 'Tool structure looks valid');
                }
            }

            // Check DOM elements
            const filterElements = {
                categoryFilter: document.getElementById('categoryFilter'),
                difficultyFilter: document.getElementById('difficultyFilter'),
                platformFilter: document.getElementById('platformFilter'),
                installationFilter: document.getElementById('installationFilter'),
                searchInput: document.getElementById('searchInput')
            };

            const missingElements = Object.entries(filterElements)
                .filter(([name, element]) => !element)
                .map(([name]) => name);

            if (missingElements.length > 0) {
                this.logError('DOM Validation', 'Missing filter elements', missingElements);
            } else {
                this.logInfo('DOM Validation', 'All filter elements found');
            }

        } catch (error) {
            this.logError('Data Validation', 'Validation failed', error);
        }
    }

    testFilters() {
        this.logInfo('Debug', 'Testing filter functionality...');
        
        try {
            // Test if filter function exists
            if (typeof window.applyFilters === 'function') {
                this.logInfo('Filter Test', 'applyFilters function found');
                // Try calling it
                window.applyFilters();
                this.logInfo('Filter Test', 'applyFilters executed successfully');
            } else {
                this.logError('Filter Test', 'applyFilters function not found');
            }

            // Test search functionality
            if (typeof window.searchWorker !== 'undefined') {
                this.logInfo('Search Test', 'Search worker available');
            } else if (typeof window.searchIndex !== 'undefined') {
                this.logInfo('Search Test', 'Search index available');
            } else {
                this.logWarn('Search Test', 'No search functionality detected');
            }

        } catch (error) {
            this.logError('Filter Test', 'Test failed', error);
        }
    }

    resetApplicationState() {
        this.logInfo('Debug', 'Resetting application state...');
        
        try {
            // Clear localStorage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('cli-tools-')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            // Reset filters
            const filterElements = [
                'categoryFilter', 'difficultyFilter', 
                'platformFilter', 'installationFilter', 'searchInput'
            ];
            
            filterElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    if (element.type === 'text') {
                        element.value = '';
                    } else {
                        element.selectedIndex = 0;
                    }
                }
            });

            // Trigger filter update
            if (typeof window.applyFilters === 'function') {
                window.applyFilters();
            }

            this.logInfo('Debug', 'Application state reset completed');
            
        } catch (error) {
            this.logError('State Reset', 'Reset failed', error);
        }
    }

    reloadData() {
        this.logInfo('Debug', 'Reloading data...');
        
        try {
            // Force reload the page
            window.location.reload(true);
        } catch (error) {
            this.logError('Data Reload', 'Reload failed', error);
        }
    }

    // Browser compatibility checks
    checkBrowserCompatibility() {
        const features = {
            'Web Workers': typeof Worker !== 'undefined',
            'Local Storage': typeof Storage !== 'undefined',
            'JSON': typeof JSON !== 'undefined',
            'Array.from': typeof Array.from === 'function',
            'Object.assign': typeof Object.assign === 'function',
            'Promise': typeof Promise !== 'undefined',
            'Fetch API': typeof fetch !== 'undefined'
        };

        const unsupported = Object.entries(features)
            .filter(([name, supported]) => !supported)
            .map(([name]) => name);

        if (unsupported.length > 0) {
            this.logWarn('Browser Compatibility', 'Unsupported features detected', unsupported);
            return false;
        }

        this.logInfo('Browser Compatibility', 'All required features supported');
        return true;
    }

    // Performance monitoring helpers
    startTimer(name) {
        this.logInfo('Performance', `Starting timer: ${name}`);
        performance.mark(`${name}-start`);
    }

    endTimer(name) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name)[0];
        this.logInfo('Performance', `${name} took ${measure.duration.toFixed(2)}ms`);
        return measure.duration;
    }
}

// Create global debug instance
window.debugHelper = new DebugHelper();

// Expose debug functions globally for console access
window.enableDebug = () => window.debugHelper.enableDebugMode();
window.disableDebug = () => window.debugHelper.disableDebugMode();

// Auto-enable debug mode for development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
    console.log('Development environment detected. Debug mode available via enableDebug() or ?debug=true');
}