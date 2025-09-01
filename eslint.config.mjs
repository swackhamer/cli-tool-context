import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        performance: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        Worker: 'readonly',
        CustomEvent: 'readonly',
        requestIdleCallback: 'readonly',
        requestAnimationFrame: 'readonly',
        
        // Library globals
        lunr: 'readonly',
        Fuse: 'readonly',
        marked: 'readonly',
        DOMPurify: 'readonly',
        
        // App globals
        CLIApp: 'writable',
        toolsData: 'writable',
        categoriesData: 'writable',
        statsData: 'writable',
        debugHelper: 'readonly',
        CLIDebug: 'readonly',
        fallbackSearch: 'readonly',
        errorRecovery: 'readonly',
        performanceMonitor: 'readonly',
        
        // Worker globals
        importScripts: 'readonly',
        self: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }]
    }
  }
];