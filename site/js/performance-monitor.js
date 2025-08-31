/**
 * Performance Monitor for CLI Tool Context website
 * Tracks and reports performance metrics
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = [];
        this.initialized = false;
        this.reportingEnabled = false;
        this.activeTimers = new Map();
    }

    /**
     * Initialize performance monitoring
     */
    initialize(options = {}) {
        if (this.initialized) return;

        this.reportingEnabled = options.enableReporting || false;
        
        if (window.debugHelper) {
            window.debugHelper.logInfo('Performance Monitor', 'Initializing performance monitoring');
        }

        // Set up performance observers
        this.setupPerformanceObservers();
        
        // Monitor critical metrics
        this.monitorPageLoad();
        this.monitorSearchPerformance();
        this.monitorFilterPerformance();
        
        this.initialized = true;

        if (window.debugHelper) {
            window.debugHelper.logInfo('Performance Monitor', 'Performance monitoring initialized');
        }
    }

    /**
     * Set up performance observers
     */
    setupPerformanceObservers() {
        if (typeof PerformanceObserver !== 'undefined') {
            // Monitor navigation timing
            try {
                const navigationObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordMetric('navigation', entry.name, entry.duration);
                    }
                });
                navigationObserver.observe({ entryTypes: ['navigation'] });
                this.observers.push(navigationObserver);
            } catch (e) {
                console.warn('Navigation observer not supported');
            }

            // Monitor resource timing
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name.includes('.js') || entry.name.includes('.css')) {
                            this.recordMetric('resource', entry.name, entry.duration);
                        }
                    }
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
                this.observers.push(resourceObserver);
            } catch (e) {
                console.warn('Resource observer not supported');
            }
        }
    }

    /**
     * Monitor page load performance
     */
    monitorPageLoad() {
        window.addEventListener('load', () => {
            // Record page load metrics using modern PerformanceNavigationTiming
            const nav = performance.getEntriesByType('navigation')[0];
            if (nav) {
                this.recordMetric('page', 'load-time', nav.loadEventEnd - nav.startTime);
                this.recordMetric('page', 'dom-content-loaded', nav.domContentLoadedEventEnd - nav.startTime);
            }
        });
    }

    /**
     * Monitor search performance
     */
    monitorSearchPerformance() {
        // Hook into CLIApp search methods
        if (window.CLIApp && window.CLIApp.performSearch) {
            const originalSearch = window.CLIApp.performSearch.bind(window.CLIApp);
            window.CLIApp.performSearch = async (query, options) => {
                const timerId = `search-${Date.now()}`;
                this.startTimer(timerId);
                try {
                    const result = await originalSearch(query, options);
                    const duration = this.endTimer(timerId);
                    this.recordMetric('search', 'duration', duration);
                    return result;
                } catch (error) {
                    this.endTimer(timerId);
                    throw error;
                }
            };
        }
    }

    /**
     * Monitor filter performance
     */
    monitorFilterPerformance() {
        // Hook into CLIApp filter methods
        if (window.CLIApp && window.CLIApp.applyFilters) {
            const originalFilter = window.CLIApp.applyFilters.bind(window.CLIApp);
            window.CLIApp.applyFilters = () => {
                const timerId = `filter-${Date.now()}`;
                this.startTimer(timerId);
                try {
                    const result = originalFilter();
                    const duration = this.endTimer(timerId);
                    this.recordMetric('filter', 'duration', duration);
                    return result;
                } catch (error) {
                    this.endTimer(timerId);
                    throw error;
                }
            };
        }
    }

    /**
     * Start a timer for measuring duration
     */
    startTimer(timerId) {
        this.activeTimers.set(timerId, performance.now());
    }

    /**
     * End a timer and return the duration
     */
    endTimer(timerId) {
        const startTime = this.activeTimers.get(timerId);
        if (startTime === undefined) {
            console.warn(`Timer ${timerId} was not started`);
            return 0;
        }
        const duration = performance.now() - startTime;
        this.activeTimers.delete(timerId);
        return duration;
    }

    /**
     * Record a performance metric
     */
    recordMetric(category, name, value, timestamp = Date.now()) {
        const key = `${category}.${name}`;
        
        if (!this.metrics.has(key)) {
            this.metrics.set(key, []);
        }
        
        this.metrics.get(key).push({
            value,
            timestamp
        });

        if (this.reportingEnabled && window.debugHelper) {
            window.debugHelper.logInfo('Performance', `${key}: ${value}ms`);
        }
    }

    /**
     * Get performance metrics
     */
    getMetrics(category = null) {
        if (category) {
            const filteredMetrics = new Map();
            for (const [key, values] of this.metrics) {
                if (key.startsWith(category + '.')) {
                    filteredMetrics.set(key, values);
                }
            }
            return Object.fromEntries(filteredMetrics);
        }
        return Object.fromEntries(this.metrics);
    }

    /**
     * Get performance summary
     */
    getSummary() {
        const summary = {};
        
        for (const [key, values] of this.metrics) {
            const [category, name] = key.split('.');
            if (!summary[category]) {
                summary[category] = {};
            }
            
            if (values.length > 0) {
                const nums = values.map(v => v.value).filter(v => typeof v === 'number');
                if (nums.length > 0) {
                    summary[category][name] = {
                        count: nums.length,
                        avg: nums.reduce((a, b) => a + b, 0) / nums.length,
                        min: Math.min(...nums),
                        max: Math.max(...nums),
                        latest: values[values.length - 1].value
                    };
                }
            }
        }
        
        return summary;
    }

    /**
     * Clear metrics
     */
    clearMetrics() {
        this.metrics.clear();
        if (window.debugHelper) {
            window.debugHelper.logInfo('Performance Monitor', 'Metrics cleared');
        }
    }

    /**
     * Destroy performance monitor
     */
    destroy() {
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (e) {
                // Ignore errors during cleanup
            }
        });
        this.observers = [];
        this.metrics.clear();
        this.initialized = false;
    }
}

// Create global performance monitor instance
window.performanceMonitor = new PerformanceMonitor();

// Auto-initialize in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
    document.addEventListener('DOMContentLoaded', () => {
        window.performanceMonitor.initialize({ enableReporting: true });
    });
}

// Expose utility functions
window.getPerformanceMetrics = () => window.performanceMonitor.getMetrics();
window.getPerformanceSummary = () => window.performanceMonitor.getSummary();