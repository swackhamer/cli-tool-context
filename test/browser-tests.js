/**
 * Browser tests for CLI Tool Context search and filtering
 * 
 * This test suite validates:
 * - Cross-engine result consistency
 * - Cache invalidation on filter changes
 * - Search functionality across different backends
 * - Filter application and counts
 */

// Test configuration
const TEST_CONFIG = {
    baseUrl: 'http://localhost:8000/site',
    timeout: 10000,
    searchEngines: ['worker', 'fallback', 'simple', 'main']
};

// Test utilities
class TestRunner {
    constructor() {
        this.results = [];
        this.currentTest = null;
    }

    async runTests() {
        console.log('Starting browser tests...');
        
        // Run test suites
        await this.testSearchConsistency();
        await this.testFilterApplication();
        await this.testCacheInvalidation();
        await this.testSearchCancellation();
        
        // Report results
        this.reportResults();
    }

    /**
     * Test search result consistency across engines
     */
    async testSearchConsistency() {
        this.startTest('Search Result Consistency');
        
        const queries = ['git', 'docker', 'python', 'test'];
        const results = {};
        
        for (const query of queries) {
            results[query] = {};
            
            // Test each search engine
            for (const engine of TEST_CONFIG.searchEngines) {
                try {
                    // Force specific engine
                    await this.forceSearchEngine(engine);
                    
                    // Perform search
                    const searchResults = await this.performSearch(query);
                    results[query][engine] = {
                        count: searchResults.length,
                        topResults: searchResults.slice(0, 5).map(r => r.item?.name || r.name)
                    };
                } catch (error) {
                    this.recordError(`Failed to test ${engine} with query "${query}": ${error.message}`);
                }
            }
            
            // Compare results
            this.compareEngineResults(query, results[query]);
        }
        
        this.endTest();
    }

    /**
     * Test filter application
     */
    async testFilterApplication() {
        this.startTest('Filter Application');
        
        const filterTests = [
            { category: 'Version Control', expectedMin: 5 },
            { difficulty: 'beginner', expectedMin: 10 },
            { platform: 'macOS', expectedMin: 5 },
            { installation: 'brew', expectedMin: 3 }
        ];
        
        for (const test of filterTests) {
            try {
                // Apply filter
                await this.applyFilter(test);
                
                // Get filtered results
                const results = await this.getFilteredTools();
                
                // Validate count
                if (results.length < test.expectedMin) {
                    this.recordError(`Filter ${JSON.stringify(test)} returned ${results.length} results, expected at least ${test.expectedMin}`);
                } else {
                    this.recordSuccess(`Filter ${JSON.stringify(test)} returned ${results.length} results`);
                }
            } catch (error) {
                this.recordError(`Failed to test filter ${JSON.stringify(test)}: ${error.message}`);
            }
        }
        
        this.endTest();
    }

    /**
     * Test cache invalidation on filter changes
     */
    async testCacheInvalidation() {
        this.startTest('Cache Invalidation');
        
        try {
            // Perform initial search
            const query = 'docker';
            const initialResults = await this.performSearch(query);
            
            // Apply filter
            await this.applyFilter({ category: 'Containerization' });
            
            // Perform same search with filter
            const filteredResults = await this.performSearch(query);
            
            // Results should be different
            if (initialResults.length === filteredResults.length) {
                this.recordWarning('Cache may not be invalidating on filter change');
            } else {
                this.recordSuccess('Cache properly invalidated on filter change');
            }
            
            // Reset filters
            await this.resetFilters();
            
            // Search again
            const resetResults = await this.performSearch(query);
            
            // Should match initial results
            if (Math.abs(initialResults.length - resetResults.length) > 2) {
                this.recordError('Results inconsistent after filter reset');
            } else {
                this.recordSuccess('Results consistent after filter reset');
            }
        } catch (error) {
            this.recordError(`Cache invalidation test failed: ${error.message}`);
        }
        
        this.endTest();
    }

    /**
     * Test search cancellation
     */
    async testSearchCancellation() {
        this.startTest('Search Cancellation');
        
        try {
            // Start multiple searches rapidly
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(this.performSearch(`test${i}`));
            }
            
            // Only the last should complete
            const results = await Promise.allSettled(promises);
            const completed = results.filter(r => r.status === 'fulfilled').length;
            
            if (completed === 1) {
                this.recordSuccess('Search cancellation working correctly');
            } else {
                this.recordWarning(`${completed} searches completed, expected 1`);
            }
        } catch (error) {
            this.recordError(`Search cancellation test failed: ${error.message}`);
        }
        
        this.endTest();
    }

    // Helper methods
    async forceSearchEngine(engine) {
        return new Promise((resolve) => {
            if (window.CLIApp) {
                window.CLIApp.state.searchStatus = engine;
                resolve();
            } else {
                throw new Error('CLIApp not available');
            }
        });
    }

    async performSearch(query) {
        return new Promise((resolve, reject) => {
            if (window.CLIApp && window.CLIApp.performSearch) {
                window.CLIApp.performSearch(query).then(resolve).catch(reject);
            } else {
                reject(new Error('Search function not available'));
            }
        });
    }

    async applyFilter(filter) {
        return new Promise((resolve) => {
            if (window.CLIApp) {
                Object.assign(window.CLIApp.state.filters, filter);
                window.CLIApp.applyFilters();
                setTimeout(resolve, 100); // Allow time for filter application
            } else {
                throw new Error('CLIApp not available');
            }
        });
    }

    async getFilteredTools() {
        return window.CLIApp?.state?.filteredTools || [];
    }

    async resetFilters() {
        return new Promise((resolve) => {
            if (window.CLIApp) {
                window.CLIApp.resetFilters();
                setTimeout(resolve, 100);
            } else {
                throw new Error('CLIApp not available');
            }
        });
    }

    compareEngineResults(query, engineResults) {
        const engines = Object.keys(engineResults);
        if (engines.length < 2) return;
        
        const baseline = engineResults[engines[0]];
        for (let i = 1; i < engines.length; i++) {
            const engine = engines[i];
            const result = engineResults[engine];
            
            // Allow some variance in count (±10%)
            const variance = Math.abs(baseline.count - result.count) / baseline.count;
            if (variance > 0.1) {
                this.recordWarning(`Query "${query}": ${engine} returned ${result.count} results vs ${baseline.count} baseline`);
            }
        }
    }

    // Test lifecycle methods
    startTest(name) {
        this.currentTest = {
            name,
            startTime: Date.now(),
            errors: [],
            warnings: [],
            successes: []
        };
    }

    endTest() {
        if (this.currentTest) {
            this.currentTest.duration = Date.now() - this.currentTest.startTime;
            this.results.push(this.currentTest);
            this.currentTest = null;
        }
    }

    recordError(message) {
        if (this.currentTest) {
            this.currentTest.errors.push(message);
        }
        console.error(`❌ ${message}`);
    }

    recordWarning(message) {
        if (this.currentTest) {
            this.currentTest.warnings.push(message);
        }
        console.warn(`⚠️ ${message}`);
    }

    recordSuccess(message) {
        if (this.currentTest) {
            this.currentTest.successes.push(message);
        }
        console.log(`✅ ${message}`);
    }

    reportResults() {
        console.log('\n=== Test Results ===');
        
        let totalErrors = 0;
        let totalWarnings = 0;
        let totalSuccesses = 0;
        
        for (const test of this.results) {
            console.log(`\n${test.name} (${test.duration}ms)`);
            console.log(`  Successes: ${test.successes.length}`);
            console.log(`  Warnings: ${test.warnings.length}`);
            console.log(`  Errors: ${test.errors.length}`);
            
            totalSuccesses += test.successes.length;
            totalWarnings += test.warnings.length;
            totalErrors += test.errors.length;
        }
        
        console.log('\n=== Summary ===');
        console.log(`Total Successes: ${totalSuccesses}`);
        console.log(`Total Warnings: ${totalWarnings}`);
        console.log(`Total Errors: ${totalErrors}`);
        
        // Return exit code
        return totalErrors === 0 ? 0 : 1;
    }
}

// Export for use in test runners
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestRunner;
}

// Auto-run if loaded in browser
if (typeof window !== 'undefined') {
    window.TestRunner = TestRunner;
    
    // Run tests when page is ready
    if (document.readyState === 'complete') {
        new TestRunner().runTests();
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => {
                new TestRunner().runTests();
            }, 2000); // Wait for app initialization
        });
    }
}