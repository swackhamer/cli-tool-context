/* global window, document, console */
/* eslint-env browser */

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
     * Validate data during loading process
     */
    validateDuringLoad(data) {
        if (window.debugHelper) {
            window.debugHelper.logInfo('Data Validator', 'Validating data during load');
        }

        this.resetValidationResults();

        if (data.tools) {
            this.validateToolsData(data.tools);
        }
        if (data.categories) {
            this.validateCategoriesData(data.categories);
        }
        if (data.stats) {
            this.validateStatsData(data.stats);
        }

        // Cross-validate
        this.validateDataConsistency(data);
        this.calculateOverallScore();

        return this.validationResults;
    }

    /**
     * Validate data consistency across files
     */
    validateDataConsistency(data) {
        const results = this.validationResults;
        
        if (!data.tools || !data.categories || !data.stats) {
            return;
        }

        // Check stats vs actual counts
        const actualToolCount = data.tools.length;
        const actualCategoryCount = Array.isArray(data.categories) ? 
            data.categories.length : Object.keys(data.categories).length;

        if (data.stats.totalTools !== actualToolCount) {
            results.statsDiscrepancies = true;
            results.overall.warnings.push(
                `Stats totalTools (${data.stats.totalTools}) doesn't match actual count (${actualToolCount})`
            );
        }

        if (data.stats.totalCategories !== actualCategoryCount) {
            results.statsDiscrepancies = true;
            results.overall.warnings.push(
                `Stats totalCategories (${data.stats.totalCategories}) doesn't match actual count (${actualCategoryCount})`
            );
        }

        // Check category tool counts
        const toolsByCategory = {};
        data.tools.forEach(tool => {
            if (tool.category) {
                const cat = tool.category;
                toolsByCategory[cat] = (toolsByCategory[cat] || 0) + 1;
            }
        });

        const categoryNames = Array.isArray(data.categories) ?
            data.categories.map(c => c.name || c.id) :
            Object.keys(data.categories);

        // Check for orphaned categories
        const orphanedCategories = categoryNames.filter(cat => 
            !toolsByCategory[cat] || toolsByCategory[cat] === 0
        );

        if (orphanedCategories.length > 0) {
            results.overall.warnings.push(
                `Orphaned categories with no tools: ${orphanedCategories.join(', ')}`
            );
        }

        // Check for missing categories
        const missingCategories = Object.keys(toolsByCategory).filter(cat =>
            !categoryNames.some(name => name.toLowerCase() === cat.toLowerCase())
        );

        if (missingCategories.length > 0) {
            results.overall.warnings.push(
                `Tools reference missing categories: ${missingCategories.join(', ')}`
            );
        }

        // Check data freshness
        if (data.stats.generatedAt) {
            const age = Date.now() - data.stats.generatedAt;
            const days = age / (1000 * 60 * 60 * 24);
            if (days > 30) {
                results.overall.warnings.push(
                    `Data is ${Math.floor(days)} days old, consider regenerating`
                );
            }
        }

        results.categoryCountDiscrepancies = orphanedCategories.length > 0 || missingCategories.length > 0;
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

            // Check if data is available - fallback to CLIApp state if globals are missing
            const tools = window.toolsData || window.CLIApp?.state?.tools || [];
            const categories = window.categoriesData || window.CLIApp?.state?.categories || [];
            const stats = window.statsData || window.CLIApp?.state?.stats || {};
            
            const hasTools = tools.length > 0;
            const hasCategories = categories.length > 0;
            const hasStats = Object.keys(stats).length > 0;

            if (!hasTools || !hasCategories || !hasStats) {
                if (window.debugHelper) {
                    window.debugHelper.logError('Data Validator', 'Global data objects not available', {
                        hasTools, hasCategories, hasStats
                    });
                }
                return this.validationResults;
            }

            // Validate each data type using fallback data
            this.validateToolsData(tools);
            this.validateCategoriesData(categories);
            this.validateStatsData(stats);

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
    validateToolsData(tools = null) {
        const result = this.validationResults.tools;
        
        try {
            if (!tools) {
                tools = window.toolsData || window.CLIApp?.state?.tools || [];
            }
            
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

            // Required fields for each tool - relaxed to allow 'unknown' values
            const requiredFields = ['name', 'description'];  // Only name and description are truly required
            const recommendedFields = ['category', 'installation', 'platform'];  // These should be present but can be 'unknown'
            const optionalFields = ['difficulty', 'tags', 'commands', 'examples'];
            
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
                
                // Check for recommended fields (warnings only)
                const missingRecommended = recommendedFields.filter(field => 
                    !tool.hasOwnProperty(field) || tool[field] === null || tool[field] === undefined || tool[field] === ''
                );
                
                if (missingRecommended.length > 0) {
                    result.warnings.push(`Tool "${tool.name || 'unnamed'}" is missing recommended fields: ${missingRecommended.join(', ')}`);
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
     * Helper to get platforms array from tool (handles both platform and platforms fields)
     */
    getPlatforms(tool) {
        if (Array.isArray(tool.platforms)) {
            return tool.platforms;
        }
        if (Array.isArray(tool.platform)) {
            return tool.platform;
        }
        if (typeof tool.platforms === 'string') {
            return [tool.platforms];
        }
        if (typeof tool.platform === 'string') {
            return [tool.platform];
        }
        return [];
    }

    /**
     * Validate individual tool fields
     */
    validateToolFields(tool, index, result) {
        // Use DataNormalizer if available for canonical validation
        const canonicalPlatforms = window.DataNormalizer?.CANONICAL_PLATFORMS || 
            ['macOS', 'Linux', 'Windows', 'cross-platform', 'web', 'BSD', 'Unix', 'Android', 'iOS'];
        const canonicalInstallations = window.DataNormalizer?.CANONICAL_INSTALLATIONS || 
            ['built-in', 'homebrew', 'npm', 'pip', 'package-manager', 'download', 'source', 'cargo', 'gem', 'go', 'docker', 'script'];


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

        // Platform validation - validate normalized values against canonical list
        const platforms = this.getPlatforms(tool);
        if (tool.platform || tool.platforms) {
            if (platforms.length === 0) {
                result.warnings.push(`Tool ${index}: platform/platforms should be string or array`);
            } else {
                // Normalize platforms first, then validate the normalized values
                if (window.DataNormalizer) {
                    // Get normalized platforms
                    const normalizedPlatforms = platforms.map(p => 
                        window.DataNormalizer.normalizePlatformString(p)
                    ).filter(Boolean);
                    
                    // Check normalized values against canonical list
                    const unknownNormalized = normalizedPlatforms.filter(p => 
                        !window.DataNormalizer.CANONICAL_PLATFORMS.includes(p)
                    );
                    
                    // Only report if normalized values are still unknown
                    if (unknownNormalized.length > 0) {
                        result.warnings.push(`Tool ${index}: unknown platforms after normalization: ${unknownNormalized.join(', ')}`);
                    }
                    
                    // Optionally report which raw values were normalized
                    const normalizedMappings = [];
                    platforms.forEach((raw, i) => {
                        const normalized = normalizedPlatforms[i];
                        if (normalized && raw !== normalized) {
                            normalizedMappings.push(`${raw} → ${normalized}`);
                        }
                    });
                    
                    if (normalizedMappings.length > 0 && this.options?.reportNormalization) {
                        result.info = result.info || [];
                        result.info.push(`Tool ${index}: platform normalizations: ${normalizedMappings.join(', ')}`);
                    }
                } else {
                    // Fallback validation without normalizer
                    const unknownPlatforms = platforms.filter(p => 
                        !canonicalPlatforms.some(cp => cp.toLowerCase() === p.toLowerCase())
                    );
                    if (unknownPlatforms.length > 0) {
                        result.warnings.push(`Tool ${index}: unknown platforms: ${unknownPlatforms.join(', ')}`);
                    }
                }
            }
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
            if (window.DataNormalizer) {
                // Use normalizer to validate installation methods
                const normalizedMethods = window.DataNormalizer.normalizeInstallation(tool.installation);
                if (normalizedMethods.length === 0 && tool.installation) {
                    result.warnings.push(`Tool ${index}: could not normalize installation method`);
                }
            } else {
                // Fallback validation
                if (typeof tool.installation === 'object') {
                    // Check installation methods
                    const validMethods = canonicalInstallations;
                    const methods = Object.keys(tool.installation);
                    const invalidMethods = methods.filter(m => 
                        !validMethods.some(vm => vm.toLowerCase() === m.toLowerCase())
                    );
                    if (invalidMethods.length > 0) {
                        result.warnings.push(`Tool ${index}: unknown installation methods: ${invalidMethods.join(', ')}`);
                    }
                } else if (typeof tool.installation !== 'string' && !Array.isArray(tool.installation)) {
                    result.warnings.push(`Tool ${index}: installation should be string, array, or object`);
                }
            }
        }

        // Data completeness scoring
        if (window.DataNormalizer) {
            const quality = window.DataNormalizer.calculateToolQuality(tool);
            if (quality.grade === 'F') {
                result.warnings.push(`Tool ${index} (${tool.name}): poor data quality (${quality.percentage}%)`);
            }
        }
    }

    /**
     * Validate categories data
     */
    validateCategoriesData(categories = null) {
        const result = this.validationResults.categories;
        
        try {
            if (!categories) {
                categories = window.categoriesData || window.CLIApp?.state?.categories || [];
            }
            
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
    validateStatsData(stats = null) {
        const result = this.validationResults.stats;
        
        try {
            if (!stats) {
                stats = window.statsData || window.CLIApp?.state?.stats || {};
            }
            
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
            const tools = window.toolsData || window.CLIApp?.state?.tools || [];
            const categories = window.categoriesData || window.CLIApp?.state?.categories || [];
            const stats = window.statsData || window.CLIApp?.state?.stats || {};

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
     * Generate actionable recommendations based on validation results
     */
    generateRecommendations() {
        const recommendations = [];
        const results = this.validationResults;

        // Critical issues
        if (results.tools.errors.length > 0) {
            recommendations.push({
                severity: 'error',
                category: 'tools',
                message: 'Fix critical tool data errors',
                actions: results.tools.errors.slice(0, 3)
            });
        }

        if (results.categories.errors.length > 0) {
            recommendations.push({
                severity: 'error',
                category: 'categories',
                message: 'Fix critical category data errors',
                actions: results.categories.errors.slice(0, 3)
            });
        }

        // Data consistency issues
        if (results.statsDiscrepancies) {
            recommendations.push({
                severity: 'warning',
                category: 'stats',
                message: 'Update stats to match actual data counts',
                actions: ['Regenerate stats.json with correct counts']
            });
        }

        if (results.categoryCountDiscrepancies) {
            recommendations.push({
                severity: 'warning',
                category: 'categories',
                message: 'Reconcile category-tool relationships',
                actions: ['Remove orphaned categories', 'Add missing category definitions']
            });
        }

        // Data quality improvements
        const poorQualityTools = results.tools.warnings.filter(w => w.includes('poor data quality'));
        if (poorQualityTools.length > 5) {
            recommendations.push({
                severity: 'info',
                category: 'quality',
                message: `Improve data quality for ${poorQualityTools.length} tools`,
                actions: ['Add missing descriptions', 'Specify platforms and installation methods']
            });
        }

        return recommendations;
    }

    /**
     * Calculate data quality metrics
     */
    calculateDataQuality(data) {
        let totalQuality = 0;
        let toolCount = 0;

        if (data.tools && window.DataNormalizer) {
            data.tools.forEach(tool => {
                const quality = window.DataNormalizer.calculateToolQuality(tool);
                totalQuality += quality.percentage;
                toolCount++;
            });
        }

        const averageQuality = toolCount > 0 ? Math.round(totalQuality / toolCount) : 0;
        
        return {
            averageQuality,
            grade: averageQuality >= 90 ? 'A' :
                   averageQuality >= 80 ? 'B' :
                   averageQuality >= 70 ? 'C' :
                   averageQuality >= 60 ? 'D' : 'F',
            toolsAnalyzed: toolCount
        };
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
    const recommendations = window.dataValidator.generateRecommendations();
    
    console.group('Data Validation Report');
    console.log(report.summary);
    report.details.forEach(detail => console.log(detail));
    
    if (recommendations.length > 0) {
        console.log('\nRecommendations:');
        recommendations.forEach(rec => {
            console.log(`[${rec.severity.toUpperCase()}] ${rec.message}`);
            rec.actions.forEach(action => console.log(`  - ${action}`));
        });
    }
    
    if (suggestions.length > 0) {
        console.log('\nSuggested fixes:');
        suggestions.forEach((suggestion, i) => console.log(`${i + 1}. ${suggestion}`));
    }
    console.groupEnd();
    
    return { results, report, suggestions, recommendations };
};

// Export DataValidator for module usage
window.DataValidator = DataValidator;