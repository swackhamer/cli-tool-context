/**
 * Simple Error Handler for CLI Tool Context
 * Provides lightweight error handling without complex recovery mechanisms
 */

class SimpleErrorHandler {
    constructor() {
        this.retryAttempts = new Map();
        this.maxRetries = 2;
        this.setupGlobalHandler();
    }

    /**
     * Setup global error handler for unhandled errors
     */
    setupGlobalHandler() {
        window.addEventListener('error', (event) => {
            console.error('Unhandled error:', event.error);
            this.logError(event.error, 'global');
            
            // Only show user-facing error for critical issues
            if (this.isCriticalError(event.error)) {
                this.showError('Something went wrong. Please refresh the page.', 'general');
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError(event.reason, 'promise');
        });
    }

    /**
     * Display user-friendly error message
     */
    showError(message, type = 'general') {
        // Check if alert container exists
        const alertContainer = document.getElementById('system-alert');
        if (alertContainer) {
            const alertMessage = alertContainer.querySelector('.alert-message');
            if (alertMessage) {
                alertMessage.textContent = message;
                alertContainer.classList.remove('d-none');
                alertContainer.classList.add('show');
                
                // Auto-hide after 10 seconds for non-critical errors
                if (type !== 'critical') {
                    setTimeout(() => {
                        alertContainer.classList.remove('show');
                        setTimeout(() => alertContainer.classList.add('d-none'), 300);
                    }, 10000);
                }
            }
        } else {
            // Fallback to simple alert for pages without alert container
            console.warn('Error:', message);
            if (type === 'critical') {
                alert(message);
            }
        }
    }

    /**
     * Simple retry mechanism for data loading
     */
    async retryDataLoad(loadFunction, dataType = 'data') {
        const attemptKey = `${dataType}_load`;
        const attempts = this.retryAttempts.get(attemptKey) || 0;
        
        if (attempts >= this.maxRetries) {
            this.retryAttempts.delete(attemptKey);
            throw new Error(`Failed to load ${dataType} after ${this.maxRetries} attempts`);
        }

        try {
            this.retryAttempts.set(attemptKey, attempts + 1);
            
            // Add delay before retry (exponential backoff)
            if (attempts > 0) {
                const delay = attempts === 1 ? 1000 : 3000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            const result = await loadFunction();
            this.retryAttempts.delete(attemptKey);
            return result;
        } catch (error) {
            if (attempts + 1 >= this.maxRetries) {
                this.retryAttempts.delete(attemptKey);
                throw error;
            }
            // Retry
            return this.retryDataLoad(loadFunction, dataType);
        }
    }

    /**
     * Handle search errors with simple fallback
     */
    handleSearchError(error) {
        console.error('Search error:', error);
        this.logError(error, 'search');
        this.showError('Search is temporarily unavailable. Try again in a moment.', 'search');
        
        // Return simple fallback search function
        return {
            search: (query, items) => {
                // Basic text matching fallback
                const lowerQuery = query.toLowerCase();
                return items.filter(item => {
                    const searchText = `${item.title || ''} ${item.description || ''} ${item.category || ''}`.toLowerCase();
                    return searchText.includes(lowerQuery);
                });
            }
        };
    }

    /**
     * Handle filter errors with reset
     */
    handleFilterError(error) {
        console.error('Filter error:', error);
        this.logError(error, 'filter');
        this.showError('Filters are not working properly. Please reset and try again.', 'filter');
        
        // Return reset action
        return {
            reset: () => {
                // Clear all filter selections
                const filterInputs = document.querySelectorAll('input[type="checkbox"]:checked, select');
                filterInputs.forEach(input => {
                    if (input.type === 'checkbox') {
                        input.checked = false;
                    } else if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    }
                });
                
                // Trigger filter update
                const event = new Event('change', { bubbles: true });
                document.querySelector('.filters-section')?.dispatchEvent(event);
            }
        };
    }

    /**
     * Handle data loading errors
     */
    async handleDataLoadError(error, fallbackData = null) {
        console.error('Data load error:', error);
        this.logError(error, 'data-load');
        
        if (fallbackData) {
            console.log('Using fallback data');
            this.showError('Using cached data. Some features may be limited.', 'data');
            return fallbackData;
        }
        
        this.showError('Unable to load data. Please refresh the page.', 'critical');
        throw error;
    }

    /**
     * Simple error logging
     */
    logError(error, context = 'unknown') {
        const errorInfo = {
            message: error?.message || String(error),
            stack: error?.stack,
            context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.error('Error logged:', errorInfo);
        
        // Store in sessionStorage for debugging (limited to last 10 errors)
        try {
            const errors = JSON.parse(sessionStorage.getItem('error_log') || '[]');
            errors.unshift(errorInfo);
            if (errors.length > 10) errors.length = 10;
            sessionStorage.setItem('error_log', JSON.stringify(errors));
        } catch (e) {
            // Ignore storage errors
        }
    }

    /**
     * Check if error is critical
     */
    isCriticalError(error) {
        if (!error) return false;
        
        const criticalPatterns = [
            /Cannot read prop/i,
            /undefined is not/i,
            /null is not/i,
            /Maximum call stack/i,
            /out of memory/i
        ];
        
        const errorString = error.message || String(error);
        return criticalPatterns.some(pattern => pattern.test(errorString));
    }

    /**
     * Get error logs for debugging
     */
    getErrorLogs() {
        try {
            return JSON.parse(sessionStorage.getItem('error_log') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Clear error logs
     */
    clearErrorLogs() {
        try {
            sessionStorage.removeItem('error_log');
        } catch {
            // Ignore storage errors
        }
    }
}

// Initialize error handler when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.simpleErrorHandler = new SimpleErrorHandler();
    });
} else {
    window.simpleErrorHandler = new SimpleErrorHandler();
}