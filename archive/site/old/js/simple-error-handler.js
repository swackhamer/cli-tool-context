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
    showError(message, type = 'general', details = null) {
        // Check for file protocol specific errors
        if (type === 'file-protocol') {
            this.showFileProtocolError(message, details);
            return;
        }
        
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
        
        // Check if it's a file protocol error
        if (this.isFileProtocolError(error)) {
            return this.handleFileProtocolError(error, fallbackData);
        }
        
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
    
    /**
     * Check if error is related to file:// protocol
     */
    isFileProtocolError(error) {
        if (!error) return false;
        
        const fileProtocolPatterns = [
            /CORS/i,
            /Cross-Origin/i,
            /file:\/\//i,
            /local file/i,
            /XMLHttpRequest.*file/i,
            /Not allowed to load local resource/i,
            /Chrome blocks local file access/i
        ];
        
        const errorString = error.message || String(error);
        return window.location.protocol === 'file:' || 
               fileProtocolPatterns.some(pattern => pattern.test(errorString));
    }
    
    /**
     * Handle file protocol specific errors
     */
    handleFileProtocolError(error, fallbackData = null) {
        console.warn('File protocol error detected:', error);
        
        // Check if embedded data is available
        if (window.EMBEDDED_DATA || fallbackData) {
            console.log('Using embedded/fallback data due to file:// protocol');
            this.showError(
                'Using embedded data. For full functionality, please use a local server.',
                'file-protocol',
                {
                    suggestions: [
                        'python3 -m http.server 8000',
                        'npx serve -p 8000',
                        'Or use Firefox which allows local file access'
                    ]
                }
            );
            return fallbackData || window.EMBEDDED_DATA;
        }
        
        // No fallback available
        this.showFileProtocolError(
            'File protocol restrictions prevent data loading.',
            {
                error: error.message,
                suggestions: [
                    'Run a local server: python3 -m http.server 8000',
                    'Use Firefox instead (allows local file access)',
                    'Deploy the site to a web server'
                ]
            }
        );
        
        throw error;
    }
    
    /**
     * Show file protocol specific error with helpful guidance
     */
    showFileProtocolError(message, details = null) {
        // Use FileProtocolHelper if available
        if (window.FileProtocolHelper) {
            window.FileProtocolHelper.showWarningBanner();
            return;
        }
        
        // Create custom file protocol error display
        const existingError = document.getElementById('file-protocol-error');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.id = 'file-protocol-error';
        errorDiv.className = 'alert alert-warning file-protocol-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            max-width: 600px;
            padding: 15px;
            border-radius: 8px;
            background: #fef3c7;
            border: 1px solid #f59e0b;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        let content = `
            <div style="display: flex; align-items: start; gap: 10px;">
                <span style="font-size: 1.5rem;">⚠️</span>
                <div>
                    <strong style="display: block; margin-bottom: 5px;">File Protocol Detected</strong>
                    <p style="margin: 5px 0;">${message}</p>
        `;
        
        if (details && details.suggestions) {
            content += `
                    <p style="margin: 10px 0 5px; font-weight: 500;">Quick Fix:</p>
                    <ul style="margin: 5px 0; padding-left: 20px;">
            `;
            details.suggestions.forEach(suggestion => {
                if (suggestion.includes(':')) {
                    content += `<li><code style="background: rgba(0,0,0,0.05); padding: 2px 5px; border-radius: 3px;">${suggestion}</code></li>`;
                } else {
                    content += `<li>${suggestion}</li>`;
                }
            });
            content += `</ul>`;
        }
        
        content += `
                    <button onclick="this.closest('#file-protocol-error').remove()" 
                            style="margin-top: 10px; padding: 5px 15px; background: white; border: 1px solid #d97706; border-radius: 4px; cursor: pointer;">
                        Dismiss
                    </button>
                </div>
            </div>
        `;
        
        errorDiv.innerHTML = content;
        document.body.appendChild(errorDiv);
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (document.getElementById('file-protocol-error')) {
                errorDiv.style.transition = 'opacity 0.3s';
                errorDiv.style.opacity = '0';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 30000);
    }
}

// Initialize error handler when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.simpleErrorHandler = new SimpleErrorHandler();
        
        // Check for file protocol on initialization
        if (window.location.protocol === 'file:') {
            console.log('File protocol detected by error handler');
        }
    });
} else {
    window.simpleErrorHandler = new SimpleErrorHandler();
    
    // Check for file protocol on initialization
    if (window.location.protocol === 'file:') {
        console.log('File protocol detected by error handler');
    }
}