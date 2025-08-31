/**
 * Error Recovery System for CLI Tool Context website
 * Handles and fixes common filtering issues automatically
 */

class ErrorRecoverySystem {
    constructor() {
        this.recoveryStrategies = new Map();
        this.recoveryAttempts = new Map();
        this.maxRetryAttempts = 3;
        this.initialized = false;
        this.lastEmptyResultsAt = 0;
        this.setupRecoveryStrategies();
    }

    /**
     * Initialize the error recovery system
     */
    initialize() {
        if (this.initialized) return;

        if (window.debugHelper) {
            window.debugHelper.logInfo('Error Recovery', 'Initializing error recovery system');
        }

        // Set up global error handlers
        this.setupGlobalErrorHandlers();
        
        // Set up periodic health checks
        this.setupHealthChecks();

        // Set up user interaction recovery
        this.setupUserInteractionRecovery();

        this.initialized = true;

        if (window.debugHelper) {
            window.debugHelper.logInfo('Error Recovery', 'Error recovery system initialized');
        }
    }

    /**
     * Set up recovery strategies for different types of errors
     */
    setupRecoveryStrategies() {
        // Data loading failures
        this.recoveryStrategies.set('data_load_failure', {
            priority: 1,
            handler: this.recoverDataLoadFailure.bind(this),
            description: 'Recover from data loading failures'
        });

        // Search worker failures
        this.recoveryStrategies.set('search_worker_failure', {
            priority: 2,
            handler: this.recoverSearchWorkerFailure.bind(this),
            description: 'Recover from search worker failures'
        });

        // Filter failures
        this.recoveryStrategies.set('filter_failure', {
            priority: 3,
            handler: this.recoverFilterFailure.bind(this),
            description: 'Recover from filtering failures'
        });

        // DOM element failures
        this.recoveryStrategies.set('dom_element_failure', {
            priority: 4,
            handler: this.recoverDOMElementFailure.bind(this),
            description: 'Recover missing DOM elements'
        });

        // LocalStorage corruption
        this.recoveryStrategies.set('localstorage_corruption', {
            priority: 5,
            handler: this.recoverLocalStorageCorruption.bind(this),
            description: 'Recover from localStorage corruption'
        });

        // Network connectivity issues
        this.recoveryStrategies.set('network_failure', {
            priority: 6,
            handler: this.recoverNetworkFailure.bind(this),
            description: 'Recover from network connectivity issues'
        });
    }

    /**
     * Set up global error handlers
     */
    setupGlobalErrorHandlers() {
        // Handle unhandled JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleGlobalError({
                type: 'javascript_error',
                error: event.error,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError({
                type: 'unhandled_promise',
                error: event.reason
            });
        });
    }

    /**
     * Set up periodic health checks
     */
    setupHealthChecks() {
        // Check system health every 30 seconds
        setInterval(() => {
            this.performHealthCheck();
        }, 30000);

        // Initial health check after a delay
        setTimeout(() => {
            this.performHealthCheck();
        }, 5000);
    }

    /**
     * Set up user interaction recovery
     */
    setupUserInteractionRecovery() {
        // Detect user frustration (rapid clicks, no results)
        let rapidClickCount = 0;
        let lastClickTime = 0;

        document.addEventListener('click', (event) => {
            const currentTime = Date.now();
            if (currentTime - lastClickTime < 1000) {
                rapidClickCount++;
                if (rapidClickCount > 3) {
                    this.handleUserFrustration(event);
                    rapidClickCount = 0;
                }
            } else {
                rapidClickCount = 0;
            }
            lastClickTime = currentTime;
        });

        // Listen for results updates to handle empty results
        let lastEmptyResultsCheck = 0;
        window.addEventListener('cliapp:results-updated', (event) => {
            const { filteredCount } = event.detail || {};
            const now = Date.now();
            
            // Throttle empty results handling (only check every 2 seconds)
            if (filteredCount === 0 && now - lastEmptyResultsCheck > 2000) {
                lastEmptyResultsCheck = now;
                setTimeout(() => {
                    window.errorRecovery.handleEmptyResults();
                }, 100);
            }
        });
    }

    /**
     * Handle global errors and attempt recovery
     */
    async handleGlobalError(errorInfo) {
        if (window.debugHelper) {
            window.debugHelper.logError('Error Recovery', 'Global error detected', errorInfo);
        }

        // Determine recovery strategy based on error type
        let strategyKey = null;
        
        if (errorInfo.type === 'javascript_error') {
            if (errorInfo.filename && errorInfo.filename.includes('search')) {
                strategyKey = 'search_worker_failure';
            } else if (errorInfo.error && errorInfo.error.message) {
                const message = errorInfo.error.message.toLowerCase();
                if (message.includes('network') || message.includes('fetch')) {
                    strategyKey = 'network_failure';
                } else if (message.includes('localstorage')) {
                    strategyKey = 'localstorage_corruption';
                }
            }
        } else if (errorInfo.type === 'unhandled_promise') {
            strategyKey = 'data_load_failure';
        }

        if (strategyKey) {
            await this.attemptRecovery(strategyKey, errorInfo);
        }
    }

    /**
     * Perform system health check
     */
    async performHealthCheck() {
        const healthIssues = [];

        try {
            // Check data availability
            if (!window.toolsData || !Array.isArray(window.toolsData) || window.toolsData.length === 0) {
                healthIssues.push('data_load_failure');
            }

            // Check DOM elements
            const criticalElements = ['toolsGrid', 'toolSearch', 'categoryFilter'];
            for (const elementId of criticalElements) {
                if (!document.getElementById(elementId)) {
                    healthIssues.push('dom_element_failure');
                    break;
                }
            }

            // Check search functionality
            if (window.CLIApp && typeof window.CLIApp.healthCheck === 'function') {
                try {
                    const isHealthy = await window.CLIApp.healthCheck();
                    if (!isHealthy) {
                        healthIssues.push('search_worker_failure');
                    }
                } catch (error) {
                    healthIssues.push('search_worker_failure');
                }
            }

            // Check localStorage
            try {
                localStorage.setItem('health-check-test', 'test');
                localStorage.removeItem('health-check-test');
            } catch (error) {
                healthIssues.push('localstorage_corruption');
            }

            // Attempt recovery for any issues found
            for (const issue of healthIssues) {
                await this.attemptRecovery(issue, { source: 'health_check' });
            }

            if (window.debugHelper && healthIssues.length > 0) {
                window.debugHelper.logWarn('Error Recovery', 'Health check found issues', healthIssues);
            }

        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logError('Error Recovery', 'Health check failed', error);
            }
        }
    }

    /**
     * Attempt recovery using appropriate strategy
     */
    async attemptRecovery(strategyKey, context = {}) {
        const strategy = this.recoveryStrategies.get(strategyKey);
        if (!strategy) {
            if (window.debugHelper) {
                window.debugHelper.logWarn('Error Recovery', `No recovery strategy for: ${strategyKey}`);
            }
            return false;
        }

        // Check retry limits
        const attempts = this.recoveryAttempts.get(strategyKey) || 0;
        if (attempts >= this.maxRetryAttempts) {
            if (window.debugHelper) {
                window.debugHelper.logWarn('Error Recovery', `Max retry attempts reached for: ${strategyKey}`);
            }
            return false;
        }

        // Increment attempt counter
        this.recoveryAttempts.set(strategyKey, attempts + 1);

        if (window.debugHelper) {
            window.debugHelper.logInfo('Error Recovery', `Attempting recovery: ${strategyKey} (attempt ${attempts + 1})`);
        }

        try {
            const success = await strategy.handler(context);
            
            if (success) {
                // Reset attempt counter on successful recovery
                this.recoveryAttempts.delete(strategyKey);
                
                if (window.debugHelper) {
                    window.debugHelper.logInfo('Error Recovery', `Recovery successful: ${strategyKey}`);
                }
                
                // Show user notification (gated for health checks)
                const shouldNotify = context?.source !== 'health_check' || (window.debugHelper?.isDebugMode);
                if (shouldNotify) {
                    this.showRecoveryNotification(`System issue resolved: ${strategy.description}`, 'success');
                }
                return true;
            } else {
                if (window.debugHelper) {
                    window.debugHelper.logWarn('Error Recovery', `Recovery failed: ${strategyKey}`);
                }
                return false;
            }

        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logError('Error Recovery', `Recovery threw error: ${strategyKey}`, error);
            }
            return false;
        }
    }

    /**
     * Recover from data loading failures
     */
    async recoverDataLoadFailure(context) {
        try {
            // Try to reload data using different methods
            if (window.CLIApp && typeof window.CLIApp.loadData === 'function') {
                await window.CLIApp.loadData();
                return window.toolsData && Array.isArray(window.toolsData) && window.toolsData.length > 0;
            }

            // Try embedded data
            if (typeof window.EMBEDDED_CLI_DATA !== 'undefined') {
                window.toolsData = window.EMBEDDED_CLI_DATA.tools || [];
                window.categoriesData = window.EMBEDDED_CLI_DATA.categories || [];
                window.statsData = window.EMBEDDED_CLI_DATA.stats || {};
                
                // Refresh CLIApp state and UI
                if (window.CLIApp && typeof window.CLIApp.refreshAppState === 'function') {
                    await window.CLIApp.refreshAppState(window.toolsData, window.categoriesData, window.statsData);
                }
                
                return true;
            }

            return false;

        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logError('Error Recovery', 'Data load recovery failed', error);
            }
            return false;
        }
    }

    /**
     * Recover from search worker failures
     */
    async recoverSearchWorkerFailure(context) {
        try {
            // Terminate existing worker if any
            if (window.CLIApp && window.CLIApp.state && window.CLIApp.state.searchWorker) {
                try {
                    window.CLIApp.state.searchWorker.terminate();
                } catch (e) {
                    // Ignore termination errors
                }
                window.CLIApp.state.searchWorker = null;
            }

            // Initialize fallback search
            if (window.fallbackSearch && window.toolsData) {
                await window.fallbackSearch.initialize(window.toolsData);
                return window.fallbackSearch.isReady;
            }

            // Try to rebuild main thread search
            if (window.CLIApp && typeof window.CLIApp.buildSearchIndexMainThread === 'function') {
                window.CLIApp.buildSearchIndexMainThread();
                return true;
            }

            return false;

        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logError('Error Recovery', 'Search worker recovery failed', error);
            }
            return false;
        }
    }

    /**
     * Recover from filter failures
     */
    async recoverFilterFailure(context) {
        try {
            // Reset filter state
            if (window.CLIApp && window.CLIApp.state) {
                window.CLIApp.state.filters = {
                    search: '',
                    category: '',
                    difficulty: '',
                    platform: '',
                    installation: ''
                };
            }

            // Reset filter UI elements
            const filterElements = ['categoryFilter', 'difficultyFilter', 'platformFilter', 'installationFilter', 'toolSearch'];
            
            for (const elementId of filterElements) {
                const element = document.getElementById(elementId);
                if (element) {
                    if (element.type === 'text') {
                        element.value = '';
                    } else {
                        element.selectedIndex = 0;
                    }
                }
            }

            // Try to reapply filters
            if (window.CLIApp && typeof window.CLIApp.applyFilters === 'function') {
                window.CLIApp.applyFilters();
                return true;
            }

            return true; // Consider successful if we reset the state

        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logError('Error Recovery', 'Filter recovery failed', error);
            }
            return false;
        }
    }

    /**
     * Recover missing DOM elements
     */
    async recoverDOMElementFailure(context) {
        try {
            // Try to recreate critical missing elements
            const criticalElements = [
                { id: 'toolsGrid', tag: 'div', className: 'tools-grid', parent: '.tools-container' },
                { id: 'emptyState', tag: 'div', className: 'empty-state', parent: '.tools-container' },
                { id: 'toolsLoading', tag: 'div', className: 'loading', parent: '.main' }
            ];

            let recoveredCount = 0;

            for (const elementConfig of criticalElements) {
                if (!document.getElementById(elementConfig.id)) {
                    const parent = document.querySelector(elementConfig.parent);
                    if (parent) {
                        const element = document.createElement(elementConfig.tag);
                        element.id = elementConfig.id;
                        element.className = elementConfig.className;
                        parent.appendChild(element);
                        recoveredCount++;
                    }
                }
            }

            // If we recovered elements, restore UI structure and event listeners
            if (recoveredCount > 0) {
                try {
                    // Try to restore UI structure and event listeners
                    if (window.CLIApp && typeof window.CLIApp.renderTools === 'function') {
                        await window.CLIApp.renderTools([]);
                        if (window.debugHelper) {
                            window.debugHelper.logInfo('DOM Recovery', 'UI structure restored with renderTools');
                        }
                    } else if (window.CLIApp && typeof window.CLIApp.initToolsPage === 'function') {
                        await window.CLIApp.initToolsPage();
                        if (window.debugHelper) {
                            window.debugHelper.logInfo('DOM Recovery', 'UI structure restored with initToolsPage');
                        }
                    }
                    
                    // Re-cache DOM elements if available
                    if (window.CLIApp && typeof window.CLIApp.cacheElements === 'function') {
                        window.CLIApp.cacheElements();
                        if (window.debugHelper) {
                            window.debugHelper.logInfo('DOM Recovery', 'DOM elements re-cached');
                        }
                    }
                } catch (uiError) {
                    if (window.debugHelper) {
                        window.debugHelper.logWarn('DOM Recovery', 'UI restoration failed', uiError);
                    }
                }
            }

            return recoveredCount > 0;

        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logError('Error Recovery', 'DOM recovery failed', error);
            }
            return false;
        }
    }

    /**
     * Recover from localStorage corruption
     */
    async recoverLocalStorageCorruption(context) {
        try {
            // Clear corrupted localStorage items
            const appKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('cli-tools-') || key === 'theme')) {
                    appKeys.push(key);
                }
            }

            for (const key of appKeys) {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    // Ignore individual removal errors
                }
            }

            // Test localStorage functionality
            localStorage.setItem('cli-tools-recovery-test', 'success');
            const testValue = localStorage.getItem('cli-tools-recovery-test');
            localStorage.removeItem('cli-tools-recovery-test');

            return testValue === 'success';

        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logError('Error Recovery', 'localStorage recovery failed', error);
            }
            return false;
        }
    }

    /**
     * Recover from network failures
     */
    async recoverNetworkFailure(context) {
        try {
            // Check network connectivity
            if (!navigator.onLine) {
                // Wait for network to come back online
                return new Promise((resolve) => {
                    const onlineHandler = () => {
                        window.removeEventListener('online', onlineHandler);
                        resolve(true);
                    };
                    window.addEventListener('online', onlineHandler);
                    
                    // Timeout after 30 seconds
                    setTimeout(() => {
                        window.removeEventListener('online', onlineHandler);
                        resolve(false);
                    }, 30000);
                });
            }

            // Try to reload data if network is available
            if (window.CLIApp && typeof window.CLIApp.loadData === 'function') {
                await window.CLIApp.loadData();
                return true;
            }

            return true; // Network appears to be working

        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logError('Error Recovery', 'Network recovery failed', error);
            }
            return false;
        }
    }

    /**
     * Handle user frustration (rapid clicking)
     */
    handleUserFrustration(event) {
        if (window.debugHelper) {
            window.debugHelper.logWarn('Error Recovery', 'User frustration detected');
        }

        // Show helpful message
        this.showRecoveryNotification(
            'Having trouble? Try refreshing the page or enabling debug mode for more information.',
            'info',
            {
                actions: [
                    { text: 'Refresh Page', action: () => location.reload() },
                    { text: 'Reset Filters', action: () => this.attemptRecovery('filter_failure') },
                    { text: 'Enable Debug', action: () => window.enableDebug && window.enableDebug() }
                ]
            }
        );
    }

    /**
     * Handle empty search/filter results
     */
    handleEmptyResults() {
        const now = Date.now();
        if (now - this.lastEmptyResultsAt < 10000) return; // 10s throttle
        this.lastEmptyResultsAt = now;

        if (window.debugHelper) {
            window.debugHelper.logInfo('Error Recovery', 'Empty results detected');
        }

        // Check current filters state to avoid false positives
        const currentFilters = window.CLIApp?.state?.filters || {};
        const hasActiveSearch = currentFilters.search && currentFilters.search.trim().length > 0;
        const hasActiveFilters = Object.entries(currentFilters).some(([key, value]) => 
            key !== 'search' && value && value !== '' && value !== 'all'
        );

        // Only show notification if search query is empty and all filters are at defaults
        if (hasActiveSearch || hasActiveFilters) {
            if (window.debugHelper) {
                window.debugHelper.logInfo('Error Recovery', 'Empty results with active filters - no notification');
            }
            return; // Silent - user has active filters, this is expected
        }

        // Check if this might be a data or filter issue
        const hasData = window.toolsData && Array.isArray(window.toolsData) && window.toolsData.length > 0;
        
        if (!hasData) {
            this.attemptRecovery('data_load_failure', { source: 'empty_results' });
        } else {
            // Suggest filter adjustments
            this.showRecoveryNotification(
                'No results found. Try adjusting your filters or search terms.',
                'suggestion',
                {
                    actions: [
                        { text: 'Reset All Filters', action: () => this.attemptRecovery('filter_failure') },
                        { text: 'View All Tools', action: () => this.clearAllFilters() }
                    ]
                }
            );
        }
    }

    /**
     * Clear all filters and show all tools
     */
    clearAllFilters() {
        const filterElements = ['categoryFilter', 'difficultyFilter', 'platformFilter', 'installationFilter', 'toolSearch'];
        
        for (const elementId of filterElements) {
            const element = document.getElementById(elementId);
            if (element) {
                if (element.type === 'text') {
                    element.value = '';
                } else {
                    element.selectedIndex = 0;
                }
            }
        }

        // Trigger filter update
        if (window.CLIApp && typeof window.CLIApp.applyFilters === 'function') {
            window.CLIApp.applyFilters();
        }
    }

    /**
     * Show recovery notification to user
     */
    showRecoveryNotification(message, type = 'info', options = {}) {
        // Create notification element using safe DOM API
        const notification = document.createElement('div');
        notification.className = `recovery-notification recovery-${type}`;
        
        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.className = 'recovery-message';
        messageDiv.textContent = message;
        notification.appendChild(messageDiv);
        
        // Create actions container if actions are provided
        if (options.actions && Array.isArray(options.actions)) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'recovery-actions';
            
            options.actions.forEach(action => {
                const button = document.createElement('button');
                button.className = 'recovery-action-btn';
                button.textContent = action.text;
                button.setAttribute('data-action', action.text);
                actionsDiv.appendChild(button);
            });
            
            notification.appendChild(actionsDiv);
        }
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'recovery-close';
        closeButton.textContent = '×';
        notification.appendChild(closeButton);

        // Add event listeners
        if (options.actions) {
            options.actions.forEach(action => {
                const btn = notification.querySelector(`[data-action="${action.text}"]`);
                if (btn) {
                    btn.addEventListener('click', () => {
                        action.action();
                        notification.remove();
                    });
                }
            });
        }

        closeButton.addEventListener('click', () => {
            notification.remove();
        });

        // Add to page
        document.body.appendChild(notification);

        // Auto-hide after delay (unless it has actions)
        if (!options.actions) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, type === 'success' ? 3000 : 5000);
        }
    }

    /**
     * Get recovery system status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            strategiesCount: this.recoveryStrategies.size,
            activeAttempts: this.recoveryAttempts.size,
            strategies: Array.from(this.recoveryStrategies.keys())
        };
    }

    /**
     * Reset recovery attempt counters
     */
    resetAttemptCounters() {
        this.recoveryAttempts.clear();
        if (window.debugHelper) {
            window.debugHelper.logInfo('Error Recovery', 'Recovery attempt counters reset');
        }
    }
}

// Create global error recovery instance
window.errorRecovery = new ErrorRecoverySystem();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.errorRecovery.initialize();
    });
} else {
    window.errorRecovery.initialize();
}

// Expose recovery functions globally
window.attemptRecovery = (strategyKey, context) => {
    return window.errorRecovery.attemptRecovery(strategyKey, context);
};

window.forceRecovery = () => {
    window.errorRecovery.resetAttemptCounters();
    window.errorRecovery.performHealthCheck();
};