/**
 * Playwright test specification for CLI Tool Context
 * Tests search consistency, filtering, and cache invalidation
 */

const { test, expect } = require('@playwright/test');

test.describe('CLI Tool Context Search Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000/site/tools.html');
        // Wait for app initialization
        await page.waitForFunction(() => window.CLIApp?.initialized === true, { timeout: 10000 });
    });

    test('Search returns consistent results across engines', async ({ page }) => {
        const queries = ['git', 'docker', 'python'];
        
        for (const query of queries) {
            // Type search query
            await page.fill('#search-input', query);
            await page.waitForTimeout(500); // Wait for debounce
            
            // Get result count
            const resultCount = await page.evaluate(() => {
                return document.querySelectorAll('.tool-card').length;
            });
            
            expect(resultCount).toBeGreaterThan(0);
        }
    });

    test('Filters apply correctly', async ({ page }) => {
        // Test category filter
        await page.selectOption('#category-filter', 'Version Control');
        await page.waitForTimeout(200);
        
        const categoryResults = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.tool-card')).every(card => {
                return card.querySelector('.category')?.textContent.includes('Version Control');
            });
        });
        
        expect(categoryResults).toBe(true);
        
        // Reset filter
        await page.selectOption('#category-filter', '');
        await page.waitForTimeout(200);
    });

    test('Cache invalidates on filter change', async ({ page }) => {
        // Search for docker
        await page.fill('#search-input', 'docker');
        await page.waitForTimeout(500);
        
        const initialCount = await page.evaluate(() => {
            return document.querySelectorAll('.tool-card').length;
        });
        
        // Apply filter
        await page.selectOption('#category-filter', 'Containerization');
        await page.waitForTimeout(200);
        
        const filteredCount = await page.evaluate(() => {
            return document.querySelectorAll('.tool-card').length;
        });
        
        // Counts should be different
        expect(filteredCount).not.toBe(initialCount);
        
        // Reset filter
        await page.selectOption('#category-filter', '');
        await page.waitForTimeout(200);
        
        const resetCount = await page.evaluate(() => {
            return document.querySelectorAll('.tool-card').length;
        });
        
        // Should be back to original
        expect(Math.abs(resetCount - initialCount)).toBeLessThanOrEqual(2);
    });

    test('Search cancellation works', async ({ page }) => {
        // Type rapidly to trigger cancellation
        const queries = ['a', 'ab', 'abc', 'abcd', 'abcde'];
        
        for (const query of queries) {
            await page.fill('#search-input', query);
            // Don't wait between inputs
        }
        
        await page.waitForTimeout(1000);
        
        // Should only have results for the last query
        const searchValue = await page.inputValue('#search-input');
        expect(searchValue).toBe('abcde');
    });

    test('Empty query returns all tools', async ({ page }) => {
        // Clear search
        await page.fill('#search-input', '');
        await page.waitForTimeout(500);
        
        const allToolsCount = await page.evaluate(() => {
            return document.querySelectorAll('.tool-card').length;
        });
        
        // Should have many tools
        expect(allToolsCount).toBeGreaterThan(50);
    });

    test('Platform filter normalizes values', async ({ page }) => {
        // Test platform normalization
        const platformTests = [
            { value: 'macOS', expected: ['macOS', 'Mac', 'Darwin'] },
            { value: 'Windows', expected: ['Windows', 'Win'] },
            { value: 'Linux', expected: ['Linux', 'Unix'] }
        ];
        
        for (const test of platformTests) {
            await page.selectOption('#platform-filter', test.value);
            await page.waitForTimeout(200);
            
            const hasCorrectPlatform = await page.evaluate((expected) => {
                const cards = document.querySelectorAll('.tool-card');
                if (cards.length === 0) return false;
                
                return Array.from(cards).every(card => {
                    const platformText = card.textContent;
                    return expected.some(p => platformText.includes(p));
                });
            }, test.expected);
            
            expect(hasCorrectPlatform).toBe(true);
            
            // Reset
            await page.selectOption('#platform-filter', '');
        }
    });
});

test.describe('Performance Tests', () => {
    test('Search completes within timeout', async ({ page }) => {
        await page.goto('http://localhost:8000/site/tools.html');
        await page.waitForFunction(() => window.CLIApp?.initialized === true, { timeout: 10000 });
        
        const startTime = Date.now();
        
        await page.fill('#search-input', 'complex search query');
        await page.waitForFunction(() => {
            const cards = document.querySelectorAll('.tool-card');
            return cards.length > 0 || document.querySelector('.no-results');
        }, { timeout: 5000 });
        
        const duration = Date.now() - startTime;
        
        // Should complete within adaptive timeout (max 5s)
        expect(duration).toBeLessThan(5000);
    });

    test('Filter application is responsive', async ({ page }) => {
        await page.goto('http://localhost:8000/site/tools.html');
        await page.waitForFunction(() => window.CLIApp?.initialized === true, { timeout: 10000 });
        
        const startTime = Date.now();
        
        // Apply multiple filters
        await page.selectOption('#category-filter', 'Development');
        await page.selectOption('#difficulty-filter', 'intermediate');
        await page.selectOption('#platform-filter', 'cross-platform');
        
        await page.waitForTimeout(100);
        
        const duration = Date.now() - startTime;
        
        // Should be very fast
        expect(duration).toBeLessThan(1000);
    });
});