/**
 * Browser Compatibility Module
 * Handles feature detection, polyfills, browser-specific optimizations,
 * graceful degradation, and performance adaptations
 */

class BrowserCompatibility {
    constructor() {
        this.features = new Map();
        this.browser = this.detectBrowser();
        this.performance = this.assessPerformance();
        this.checkFeatures();
        this.loadPolyfills();
    }

    /**
     * Detect browser type and version
     * @returns {Object} Browser information
     */
    detectBrowser() {
        const ua = navigator.userAgent;
        const result = {
            name: 'unknown',
            version: 'unknown',
            engine: 'unknown',
            isMobile: /Mobile|Android|iPhone|iPad/i.test(ua),
            isTablet: /iPad|Android.*Tablet/i.test(ua),
            isSafari: /^((?!chrome|android).)*safari/i.test(ua),
            isChrome: /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor),
            isFirefox: /Firefox/.test(ua),
            isEdge: /Edg/.test(ua),
            isIE: /MSIE|Trident/.test(ua),
            isOpera: /OPR/.test(ua)
        };

        // Detect specific versions
        if (result.isChrome) {
            result.name = 'Chrome';
            const match = ua.match(/Chrome\/(\d+)/);
            if (match) result.version = parseInt(match[1], 10);
            result.engine = 'Blink';
        } else if (result.isFirefox) {
            result.name = 'Firefox';
            const match = ua.match(/Firefox\/(\d+)/);
            if (match) result.version = parseInt(match[1], 10);
            result.engine = 'Gecko';
        } else if (result.isSafari) {
            result.name = 'Safari';
            const match = ua.match(/Version\/(\d+)/);
            if (match) result.version = parseInt(match[1], 10);
            result.engine = 'WebKit';
        } else if (result.isEdge) {
            result.name = 'Edge';
            const match = ua.match(/Edg\/(\d+)/);
            if (match) result.version = parseInt(match[1], 10);
            result.engine = 'Blink';
        } else if (result.isIE) {
            result.name = 'IE';
            const match = ua.match(/(?:MSIE |rv:)(\d+)/);
            if (match) result.version = parseInt(match[1], 10);
            result.engine = 'Trident';
        }

        return result;
    }

    /**
     * Check for modern JavaScript and DOM features
     */
    checkFeatures() {
        // JavaScript features
        this.features.set('promise', typeof Promise !== 'undefined');
        this.features.set('async', this.checkAsyncSupport());
        this.features.set('fetch', typeof fetch !== 'undefined');
        this.features.set('map', typeof Map !== 'undefined');
        this.features.set('set', typeof Set !== 'undefined');
        this.features.set('weakmap', typeof WeakMap !== 'undefined');
        this.features.set('weakset', typeof WeakSet !== 'undefined');
        this.features.set('symbol', typeof Symbol !== 'undefined');
        this.features.set('proxy', typeof Proxy !== 'undefined');
        this.features.set('reflect', typeof Reflect !== 'undefined');
        
        // Array methods
        this.features.set('array.includes', Array.prototype.includes !== undefined);
        this.features.set('array.find', Array.prototype.find !== undefined);
        this.features.set('array.findIndex', Array.prototype.findIndex !== undefined);
        this.features.set('array.from', Array.from !== undefined);
        
        // Object methods
        this.features.set('object.assign', Object.assign !== undefined);
        this.features.set('object.entries', Object.entries !== undefined);
        this.features.set('object.values', Object.values !== undefined);
        
        // String methods
        this.features.set('string.includes', String.prototype.includes !== undefined);
        this.features.set('string.startsWith', String.prototype.startsWith !== undefined);
        this.features.set('string.endsWith', String.prototype.endsWith !== undefined);
        this.features.set('string.padStart', String.prototype.padStart !== undefined);
        this.features.set('string.padEnd', String.prototype.padEnd !== undefined);
        
        // DOM features
        this.features.set('querySelector', document.querySelector !== undefined);
        this.features.set('classList', document.documentElement.classList !== undefined);
        this.features.set('dataset', document.documentElement.dataset !== undefined);
        this.features.set('addEventListener', window.addEventListener !== undefined);
        this.features.set('removeEventListener', window.removeEventListener !== undefined);
        
        // Advanced DOM features
        this.features.set('mutationObserver', typeof MutationObserver !== 'undefined');
        this.features.set('intersectionObserver', typeof IntersectionObserver !== 'undefined');
        this.features.set('resizeObserver', typeof ResizeObserver !== 'undefined');
        this.features.set('requestAnimationFrame', typeof requestAnimationFrame !== 'undefined');
        this.features.set('requestIdleCallback', typeof requestIdleCallback !== 'undefined');
        
        // CSS features
        this.features.set('cssGrid', this.checkCSSSupport('display', 'grid'));
        this.features.set('cssFlexbox', this.checkCSSSupport('display', 'flex'));
        this.features.set('cssCustomProperties', this.checkCSSCustomProperties());
        this.features.set('cssSticky', this.checkCSSSupport('position', 'sticky'));
        
        // Storage
        this.features.set('localStorage', typeof localStorage !== 'undefined');
        this.features.set('sessionStorage', typeof sessionStorage !== 'undefined');
        this.features.set('indexedDB', typeof indexedDB !== 'undefined');
        
        // Performance
        this.features.set('performance', typeof performance !== 'undefined');
        this.features.set('performanceObserver', typeof PerformanceObserver !== 'undefined');
        this.features.set('navigationTiming', performance && performance.timing !== undefined);
        this.features.set('resourceTiming', performance && performance.getEntriesByType !== undefined);
        this.features.set('userTiming', performance && performance.mark !== undefined);
        
        // Web Workers
        this.features.set('worker', typeof Worker !== 'undefined');
        this.features.set('sharedWorker', typeof SharedWorker !== 'undefined');
        this.features.set('serviceWorker', 'serviceWorker' in navigator);
    }

    /**
     * Check async/await support
     * @returns {boolean} Whether async/await is supported
     */
    checkAsyncSupport() {
        try {
            eval('(async function() {})');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Check CSS support
     * @param {string} property - CSS property to check
     * @param {string} value - CSS value to check
     * @returns {boolean} Whether the CSS feature is supported
     */
    checkCSSSupport(property, value) {
        const element = document.createElement('div');
        element.style[property] = value;
        return element.style[property] === value;
    }

    /**
     * Check CSS custom properties support
     * @returns {boolean} Whether CSS custom properties are supported
     */
    checkCSSCustomProperties() {
        const element = document.createElement('div');
        element.style.setProperty('--test', '1px');
        return element.style.getPropertyValue('--test') === '1px';
    }

    /**
     * Load polyfills for missing features
     */
    loadPolyfills() {
        // Array.prototype.includes polyfill
        if (!this.features.get('array.includes')) {
            Array.prototype.includes = function(searchElement, fromIndex) {
                return this.indexOf(searchElement, fromIndex) !== -1;
            };
        }

        // Array.prototype.find polyfill
        if (!this.features.get('array.find')) {
            Array.prototype.find = function(predicate) {
                if (this == null) {
                    throw new TypeError('Array.prototype.find called on null or undefined');
                }
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                const list = Object(this);
                const length = list.length >>> 0;
                const thisArg = arguments[1];
                for (let i = 0; i < length; i++) {
                    const value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return value;
                    }
                }
                return undefined;
            };
        }

        // Object.assign polyfill
        if (!this.features.get('object.assign')) {
            Object.assign = function(target) {
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                const to = Object(target);
                for (let i = 1; i < arguments.length; i++) {
                    const nextSource = arguments[i];
                    if (nextSource != null) {
                        for (const nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            };
        }

        // String.prototype.includes polyfill
        if (!this.features.get('string.includes')) {
            String.prototype.includes = function(search, start) {
                if (typeof start !== 'number') {
                    start = 0;
                }
                if (start + search.length > this.length) {
                    return false;
                }
                return this.indexOf(search, start) !== -1;
            };
        }

        // requestAnimationFrame polyfill
        if (!this.features.get('requestAnimationFrame')) {
            window.requestAnimationFrame = (function() {
                return window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame ||
                       function(callback) {
                           return window.setTimeout(callback, 1000 / 60);
                       };
            })();
            
            window.cancelAnimationFrame = (function() {
                return window.webkitCancelAnimationFrame ||
                       window.mozCancelAnimationFrame ||
                       function(id) {
                           clearTimeout(id);
                       };
            })();
        }

        // classList polyfill for IE9
        if (!this.features.get('classList')) {
            const defineClassList = function(element) {
                const classListProp = 'classList';
                const protoProp = 'prototype';
                const elemCtrProto = element[protoProp];
                const objCtr = Object;
                
                if (!objCtr.defineProperty || !elemCtrProto || elemCtrProto[classListProp]) {
                    return;
                }
                
                const classListGetter = function() {
                    const elem = this;
                    const classes = elem.className.trim().split(/\s+/);
                    
                    const classList = {
                        add: function(name) {
                            if (!this.contains(name)) {
                                classes.push(name);
                                elem.className = classes.join(' ');
                            }
                        },
                        contains: function(name) {
                            return classes.indexOf(name) !== -1;
                        },
                        remove: function(name) {
                            const index = classes.indexOf(name);
                            if (index !== -1) {
                                classes.splice(index, 1);
                                elem.className = classes.join(' ');
                            }
                        },
                        toggle: function(name) {
                            if (this.contains(name)) {
                                this.remove(name);
                            } else {
                                this.add(name);
                            }
                        }
                    };
                    
                    return classList;
                };
                
                objCtr.defineProperty(elemCtrProto, classListProp, {
                    get: classListGetter,
                    enumerable: true,
                    configurable: true
                });
            };
            
            defineClassList(Element);
        }

        // Promise polyfill (basic implementation)
        if (!this.features.get('promise')) {
            window.Promise = function(executor) {
                const self = this;
                self.status = 'pending';
                self.value = undefined;
                self.reason = undefined;
                self.callbacks = [];
                
                function resolve(value) {
                    if (self.status === 'pending') {
                        self.status = 'fulfilled';
                        self.value = value;
                        self.callbacks.forEach(callback => callback.onFulfilled(value));
                    }
                }
                
                function reject(reason) {
                    if (self.status === 'pending') {
                        self.status = 'rejected';
                        self.reason = reason;
                        self.callbacks.forEach(callback => callback.onRejected(reason));
                    }
                }
                
                try {
                    executor(resolve, reject);
                } catch (error) {
                    reject(error);
                }
            };
            
            window.Promise.prototype.then = function(onFulfilled, onRejected) {
                const self = this;
                return new Promise(function(resolve, reject) {
                    function handle() {
                        try {
                            const result = self.status === 'fulfilled' 
                                ? onFulfilled(self.value) 
                                : onRejected(self.reason);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    }
                    
                    if (self.status === 'pending') {
                        self.callbacks.push({
                            onFulfilled: function(value) {
                                handle();
                            },
                            onRejected: function(reason) {
                                handle();
                            }
                        });
                    } else {
                        setTimeout(handle, 0);
                    }
                });
            };
        }
    }

    /**
     * Assess browser performance capabilities
     * @returns {Object} Performance assessment
     */
    assessPerformance() {
        const assessment = {
            tier: 'high', // high, medium, low
            animations: true,
            complexFilters: true,
            virtualScrolling: true,
            webWorkers: false,
            recommendations: []
        };

        // Check for low-end device indicators
        const isLowEnd = 
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
            (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
            this.browser.isIE ||
            this.browser.isMobile;

        const isMedium = 
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
            (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
            this.browser.isTablet;

        if (isLowEnd) {
            assessment.tier = 'low';
            assessment.animations = false;
            assessment.complexFilters = false;
            assessment.virtualScrolling = false;
            assessment.recommendations.push('Disable animations for better performance');
            assessment.recommendations.push('Use simpler filtering strategies');
        } else if (isMedium) {
            assessment.tier = 'medium';
            assessment.virtualScrolling = true;
            assessment.recommendations.push('Use moderate animation complexity');
        }

        // Check for Web Worker support
        if (this.features.get('worker')) {
            assessment.webWorkers = true;
            assessment.recommendations.push('Web Workers available for heavy computations');
        }

        return assessment;
    }

    /**
     * Get browser-specific optimizations
     * @returns {Object} Optimization settings
     */
    getOptimizations() {
        const optimizations = {
            debounceTimings: {
                search: 300,
                filter: 150,
                resize: 100
            },
            renderBatchSize: 20,
            cacheSize: 50,
            enableVirtualScrolling: true,
            enableAnimations: true,
            enableWebWorkers: false,
            passiveEventListeners: true
        };

        // Safari-specific optimizations
        if (this.browser.isSafari) {
            optimizations.debounceTimings.search = 350; // Slightly longer debounce for Safari
            optimizations.passiveEventListeners = false; // Safari has issues with passive listeners
        }

        // Firefox-specific optimizations
        if (this.browser.isFirefox) {
            optimizations.renderBatchSize = 25; // Firefox handles larger batches well
        }

        // Chrome-specific optimizations
        if (this.browser.isChrome) {
            optimizations.enableWebWorkers = this.features.get('worker');
        }

        // IE/Edge legacy optimizations
        if (this.browser.isIE || (this.browser.isEdge && this.browser.version < 79)) {
            optimizations.debounceTimings.search = 500;
            optimizations.debounceTimings.filter = 300;
            optimizations.renderBatchSize = 10;
            optimizations.cacheSize = 25;
            optimizations.enableVirtualScrolling = false;
            optimizations.enableAnimations = false;
        }

        // Mobile optimizations
        if (this.browser.isMobile) {
            optimizations.debounceTimings.search = 400;
            optimizations.debounceTimings.filter = 200;
            optimizations.renderBatchSize = 15;
            optimizations.enableAnimations = false;
        }

        // Low-performance optimizations
        if (this.performance.tier === 'low') {
            optimizations.renderBatchSize = 10;
            optimizations.cacheSize = 25;
            optimizations.enableVirtualScrolling = false;
            optimizations.enableAnimations = false;
            optimizations.enableWebWorkers = false;
        } else if (this.performance.tier === 'medium') {
            optimizations.renderBatchSize = 15;
            optimizations.cacheSize = 35;
        }

        return optimizations;
    }

    /**
     * Apply graceful degradation for unsupported features
     */
    applyGracefulDegradation() {
        const degradations = [];

        // Disable IntersectionObserver if not supported
        if (!this.features.get('intersectionObserver')) {
            degradations.push({
                feature: 'IntersectionObserver',
                fallback: 'scroll events',
                action: () => {
                    // Use scroll events instead
                    console.log('Using scroll events instead of IntersectionObserver');
                }
            });
        }

        // Disable CSS Grid if not supported
        if (!this.features.get('cssGrid')) {
            degradations.push({
                feature: 'CSS Grid',
                fallback: 'flexbox/float layout',
                action: () => {
                    document.body.classList.add('no-grid-support');
                }
            });
        }

        // Disable advanced animations if performance is low
        if (this.performance.tier === 'low') {
            degradations.push({
                feature: 'animations',
                fallback: 'instant transitions',
                action: () => {
                    document.body.classList.add('reduce-motion');
                }
            });
        }

        return degradations;
    }

    /**
     * Check if a feature is supported
     * @param {string} feature - Feature name to check
     * @returns {boolean} Whether the feature is supported
     */
    isSupported(feature) {
        return this.features.get(feature) === true;
    }

    /**
     * Get compatibility report
     * @returns {Object} Compatibility report
     */
    getCompatibilityReport() {
        const report = {
            browser: this.browser,
            performance: this.performance,
            supportedFeatures: [],
            unsupportedFeatures: [],
            polyfillsLoaded: [],
            degradations: this.applyGracefulDegradation(),
            optimizations: this.getOptimizations()
        };

        // Categorize features
        for (const [feature, supported] of this.features.entries()) {
            if (supported) {
                report.supportedFeatures.push(feature);
            } else {
                report.unsupportedFeatures.push(feature);
                
                // Check if polyfill was loaded
                if (this.checkPolyfillLoaded(feature)) {
                    report.polyfillsLoaded.push(feature);
                }
            }
        }

        return report;
    }

    /**
     * Check if a polyfill was successfully loaded
     * @param {string} feature - Feature name
     * @returns {boolean} Whether the polyfill was loaded
     */
    checkPolyfillLoaded(feature) {
        // Re-check the feature after polyfills
        switch (feature) {
            case 'array.includes':
                return Array.prototype.includes !== undefined;
            case 'object.assign':
                return Object.assign !== undefined;
            case 'promise':
                return typeof Promise !== 'undefined';
            case 'requestAnimationFrame':
                return typeof requestAnimationFrame !== 'undefined';
            default:
                return false;
        }
    }

    /**
     * Show compatibility warning if needed
     */
    showCompatibilityWarning() {
        // Compute unsupported features locally
        const unsupported = Array.from(this.features.entries())
            .filter(([feature, supported]) => !supported)
            .map(([feature]) => feature);
        
        if (this.browser.isIE || this.browser.version < 11) {
            console.warn('Your browser is severely outdated. Some features may not work correctly.');
            
            // Show user-facing warning if element exists
            const warningElement = document.getElementById('browser-warning');
            if (warningElement) {
                warningElement.style.display = 'block';
                warningElement.innerHTML = `
                    <p>You are using an outdated browser (${this.browser.name} ${this.browser.version}). 
                    For the best experience, please upgrade to a modern browser.</p>
                `;
            }
        } else if (unsupported.length > 10) {
            console.warn('Your browser lacks support for several modern features. Performance may be impacted.');
        }
    }
}

// Initialize browser compatibility on load
const browserCompat = new BrowserCompatibility();

// Export for use in other modules
window.BrowserCompatibility = browserCompat;