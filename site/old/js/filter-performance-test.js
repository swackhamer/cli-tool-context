/**
 * Filter Performance Test Module
 * Comprehensive performance testing for filter operations
 */

class FilterPerformanceTest {
    constructor() {
        this.testResults = [];
        this.benchmarks = new Map();
        this.datasets = new Map();
    }

    /**
     * Generate test datasets of varying sizes
     */
    generateDatasets() {
        const sizes = [100, 300, 500, 1000];
        const categories = ['AI-Powered Tools', 'Development Tools', 'Network Tools', 'System Administration', 'Text Processing'];
        const platforms = ['macOS', 'Linux', 'Windows', 'cross-platform'];
        const installations = ['homebrew', 'npm', 'pip', 'built-in', 'manual', 'cargo'];
        
        sizes.forEach(size => {
            const tools = [];
            for (let i = 0; i < size; i++) {
                tools.push({
                    id: `tool-${i}`,
                    name: `Tool ${i}`,
                    description: `This is a detailed description for tool ${i} with various keywords like search, filter, performance, test, and benchmark`,
                    category: categories[i % categories.length],
                    platform: [platforms[i % platforms.length], platforms[(i + 1) % platforms.length]],
                    installation: [installations[i % installations.length]],
                    difficulty: (i % 5) + 1,
                    tags: [`tag${i % 10}`, `tag${(i + 1) % 10}`, `tag${(i + 2) % 10}`],
                    popularity: Math.floor(Math.random() * 100)
                });
            }
            this.datasets.set(size, tools);
        });
    }

    /**
     * Test search performance with different query lengths and complexities
     */
    async testSearchPerformance() {
        const results = [];
        const queries = [
            { query: 'a', complexity: 'single-char' },
            { query: 'tool', complexity: 'simple' },
            { query: 'performance test', complexity: 'multi-word' },
            { query: 'search filter benchmark', complexity: 'complex' },
            { query: '"exact match query"', complexity: 'exact' },
            { query: 'tool*', complexity: 'wildcard' }
        ];
        
        for (const [size, dataset] of this.datasets.entries()) {
            for (const { query, complexity } of queries) {
                const startTime = performance.now();
                
                // Simulate search operation
                const searchResults = this.performSearch(dataset, query);
                
                const duration = performance.now() - startTime;
                
                results.push({
                    datasetSize: size,
                    query,
                    complexity,
                    resultsCount: searchResults.length,
                    duration: duration.toFixed(3),
                    throughput: (size / duration).toFixed(2) // tools per ms
                });
            }
        }
        
        return results;
    }

    /**
     * Simple search implementation for testing
     */
    performSearch(dataset, query) {
        const normalizedQuery = query.toLowerCase().replace(/['"]/g, '');
        const terms = normalizedQuery.split(' ').filter(Boolean);
        
        return dataset.filter(tool => {
            const searchText = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();
            return terms.every(term => searchText.includes(term));
        });
    }

    /**
     * Test platform filter performance
     */
    async testPlatformFilterPerformance() {
        const results = [];
        const platforms = ['macOS', 'Linux', 'Windows', 'cross-platform'];
        
        for (const [size, dataset] of this.datasets.entries()) {
            for (const platform of platforms) {
                const startTime = performance.now();
                
                const filtered = dataset.filter(tool => 
                    tool.platform && tool.platform.some(p => 
                        p.toLowerCase() === platform.toLowerCase()
                    )
                );
                
                const duration = performance.now() - startTime;
                
                results.push({
                    datasetSize: size,
                    filter: 'platform',
                    value: platform,
                    resultsCount: filtered.length,
                    duration: duration.toFixed(3),
                    throughput: (size / duration).toFixed(2)
                });
            }
        }
        
        return results;
    }

    /**
     * Test installation filter performance
     */
    async testInstallationFilterPerformance() {
        const results = [];
        const methods = ['homebrew', 'npm', 'pip', 'built-in'];
        
        for (const [size, dataset] of this.datasets.entries()) {
            for (const method of methods) {
                const startTime = performance.now();
                
                const filtered = dataset.filter(tool => 
                    tool.installation && tool.installation.some(m => 
                        m.toLowerCase() === method.toLowerCase()
                    )
                );
                
                const duration = performance.now() - startTime;
                
                results.push({
                    datasetSize: size,
                    filter: 'installation',
                    value: method,
                    resultsCount: filtered.length,
                    duration: duration.toFixed(3),
                    throughput: (size / duration).toFixed(2)
                });
            }
        }
        
        return results;
    }

    /**
     * Test category filter performance
     */
    async testCategoryFilterPerformance() {
        const results = [];
        const categories = ['AI-Powered Tools', 'Development Tools', 'Network Tools'];
        
        for (const [size, dataset] of this.datasets.entries()) {
            for (const category of categories) {
                const startTime = performance.now();
                
                const filtered = dataset.filter(tool => 
                    tool.category === category
                );
                
                const duration = performance.now() - startTime;
                
                results.push({
                    datasetSize: size,
                    filter: 'category',
                    value: category,
                    resultsCount: filtered.length,
                    duration: duration.toFixed(3),
                    throughput: (size / duration).toFixed(2)
                });
            }
        }
        
        return results;
    }

    /**
     * Test difficulty filter performance
     */
    async testDifficultyFilterPerformance() {
        const results = [];
        const difficulties = [1, 2, 3, 4, 5];
        
        for (const [size, dataset] of this.datasets.entries()) {
            for (const difficulty of difficulties) {
                const startTime = performance.now();
                
                const filtered = dataset.filter(tool => 
                    tool.difficulty === difficulty
                );
                
                const duration = performance.now() - startTime;
                
                results.push({
                    datasetSize: size,
                    filter: 'difficulty',
                    value: difficulty,
                    resultsCount: filtered.length,
                    duration: duration.toFixed(3),
                    throughput: (size / duration).toFixed(2)
                });
            }
        }
        
        return results;
    }

    /**
     * Test combined filter performance (multiple filters simultaneously)
     */
    async testCombinedFilterPerformance() {
        const results = [];
        const filterCombinations = [
            { category: 'Development Tools', platform: 'macOS' },
            { category: 'Network Tools', platform: 'Linux', difficulty: 3 },
            { category: 'AI-Powered Tools', platform: 'cross-platform', installation: 'npm' },
            { category: 'System Administration', platform: 'Windows', difficulty: 4, installation: 'built-in' }
        ];
        
        for (const [size, dataset] of this.datasets.entries()) {
            for (const filters of filterCombinations) {
                const startTime = performance.now();
                
                let filtered = [...dataset];
                
                if (filters.category) {
                    filtered = filtered.filter(tool => tool.category === filters.category);
                }
                if (filters.platform) {
                    filtered = filtered.filter(tool => 
                        tool.platform && tool.platform.some(p => 
                            p.toLowerCase() === filters.platform.toLowerCase()
                        )
                    );
                }
                if (filters.difficulty) {
                    filtered = filtered.filter(tool => tool.difficulty === filters.difficulty);
                }
                if (filters.installation) {
                    filtered = filtered.filter(tool => 
                        tool.installation && tool.installation.some(m => 
                            m.toLowerCase() === filters.installation.toLowerCase()
                        )
                    );
                }
                
                const duration = performance.now() - startTime;
                
                results.push({
                    datasetSize: size,
                    filters: Object.keys(filters).length,
                    filterDetails: JSON.stringify(filters),
                    resultsCount: filtered.length,
                    duration: duration.toFixed(3),
                    throughput: (size / duration).toFixed(2)
                });
            }
        }
        
        return results;
    }

    /**
     * Test memory usage during filter operations
     */
    async testMemoryUsage() {
        const results = [];
        
        if (!performance.memory) {
            return [{ error: 'Memory API not available in this browser' }];
        }
        
        for (const [size, dataset] of this.datasets.entries()) {
            const beforeMemory = performance.memory.usedJSHeapSize;
            
            // Perform multiple filter operations
            const operations = [];
            for (let i = 0; i < 100; i++) {
                operations.push(dataset.filter(tool => tool.difficulty >= 3));
            }
            
            const afterMemory = performance.memory.usedJSHeapSize;
            const memoryUsed = afterMemory - beforeMemory;
            
            results.push({
                datasetSize: size,
                operations: operations.length,
                memoryUsedBytes: memoryUsed,
                memoryUsedMB: (memoryUsed / 1048576).toFixed(2),
                averagePerOperation: (memoryUsed / operations.length).toFixed(2)
            });
            
            // Clear operations array to free memory
            operations.length = 0;
        }
        
        return results;
    }

    /**
     * Test filter responsiveness under heavy load
     */
    async testFilterResponsiveness() {
        const results = [];
        const targetResponseTime = 300; // 300ms target
        
        for (const [size, dataset] of this.datasets.entries()) {
            const testDuration = 5000; // Test for 5 seconds
            const startTime = performance.now();
            let operationCount = 0;
            let totalDuration = 0;
            const durations = [];
            
            while (performance.now() - startTime < testDuration) {
                const opStart = performance.now();
                
                // Perform a filter operation
                const filtered = dataset.filter(tool => 
                    tool.category === 'Development Tools' &&
                    tool.difficulty >= 3
                );
                
                const opDuration = performance.now() - opStart;
                durations.push(opDuration);
                totalDuration += opDuration;
                operationCount++;
            }
            
            // Calculate percentiles
            durations.sort((a, b) => a - b);
            const p50 = durations[Math.floor(durations.length * 0.5)];
            const p95 = durations[Math.floor(durations.length * 0.95)];
            const p99 = durations[Math.floor(durations.length * 0.99)];
            
            results.push({
                datasetSize: size,
                operationCount,
                averageDuration: (totalDuration / operationCount).toFixed(3),
                p50: p50.toFixed(3),
                p95: p95.toFixed(3),
                p99: p99.toFixed(3),
                meetsTarget: p95 < targetResponseTime,
                operationsPerSecond: (operationCount / (testDuration / 1000)).toFixed(2)
            });
        }
        
        return results;
    }

    /**
     * Measure perceived performance with loading indicators
     */
    async testPerceivedPerformance() {
        const results = [];
        
        for (const [size, dataset] of this.datasets.entries()) {
            // Time to first result
            const ttfrStart = performance.now();
            const firstResult = dataset[0];
            const ttfr = performance.now() - ttfrStart;
            
            // Time to interactive (all results ready)
            const ttiStart = performance.now();
            const allResults = [...dataset];
            const tti = performance.now() - ttiStart;
            
            // Time to complete render (simulated)
            const renderStart = performance.now();
            let renderTime = 0;
            
            // Simulate rendering in batches
            const batchSize = 20;
            for (let i = 0; i < dataset.length; i += batchSize) {
                const batch = dataset.slice(i, Math.min(i + batchSize, dataset.length));
                // Simulate DOM manipulation time
                await new Promise(resolve => setTimeout(resolve, 1));
                renderTime = performance.now() - renderStart;
            }
            
            results.push({
                datasetSize: size,
                timeToFirstResult: ttfr.toFixed(3),
                timeToInteractive: tti.toFixed(3),
                timeToCompleteRender: renderTime.toFixed(3),
                userPerceivedLatency: Math.max(ttfr, tti, renderTime).toFixed(3)
            });
        }
        
        return results;
    }

    /**
     * Test smooth scrolling and pagination performance
     */
    async testScrollPerformance() {
        const results = [];
        const pageSize = 50;
        
        for (const [size, dataset] of this.datasets.entries()) {
            const totalPages = Math.ceil(size / pageSize);
            const pageTimes = [];
            
            for (let page = 1; page <= totalPages; page++) {
                const startTime = performance.now();
                
                const startIndex = (page - 1) * pageSize;
                const endIndex = Math.min(page * pageSize, size);
                const pageData = dataset.slice(startIndex, endIndex);
                
                const duration = performance.now() - startTime;
                pageTimes.push(duration);
            }
            
            const avgPageTime = pageTimes.reduce((a, b) => a + b, 0) / pageTimes.length;
            const maxPageTime = Math.max(...pageTimes);
            
            results.push({
                datasetSize: size,
                pageSize,
                totalPages,
                averagePageTime: avgPageTime.toFixed(3),
                maxPageTime: maxPageTime.toFixed(3),
                smoothScrolling: maxPageTime < 16.67 // 60fps threshold
            });
        }
        
        return results;
    }

    /**
     * Run all performance tests
     */
    async runAllTests() {
        console.log('Generating test datasets...');
        this.generateDatasets();
        
        const allResults = {
            timestamp: new Date().toISOString(),
            browser: this.getBrowserInfo(),
            tests: {}
        };
        
        console.log('Running search performance tests...');
        allResults.tests.searchPerformance = await this.testSearchPerformance();
        
        console.log('Running platform filter tests...');
        allResults.tests.platformFilter = await this.testPlatformFilterPerformance();
        
        console.log('Running installation filter tests...');
        allResults.tests.installationFilter = await this.testInstallationFilterPerformance();
        
        console.log('Running category filter tests...');
        allResults.tests.categoryFilter = await this.testCategoryFilterPerformance();
        
        console.log('Running difficulty filter tests...');
        allResults.tests.difficultyFilter = await this.testDifficultyFilterPerformance();
        
        console.log('Running combined filter tests...');
        allResults.tests.combinedFilter = await this.testCombinedFilterPerformance();
        
        console.log('Running memory usage tests...');
        allResults.tests.memoryUsage = await this.testMemoryUsage();
        
        console.log('Running responsiveness tests...');
        allResults.tests.responsiveness = await this.testFilterResponsiveness();
        
        console.log('Running perceived performance tests...');
        allResults.tests.perceivedPerformance = await this.testPerceivedPerformance();
        
        console.log('Running scroll performance tests...');
        allResults.tests.scrollPerformance = await this.testScrollPerformance();
        
        this.testResults = allResults;
        return allResults;
    }

    /**
     * Get browser information
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        return {
            userAgent: ua,
            platform: navigator.platform,
            cores: navigator.hardwareConcurrency || 'unknown',
            memory: navigator.deviceMemory || 'unknown',
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : 'unknown'
        };
    }

    /**
     * Generate performance report
     */
    generateReport() {
        if (!this.testResults.tests) {
            return 'No test results available. Run tests first.';
        }
        
        const report = [];
        report.push('='.repeat(60));
        report.push('FILTER PERFORMANCE TEST REPORT');
        report.push('='.repeat(60));
        report.push(`Timestamp: ${this.testResults.timestamp}`);
        report.push(`Browser: ${this.testResults.browser.userAgent}`);
        report.push(`Platform: ${this.testResults.browser.platform}`);
        report.push(`CPU Cores: ${this.testResults.browser.cores}`);
        report.push(`Device Memory: ${this.testResults.browser.memory} GB`);
        report.push('');
        
        // Search Performance Summary
        if (this.testResults.tests.searchPerformance) {
            report.push('SEARCH PERFORMANCE:');
            report.push('-'.repeat(40));
            const searchData = this.testResults.tests.searchPerformance;
            const avgDuration = searchData.reduce((sum, r) => sum + parseFloat(r.duration), 0) / searchData.length;
            report.push(`Average search time: ${avgDuration.toFixed(3)}ms`);
            report.push(`Best throughput: ${Math.max(...searchData.map(r => parseFloat(r.throughput)))} tools/ms`);
            report.push('');
        }
        
        // Filter Performance Summary
        ['platformFilter', 'categoryFilter', 'difficultyFilter', 'installationFilter'].forEach(filterType => {
            if (this.testResults.tests[filterType]) {
                const filterName = filterType.replace('Filter', '').toUpperCase();
                report.push(`${filterName} FILTER PERFORMANCE:`);
                report.push('-'.repeat(40));
                const filterData = this.testResults.tests[filterType];
                const avgDuration = filterData.reduce((sum, r) => sum + parseFloat(r.duration), 0) / filterData.length;
                report.push(`Average filter time: ${avgDuration.toFixed(3)}ms`);
                report.push(`Best throughput: ${Math.max(...filterData.map(r => parseFloat(r.throughput)))} tools/ms`);
                report.push('');
            }
        });
        
        // Combined Filter Performance
        if (this.testResults.tests.combinedFilter) {
            report.push('COMBINED FILTER PERFORMANCE:');
            report.push('-'.repeat(40));
            const combinedData = this.testResults.tests.combinedFilter;
            const avgDuration = combinedData.reduce((sum, r) => sum + parseFloat(r.duration), 0) / combinedData.length;
            report.push(`Average combined filter time: ${avgDuration.toFixed(3)}ms`);
            report.push(`Max filters tested: ${Math.max(...combinedData.map(r => r.filters))}`);
            report.push('');
        }
        
        // Memory Usage
        if (this.testResults.tests.memoryUsage && this.testResults.tests.memoryUsage[0] && !this.testResults.tests.memoryUsage[0].error) {
            report.push('MEMORY USAGE:');
            report.push('-'.repeat(40));
            const memData = this.testResults.tests.memoryUsage;
            const avgMemory = memData.reduce((sum, r) => sum + parseFloat(r.memoryUsedMB), 0) / memData.length;
            report.push(`Average memory used: ${avgMemory.toFixed(2)} MB`);
            report.push(`Max memory used: ${Math.max(...memData.map(r => parseFloat(r.memoryUsedMB)))} MB`);
            report.push('');
        }
        
        // Responsiveness
        if (this.testResults.tests.responsiveness) {
            report.push('FILTER RESPONSIVENESS:');
            report.push('-'.repeat(40));
            const respData = this.testResults.tests.responsiveness;
            respData.forEach(data => {
                report.push(`Dataset size ${data.datasetSize}:`);
                report.push(`  - Operations/sec: ${data.operationsPerSecond}`);
                report.push(`  - P50 latency: ${data.p50}ms`);
                report.push(`  - P95 latency: ${data.p95}ms`);
                report.push(`  - P99 latency: ${data.p99}ms`);
                report.push(`  - Meets target: ${data.meetsTarget ? 'YES' : 'NO'}`);
            });
            report.push('');
        }
        
        // Perceived Performance
        if (this.testResults.tests.perceivedPerformance) {
            report.push('PERCEIVED PERFORMANCE:');
            report.push('-'.repeat(40));
            const percData = this.testResults.tests.perceivedPerformance;
            percData.forEach(data => {
                report.push(`Dataset size ${data.datasetSize}:`);
                report.push(`  - Time to first result: ${data.timeToFirstResult}ms`);
                report.push(`  - Time to interactive: ${data.timeToInteractive}ms`);
                report.push(`  - Time to complete render: ${data.timeToCompleteRender}ms`);
                report.push(`  - User perceived latency: ${data.userPerceivedLatency}ms`);
            });
            report.push('');
        }
        
        // Scroll Performance
        if (this.testResults.tests.scrollPerformance) {
            report.push('SCROLL/PAGINATION PERFORMANCE:');
            report.push('-'.repeat(40));
            const scrollData = this.testResults.tests.scrollPerformance;
            scrollData.forEach(data => {
                report.push(`Dataset size ${data.datasetSize}:`);
                report.push(`  - Page size: ${data.pageSize}`);
                report.push(`  - Total pages: ${data.totalPages}`);
                report.push(`  - Avg page time: ${data.averagePageTime}ms`);
                report.push(`  - Max page time: ${data.maxPageTime}ms`);
                report.push(`  - Smooth scrolling: ${data.smoothScrolling ? 'YES' : 'NO'}`);
            });
            report.push('');
        }
        
        report.push('='.repeat(60));
        report.push('END OF REPORT');
        report.push('='.repeat(60));
        
        return report.join('\n');
    }

    /**
     * Export results as JSON
     */
    exportJSON() {
        return JSON.stringify(this.testResults, null, 2);
    }

    /**
     * Export results as CSV
     */
    exportCSV() {
        const csv = [];
        csv.push('Test Type,Dataset Size,Metric,Value');
        
        for (const [testName, testData] of Object.entries(this.testResults.tests)) {
            if (Array.isArray(testData)) {
                testData.forEach(row => {
                    for (const [key, value] of Object.entries(row)) {
                        if (key !== 'datasetSize' && typeof value !== 'object') {
                            csv.push(`${testName},${row.datasetSize || 'N/A'},${key},${value}`);
                        }
                    }
                });
            }
        }
        
        return csv.join('\n');
    }
}

// Export for use in other modules
window.FilterPerformanceTest = FilterPerformanceTest;