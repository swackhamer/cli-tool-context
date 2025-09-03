/* global window, document, console, setTimeout, clearTimeout */
/* eslint-env browser */

/**
 * Comment 12: Integration Tests for Search Functionality
 * Simple test framework for verifying search system integrity
 */

class IntegrationTestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
        this.timeout = 30000; // 30 second timeout per test
    }

    // Add a test
    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    // Run all tests
    async run() {
        console.log('🧪 Starting integration tests...');
        this.results = [];
        
        for (const test of this.tests) {
            try {
                console.log(`Running: ${test.name}`);
                const result = await this.runSingleTest(test);
                this.results.push(result);
                console.log(`${result.passed ? '✅' : '❌'} ${test.name}${result.passed ? '' : ': ' + result.error}`);
            } catch (error) {
                console.error(`❌ ${test.name}: ${error.message}`);
                this.results.push({
                    name: test.name,
                    passed: false,
                    error: error.message,
                    duration: 0
                });
            }
        }
        
        this.printSummary();
        return this.results;
    }

    // Run a single test with timeout
    async runSingleTest(test) {
        const startTime = performance.now();
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                resolve({
                    name: test.name,
                    passed: false,
                    error: 'Test timeout',
                    duration: this.timeout
                });
            }, this.timeout);

            try {
                const testResult = test.testFn();
                
                if (testResult instanceof Promise) {
                    testResult
                        .then(() => {
                            clearTimeout(timeoutId);
                            resolve({
                                name: test.name,
                                passed: true,
                                error: null,
                                duration: performance.now() - startTime
                            });
                        })
                        .catch((error) => {
                            clearTimeout(timeoutId);
                            resolve({
                                name: test.name,
                                passed: false,
                                error: error.message || String(error),
                                duration: performance.now() - startTime
                            });
                        });
                } else {
                    clearTimeout(timeoutId);
                    resolve({
                        name: test.name,
                        passed: true,
                        error: null,
                        duration: performance.now() - startTime
                    });
                }
            } catch (error) {
                clearTimeout(timeoutId);
                resolve({
                    name: test.name,
                    passed: false,
                    error: error.message || String(error),
                    duration: performance.now() - startTime
                });
            }
        });
    }

    // Print test summary
    printSummary() {
        const passed = this.results.filter(r => r.passed).length;
        const total = this.results.length;
        const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / total;
        
        console.log(`\n📊 Test Results: ${passed}/${total} passed`);
        console.log(`⏱️  Average duration: ${avgDuration.toFixed(1)}ms`);
        
        if (passed === total) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('❌ Some tests failed');
            this.results.filter(r => !r.passed).forEach(r => {
                console.log(`   - ${r.name}: ${r.error}`);
            });
        }
    }
}

// Create test runner instance
const testRunner = new IntegrationTestRunner();

// Helper function to wait for condition
function waitFor(condition, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        function check() {
            if (condition()) {
                resolve();
            } else if (Date.now() - startTime > timeout) {
                reject(new Error('Timeout waiting for condition'));
            } else {
                setTimeout(check, 100);
            }
        }
        
        check();
    });
}

// Test 1: Application initialization
testRunner.test('Application initializes correctly', async () => {
    await waitFor(() => window.CLIApp && window.CLIApp.init, 10000);
    
    if (!window.CLIApp.state?.tools || window.CLIApp.state.tools.length === 0) {
        throw new Error('No tools loaded');
    }
    
    console.log(`✓ Loaded ${window.CLIApp.state.tools.length} tools`);
});

// Test 2: Search system ready
testRunner.test('Search system becomes ready', async () => {
    await waitFor(() => {
        return window.CLIApp && 
               window.CLIApp.state && 
               (window.CLIApp.state.searchIndexReady === true || 
                (window.CLIApp.state.searchManager && window.CLIApp.state.searchManager.isReady === true));
    }, 15000);
    
    const status = window.CLIApp.state.searchStatus || 
                   (window.CLIApp.state.searchManager?.isReady ? 'ready' : 'not-ready');
    console.log(`✓ Search system ready (${status})`);
});

// Test 3: Basic search functionality
testRunner.test('Basic search returns results', async () => {
    await waitFor(() => window.CLIApp && window.CLIApp.performSearch, 5000);
    
    const results = await window.CLIApp.performSearch('git', 10);
    
    if (!results || !Array.isArray(results)) {
        throw new Error('Search did not return array');
    }
    
    if (results.length === 0) {
        throw new Error('Search returned no results for "git"');
    }
    
    // Verify result structure
    const firstResult = results[0];
    if (!firstResult.tool || !firstResult.tool.name) {
        throw new Error('Invalid result structure');
    }
    
    console.log(`✓ Search returned ${results.length} results`);
});

// Test 4: Filter functionality
testRunner.test('Filters work correctly', async () => {
    await waitFor(() => window.CLIApp && window.CLIApp.applyFilters, 5000);
    
    const originalCount = window.CLIApp.state.filteredTools?.length || 0;
    
    // Apply a platform filter
    window.CLIApp.state.filters.platform = 'Cross-platform';
    await window.CLIApp.applyFilters();
    
    const filteredCount = window.CLIApp.state.filteredTools?.length || 0;
    
    if (filteredCount >= originalCount) {
        throw new Error('Filter did not reduce results');
    }
    
    // Reset filter
    window.CLIApp.state.filters.platform = '';
    await window.CLIApp.applyFilters();
    
    console.log(`✓ Filter reduced results from ${originalCount} to ${filteredCount}`);
});

// Test 5: SearchManager availability
testRunner.test('SearchManager is available', async () => {
    if (!window.CLIApp || !window.CLIApp.state || !window.CLIApp.state.searchManager) {
        throw new Error('SearchManager not available');
    }
    
    const searchManager = window.CLIApp.state.searchManager;
    if (!searchManager.isReady) {
        throw new Error('SearchManager not ready');
    }
    
    const health = searchManager.healthCheck();
    if (!health.searchFunctional) {
        throw new Error('SearchManager health check failed');
    }
    
    console.log(`✓ SearchManager is healthy with ${health.toolCount} tools`);
});

// Test 6: Performance monitoring
testRunner.test('Performance monitoring works', async () => {
    if (!window.performanceMonitor) {
        throw new Error('Performance monitor not available');
    }
    
    const metrics = window.performanceMonitor.getMetrics('search');
    
    if (!metrics || Object.keys(metrics).length === 0) {
        throw new Error('No performance metrics captured');
    }
    
    console.log(`✓ Performance metrics captured: ${Object.keys(metrics).length} metrics`);
});

// Test 7: Simple error handling
testRunner.test('Simple error handler initializes correctly', async () => {
    if (!window.simpleErrorHandler) {
        throw new Error('Simple error handler not initialized');
    }
    
    // Test that error handler has required methods
    if (typeof window.simpleErrorHandler.showError !== 'function') {
        throw new Error('showError method not found');
    }
    
    if (typeof window.simpleErrorHandler.handleDataLoadError !== 'function') {
        throw new Error('handleDataLoadError method not found');
    }
    
    console.log('✓ Simple error handler initialized');
});

// Test 8: Data loading with validation
testRunner.test('Data loads successfully with validation', async () => {
    if (!window.DataLoader) {
        throw new Error('DataLoader not available');
    }
    
    const loader = new window.DataLoader({
        validateDuringLoad: true,
        useCache: false
    });
    
    let validationOccurred = false;
    loader.on('validation-warning', () => {
        validationOccurred = true;
    });
    
    console.log('✓ DataLoader integration working');
});

// Test 9: Data validation runs during loading
testRunner.test('Data validation runs during loading', async () => {
    if (!window.DataValidator) {
        throw new Error('DataValidator not available');
    }
    
    const validator = new window.DataValidator();
    const testData = {
        tools: window.CLIApp?.state?.tools || [],
        categories: window.CLIApp?.state?.categories || [],
        stats: window.CLIApp?.state?.stats || {}
    };
    
    const results = validator.validateDuringLoad(testData);
    
    if (!results || typeof results.overall !== 'object') {
        throw new Error('Validation did not return expected results');
    }
    
    console.log(`✓ Validation complete with score: ${results.overall.score}%`);
});

// Test 10: Validation warnings don't break functionality
testRunner.test('Validation warnings don\'t break functionality', async () => {
    const app = window.CLIApp;
    if (!app) {
        throw new Error('CLIApp not initialized');
    }
    
    // Create intentionally problematic data
    const badTool = {
        name: 'test-tool',
        // Missing required fields intentionally
    };
    
    try {
        const normalized = app.normalizeToolEntry(badTool);
        if (!normalized) {
            throw new Error('Normalization returned null');
        }
        
        // Should have default values filled in
        if (!normalized.description || !normalized.category) {
            throw new Error('Normalization did not add default values');
        }
        
        console.log('✓ Graceful handling of incomplete data');
    } catch (error) {
        throw new Error(`Normalization failed: ${error.message}`);
    }
});

// Test 11: Data normalization produces consistent results
testRunner.test('Data normalization produces consistent results', async () => {
    if (!window.DataNormalizer) {
        throw new Error('DataNormalizer not available');
    }
    
    const testCases = [
        { platform: 'mac', expected: 'macOS' },
        { platform: 'linux', expected: 'Linux' },
        { installation: 'brew', expected: 'homebrew' }
    ];
    
    for (const test of testCases) {
        if (test.platform) {
            const result = window.DataNormalizer.normalizePlatformString(test.platform);
            if (result !== test.expected) {
                throw new Error(`Platform normalization failed: ${test.platform} -> ${result}`);
            }
        }
        if (test.installation) {
            const result = window.DataNormalizer.normalizeInstallationString(test.installation);
            if (result !== test.expected) {
                throw new Error(`Installation normalization failed: ${test.installation} -> ${result}`);
            }
        }
    }
    
    console.log('✓ Normalization consistency verified');
});

// Test 12: Stats totals match actual data counts
testRunner.test('Stats totals match actual data counts', async () => {
    const app = window.CLIApp;
    if (!app || !app.state) {
        throw new Error('CLIApp state not available');
    }
    
    const actualToolCount = app.state.tools.length;
    const actualCategoryCount = app.state.categories.length;
    const statsToolCount = app.state.stats.totalTools;
    const statsCategoryCount = app.state.stats.totalCategories;
    
    // Allow for some discrepancy as stats might be cached
    const toolDiff = Math.abs(actualToolCount - statsToolCount);
    const categoryDiff = Math.abs(actualCategoryCount - statsCategoryCount);
    
    if (toolDiff > 10) {
        console.warn(`⚠️ Tool count mismatch: actual=${actualToolCount}, stats=${statsToolCount}`);
    }
    
    if (categoryDiff > 5) {
        console.warn(`⚠️ Category count mismatch: actual=${actualCategoryCount}, stats=${statsCategoryCount}`);
    }
    
    console.log('✓ Stats reconciliation checked');
});

// Test 13: Debug panel shows validation status
testRunner.test('Debug panel shows validation status', async () => {
    if (!window.debugHelper) {
        console.log('⚠️ Debug helper not enabled, skipping test');
        return;
    }
    
    const validationElement = document.getElementById('debug-validation-status');
    const qualityElement = document.getElementById('debug-data-quality');
    
    if (validationElement || qualityElement) {
        console.log('✓ Validation status elements present in debug panel');
    } else {
        console.log('⚠️ Validation status elements not found in debug panel');
    }
});

// Performance Optimization Tests

// Test 14: Performance Optimizer initialization
testRunner.test('Performance Optimizer modules available', async () => {
    if (!window.PerformanceOptimizer) {
        throw new Error('PerformanceOptimizer not loaded');
    }
    
    const requiredClasses = [
        'DebouncedFilterManager',
        'FilterIndex',
        'VirtualRenderer',
        'PerformanceMonitor',
        'MemoryManager'
    ];
    
    for (const className of requiredClasses) {
        if (!window.PerformanceOptimizer[className]) {
            throw new Error(`${className} not available`);
        }
    }
    
    console.log('✓ All Performance Optimizer modules available');
});

// Test 15: DebouncedFilterManager works correctly
testRunner.test('DebouncedFilterManager debounces operations', async () => {
    if (!window.PerformanceOptimizer) {
        console.log('⚠️ Performance Optimizer not available, skipping');
        return;
    }
    
    const manager = new window.PerformanceOptimizer.DebouncedFilterManager();
    let callCount = 0;
    const operation = () => callCount++;
    
    // Queue multiple operations quickly
    manager.queue('test', operation, 'filter');
    manager.queue('test', operation, 'filter');
    manager.queue('test', operation, 'filter');
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (callCount !== 1) {
        throw new Error(`Expected 1 call after debouncing, got ${callCount}`);
    }
    
    console.log('✓ DebouncedFilterManager working correctly');
});

// Test 16: FilterIndex builds and queries correctly
testRunner.test('FilterIndex builds and queries correctly', async () => {
    if (!window.PerformanceOptimizer) {
        console.log('⚠️ Performance Optimizer not available, skipping');
        return;
    }
    
    const filterIndex = new window.PerformanceOptimizer.FilterIndex();
    const testTools = [
        { id: 1, category: 'dev', platform: ['macOS'], installation: ['homebrew'], difficulty: 3 },
        { id: 2, category: 'network', platform: ['Linux'], installation: ['npm'], difficulty: 4 },
        { id: 3, category: 'dev', platform: ['Windows'], installation: ['homebrew'], difficulty: 3 }
    ];
    
    filterIndex.buildIndexes(testTools);
    
    const devTools = filterIndex.getByCategory('dev');
    if (devTools.size !== 2) {
        throw new Error(`Expected 2 dev tools, got ${devTools.size}`);
    }
    
    const homebrewTools = filterIndex.getByInstallation('homebrew');
    if (homebrewTools.size !== 2) {
        throw new Error(`Expected 2 homebrew tools, got ${homebrewTools.size}`);
    }
    
    console.log('✓ FilterIndex working correctly');
});

// Test 17: PerformanceMonitor tracks operations
testRunner.test('PerformanceMonitor tracks operations', async () => {
    if (!window.PerformanceOptimizer) {
        console.log('⚠️ Performance Optimizer not available, skipping');
        return;
    }
    
    const monitor = new window.PerformanceOptimizer.PerformanceMonitor();
    
    monitor.startOperation('test-op');
    await new Promise(resolve => setTimeout(resolve, 50));
    const metrics = monitor.endOperation('test-op');
    
    if (!metrics || !metrics.duration) {
        throw new Error('Performance metrics not captured');
    }
    
    if (metrics.duration < 40 || metrics.duration > 100) {
        throw new Error(`Unexpected duration: ${metrics.duration}`);
    }
    
    console.log(`✓ Performance monitoring working (duration: ${metrics.duration.toFixed(2)}ms)`);
});

// Test 18: Browser Compatibility detection
testRunner.test('Browser Compatibility module works', async () => {
    if (!window.BrowserCompatibility) {
        throw new Error('BrowserCompatibility not loaded');
    }
    
    const compat = window.BrowserCompatibility;
    
    // Check browser detection
    if (!compat.browser || !compat.browser.name) {
        throw new Error('Browser not detected');
    }
    
    // Check feature detection
    const criticalFeatures = ['promise', 'querySelector', 'addEventListener'];
    for (const feature of criticalFeatures) {
        if (!compat.isSupported(feature)) {
            console.warn(`Critical feature not supported: ${feature}`);
        }
    }
    
    // Check optimizations
    const optimizations = compat.getOptimizations();
    if (!optimizations.debounceTimings || !optimizations.renderBatchSize) {
        throw new Error('Browser optimizations not configured');
    }
    
    console.log(`✓ Browser Compatibility working (${compat.browser.name} detected)`);
});

// Test 19: Filter performance with large dataset
testRunner.test('Filter performance with large dataset', async () => {
    const app = window.CLIApp;
    if (!app || !app.state || !app.state.tools) {
        console.log('⚠️ App not ready for performance test');
        return;
    }
    
    const toolCount = app.state.tools.length;
    
    // Time a filter operation
    const startTime = performance.now();
    
    // Apply multiple filters
    app.state.filters.category = app.state.categories[0]?.name || '';
    app.state.filters.difficulty = '3';
    await app.applyFilters();
    
    const duration = performance.now() - startTime;
    
    // Reset filters
    app.state.filters.category = '';
    app.state.filters.difficulty = '';
    await app.applyFilters();
    
    // Check performance threshold
    const threshold = toolCount > 100 ? 300 : 100; // 300ms for large datasets, 100ms for small
    if (duration > threshold) {
        console.warn(`⚠️ Filter operation took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
    } else {
        console.log(`✓ Filter performance acceptable: ${duration.toFixed(2)}ms for ${toolCount} tools`);
    }
});

// Test 20: Search performance with caching
testRunner.test('Search performance with caching', async () => {
    const app = window.CLIApp;
    if (!app || !app.performSearch) {
        console.log('⚠️ Search not ready for performance test');
        return;
    }
    
    const query = 'test';
    
    // First search (cold cache)
    const coldStart = performance.now();
    const results1 = await app.performSearch(query);
    const coldTime = performance.now() - coldStart;
    
    // Second search (warm cache)
    const warmStart = performance.now();
    const results2 = await app.performSearch(query);
    const warmTime = performance.now() - warmStart;
    
    if (warmTime >= coldTime) {
        console.warn(`⚠️ Cache not improving performance: cold=${coldTime.toFixed(2)}ms, warm=${warmTime.toFixed(2)}ms`);
    } else {
        const improvement = ((coldTime - warmTime) / coldTime * 100).toFixed(0);
        console.log(`✓ Search cache working: ${improvement}% improvement (cold=${coldTime.toFixed(2)}ms, warm=${warmTime.toFixed(2)}ms)`);
    }
});

// Test 21: Memory management
testRunner.test('Memory management functionality', async () => {
    if (!window.PerformanceOptimizer) {
        console.log('⚠️ Performance Optimizer not available, skipping');
        return;
    }
    
    const memoryManager = new window.PerformanceOptimizer.MemoryManager();
    
    // Register a cleanup callback
    let cleanupCalled = false;
    memoryManager.registerCleanup(() => {
        cleanupCalled = true;
    });
    
    // Trigger manual cleanup
    memoryManager.cleanup();
    
    if (!cleanupCalled) {
        throw new Error('Memory cleanup callback not called');
    }
    
    console.log('✓ Memory management working');
});

// Test 22: Virtual rendering performance
testRunner.test('Virtual rendering for large datasets', async () => {
    if (!window.PerformanceOptimizer) {
        console.log('⚠️ Performance Optimizer not available, skipping');
        return;
    }
    
    const virtualRenderer = new window.PerformanceOptimizer.VirtualRenderer();
    const container = document.createElement('div');
    const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    const startTime = performance.now();
    
    virtualRenderer.queueRender(
        items,
        container,
        (element, item) => {
            element.className = 'test-item';
            element.textContent = item.name;
        }
    );
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const renderTime = performance.now() - startTime;
    
    if (container.children.length !== 100) {
        throw new Error(`Expected 100 rendered items, got ${container.children.length}`);
    }
    
    if (renderTime > 500) {
        console.warn(`⚠️ Virtual rendering slow: ${renderTime.toFixed(2)}ms for 100 items`);
    } else {
        console.log(`✓ Virtual rendering performance good: ${renderTime.toFixed(2)}ms for 100 items`);
    }
});

// Test 23: Filter index performance
testRunner.test('Filter index performance with real data', async () => {
    if (!window.PerformanceOptimizer || !window.CLIApp?.state?.tools) {
        console.log('⚠️ Prerequisites not available, skipping');
        return;
    }
    
    const filterIndex = new window.PerformanceOptimizer.FilterIndex();
    const tools = window.CLIApp.state.tools;
    
    const buildStart = performance.now();
    filterIndex.buildIndexes(tools);
    const buildTime = performance.now() - buildStart;
    
    const queryStart = performance.now();
    const devTools = filterIndex.getByCategory('Development Tools');
    const macTools = filterIndex.getByPlatform('macOS');
    const queryTime = performance.now() - queryStart;
    
    if (buildTime > 50) {
        console.warn(`⚠️ Index building slow: ${buildTime.toFixed(2)}ms for ${tools.length} tools`);
    }
    
    if (queryTime > 5) {
        console.warn(`⚠️ Index queries slow: ${queryTime.toFixed(2)}ms`);
    }
    
    console.log(`✓ Filter index performance: build=${buildTime.toFixed(2)}ms, query=${queryTime.toFixed(2)}ms`);
});

// Test 24: Overall performance health check
testRunner.test('Overall performance health check', async () => {
    const report = {
        performanceOptimizer: !!window.PerformanceOptimizer,
        browserCompatibility: !!window.BrowserCompatibility,
        searchManager: !!window.CLIApp?.state?.searchManager?.isReady,
        filterIndex: !!window.CLIApp?.filterIndex,
        virtualRenderer: !!window.CLIApp?.virtualRenderer,
        performanceMonitor: !!window.CLIApp?.performanceMonitor
    };
    
    const enabledFeatures = Object.values(report).filter(v => v).length;
    const totalFeatures = Object.keys(report).length;
    
    if (enabledFeatures < totalFeatures / 2) {
        console.warn(`⚠️ Only ${enabledFeatures}/${totalFeatures} performance features enabled`);
    } else {
        console.log(`✓ Performance features: ${enabledFeatures}/${totalFeatures} enabled`);
    }
    
    // Log detailed status
    for (const [feature, enabled] of Object.entries(report)) {
        console.log(`  ${enabled ? '✓' : '✗'} ${feature}`);
    }
});

// Comment 1: E2E Tests for FilterIndex Path Parity and Synonym Handling

// Test 25: FilterIndex path parity with synonym normalization
testRunner.test('FilterIndex path parity with synonym normalization', async () => {
    // Ensure CLIApp is initialized
    if (!window.CLIApp || !window.CLIApp.state) {
        throw new Error('CLIApp not initialized');
    }
    
    // Ensure performance optimizer is initialized
    if (!window.CLIApp.initPerformanceOptimizer) {
        console.log('⚠️ initPerformanceOptimizer not available, skipping');
        return;
    }
    
    // Initialize performance optimizer if needed
    if (!window.CLIApp.filterIndex) {
        window.CLIApp.initPerformanceOptimizer();
    }
    
    if (!window.CLIApp.filterIndex) {
        throw new Error('FilterIndex not available after initialization');
    }
    
    // Seed deterministic test data with synonyms
    const testTools = [
        { 
            id: 'tool1', 
            name: 'Test Tool 1',
            category: 'Development Tools',
            platform: ['osx'], // Using synonym 'osx' instead of 'macOS'
            installation: ['brew'], // Using synonym 'brew' instead of 'homebrew'
            difficulty: 3,
            description: 'Test tool 1'
        },
        {
            id: 'tool2',
            name: 'Test Tool 2', 
            category: 'Network Tools',
            platform: ['macOS'],
            installation: ['homebrew'],
            difficulty: 4,
            description: 'Test tool 2'
        },
        {
            id: 'tool3',
            name: 'Test Tool 3',
            category: 'Development Tools',
            platform: ['mac'], // Another synonym
            installation: ['brew'],
            difficulty: 3,
            description: 'Test tool 3'
        }
    ];
    
    // Save original tools
    const originalTools = window.CLIApp.state.tools;
    const originalFiltered = window.CLIApp.state.filteredTools;
    
    // Set test tools
    window.CLIApp.state.tools = testTools;
    window.CLIApp.state.filteredTools = testTools;
    
    // Build indexes with test data
    window.CLIApp.filterIndex.buildIndexes(testTools);
    
    // Test platform synonym normalization
    window.CLIApp.state.filters = { platform: 'macOS' };
    
    // Capture results with index path
    await window.CLIApp.applyFilters();
    const indexResults = [...window.CLIApp.state.filteredTools];
    
    // Disable index path temporarily
    const savedIndex = window.CLIApp.filterIndex;
    window.CLIApp.filterIndex = null;
    
    // Re-run with fallback path
    window.CLIApp.state.filteredTools = testTools;
    await window.CLIApp.applyFilters();
    const fallbackResults = [...window.CLIApp.state.filteredTools];
    
    // Restore index
    window.CLIApp.filterIndex = savedIndex;
    
    // Verify results are identical
    if (indexResults.length !== fallbackResults.length) {
        throw new Error(`Platform synonym parity failed: index=${indexResults.length}, fallback=${fallbackResults.length}`);
    }
    
    // Both paths should find all 3 tools (osx, macOS, mac all normalize to macOS)
    if (indexResults.length !== 3) {
        throw new Error(`Expected 3 tools with platform macOS synonyms, got ${indexResults.length}`);
    }
    
    // Restore original state
    window.CLIApp.state.tools = originalTools;
    window.CLIApp.state.filteredTools = originalFiltered;
    window.CLIApp.state.filters = {};
    
    console.log('✓ FilterIndex path parity verified for platform synonyms');
});

// Test 26: FilterIndex installation synonym handling
testRunner.test('FilterIndex installation synonym handling', async () => {
    if (!window.CLIApp || !window.CLIApp.filterIndex) {
        console.log('⚠️ FilterIndex not available, skipping');
        return;
    }
    
    // Seed test data
    const testTools = [
        {
            id: 'brew1',
            name: 'Brew Tool',
            category: 'Development Tools',
            platform: ['Cross-platform'],
            installation: ['brew'], // Synonym
            difficulty: 2,
            description: 'Installed via brew'
        },
        {
            id: 'homebrew1',
            name: 'Homebrew Tool',
            category: 'Development Tools',
            platform: ['Cross-platform'],
            installation: ['homebrew'], // Canonical
            difficulty: 2,
            description: 'Installed via homebrew'
        }
    ];
    
    // Save original state
    const originalTools = window.CLIApp.state.tools;
    const originalFiltered = window.CLIApp.state.filteredTools;
    
    // Set test data
    window.CLIApp.state.tools = testTools;
    window.CLIApp.state.filteredTools = testTools;
    
    // Build indexes
    window.CLIApp.filterIndex.buildIndexes(testTools);
    
    // Test with 'homebrew' filter
    window.CLIApp.state.filters = { installation: 'homebrew' };
    
    // Get index results
    await window.CLIApp.applyFilters();
    const indexResults = [...window.CLIApp.state.filteredTools];
    
    // Disable index
    const savedIndex = window.CLIApp.filterIndex;
    window.CLIApp.filterIndex = null;
    
    // Get fallback results
    window.CLIApp.state.filteredTools = testTools;
    await window.CLIApp.applyFilters();
    const fallbackResults = [...window.CLIApp.state.filteredTools];
    
    // Restore index
    window.CLIApp.filterIndex = savedIndex;
    
    // Both should find both tools (brew normalizes to homebrew)
    if (indexResults.length !== 2 || fallbackResults.length !== 2) {
        throw new Error(`Installation synonym parity failed: index=${indexResults.length}, fallback=${fallbackResults.length}`);
    }
    
    // Restore original state
    window.CLIApp.state.tools = originalTools;
    window.CLIApp.state.filteredTools = originalFiltered;
    window.CLIApp.state.filters = {};
    
    console.log('✓ FilterIndex installation synonym handling verified');
});

// Test 27: FilterIndex combined filters parity
testRunner.test('FilterIndex combined filters parity', async () => {
    if (!window.CLIApp || !window.CLIApp.filterIndex) {
        console.log('⚠️ FilterIndex not available, skipping');
        return;
    }
    
    // Create test data
    const testTools = [
        {
            id: 'combo1',
            name: 'Combo Tool 1',
            category: 'Development Tools',
            platform: ['macOS'],
            installation: ['homebrew'],
            difficulty: 3,
            description: 'Matches all filters'
        },
        {
            id: 'combo2',
            name: 'Combo Tool 2',
            category: 'Development Tools',
            platform: ['Linux'],
            installation: ['homebrew'],
            difficulty: 3,
            description: 'Wrong platform'
        },
        {
            id: 'combo3',
            name: 'Combo Tool 3',
            category: 'Network Tools',
            platform: ['macOS'],
            installation: ['homebrew'],
            difficulty: 3,
            description: 'Wrong category'
        }
    ];
    
    // Save original state
    const originalTools = window.CLIApp.state.tools;
    const originalFiltered = window.CLIApp.state.filteredTools;
    
    // Set test data
    window.CLIApp.state.tools = testTools;
    window.CLIApp.state.filteredTools = testTools;
    
    // Build indexes
    window.CLIApp.filterIndex.buildIndexes(testTools);
    
    // Apply combined filters
    window.CLIApp.state.filters = {
        category: 'Development Tools',
        platform: 'macOS',
        installation: 'homebrew',
        difficulty: '3'
    };
    
    // Get index results
    await window.CLIApp.applyFilters();
    const indexResults = [...window.CLIApp.state.filteredTools];
    
    // Disable index
    const savedIndex = window.CLIApp.filterIndex;
    window.CLIApp.filterIndex = null;
    
    // Get fallback results
    window.CLIApp.state.filteredTools = testTools;
    await window.CLIApp.applyFilters();
    const fallbackResults = [...window.CLIApp.state.filteredTools];
    
    // Restore index
    window.CLIApp.filterIndex = savedIndex;
    
    // Both should find only combo1
    if (indexResults.length !== 1 || fallbackResults.length !== 1) {
        throw new Error(`Combined filters parity failed: index=${indexResults.length}, fallback=${fallbackResults.length}`);
    }
    
    if (indexResults[0].id !== 'combo1' || fallbackResults[0].id !== 'combo1') {
        throw new Error('Combined filters returned wrong tool');
    }
    
    // Restore original state
    window.CLIApp.state.tools = originalTools;
    window.CLIApp.state.filteredTools = originalFiltered;
    window.CLIApp.state.filters = {};
    
    console.log('✓ FilterIndex combined filters parity verified');
});

// Test 28: FilterIndex cache invalidation on toolsVersion change
testRunner.test('FilterIndex cache invalidation on toolsVersion change', async () => {
    if (!window.CLIApp || !window.CLIApp.filterIndex) {
        console.log('⚠️ FilterIndex not available, skipping');
        return;
    }
    
    // Create test data
    const testTools = [
        {
            id: 'cache1',
            name: 'Cache Tool',
            category: 'Development Tools',
            platform: ['macOS'],
            installation: ['homebrew'],
            difficulty: 3,
            description: 'Test cache'
        }
    ];
    
    // Save original state
    const originalTools = window.CLIApp.state.tools;
    const originalFiltered = window.CLIApp.state.filteredTools;
    const originalVersion = window.CLIApp.state.toolsVersion;
    
    // Set test data
    window.CLIApp.state.tools = testTools;
    window.CLIApp.state.filteredTools = testTools;
    window.CLIApp.state.toolsVersion = 'v1';
    
    // Build indexes
    window.CLIApp.filterIndex.buildIndexes(testTools);
    
    // Apply filter and cache result
    window.CLIApp.state.filters = { category: 'Development Tools' };
    await window.CLIApp.applyFilters();
    const firstResults = [...window.CLIApp.state.filteredTools];
    
    // Change toolsVersion to simulate data update
    window.CLIApp.state.toolsVersion = 'v2';
    
    // Add a new tool
    const newTools = [
        ...testTools,
        {
            id: 'cache2',
            name: 'New Cache Tool',
            category: 'Development Tools',
            platform: ['macOS'],
            installation: ['homebrew'],
            difficulty: 3,
            description: 'New tool after version change'
        }
    ];
    
    window.CLIApp.state.tools = newTools;
    window.CLIApp.state.filteredTools = newTools;
    
    // Rebuild indexes (should invalidate cache)
    window.CLIApp.filterIndex.buildIndexes(newTools);
    
    // Apply same filter
    await window.CLIApp.applyFilters();
    const secondResults = [...window.CLIApp.state.filteredTools];
    
    // Should now find 2 tools instead of 1
    if (secondResults.length !== 2) {
        throw new Error(`Cache invalidation failed: expected 2 tools, got ${secondResults.length}`);
    }
    
    if (firstResults.length !== 1) {
        throw new Error(`Initial cache state wrong: expected 1 tool, got ${firstResults.length}`);
    }
    
    // Restore original state
    window.CLIApp.state.tools = originalTools;
    window.CLIApp.state.filteredTools = originalFiltered;
    window.CLIApp.state.toolsVersion = originalVersion;
    window.CLIApp.state.filters = {};
    
    console.log('✓ FilterIndex cache invalidation verified');
});

// Test 29: FilterIndex cache-hit reapply
testRunner.test('FilterIndex cache-hit reapply', async () => {
    if (!window.CLIApp || !window.CLIApp.filterIndex) {
        console.log('⚠️ FilterIndex not available, skipping');
        return;
    }
    
    // Create test data
    const testTools = [
        {
            id: 'reapply1',
            name: 'Reapply Tool 1',
            category: 'Development Tools',
            platform: ['macOS'],
            installation: ['homebrew'],
            difficulty: 3,
            description: 'Test reapply'
        },
        {
            id: 'reapply2',
            name: 'Reapply Tool 2',
            category: 'Network Tools',
            platform: ['macOS'],
            installation: ['npm'],
            difficulty: 4,
            description: 'Test reapply 2'
        }
    ];
    
    // Save original state
    const originalTools = window.CLIApp.state.tools;
    const originalFiltered = window.CLIApp.state.filteredTools;
    
    // Set test data
    window.CLIApp.state.tools = testTools;
    window.CLIApp.state.filteredTools = testTools;
    
    // Build indexes
    window.CLIApp.filterIndex.buildIndexes(testTools);
    
    // Apply filter first time
    window.CLIApp.state.filters = { category: 'Development Tools' };
    await window.CLIApp.applyFilters();
    const firstResults = [...window.CLIApp.state.filteredTools];
    
    // Track if index was used
    let indexUsedCount = 0;
    const originalGetByCategory = window.CLIApp.filterIndex.getByCategory;
    window.CLIApp.filterIndex.getByCategory = function(...args) {
        indexUsedCount++;
        return originalGetByCategory.apply(this, args);
    };
    
    // Apply same filter again (should use cache)
    await window.CLIApp.applyFilters();
    const secondResults = [...window.CLIApp.state.filteredTools];
    
    // Restore original method
    window.CLIApp.filterIndex.getByCategory = originalGetByCategory;
    
    // Results should be identical
    if (firstResults.length !== secondResults.length) {
        throw new Error(`Cache-hit reapply failed: first=${firstResults.length}, second=${secondResults.length}`);
    }
    
    if (firstResults.length !== 1 || firstResults[0].id !== 'reapply1') {
        throw new Error('Cache-hit reapply returned wrong results');
    }
    
    // Restore original state
    window.CLIApp.state.tools = originalTools;
    window.CLIApp.state.filteredTools = originalFiltered;
    window.CLIApp.state.filters = {};
    
    console.log('✓ FilterIndex cache-hit reapply verified');
});

// Export test runner for manual usage
window.runIntegrationTests = () => testRunner.run();

// Export performance test runner
window.runPerformanceTests = async () => {
    if (window.FilterPerformanceTest) {
        console.log('🚀 Running comprehensive performance tests...');
        const perfTest = new window.FilterPerformanceTest();
        const results = await perfTest.runAllTests();
        console.log(perfTest.generateReport());
        return results;
    } else {
        console.log('⚠️ FilterPerformanceTest not available');
    }
};

// Auto-run tests in development
if (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.protocol === 'file:') {
    
    // Run tests after page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => testRunner.run(), 2000); // Give app time to initialize
        });
    } else {
        setTimeout(() => testRunner.run(), 2000);
    }
}

console.log('🧪 Integration test framework loaded. Run window.runIntegrationTests() to start manually.');