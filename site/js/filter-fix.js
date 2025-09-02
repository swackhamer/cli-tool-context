/**
 * Filter and Search Fix for CLI Tool Context
 * This script fixes issues with filtering and search functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for CLIApp to be initialized
    const waitForCLIApp = setInterval(function() {
        if (window.CLIApp && window.CLIApp.initialized) {
            clearInterval(waitForCLIApp);
            console.log('CLIApp initialized, applying fixes...');
            applyFixes();
        }
    }, 100);
    
    // Fallback initialization after 3 seconds if CLIApp isn't detected
    setTimeout(function() {
        if (!window.CLIApp || !window.CLIApp.initialized) {
            console.warn('CLIApp not initialized after timeout, forcing fix application...');
            if (!window.CLIApp) {
                window.CLIApp = {
                    state: {
                        tools: [],
                        filteredTools: [],
                        filters: {},
                        categories: [],
                        stats: {}
                    },
                    initialized: true
                };
            }
            applyFixes();
        }
    }, 3000);

    function applyFixes() {
        console.log('Applying filter and search fixes...');
        
        try {
            // Fix 1: Ensure filter event handlers are properly attached
            attachFilterEventHandlers();
            
            // Fix 2: Fix difficulty filter
            fixDifficultyFilter();
            
            // Fix 3: Fix platform filter
            fixPlatformFilter();
            
            // Fix 4: Fix search functionality
            fixSearchFunctionality();
            
            // Fix 5: Ensure data is properly loaded
            ensureDataLoaded();
            
            // Fix 6: Force re-apply filters to update UI
            if (window.CLIApp && typeof window.CLIApp.applyFilters === 'function') {
                setTimeout(() => {
                    console.log('Re-applying filters to update UI...');
                    window.CLIApp.applyFilters();
                }, 1000);
            }
            
            // Add diagnostic info to console
            console.log('Filter and search fixes applied successfully!');
            console.log('Current state:', window.CLIApp ? {
                'tools': window.CLIApp.state?.tools?.length || 0,
                'filteredTools': window.CLIApp.state?.filteredTools?.length || 0,
                'filters': window.CLIApp.state?.filters || {},
                'categories': window.CLIApp.state?.categories?.length || 0
            } : 'CLIApp not available');
        } catch (error) {
            console.error('Error applying fixes:', error);
        }
    }

    function attachFilterEventHandlers() {
        // Re-attach event handlers for filter controls
        const filterControls = [
            { id: 'categoryFilter', filter: 'category' },
            { id: 'difficultyFilter', filter: 'difficulty' },
            { id: 'platformFilter', filter: 'platform' },
            { id: 'installationFilter', filter: 'installation' },
            { id: 'sortBy', filter: 'sort' }
        ];

        filterControls.forEach(control => {
            const element = document.getElementById(control.id);
            if (element) {
                // Remove existing event listeners (if any)
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
                
                // Add new event listener
                newElement.addEventListener('change', function() {
                    if (control.filter === 'sort') {
                        if (window.CLIApp && window.CLIApp.state) {
                            window.CLIApp.state.sortBy = this.value;
                        }
                    } else {
                        if (window.CLIApp && window.CLIApp.state && window.CLIApp.state.filters) {
                            window.CLIApp.state.filters[control.filter] = this.value;
                        }
                    }
                    
                    if (window.CLIApp && typeof window.CLIApp.applyFilters === 'function') {
                        window.CLIApp.applyFilters();
                    }
                });
            }
        });

        // Fix reset filters button
        const resetFiltersBtn = document.getElementById('resetFilters');
        if (resetFiltersBtn) {
            const newResetBtn = resetFiltersBtn.cloneNode(true);
            resetFiltersBtn.parentNode.replaceChild(newResetBtn, resetFiltersBtn);
            
            newResetBtn.addEventListener('click', function() {
                if (window.CLIApp && typeof window.CLIApp.resetFilters === 'function') {
                    window.CLIApp.resetFilters();
                }
            });
        }

        // Fix search input and button
        const searchInput = document.getElementById('toolSearch');
        const searchButton = document.getElementById('toolSearchButton');
        const searchClear = document.getElementById('toolSearchClear');
        
        if (searchInput) {
            const newSearchInput = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            
            newSearchInput.addEventListener('input', function() {
                if (window.CLIApp && window.CLIApp.state && window.CLIApp.state.filters) {
                    window.CLIApp.state.filters.search = this.value;
                }
                
                // Show/hide clear button
                if (searchClear) {
                    searchClear.style.display = this.value ? 'block' : 'none';
                }
                
                // Debounce search to avoid excessive filtering
                if (window.CLIApp._searchDebounce) {
                    clearTimeout(window.CLIApp._searchDebounce);
                }
                
                window.CLIApp._searchDebounce = setTimeout(function() {
                    if (window.CLIApp && typeof window.CLIApp.applyFilters === 'function') {
                        window.CLIApp.applyFilters();
                    }
                }, 300);
            });
            
            // Add keypress event for Enter key
            newSearchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    if (window.CLIApp && typeof window.CLIApp.applyFilters === 'function') {
                        window.CLIApp.applyFilters();
                    }
                }
            });
        }
        
        if (searchButton) {
            const newSearchButton = searchButton.cloneNode(true);
            searchButton.parentNode.replaceChild(newSearchButton, searchButton);
            
            newSearchButton.addEventListener('click', function() {
                if (window.CLIApp && typeof window.CLIApp.applyFilters === 'function') {
                    window.CLIApp.applyFilters();
                }
            });
        }
        
        if (searchClear) {
            const newSearchClear = searchClear.cloneNode(true);
            searchClear.parentNode.replaceChild(newSearchClear, searchClear);
            
            newSearchClear.addEventListener('click', function() {
                if (searchInput) {
                    searchInput.value = '';
                }
                
                if (window.CLIApp && window.CLIApp.state && window.CLIApp.state.filters) {
                    window.CLIApp.state.filters.search = '';
                }
                
                this.style.display = 'none';
                
                if (window.CLIApp && typeof window.CLIApp.applyFilters === 'function') {
                    window.CLIApp.applyFilters();
                }
            });
        }
    }

    function fixDifficultyFilter() {
        // Fix difficulty filter functionality
        if (window.CLIApp) {
            console.log('Fixing difficulty filter...');
            
            // Ensure the difficulty filter element is working
            const difficultyFilter = document.getElementById('difficultyFilter');
            if (difficultyFilter) {
                // Make sure the difficulty filter has the correct options
                if (difficultyFilter.options.length === 0) {
                    // Add options if missing
                    const options = [
                        { value: '', text: 'All Levels' },
                        { value: '1', text: '⭐ Beginner' },
                        { value: '2', text: '⭐⭐ Basic' },
                        { value: '3', text: '⭐⭐⭐ Intermediate' },
                        { value: '4', text: '⭐⭐⭐⭐ Advanced' },
                        { value: '5', text: '⭐⭐⭐⭐⭐ Expert' }
                    ];
                    
                    options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.textContent = opt.text;
                        difficultyFilter.appendChild(option);
                    });
                }
            }
            
            // Patch the filterAndSortTools method to correctly handle difficulty filtering
            const originalFilterAndSortTools = window.CLIApp.filterAndSortTools;
            if (originalFilterAndSortTools) {
                window.CLIApp.filterAndSortTools = async function() {
                    try {
                        if (!Array.isArray(window.CLIApp.state.tools)) {
                            console.warn('No tools data available for filtering');
                            window.CLIApp.state.filteredTools = [];
                            return;
                        }

                        // Rest of the original function...
                        let filtered = [...window.CLIApp.state.tools];
                        let searchResultsMap = new Map();

                        // Apply search filter
                        if (window.CLIApp.state.filters.search) {
                            // Original search logic...
                            const query = window.CLIApp.state.filters.search.trim();
                            try {
                                const searchResults = await window.CLIApp.performSearch(query, filtered.length);
                                
                                if (Array.isArray(searchResults) && searchResults.length > 0) {
                                    // Extract IDs from search results
                                    const searchIds = searchResults.map(result => {
                                        if (result && typeof result === 'object') {
                                            if (result.id) return result.id;
                                            if (result.tool && result.tool.id) return result.tool.id;
                                            if (result.ref) return result.ref;
                                        }
                                        return null;
                                    }).filter(Boolean);
                                    
                                    filtered = filtered.filter(tool => searchIds.includes(tool.id));
                                } else {
                                    filtered = [];
                                }
                            } catch (searchErr) {
                                console.error('Search failed, using simple matching:', searchErr);
                                const lowerQuery = window.CLIApp.state.filters.search.toLowerCase();
                                filtered = filtered.filter(tool => 
                                    (tool.name && tool.name.toLowerCase().includes(lowerQuery)) ||
                                    (tool.description && tool.description.toLowerCase().includes(lowerQuery)) ||
                                    (tool.tags && Array.isArray(tool.tags) && tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
                                );
                            }
                        }

                        // Apply category filter
                        if (window.CLIApp.state.filters.category) {
                            filtered = filtered.filter(tool => {
                                const toolCategory = (tool.category || '').trim().toLowerCase();
                                const filterCategory = window.CLIApp.state.filters.category.trim().toLowerCase();
                                return toolCategory === filterCategory;
                            });
                        }

                        // Apply difficulty filter - FIXED VERSION
                        if (window.CLIApp.state.filters.difficulty) {
                            const difficultyLevel = parseInt(window.CLIApp.state.filters.difficulty);
                            if (!isNaN(difficultyLevel) && difficultyLevel >= 1 && difficultyLevel <= 5) {
                                filtered = filtered.filter(tool => {
                                    // Handle different difficulty formats
                                    let toolDiff;
                                    if (typeof tool.difficulty === 'number') {
                                        toolDiff = tool.difficulty;
                                    } else if (typeof tool.difficulty === 'string') {
                                        toolDiff = parseInt(tool.difficulty);
                                    } else if (tool.difficulty && typeof tool.difficulty === 'object') {
                                        // Handle object format
                                        if (tool.difficulty.level) {
                                            toolDiff = parseInt(tool.difficulty.level);
                                        } else if (tool.difficulty.value) {
                                            toolDiff = parseInt(tool.difficulty.value);
                                        }
                                    }
                                    
                                    // If we couldn't parse a number, try to infer from stars
                                    if (isNaN(toolDiff) && tool.difficulty && typeof tool.difficulty === 'string') {
                                        // Count stars to determine difficulty
                                        const stars = (tool.difficulty.match(/⭐/g) || []).length;
                                        if (stars > 0) {
                                            toolDiff = stars;
                                        }
                                    }
                                    
                                    return !isNaN(toolDiff) && toolDiff === difficultyLevel;
                                });
                            }
                        }

                        // Apply platform filter
                        if (window.CLIApp.state.filters.platform) {
                            // Original platform filter logic...
                            filtered = filtered.filter(tool => {
                                if (!tool.platform && !tool.platforms) return false;
                                
                                // Extract platforms
                                let platforms = [];
                                if (typeof tool.platform === 'string') {
                                    platforms = [tool.platform];
                                } else if (Array.isArray(tool.platform)) {
                                    platforms = tool.platform;
                                } else if (Array.isArray(tool.platforms)) {
                                    platforms = tool.platforms;
                                } else if (typeof tool.platform === 'object' && tool.platform !== null) {
                                    // Handle object format
                                    if (tool.platform.primary) {
                                        platforms = [tool.platform.primary];
                                    } else {
                                        platforms = Object.values(tool.platform).filter(p => typeof p === 'string');
                                    }
                                }
                                
                                // Normalize platform names
                                const normalizedPlatforms = platforms.map(p => {
                                    const lp = (p || '').toLowerCase();
                                    if (lp.includes('mac') || lp.includes('osx') || lp.includes('darwin')) return 'macOS';
                                    if (lp.includes('win')) return 'Windows';
                                    if (lp.includes('linux') || lp.includes('unix')) return 'Linux';
                                    return p;
                                });
                                
                                // Check if any platform matches the filter
                                return normalizedPlatforms.some(p => 
                                    p.toLowerCase() === window.CLIApp.state.filters.platform.toLowerCase()
                                );
                            });
                        }

                        // Apply installation filter
                        if (window.CLIApp.state.filters.installation) {
                            // Original installation filter logic...
                            filtered = filtered.filter(tool => {
                                if (!tool.installation) return false;
                                
                                // Extract installation method
                                let installation = '';
                                if (typeof tool.installation === 'string') {
                                    installation = tool.installation;
                                } else if (typeof tool.installation === 'object' && tool.installation !== null) {
                                    if (tool.installation.primary) {
                                        installation = tool.installation.primary;
                                    } else if (tool.installation.method) {
                                        installation = tool.installation.method;
                                    } else {
                                        // Use first property value
                                        const keys = Object.keys(tool.installation);
                                        if (keys.length > 0) {
                                            installation = tool.installation[keys[0]];
                                        }
                                    }
                                }
                                
                                // Normalize installation method
                                const normalizeInstallation = (method) => {
                                    if (!method) return '';
                                    const lm = method.toLowerCase();
                                    if (lm.includes('built') && lm.includes('in')) return 'built-in';
                                    if (lm.includes('brew')) return 'homebrew';
                                    if (lm.includes('npm')) return 'npm';
                                    if (lm.includes('pip')) return 'pip';
                                    if (lm.includes('package') || lm.includes('apt') || lm.includes('yum')) return 'package-manager';
                                    return lm;
                                };
                                
                                // Compare normalized values
                                return normalizeInstallation(installation) === normalizeInstallation(window.CLIApp.state.filters.installation);
                            });
                        }

                        // Sort tools
                        filtered.sort((a, b) => {
                            try {
                                switch (window.CLIApp.state.sortBy) {
                                    case 'name':
                                        return (a.name || '').localeCompare(b.name || '');
                                    case 'name-desc':
                                        return (b.name || '').localeCompare(a.name || '');
                                    case 'category':
                                        return (a.category || '').localeCompare(b.category || '') || (a.name || '').localeCompare(b.name || '');
                                    case 'difficulty':
                                        const aDiff = parseInt(a.difficulty) || 0;
                                        const bDiff = parseInt(b.difficulty) || 0;
                                        return aDiff - bDiff || (a.name || '').localeCompare(b.name || '');
                                    default:
                                        return (a.name || '').localeCompare(b.name || '');
                                }
                            } catch (sortErr) {
                                return 0;
                            }
                        });

                        window.CLIApp.state.filteredTools = filtered;
                        window.CLIApp.state.searchHighlights = searchResultsMap;
                        window.CLIApp.state.currentPage = 1;
                    } catch (error) {
                        console.error('filterAndSortTools error:', error);
                        window.CLIApp.state.filteredTools = [];
                        throw error;
                    }
                };
            }
        }
    }

    function fixPlatformFilter() {
        // Fix platform filter functionality
        if (window.CLIApp) {
            console.log('Fixing platform filter...');
            
            // Ensure the platform filter element is working
            const platformFilter = document.getElementById('platformFilter');
            if (platformFilter) {
                // Make sure the platform filter has the correct options
                if (platformFilter.options.length === 0) {
                    // Add options if missing
                    const options = [
                        { value: '', text: 'All Platforms' },
                        { value: 'macOS', text: 'macOS' },
                        { value: 'Linux', text: 'Linux' },
                        { value: 'Windows', text: 'Windows' },
                        { value: 'cross-platform', text: 'Cross-Platform' },
                        { value: 'web', text: 'Web' }
                    ];
                    
                    options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.textContent = opt.text;
                        platformFilter.appendChild(option);
                    });
                }
            }
            
            // Ensure the normalizePlatforms function works correctly
            window.normalizePlatforms = function(tool) {
                if (!tool) return [];
                
                // Extract platforms from different possible formats
                let platforms = [];
                
                if (tool.platforms && Array.isArray(tool.platforms)) {
                    platforms = tool.platforms;
                } else if (tool.platform && Array.isArray(tool.platform)) {
                    platforms = tool.platform;
                } else if (tool.platform && typeof tool.platform === 'string') {
                    platforms = [tool.platform];
                } else if (tool.platforms && typeof tool.platforms === 'string') {
                    platforms = [tool.platforms];
                } else if (tool.platform && typeof tool.platform === 'object' && tool.platform !== null) {
                    // Handle object format
                    if (tool.platform.primary) {
                        platforms = [tool.platform.primary];
                    } else {
                        platforms = Object.values(tool.platform).filter(p => typeof p === 'string');
                    }
                }
                
                // Normalize platform names
                return platforms.map(p => {
                    if (!p) return null;
                    const lp = p.toLowerCase();
                    if (lp.includes('mac') || lp.includes('osx') || lp.includes('darwin')) return 'macOS';
                    if (lp.includes('win')) return 'Windows';
                    if (lp.includes('linux') || lp.includes('unix')) return 'Linux';
                    return p;
                }).filter(Boolean);
            };
        }
    }

    function fixSearchFunctionality() {
        // Fix search functionality
        if (window.CLIApp) {
            console.log('Fixing search functionality...');
            
            // Ensure search input is working
            const searchInput = document.getElementById('toolSearch');
            if (searchInput) {
                // Make sure search input has the correct attributes
                searchInput.setAttribute('placeholder', 'Search tools by name, description, or keywords...');
                searchInput.setAttribute('autocomplete', 'off');
                searchInput.setAttribute('spellcheck', 'false');
                
                // Force clear any existing search
                searchInput.value = '';
                if (window.CLIApp.state && window.CLIApp.state.filters) {
                    window.CLIApp.state.filters.search = '';
                }
            }
            
            // Patch the performSearch method to handle search properly
            const originalPerformSearch = window.CLIApp.performSearch;
            if (originalPerformSearch) {
                window.CLIApp.performSearch = async function(query, limit = 50) {
                    // Handle empty query
                    if (!query || !query.trim()) {
                        return window.CLIApp.state.tools || [];
                    }
                    
                    // Try using the original search function
                    try {
                        const results = await originalPerformSearch.call(window.CLIApp, query, limit);
                        if (Array.isArray(results) && results.length > 0) {
                            return results;
                        }
                    } catch (error) {
                        console.warn('Original search failed, falling back to simple search:', error);
                    }
                    
                    // Fallback to simple search
                    return window.CLIApp.simpleSearch(query, limit);
                };
            }
            
            // Ensure simpleSearch works correctly
            window.CLIApp.simpleSearch = function(query, limit = 50) {
                try {
                    if (!Array.isArray(window.CLIApp.state.tools)) {
                        return [];
                    }
                    
                    const lowerQuery = query.toLowerCase().trim();
                    const results = [];
                    
                    for (let i = 0; i < window.CLIApp.state.tools.length && results.length < limit; i++) {
                        const tool = window.CLIApp.state.tools[i];
                        if (!tool) continue;
                        
                        let score = 0;
                        const nameMatch = tool.name && tool.name.toLowerCase().includes(lowerQuery);
                        const descMatch = tool.description && tool.description.toLowerCase().includes(lowerQuery);
                        const catMatch = tool.category && tool.category.toLowerCase().includes(lowerQuery);
                        const tagMatch = tool.tags && Array.isArray(tool.tags) && 
                                         tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
                        
                        // Calculate relevance score
                        if (nameMatch) score += 3;
                        if (descMatch) score += 2;
                        if (catMatch) score += 1;
                        if (tagMatch) score += 1;
                        
                        if (score > 0) {
                            results.push({
                                ...tool,
                                score: score / 7 // Normalize score to 0-1
                            });
                        }
                    }
                    
                    // Sort by score and return
                    return results.sort((a, b) => b.score - a.score);
                    
                } catch (error) {
                    console.error('simpleSearch error:', error);
                    return [];
                }
            };
        }
    }

    function ensureDataLoaded() {
        // Ensure data is properly loaded
        if (window.CLIApp) {
            console.log('Ensuring data is properly loaded...');
            
            // Create a debug message in the UI
            const createDebugMessage = (message, isError = false) => {
                // Check if error container exists
                let errorContainer = document.getElementById('error-messages-container');
                if (!errorContainer) {
                    // Create error container if it doesn't exist
                    errorContainer = document.createElement('div');
                    errorContainer.id = 'error-messages-container';
                    errorContainer.className = 'error-messages-container';
                    errorContainer.style.display = 'block';
                    
                    // Insert after tools-controls
                    const toolsControls = document.querySelector('.tools-controls');
                    if (toolsControls && toolsControls.parentNode) {
                        toolsControls.parentNode.insertBefore(errorContainer, toolsControls.nextSibling);
                    } else {
                        document.body.appendChild(errorContainer);
                    }
                }
                
                // Create error message
                const errorMessage = document.createElement('div');
                errorMessage.className = isError ? 'error-message' : 'info-message';
                errorMessage.innerHTML = `
                    <span class="message-icon">${isError ? '⚠️' : 'ℹ️'}</span>
                    <span class="message-text">${message}</span>
                    <button class="message-close">×</button>
                `;
                
                // Add close button functionality
                const closeButton = errorMessage.querySelector('.message-close');
                if (closeButton) {
                    closeButton.addEventListener('click', function() {
                        errorMessage.remove();
                        if (errorContainer.children.length === 0) {
                            errorContainer.style.display = 'none';
                        }
                    });
                }
                
                // Add to container
                errorContainer.appendChild(errorMessage);
                errorContainer.style.display = 'block';
                
                // Auto-remove after 10 seconds
                setTimeout(() => {
                    if (errorMessage.parentNode) {
                        errorMessage.remove();
                        if (errorContainer.children.length === 0) {
                            errorContainer.style.display = 'none';
                        }
                    }
                }, 10000);
            };
            
            // Check if data is already loaded
            if (!Array.isArray(window.CLIApp.state.tools) || window.CLIApp.state.tools.length === 0) {
                console.log('Data not loaded, attempting to load from embedded-data.js or JSON files...');
                
                // Try to load data from embedded-data.js
                if (window.toolsData && Array.isArray(window.toolsData) && window.toolsData.length > 0) {
                    window.CLIApp.state.tools = window.toolsData;
                    console.log(`Loaded ${window.toolsData.length} tools from embedded data`);
                    createDebugMessage(`Successfully loaded ${window.toolsData.length} tools from embedded data.`);
                } else {
                    // Try to load data from JSON files
                    fetch('./data/tools.json')
                        .then(response => response.json())
                        .then(data => {
                            if (Array.isArray(data) && data.length > 0) {
                                window.CLIApp.state.tools = data;
                                console.log(`Loaded ${data.length} tools from tools.json`);
                                createDebugMessage(`Successfully loaded ${data.length} tools from tools.json.`);
                                window.CLIApp.applyFilters();
                            }
                        })
                        .catch(error => {
                            console.error('Failed to load tools.json:', error);
                            createDebugMessage('Failed to load tools data. Please check your connection and try again.', true);
                        });
                }
                
                // Load categories data
                fetch('./data/categories.json')
                    .then(response => response.json())
                    .then(data => {
                        if (Array.isArray(data) && data.length > 0) {
                            window.CLIApp.state.categories = data;
                            console.log(`Loaded ${data.length} categories from categories.json`);
                        }
                    })
                    .catch(error => {
                        console.error('Failed to load categories.json:', error);
                    });
                
                // Load stats data
                fetch('./data/stats.json')
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            window.CLIApp.state.stats = data;
                            console.log('Loaded stats from stats.json');
                        }
                    })
                    .catch(error => {
                        console.error('Failed to load stats.json:', error);
                    });
            }
            
            // Apply filters to show all tools initially
            setTimeout(() => {
                try {
                    window.CLIApp.applyFilters();
                    console.log('Initial filters applied successfully');
                    
                    // Add a debug message to help users
                    if (window.CLIApp.state && window.CLIApp.state.filteredTools) {
                        const count = window.CLIApp.state.filteredTools.length;
                        if (count > 0) {
                            createDebugMessage(`Filtering system is now working. Showing ${count} tools.`);
                        } else {
                            createDebugMessage('Filtering system is ready, but no tools match the current filters.', true);
                        }
                    }
                } catch (error) {
                    console.error('Error applying initial filters:', error);
                    createDebugMessage('There was an error initializing the filtering system. Try refreshing the page.', true);
                }
            }, 500);
        }
    }
});
