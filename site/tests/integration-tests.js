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

// Test 7: Error recovery
testRunner.test('Error recovery mechanisms work', async () => {
    const healthCheck = await window.CLIApp.healthCheck();
    
    if (!healthCheck) {
        throw new Error('Health check failed');
    }
    
    console.log('✓ Health check passed');
});

// Export test runner for manual usage
window.runIntegrationTests = () => testRunner.run();

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