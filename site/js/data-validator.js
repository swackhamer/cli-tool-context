/**
 * Data Validation Module for CLI Tool Context website
 * Ensures data integrity and identifies data-related filtering issues
 */

class DataValidator {
    constructor() {
        this.validationResults = {
            tools: { valid: false, errors: [], warnings: [] },
            categories: { valid: false, errors: [], warnings: [] },
            stats: { valid: false, errors: [], warnings: [] },
            overall: { valid: false, score: 0 }
        };
    }

    /**
     * Validate all data and return comprehensive results
     */
    async validateAll() {
        if (window.debugHelper) {
            window.debugHelper.logInfo('Data Validator', 'Starting comprehensive data validation');
            window.debugHelper.startTimer('data-validation');
        }

        try {
            // Reset validation results
            this.resetValidationResults();

            // Check if data is available
            const hasTools = typeof window.toolsData !== 'undefined';
            const hasCategories = typeof window.categoriesData !== 'undefined';
            const hasStats = typeof window.statsData !== 'undefined';

            if (!hasTools || !hasCategories || !hasStats) {
                if (window.debugHelper) {
                    window.debugHelper.logError('Data Validator', 'Global data objects not available', {
                        hasTools, hasCategories, hasStats
                    });
                }
                return this.validationResults;
            }

            // Validate each data type
            this.validateToolsData();
            this.validateCategoriesData();
            this.validateStatsData();

            // Cross-validate data relationships
            this.validateDataRelationships();

            // Calculate overall score
            this.calculateOverallScore();

            if (window.debugHelper) {
                window.debugHelper.endTimer('data-validation');
                window.debugHelper.logInfo('Data Validator', 'Data validation completed', {
                    overall: this.validationResults.overall,
                    toolsValid: this.validationResults.tools.valid,
                    categoriesValid: this.validationResults.categories.valid,
                    statsValid: this.validationResults.stats.valid
                });
            }

            return this.validationResults;

        } catch (error) {
            if (window.debugHelper) {
                window.debugHelper.logError('Data Validator', 'Validation failed', error);
            }
            this.validationResults.overall.errors = [`Validation failed: ${error.message}`];
            return this.validationResults;
        }
    }

    resetValidationResults() {
        this.validationResults = {
            tools: { valid: false, errors: [], warnings: [], count: 0 },
            categories: { valid: false, errors: [], warnings: [], count: 0 },
            stats: { valid: false, errors: [], warnings: [], count: 0 },
            overall: { valid: false, score: 0, errors: [], warnings: [] }
        };
    }

    /**
     * Validate tools data structure and content
     */
    validateToolsData() {
        const result = this.validationResults.tools;
        
        try {
            const tools = window.toolsData;
            
            if (!Array.isArray(tools)) {
                result.errors.push('Tools data is not an array');
                return;
            }

            result.count = tools.length;

            if (tools.length === 0) {
                result.warnings.push('No tools data available');
                result.valid = true; // Empty but valid
                return;
            }

            // Required fields for each tool
            const requiredFields = ['name', 'description', 'category', 'installation'];
            const optionalFields = ['platform', 'difficulty', 'tags', 'commands', 'examples'];
            
            let validTools = 0;
            const missingFieldsMap = new Map();
            const duplicateNames = new Set();
            const namesFound = new Set();

            tools.forEach((tool, index) => {
                if (!tool || typeof tool !== 'object') {
                    result.errors.push(`Tool at index ${index} is not a valid object`);
                    return;
                }

                // Check for required fields
                const missingFields = requiredFields.filter(field => 
                    !tool.hasOwnProperty(field) || tool[field] === null || tool[field] === undefined || tool[field] === ''
                );

                if (missingFields.length > 0) {
                    missingFields.forEach(field => {
                        const count = missingFieldsMap.get(field) || 0;
                        missingFieldsMap.set(field, count + 1);
                    });
                }

                // Check for duplicate names
                if (tool.name) {
                    if (namesFound.has(tool.name.toLowerCase())) {
                        duplicateNames.add(tool.name);
                    } else {
                        namesFound.add(tool.name.toLowerCase());
                    }
                }

                // Validate field types and content
                this.validateToolFields(tool, index, result);

                if (missingFields.length === 0) {
                    validTools++;
                }
            });

            // Report missing fields
            for (const [field, count] of missingFieldsMap.entries()) {
                if (count > tools.length * 0.1) { // More than 10% missing
                    result.errors.push(`Field '${field}' missing in ${count} tools (${Math.round(count/tools.length*100)}%)`);
                } else {
                    result.warnings.push(`Field '${field}' missing in ${count} tools`);
                }
            }

            // Report duplicates
            if (duplicateNames.size > 0) {
                result.warnings.push(`Duplicate tool names found: ${Array.from(duplicateNames).join(', ')}`);
            }

            // Set validity based on criteria
            result.valid = result.errors.length === 0 && validTools > tools.length * 0.8;

            if (window.debugHelper) {
                window.debugHelper.logInfo('Data Validator', 'Tools validation completed', {
                    total: tools.length,
                    valid: validTools,
                    errors: result.errors.length,
                    warnings: result.warnings.length
                });
            }

        } catch (error) {
            result.errors.push(`Tools validation failed: ${error.message}`);
        }
    }

    /**
     * Validate individual tool fields
     */
    validateToolFields(tool, index, result) {
        // Name validation
        if (tool.name && typeof tool.name !== 'string') {
            result.warnings.push(`Tool ${index}: name should be a string`);
        }

        // Description validation
        if (tool.description) {
            if (typeof tool.description !== 'string') {
                result.warnings.push(`Tool ${index}: description should be a string`);
            } else if (tool.description.length < 10) {
                result.warnings.push(`Tool ${index}: description too short (<10 characters)`);
            }
        }

        // Category validation
        if (tool.category && typeof tool.category !== 'string') {
            result.warnings.push(`Tool ${index}: category should be a string`);
        }

        // Platform validation
        if (tool.platform && !Array.isArray(tool.platform) && typeof tool.platform !== 'string') {
            result.warnings.push(`Tool ${index}: platform should be string or array`);
        }

        // Difficulty validation
        if (tool.difficulty !== undefined) {
            if (typeof tool.difficulty !== 'number' || tool.difficulty < 1 || tool.difficulty > 5) {
                result.warnings.push(`Tool ${index}: difficulty should be number 1-5`);
            }
        }

        // Tags validation
        if (tool.tags && !Array.isArray(tool.tags)) {
            result.warnings.push(`Tool ${index}: tags should be an array`);
        }

        // Installation validation
        if (tool.installation) {
            if (typeof tool.installation === 'object') {
                // Check installation methods
                const validMethods = ['npm','pip','brew','homebrew','apt','yum','cargo','go','manual','binary','package-manager'];
                const methods = Object.keys(tool.installation);
                const invalidMethods = methods.filter(m => !validMethods.includes(m));
                if (invalidMethods.length > 0) {
                    result.warnings.push(`Tool ${index}: unknown installation methods: ${invalidMethods.join(', ')}`);
                }
            } else if (typeof tool.installation !== 'string') {
                result.warnings.push(`Tool ${index}: installation should be string or object`);
            }
        }
    }

    /**
     * Validate categories data
     */
    validateCategoriesData() {
        const result = this.validationResults.categories;
        
        try {
            const categories = window.categoriesData;
            
            if (!Array.isArray(categories) && typeof categories !== 'object') {
                result.errors.push('Categories data is not an array or object');
                return;
            }

            if (Array.isArray(categories)) {
                result.count = categories.length;
                
                categories.forEach((category, index) => {
                    if (!category || typeof category !== 'object') {
                        result.errors.push(`Category at index ${index} is not a valid object`);
                        return;
                    }

                    if (!category.name || typeof category.name !== 'string') {
                        result.errors.push(`Category at index ${index} missing valid name`);
                    }
                });
            } else {
                // Handle object format
                result.count = Object.keys(categories).length;
                
                Object.entries(categories).forEach(([key, category]) => {
                    if (typeof category !== 'object') {
                        result.warnings.push(`Category '${key}' is not an object`);
                    }
                });
            }

            result.valid = result.errors.length === 0;

        } catch (error) {
            result.errors.push(`Categories validation failed: ${error.message}`);
        }
    }

    /**
     * Validate stats data
     */
    validateStatsData() {
        const result = this.validationResults.stats;
        
        try {
            const stats = window.statsData;
            
            if (!stats || typeof stats !== 'object') {
                result.errors.push('Stats data is not an object');
                return;
            }

            // Expected stats properties
            const expectedStats = ['totalTools', 'totalCategories', 'lastUpdated'];
            const missingStats = expectedStats.filter(stat => !(stat in stats));
            
            if (missingStats.length > 0) {
                result.warnings.push(`Missing stats: ${missingStats.join(', ')}`);
            }

            // Validate stat values
            if (stats.totalTools !== undefined) {
                if (typeof stats.totalTools !== 'number' || stats.totalTools < 0) {
                    result.errors.push('totalTools should be a positive number');
                }
            }

            if (stats.totalCategories !== undefined) {
                if (typeof stats.totalCategories !== 'number' || stats.totalCategories < 0) {
                    result.errors.push('totalCategories should be a positive number');
                }
            }

            if (stats.lastUpdated !== undefined) {
                if (typeof stats.lastUpdated !== 'string') {
                    result.warnings.push('lastUpdated should be a string (ISO date)');
                }
            }

            result.valid = result.errors.length === 0;

        } catch (error) {
            result.errors.push(`Stats validation failed: ${error.message}`);
        }
    }

    /**
     * Cross-validate data relationships
     */
    validateDataRelationships() {
        try {
            const tools = window.toolsData;
            const categories = window.categoriesData;
            const stats = window.statsData;

            if (!Array.isArray(tools) || !categories || !stats) return;

            // Get category names/ids
            let categoryNames = [];
            if (Array.isArray(categories)) {
                categoryNames = categories.map(cat => cat.name).filter(Boolean);
            } else {
                categoryNames = Object.keys(categories);
            }

            // Check if tool categories exist in categories data
            const missingCategories = new Set();
            const categoryCounts = new Map();

            tools.forEach(tool => {
                if (tool.category) {
                    const category = tool.category.toLowerCase();
                    if (!categoryNames.some(cat => cat.toLowerCase() === category)) {
                        missingCategories.add(tool.category);
                    }
                    
                    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
                }
            });

            if (missingCategories.size > 0) {
                this.validationResults.overall.warnings.push(
                    `Tools reference missing categories: ${Array.from(missingCategories).join(', ')}`
                );
            }

            // Validate stats against actual data
            if (stats.totalTools !== undefined && stats.totalTools !== tools.length) {
                this.validationResults.overall.warnings.push(
                    `Stats totalTools (${stats.totalTools}) doesn't match actual tools count (${tools.length})`
                );
            }

            if (stats.totalCategories !== undefined && stats.totalCategories !== categoryNames.length) {
                this.validationResults.overall.warnings.push(
                    `Stats totalCategories (${stats.totalCategories}) doesn't match actual categories count (${categoryNames.length})`
                );
            }

        } catch (error) {
            this.validationResults.overall.errors.push(`Relationship validation failed: ${error.message}`);
        }
    }

    /**
     * Calculate overall validation score and status
     */
    calculateOverallScore() {
        const results = this.validationResults;
        let score = 0;
        let maxScore = 0;

        // Tools validation (40% of score)
        maxScore += 40;
        if (results.tools.valid) score += 40;
        else if (results.tools.errors.length === 0) score += 20; // Partial credit for warnings only

        // Categories validation (30% of score)
        maxScore += 30;
        if (results.categories.valid) score += 30;
        else if (results.categories.errors.length === 0) score += 15;

        // Stats validation (20% of score)
        maxScore += 20;
        if (results.stats.valid) score += 20;
        else if (results.stats.errors.length === 0) score += 10;

        // Relationship validation (10% of score)
        maxScore += 10;
        if (results.overall.errors.length === 0) score += 10;
        else if (results.overall.warnings.length === 0) score += 5;

        results.overall.score = Math.round((score / maxScore) * 100);
        results.overall.valid = results.overall.score >= 80 && 
                                results.tools.valid && 
                                results.categories.valid && 
                                results.stats.valid;

        // Set overall status
        if (results.overall.score >= 90) {
            results.overall.status = 'excellent';
        } else if (results.overall.score >= 80) {
            results.overall.status = 'good';
        } else if (results.overall.score >= 60) {
            results.overall.status = 'fair';
        } else {
            results.overall.status = 'poor';
        }
    }

    /**
     * Generate a human-readable validation report
     */
    generateReport() {
        const results = this.validationResults;
        const report = {
            summary: `Data validation score: ${results.overall.score}% (${results.overall.status || 'unknown'})`,
            details: []
        };

        // Tools report
        if (results.tools.count > 0) {
            report.details.push(`✓ Tools: ${results.tools.count} items ${results.tools.valid ? '(valid)' : '(issues found)'}`);
            if (results.tools.errors.length > 0) {
                report.details.push(`  Errors: ${results.tools.errors.join('; ')}`);
            }
            if (results.tools.warnings.length > 0) {
                report.details.push(`  Warnings: ${results.tools.warnings.join('; ')}`);
            }
        } else {
            report.details.push('✗ Tools: No data available');
        }

        // Categories report
        if (results.categories.count > 0) {
            report.details.push(`✓ Categories: ${results.categories.count} items ${results.categories.valid ? '(valid)' : '(issues found)'}`);
            if (results.categories.errors.length > 0) {
                report.details.push(`  Errors: ${results.categories.errors.join('; ')}`);
            }
        } else {
            report.details.push('✗ Categories: No data available');
        }

        // Stats report
        report.details.push(`${results.stats.valid ? '✓' : '✗'} Stats: ${results.stats.valid ? 'valid' : 'issues found'}`);
        if (results.stats.errors.length > 0) {
            report.details.push(`  Errors: ${results.stats.errors.join('; ')}`);
        }

        // Overall issues
        if (results.overall.errors.length > 0) {
            report.details.push(`Overall Errors: ${results.overall.errors.join('; ')}`);
        }
        if (results.overall.warnings.length > 0) {
            report.details.push(`Overall Warnings: ${results.overall.warnings.join('; ')}`);
        }

        return report;
    }

    /**
     * Suggest fixes for common data issues
     */
    suggestFixes() {
        const suggestions = [];
        const results = this.validationResults;

        // Tools-related suggestions
        if (results.tools.errors.some(e => e.includes('missing'))) {
            suggestions.push('Add missing required fields to tool definitions (name, description, category, installation)');
        }

        if (results.tools.warnings.some(w => w.includes('description too short'))) {
            suggestions.push('Expand tool descriptions to be more informative (minimum 10 characters)');
        }

        if (results.tools.warnings.some(w => w.includes('difficulty'))) {
            suggestions.push('Set tool difficulty ratings as numbers between 1-5');
        }

        // Categories-related suggestions
        if (results.overall.warnings.some(w => w.includes('missing categories'))) {
            suggestions.push('Add missing category definitions or update tool categories to match existing ones');
        }

        // Stats-related suggestions
        if (results.overall.warnings.some(w => w.includes('totalTools'))) {
            suggestions.push('Update stats.totalTools to match actual number of tools');
        }

        if (results.overall.warnings.some(w => w.includes('totalCategories'))) {
            suggestions.push('Update stats.totalCategories to match actual number of categories');
        }

        return suggestions;
    }
}

// Create global data validator instance
window.dataValidator = new DataValidator();

// Expose validation function globally
window.validateData = async () => {
    const results = await window.dataValidator.validateAll();
    const report = window.dataValidator.generateReport();
    const suggestions = window.dataValidator.suggestFixes();
    
    console.group('Data Validation Report');
    console.log(report.summary);
    report.details.forEach(detail => console.log(detail));
    
    if (suggestions.length > 0) {
        console.log('\nSuggested fixes:');
        suggestions.forEach((suggestion, i) => console.log(`${i + 1}. ${suggestion}`));
    }
    console.groupEnd();
    
    return { results, report, suggestions };
};