/**
 * Data Normalization Module
 * Provides comprehensive normalization for platform and installation data
 */

(function(window) {
    'use strict';

    // Canonical platform definitions with comprehensive alias mapping
    const PLATFORM_ALIASES = {
        'macOS': ['mac', 'macos', 'osx', 'os x', 'darwin', 'apple', 'macintosh', 'mac os', 'mac-os', 'macosx', 'mac os x'],
        'Linux': ['linux', 'nix', 'unix', 'gnu', 'ubuntu', 'debian', 'fedora', 'centos', 'rhel', 'arch', 'manjaro', 'redhat', 'red hat', 'suse', 'opensuse', 'gentoo', 'mint', 'kali', 'alpine', 'gnu/linux'],
        'Windows': ['windows', 'win', 'win32', 'win64', 'pc', 'microsoft', 'dos', 'ms-dos', 'msdos', 'windows nt', 'winnt'],
        'cross-platform': ['cross-platform', 'cross platform', 'crossplatform', 'universal', 'any', 'all', 'multi-platform', 'multiplatform', 'portable'],
        'web': ['web', 'browser', 'online', 'webapp', 'web-based', 'cloud', 'saas'],
        'BSD': ['bsd', 'freebsd', 'openbsd', 'netbsd', 'dragonfly', 'dragonflybsd'],
        'Unix': ['unix', 'posix', 'unix-like', 'unixlike'],
        'Android': ['android', 'droid'],
        'iOS': ['ios', 'iphone', 'ipad', 'ipados']
    };

    // Canonical installation method definitions with comprehensive alias mapping
    const INSTALLATION_ALIASES = {
        'built-in': ['builtin', 'built in', 'built-in', 'native', 'system', 'default', 'included', 'preinstalled', 'pre-installed', 'bundled', 'ships with', 'comes with', 'out of the box', 'ootb'],
        'homebrew': ['brew', 'home-brew', 'home brew', 'homebrew', 'linuxbrew', 'homebrew/core', 'homebrew/cask', 'brewfile'],
        'npm': ['node', 'npm', 'npx', 'nodejs', 'node.js', 'yarn', 'pnpm', 'bun', 'node package manager', 'javascript', 'js'],
        'pip': ['pip', 'pip3', 'python', 'pypi', 'python-pip', 'conda', 'pipenv', 'poetry', 'python package', 'py', 'python3', 'pip install', 'easy_install'],
        'package-manager': ['package manager', 'pkg', 'package', 'apt', 'yum', 'dnf', 'pacman', 'zypper', 'apk', 'emerge', 'apt-get', 'aptitude', 'snap', 'flatpak', 'nix', 'guix', 'port', 'macports', 'ports'],
        'download': ['download', 'binary', 'executable', 'installer', 'dmg', 'msi', 'exe', 'app', 'appimage', 'deb', 'rpm', 'tar', 'zip', 'archive', 'release', 'github release', 'direct download'],
        'source': ['source', 'compile', 'build', 'git', 'github', 'manual', 'make', 'cmake', 'from source', 'build from source', 'compilation', 'svn', 'mercurial', 'hg', 'clone'],
        'cargo': ['cargo', 'rust', 'rustup', 'crates.io', 'cargo install'],
        'gem': ['gem', 'ruby', 'rubygems', 'bundler', 'gem install'],
        'go': ['go', 'golang', 'go get', 'go install', 'go mod'],
        'docker': ['docker', 'container', 'docker hub', 'dockerfile', 'docker image', 'docker pull'],
        'script': ['script', 'curl', 'wget', 'shell', 'bash', 'sh', 'install script', 'installer script', 'one-liner']
    };

    // Export canonical constants
    const CANONICAL_PLATFORMS = Object.keys(PLATFORM_ALIASES);
    const CANONICAL_INSTALLATIONS = Object.keys(INSTALLATION_ALIASES);

    /**
     * Normalize a platform string to its canonical form
     */
    function normalizePlatformString(platform) {
        if (!platform) return null;
        
        const normalized = platform.toString().toLowerCase().trim();
        
        // Check each canonical platform's aliases
        for (const [canonical, aliases] of Object.entries(PLATFORM_ALIASES)) {
            if (aliases.includes(normalized)) {
                return canonical;
            }
        }
        
        // If no alias match, check if it's already canonical (case-insensitive)
        for (const canonical of CANONICAL_PLATFORMS) {
            if (canonical.toLowerCase() === normalized) {
                return canonical;
            }
        }
        
        // Return original if no match found (preserve unknown platforms)
        return platform;
    }

    /**
     * Extract platforms from various input formats
     */
    function extractPlatforms(input) {
        if (!input) return [];
        
        let platforms = [];
        
        // Handle array input
        if (Array.isArray(input)) {
            platforms = input;
        }
        // Handle string input (comma or pipe separated)
        else if (typeof input === 'string') {
            platforms = input.split(/[,|]/).map(p => p.trim()).filter(Boolean);
        }
        // Handle object with platform properties
        else if (typeof input === 'object') {
            // Check for boolean flags
            const booleanPlatforms = [];
            for (const key of ['macOS', 'linux', 'windows', 'mac', 'win']) {
                if (input[key] === true) {
                    booleanPlatforms.push(key);
                }
            }
            if (booleanPlatforms.length > 0) {
                platforms = booleanPlatforms;
            }
            // Check for platforms array within object
            else if (input.platforms && Array.isArray(input.platforms)) {
                platforms = input.platforms;
            }
            // Check for platform string within object
            else if (input.platform && typeof input.platform === 'string') {
                platforms = extractPlatforms(input.platform);
            }
        }
        
        return platforms;
    }

    /**
     * Normalize platforms to canonical form with deduplication
     */
    function normalizePlatforms(input) {
        const platforms = extractPlatforms(input);
        const normalized = new Set();
        
        for (const platform of platforms) {
            const canonical = normalizePlatformString(platform);
            if (canonical) {
                normalized.add(canonical);
            }
        }
        
        // Return in canonical order
        const ordered = [];
        for (const canonical of CANONICAL_PLATFORMS) {
            if (normalized.has(canonical)) {
                ordered.push(canonical);
            }
        }
        
        return ordered;
    }

    /**
     * Normalize an installation method string to its canonical form
     */
    function normalizeInstallationString(method) {
        if (!method) return null;
        
        const normalized = method.toString().toLowerCase().trim();
        
        // Check each canonical installation's aliases
        for (const [canonical, aliases] of Object.entries(INSTALLATION_ALIASES)) {
            if (aliases.includes(normalized)) {
                return canonical;
            }
        }
        
        // If no alias match, check if it's already canonical (case-insensitive)
        for (const canonical of CANONICAL_INSTALLATIONS) {
            if (canonical.toLowerCase() === normalized) {
                return canonical;
            }
        }
        
        // Check for partial matches (e.g., "brew install" -> "homebrew")
        for (const [canonical, aliases] of Object.entries(INSTALLATION_ALIASES)) {
            for (const alias of aliases) {
                if (normalized.includes(alias) || alias.includes(normalized)) {
                    return canonical;
                }
            }
        }
        
        // Return original if no match found (preserve unknown methods)
        return method;
    }

    /**
     * Extract installation methods from various input formats
     */
    function extractInstallationMethods(input) {
        if (!input) return [];
        
        let methods = [];
        
        // Handle array input
        if (Array.isArray(input)) {
            methods = input;
        }
        // Handle string input
        else if (typeof input === 'string') {
            // Check for multiple methods separated by common delimiters
            if (input.includes(',') || input.includes('|') || input.includes('/')) {
                methods = input.split(/[,|/]/).map(m => m.trim()).filter(Boolean);
            } else {
                methods = [input];
            }
        }
        // Handle object input
        else if (typeof input === 'object') {
            // Check for method property
            if (input.method) {
                methods = extractInstallationMethods(input.method);
            }
            // Check for methods array
            else if (input.methods && Array.isArray(input.methods)) {
                methods = input.methods;
            }
            // Check for type property (common in some formats)
            else if (input.type) {
                methods = extractInstallationMethods(input.type);
            }
            // Check for command property
            else if (input.command) {
                // Try to infer from command
                const command = input.command.toLowerCase();
                if (command.includes('brew')) methods.push('homebrew');
                else if (command.includes('npm') || command.includes('npx')) methods.push('npm');
                else if (command.includes('pip')) methods.push('pip');
                else if (command.includes('cargo')) methods.push('cargo');
                else if (command.includes('gem')) methods.push('gem');
                else if (command.includes('apt') || command.includes('yum')) methods.push('package-manager');
                else methods.push('source');
            }
        }
        
        return methods;
    }

    /**
     * Normalize installation methods to canonical form with deduplication
     */
    function normalizeInstallation(input) {
        const methods = extractInstallationMethods(input);
        const normalized = new Set();
        
        for (const method of methods) {
            const canonical = normalizeInstallationString(method);
            if (canonical) {
                normalized.add(canonical);
            }
        }
        
        // Return in canonical order
        const ordered = [];
        for (const canonical of CANONICAL_INSTALLATIONS) {
            if (normalized.has(canonical)) {
                ordered.push(canonical);
            }
        }
        
        return ordered;
    }

    /**
     * Calculate data quality score for a tool entry
     */
    function calculateToolQuality(tool) {
        let score = 0;
        let maxScore = 0;
        
        // Required fields
        const requiredFields = ['name', 'description', 'difficulty'];
        for (const field of requiredFields) {
            maxScore += 10;
            if (tool[field] && tool[field].toString().trim()) {
                score += 10;
            }
        }
        
        // Important fields
        const importantFields = ['category', 'platforms', 'installation', 'example'];
        for (const field of importantFields) {
            maxScore += 5;
            if (tool[field]) {
                score += 5;
                // Extra points for rich data
                if (Array.isArray(tool[field]) && tool[field].length > 1) {
                    score += 2;
                    maxScore += 2;
                }
            }
        }
        
        // Optional but valuable fields
        const optionalFields = ['alternatives', 'related', 'documentation', 'tips'];
        for (const field of optionalFields) {
            maxScore += 3;
            if (tool[field]) {
                score += 3;
            }
        }
        
        return {
            score: score,
            maxScore: maxScore,
            percentage: Math.round((score / maxScore) * 100),
            grade: score / maxScore >= 0.9 ? 'A' :
                   score / maxScore >= 0.8 ? 'B' :
                   score / maxScore >= 0.7 ? 'C' :
                   score / maxScore >= 0.6 ? 'D' : 'F'
        };
    }

    /**
     * Normalize a complete tool entry
     */
    function normalizeToolEntry(tool) {
        if (!tool) return null;
        
        const normalized = { ...tool };
        
        // Normalize platforms
        const platforms = normalizePlatforms(tool.platforms || tool.platform || []);
        normalized.platforms = platforms;
        // Keep backward compatibility
        normalized.platform = platforms;
        
        // Normalize installation
        const installation = normalizeInstallation(tool.installation || tool.install || []);
        normalized.installation = installation;
        
        // Ensure required fields have defaults
        normalized.name = normalized.name || 'Unknown Tool';
        normalized.description = normalized.description || '';
        normalized.difficulty = normalized.difficulty || 1;
        
        // Normalize difficulty to number if string
        if (typeof normalized.difficulty === 'string') {
            const diffNum = parseInt(normalized.difficulty, 10);
            normalized.difficulty = isNaN(diffNum) ? 1 : Math.min(5, Math.max(1, diffNum));
        }
        
        // Add data quality metrics
        normalized._quality = calculateToolQuality(normalized);
        
        // Generate tool ID if missing
        if (!normalized.id) {
            normalized.id = normalized.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        }
        
        return normalized;
    }

    /**
     * Normalize a category entry
     */
    function normalizeCategory(category) {
        if (!category) return null;
        
        const normalized = { ...category };
        
        // Generate category ID from name if missing
        if (!normalized.id && normalized.name) {
            normalized.id = normalized.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        }
        
        // Ensure required fields
        normalized.name = normalized.name || 'Unknown Category';
        normalized.description = normalized.description || '';
        normalized.icon = normalized.icon || '📁';
        normalized.tools = normalized.tools || [];
        
        // Normalize tool count (will be recalculated later)
        normalized.toolCount = normalized.toolCount || normalized.tools.length || 0;
        
        return normalized;
    }

    /**
     * Recalculate category tool counts based on actual tool data
     */
    function recalculateCategoryCounts(categories, tools) {
        const counts = {};
        
        // Count tools per category
        for (const tool of tools) {
            const category = tool.category;
            if (category) {
                counts[category] = (counts[category] || 0) + 1;
            }
        }
        
        // Update category counts
        const normalized = categories.map(cat => {
            const updated = { ...cat };
            const categoryKey = cat.name || cat.id;
            updated.toolCount = counts[categoryKey] || 0;
            return updated;
        });
        
        return normalized;
    }

    // Export the module
    window.DataNormalizer = {
        // Platform normalization
        normalizePlatforms,
        normalizePlatformString,
        extractPlatforms,
        CANONICAL_PLATFORMS,
        
        // Installation normalization
        normalizeInstallation,
        normalizeInstallationString,
        extractInstallationMethods,
        CANONICAL_INSTALLATIONS,
        
        // Entry normalization
        normalizeToolEntry,
        normalizeCategory,
        recalculateCategoryCounts,
        
        // Quality metrics
        calculateToolQuality,
        
        // Alias maps for testing/debugging
        PLATFORM_ALIASES,
        INSTALLATION_ALIASES
    };

})(window);