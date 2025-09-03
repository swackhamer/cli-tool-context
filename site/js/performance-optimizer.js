/**
 * Performance Optimizer Module
 * Handles debounced operations, efficient data structures, optimized rendering,
 * memory management, performance monitoring, and browser optimizations
 */

class DebouncedFilterManager {
    constructor() {
        this.timers = new Map();
        this.pendingOperations = new Map();
        this.operationDelays = {
            search: 300,    // 300ms for search operations
            filter: 150,    // 150ms for filter operations
            default: 200    // Default delay
        };
    }

    /**
     * Queue a debounced operation
     * @param {string} operationId - Unique identifier for the operation
     * @param {Function} operation - The operation to execute
     * @param {string} type - Type of operation ('search', 'filter', 'default')
     */
    queue(operationId, operation, type = 'default') {
        // Cancel previous operation if exists
        if (this.timers.has(operationId)) {
            clearTimeout(this.timers.get(operationId));
        }

        const delay = this.operationDelays[type] || this.operationDelays.default;
        
        const timer = setTimeout(() => {
            this.timers.delete(operationId);
            this.pendingOperations.delete(operationId);
            operation();
        }, delay);

        this.timers.set(operationId, timer);
        this.pendingOperations.set(operationId, operation);
    }

    /**
     * Cancel a pending operation
     * @param {string} operationId - Unique identifier for the operation
     */
    cancel(operationId) {
        if (this.timers.has(operationId)) {
            clearTimeout(this.timers.get(operationId));
            this.timers.delete(operationId);
            this.pendingOperations.delete(operationId);
        }
    }

    /**
     * Cancel all pending operations
     */
    cancelAll() {
        for (const timer of this.timers.values()) {
            clearTimeout(timer);
        }
        this.timers.clear();
        this.pendingOperations.clear();
    }

    /**
     * Execute operation immediately, cancelling any pending
     * @param {string} operationId - Unique identifier for the operation
     * @param {Function} operation - The operation to execute
     */
    executeNow(operationId, operation) {
        this.cancel(operationId);
        operation();
    }
}

class FilterIndex {
    constructor() {
        this.indexes = new Map();
        this.cacheEnabled = true;
        this.cacheSize = 0;
        this.maxCacheSize = 50; // Max 50 cached filter results
        this.ttl = 5000; // 5 second TTL for cached results
        this.timestamps = new Map();
    }

    /**
     * Build indexes for efficient filtering
     * @param {Array} tools - Array of tool objects
     */
    buildIndexes(tools) {
        // Clear existing indexes
        this.indexes.clear();
        
        // Build category index
        const categoryIndex = new Map();
        const platformIndex = new Map();
        const installationIndex = new Map();
        const difficultyIndex = new Map();
        
        tools.forEach((tool, index) => {
            // Category index
            if (tool.category) {
                if (!categoryIndex.has(tool.category)) {
                    categoryIndex.set(tool.category, new Set());
                }
                categoryIndex.get(tool.category).add(index);
            }
            
            // Platform index
            if (tool.platform && Array.isArray(tool.platform)) {
                tool.platform.forEach(platform => {
                    const normalizedPlatform = platform.toLowerCase();
                    if (!platformIndex.has(normalizedPlatform)) {
                        platformIndex.set(normalizedPlatform, new Set());
                    }
                    platformIndex.get(normalizedPlatform).add(index);
                });
            }
            
            // Installation index
            if (tool.installation && Array.isArray(tool.installation)) {
                tool.installation.forEach(method => {
                    const normalizedMethod = method.toLowerCase();
                    if (!installationIndex.has(normalizedMethod)) {
                        installationIndex.set(normalizedMethod, new Set());
                    }
                    installationIndex.get(normalizedMethod).add(index);
                });
            }
            
            // Difficulty index
            if (tool.difficulty) {
                if (!difficultyIndex.has(tool.difficulty)) {
                    difficultyIndex.set(tool.difficulty, new Set());
                }
                difficultyIndex.get(tool.difficulty).add(index);
            }
        });
        
        this.indexes.set('category', categoryIndex);
        this.indexes.set('platform', platformIndex);
        this.indexes.set('installation', installationIndex);
        this.indexes.set('difficulty', difficultyIndex);
    }

    /**
     * Get tools by category
     * @param {string} category - Category to filter by
     * @returns {Set} Set of tool indexes
     */
    getByCategory(category) {
        const categoryIndex = this.indexes.get('category');
        return categoryIndex ? categoryIndex.get(category) || new Set() : new Set();
    }

    /**
     * Get tools by platform
     * @param {string} platform - Platform to filter by
     * @returns {Set} Set of tool indexes
     */
    getByPlatform(platform) {
        const platformIndex = this.indexes.get('platform');
        const normalizedPlatform = platform.toLowerCase();
        return platformIndex ? platformIndex.get(normalizedPlatform) || new Set() : new Set();
    }

    /**
     * Get tools by installation method
     * @param {string} method - Installation method to filter by
     * @returns {Set} Set of tool indexes
     */
    getByInstallation(method) {
        const installationIndex = this.indexes.get('installation');
        const normalizedMethod = method.toLowerCase();
        return installationIndex ? installationIndex.get(normalizedMethod) || new Set() : new Set();
    }

    /**
     * Get tools by difficulty
     * @param {number} minDifficulty - Minimum difficulty
     * @param {number} maxDifficulty - Maximum difficulty
     * @returns {Set} Set of tool indexes
     */
    getByDifficulty(minDifficulty, maxDifficulty) {
        const difficultyIndex = this.indexes.get('difficulty');
        const result = new Set();
        
        if (difficultyIndex) {
            for (let i = minDifficulty; i <= maxDifficulty; i++) {
                const tools = difficultyIndex.get(i);
                if (tools) {
                    for (const toolIndex of tools) {
                        result.add(toolIndex);
                    }
                }
            }
        }
        
        return result;
    }

    /**
     * Cache filter results with TTL
     * @param {string} cacheKey - Unique key for the cache entry
     * @param {Set} result - Filter result to cache
     */
    cacheResult(cacheKey, result) {
        if (!this.cacheEnabled) return;
        
        // Manage cache size
        if (this.cacheSize >= this.maxCacheSize) {
            this.evictOldest();
        }
        
        this.indexes.set(cacheKey, result);
        this.timestamps.set(cacheKey, Date.now());
        this.cacheSize++;
    }

    /**
     * Get cached result if valid
     * @param {string} cacheKey - Unique key for the cache entry
     * @returns {Set|null} Cached result or null if expired/not found
     */
    getCachedResult(cacheKey) {
        if (!this.cacheEnabled) return null;
        
        const timestamp = this.timestamps.get(cacheKey);
        if (!timestamp) return null;
        
        if (Date.now() - timestamp > this.ttl) {
            // Cache expired
            this.indexes.delete(cacheKey);
            this.timestamps.delete(cacheKey);
            this.cacheSize--;
            return null;
        }
        
        return this.indexes.get(cacheKey);
    }

    /**
     * Evict oldest cache entry
     */
    evictOldest() {
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, time] of this.timestamps.entries()) {
            if (time < oldestTime) {
                oldestTime = time;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.indexes.delete(oldestKey);
            this.timestamps.delete(oldestKey);
            this.cacheSize--;
        }
    }

    /**
     * Clear all caches
     */
    clearCache() {
        for (const key of this.timestamps.keys()) {
            this.indexes.delete(key);
        }
        this.timestamps.clear();
        this.cacheSize = 0;
    }
}

class VirtualRenderer {
    constructor() {
        this.renderQueue = [];
        this.isRendering = false;
        this.frameId = null;
        this.recycledElements = [];
        this.maxRecycledElements = 50;
        this.batchSize = 20; // Render 20 items per frame
    }

    /**
     * Queue items for rendering
     * @param {Array} items - Items to render
     * @param {HTMLElement} container - Container element
     * @param {Function} renderFunction - Function to render each item
     */
    queueRender(items, container, renderFunction) {
        this.renderQueue.push({ items, container, renderFunction });
        
        if (!this.isRendering) {
            this.startRendering();
        }
    }

    /**
     * Start the rendering process
     */
    startRendering() {
        if (this.isRendering || this.renderQueue.length === 0) return;
        
        this.isRendering = true;
        this.frameId = requestAnimationFrame(() => this.renderBatch());
    }

    /**
     * Render a batch of items
     */
    renderBatch() {
        if (this.renderQueue.length === 0) {
            this.isRendering = false;
            return;
        }
        
        const task = this.renderQueue[0];
        const fragment = document.createDocumentFragment();
        const itemsToRender = task.items.splice(0, this.batchSize);
        
        itemsToRender.forEach(item => {
            const element = this.getOrCreateElement(task.renderFunction, item);
            fragment.appendChild(element);
        });
        
        task.container.appendChild(fragment);
        
        // If current task is complete, remove it
        if (task.items.length === 0) {
            this.renderQueue.shift();
        }
        
        // Continue rendering
        if (this.renderQueue.length > 0) {
            this.frameId = requestAnimationFrame(() => this.renderBatch());
        } else {
            this.isRendering = false;
        }
    }

    /**
     * Get a recycled element or create a new one
     * @param {Function} renderFunction - Function to render the item
     * @param {Object} item - Item data
     * @returns {HTMLElement} Rendered element
     */
    getOrCreateElement(renderFunction, item) {
        let element = this.recycledElements.pop();
        
        if (!element) {
            element = document.createElement('div');
            element.className = 'tool-card';
        }
        
        // Update element with new data
        renderFunction(element, item);
        return element;
    }

    /**
     * Recycle elements for reuse
     * @param {NodeList|Array} elements - Elements to recycle
     */
    recycleElements(elements) {
        elements.forEach(element => {
            if (this.recycledElements.length < this.maxRecycledElements) {
                // Clear element content for reuse
                element.innerHTML = '';
                element.className = 'tool-card';
                this.recycledElements.push(element);
            }
        });
    }

    /**
     * Cancel pending render operations
     */
    cancelRendering() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        this.renderQueue = [];
        this.isRendering = false;
    }

    /**
     * Clear recycled elements
     */
    clearRecycled() {
        this.recycledElements = [];
    }
}

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.enabled = true;
        this.thresholds = {
            filterOperation: 300,  // 300ms max for filter operations
            renderOperation: 100,  // 100ms max for render operations
            searchOperation: 500   // 500ms max for search operations
        };
    }

    /**
     * Start timing an operation
     * @param {string} operationId - Unique identifier for the operation
     */
    startOperation(operationId) {
        if (!this.enabled) return;
        
        this.metrics.set(operationId, {
            startTime: performance.now(),
            endTime: null,
            duration: null,
            warnings: []
        });
    }

    /**
     * End timing an operation
     * @param {string} operationId - Unique identifier for the operation
     * @param {string} type - Type of operation for threshold checking
     */
    endOperation(operationId, type = 'filterOperation') {
        if (!this.enabled) return;
        
        const metric = this.metrics.get(operationId);
        if (!metric) return;
        
        metric.endTime = performance.now();
        metric.duration = metric.endTime - metric.startTime;
        
        // Check threshold
        const threshold = this.thresholds[type];
        if (threshold && metric.duration > threshold) {
            metric.warnings.push(`Operation exceeded threshold: ${metric.duration.toFixed(2)}ms > ${threshold}ms`);
            console.warn(`Performance warning for ${operationId}:`, metric.warnings[0]);
        }
        
        return metric;
    }

    /**
     * Get metrics for an operation
     * @param {string} operationId - Unique identifier for the operation
     * @returns {Object} Operation metrics
     */
    getMetrics(operationId) {
        return this.metrics.get(operationId);
    }

    /**
     * Get all metrics
     * @returns {Map} All metrics
     */
    getAllMetrics() {
        return new Map(this.metrics);
    }

    /**
     * Clear metrics
     */
    clearMetrics() {
        this.metrics.clear();
    }

    /**
     * Get memory usage
     * @returns {Object} Memory usage information
     */
    getMemoryUsage() {
        if (!performance.memory) {
            return { available: false };
        }
        
        return {
            available: true,
            usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
            totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
            jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
        };
    }

    /**
     * Report performance summary
     * @returns {Object} Performance summary
     */
    generateReport() {
        const report = {
            totalOperations: this.metrics.size,
            averageDuration: 0,
            slowOperations: [],
            warnings: [],
            memory: this.getMemoryUsage()
        };
        
        let totalDuration = 0;
        let operationCount = 0;
        
        for (const [id, metric] of this.metrics.entries()) {
            if (metric.duration !== null) {
                totalDuration += metric.duration;
                operationCount++;
                
                if (metric.warnings.length > 0) {
                    report.warnings.push({ id, warnings: metric.warnings });
                }
                
                if (metric.duration > 300) {
                    report.slowOperations.push({ id, duration: metric.duration });
                }
            }
        }
        
        if (operationCount > 0) {
            report.averageDuration = (totalDuration / operationCount).toFixed(2);
        }
        
        return report;
    }
}

class MemoryManager {
    constructor() {
        this.cleanupCallbacks = [];
        this.cleanupInterval = null;
        this.memoryCheckInterval = 30000; // Check every 30 seconds
        this.memoryThreshold = 100; // 100MB threshold
    }

    /**
     * Start automatic memory management
     */
    startAutoCleanup() {
        if (this.cleanupInterval) return;
        
        this.cleanupInterval = setInterval(() => {
            this.checkMemoryAndCleanup();
        }, this.memoryCheckInterval);
    }

    /**
     * Stop automatic memory management
     */
    stopAutoCleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    /**
     * Register a cleanup callback
     * @param {Function} callback - Cleanup function to call
     */
    registerCleanup(callback) {
        this.cleanupCallbacks.push(callback);
    }

    /**
     * Check memory usage and trigger cleanup if needed
     */
    checkMemoryAndCleanup() {
        if (!performance.memory) return;
        
        const usedMemoryMB = performance.memory.usedJSHeapSize / 1048576;
        
        if (usedMemoryMB > this.memoryThreshold) {
            this.performCleanup();
        }
    }

    /**
     * Perform cleanup operations
     */
    performCleanup() {
        console.log('Performing memory cleanup...');
        
        // Execute all cleanup callbacks
        this.cleanupCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Cleanup callback error:', error);
            }
        });
        
        // Suggest garbage collection (note: this is just a hint)
        if (global.gc) {
            global.gc();
        }
    }

    /**
     * Manual cleanup trigger
     */
    cleanup() {
        this.performCleanup();
    }
}

// Export the performance optimization classes
window.PerformanceOptimizer = {
    DebouncedFilterManager,
    FilterIndex,
    VirtualRenderer,
    PerformanceMonitor,
    MemoryManager
};