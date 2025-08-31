# CLI Tools Website

A modern, responsive web interface for browsing, searching, and learning about the 357+ CLI tools documented in the CLI Tools Reference Documentation repository.

## 🌐 Website Overview

This self-contained static website provides an intuitive interface for discovering CLI tools with advanced search and filtering capabilities. Built with modern web technologies and optimized for both desktop and mobile experiences.

### Key Features

- **🔍 Advanced Search** - Full-text search across all 357+ tools using Lunr.js
- **📊 Smart Filtering** - Filter by category, difficulty, platform, and installation method
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **🌙 Dark Mode** - Toggle between light and dark themes with smooth transitions
- **📋 Interactive Cheat Sheet** - Searchable command reference with copy-to-clipboard functionality
- **🔗 Deep Linking** - Shareable URLs for specific searches and tools
- **⚡ Performance Optimized** - Fast loading and smooth interactions for large datasets

## 📁 Directory Structure

```
site/
├── index.html          # Homepage with statistics and navigation (217 lines)
├── tools.html          # Main tool browser with search/filtering (237 lines)
├── cheatsheet.html     # Interactive CLI cheat sheet (178 lines)
├── README.md           # This documentation file
├── styles/
│   └── main.css        # Complete responsive stylesheet (1,247 lines)
├── js/
│   ├── main.js         # Full application logic (1,167 lines)
│   └── search.worker.js # Web Worker for background search indexing
├── lib/
│   ├── lunr.min.js     # Full-text search library
│   ├── marked.min.js   # Markdown rendering
│   ├── dompurify.min.js # HTML sanitization for security
│   ├── prism.min.js    # Syntax highlighting
│   └── prism.min.css   # Prism CSS theme
└── data/
    ├── tools.json      # Complete tool database (generated)
    ├── categories.json # Category statistics (generated)
    ├── stats.json      # Overall metrics (generated)
    └── cheatsheet.json # Cheat sheet content (generated)
```

## 🚀 Getting Started

### Prerequisites

**Required:**
- **Dart SDK** - Required for data generation (`dart --version`)
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge

**Optional:**
- **Python 3** - For local development server
- **jq** - For JSON validation during data generation

### Data Generation

Generate the JSON data files from the main documentation:

```bash
# From the project root directory
./scripts/generate_site_data.sh

# Options available:
./scripts/generate_site_data.sh --help
./scripts/generate_site_data.sh --incremental  # Update only if needed
./scripts/generate_site_data.sh --quiet        # Suppress output
./scripts/generate_site_data.sh --verbose      # Detailed progress
```

### Local Development

Run a local development server to test the website:

```bash
# Navigate to the site directory
cd site

# Start a simple HTTP server
python3 -m http.server 8000

# Or use Node.js if available
npx http-server -p 8000

# Visit in browser
open http://localhost:8000
```

### Deployment

For production deployment:

1. **Generate Data**: Ensure JSON files are up to date
2. **Static Hosting**: Upload the entire `site/` directory to any static host
3. **Web Server**: Configure proper MIME types for `.json` files
4. **SSL**: Enable HTTPS for production use

Popular hosting options:
- GitHub Pages
- Netlify
- Vercel
- Amazon S3 + CloudFront
- Cloudflare Pages

## 🔧 Troubleshooting Guide

### Common Issues and Solutions

#### 1. Search and Filtering Not Working

**Symptoms:**
- Search returns no results
- Filters don't apply correctly
- Tools not appearing

**Solutions:**

1. **Check Data Loading:**
   ```javascript
   // Open browser console (F12) and check:
   console.log(window.toolsData);  // Should show array of tools
   console.log(window.CLIApp?.state?.tools);  // Should match toolsData
   ```

2. **Verify Search Worker:**
   - Look for "Search worker ready" in console
   - If worker fails, system automatically falls back to main thread search
   - Try clearing browser cache if worker persists in failing

3. **Reset Filters:**
   - Click "Reset Filters" button
   - Or run in console: `window.CLIApp?.resetAllFilters()`

4. **Enable Debug Mode:**
   - Add `?debug=true` to URL (e.g., `tools.html?debug=true`)
   - Debug panel shows system status

#### 2. Data Loading Failures

**Symptoms:**
- "Data Generation Required" message
- Empty tools grid
- 0 tools showing

**Solutions:**

1. **Generate Data Files:**
   ```bash
   # From project root
   ./scripts/generate_site_data.sh
   ```

2. **Check File Paths:**
   - Ensure `data/tools.json` exists
   - Verify file size > 0
   - Check JSON validity: `jq . site/data/tools.json`

3. **File Protocol Issues:**
   - If opening via `file://`, use a local server instead
   - Web Workers don't work with `file://` protocol

#### 3. Platform/Installation Filter Issues

**Problem:** Filters show incorrect results

**Root Cause:** Data type inconsistencies (string vs array)

**Solution:** The system now normalizes all data types automatically. If issues persist:
1. Clear browser cache
2. Regenerate data files
3. Check tool data format in `tools.json`

#### 4. Search Worker Failures

**Symptoms:**
- "Search worker error" in console
- Slow search performance

**Solutions:**

1. **Automatic Recovery:**
   - System automatically falls back to fallback search
   - No action needed in most cases

2. **Manual Recovery:**
   ```javascript
   // Force fallback search initialization
   window.fallbackSearch?.initialize(window.toolsData);
   ```

3. **Check Lunr.js Loading:**
   - Verify `lib/lunr.min.js` exists
   - Check network tab for 404 errors

#### 5. DOM Element Issues

**Symptoms:**
- UI elements missing
- Buttons not working
- Layout broken

**Solutions:**

1. **Check Browser Compatibility:**
   - Use modern browser (Chrome 90+, Firefox 88+, Safari 14+)
   - Enable JavaScript

2. **Validate HTML:**
   - Check for console errors
   - Ensure all script files loaded

3. **Recovery Actions:**
   ```javascript
   // Reinitialize UI
   window.CLIApp?.cacheElements();
   window.CLIApp?.initEventListeners();
   ```

### System Architecture

The website uses a multi-layered architecture for robustness:

```
┌─────────────────────────────────────┐
│         User Interface              │
├─────────────────────────────────────┤
│      Main Application (main.js)     │
├─────────┬───────────┬───────────────┤
│ Search  │ Fallback  │ Error         │
│ Worker  │ Search    │ Recovery      │
├─────────┴───────────┴───────────────┤
│         Data Layer (JSON)           │
└─────────────────────────────────────┘
```

**Key Components:**

1. **Search Worker** (`search.worker.js`)
   - Runs in background thread
   - Builds Lunr.js index
   - Handles search queries

2. **Fallback Search** (`fallback-search.js`)
   - Activates if worker fails
   - Multiple search algorithms
   - Main thread execution

3. **Error Recovery** (`error-recovery.js`)
   - Automatic issue detection
   - Self-healing strategies
   - User notification system

4. **Debug Helper** (`debug.js`)
   - System diagnostics
   - Performance monitoring
   - State inspection

### Debug Commands

Access these in browser console:

```javascript
// Enable debug mode
window.enableDebug();

// Check system health
window.errorRecovery?.performHealthCheck();

// Reset application state
window.debugHelper?.resetApplicationState();

// Validate data
window.dataValidator?.validateAll();

// Force data reload
window.CLIApp?.loadData();

// Inspect current state
console.table(window.CLIApp?.state);

// Get performance metrics
window.performanceMonitor?.getReport();
```

### Performance Optimization

The site is optimized for large datasets:

- **Lazy Loading**: Tools loaded in batches
- **Web Workers**: Search runs in background
- **Debouncing**: Input events throttled
- **Caching**: Search results cached
- **Virtual Scrolling**: Coming in future update

### Browser Requirements

**Minimum Requirements:**
- ES6 support (2015+)
- Web Workers API
- LocalStorage API
- Fetch API

**Recommended:**
- Chrome 90+ / Firefox 88+ / Safari 14+ / Edge 90+
- JavaScript enabled
- Cookies enabled (for theme preference)

### Known Limitations

1. **File Protocol**: Limited functionality when opened via `file://`
2. **Search Worker**: May fail in private/incognito mode with strict settings
3. **Large Datasets**: Initial load may be slow on older devices
4. **Offline Mode**: Requires pre-generated data files

### Getting Help

If issues persist after troubleshooting:

1. **Check Console**: Press F12 and look for error messages
2. **Enable Debug**: Add `?debug=true` to URL
3. **Clear Cache**: Force refresh with Ctrl+Shift+R (Cmd+Shift+R on Mac)
4. **Report Issue**: Open issue on GitHub with:
   - Browser version
   - Console errors
   - Steps to reproduce

### Recovery Tools

The website includes multiple recovery mechanisms:

1. **Automatic Recovery**
   - Detects and fixes common issues
   - Runs health checks periodically
   - Provides fallback options

2. **Manual Recovery**
   - Troubleshooting panel with diagnostic tools
   - Reset buttons for filters and state
   - Fallback search input for emergencies

3. **Debug Tools**
   - Real-time status monitoring
   - Performance metrics
   - Data validation

This robust system ensures the website remains functional even when components fail.

## 🔧 Development Workflow

### Data Pipeline

The website relies on generated JSON files that are created from the main `TOOLS.md` documentation:

```
TOOLS.md + docs/CHEATSHEET.md
    ↓ (Bash wrapper script)
scripts/generate_site_data.sh
    ↓ (Direct Dart execution)
dart_tools/bin/generate_site_data.dart
    ↓ (JSON generation with enhanced metadata)
site/data/*.json
    ↓ (JavaScript loading)
Website Interface
```

**Implementation Details:**
- Direct Dart CLI execution for reliable data generation
- Robust parsing of TOOLS.md using existing parser infrastructure
- Enhanced metadata generation for web interface optimization

### JSON Data Schema

#### tools.json
```json
{
  "tools": [
    {
      "name": "grep",
      "description": "Search text patterns in files",
      "category": "Text Processing",
      "difficulty": 3,
      "difficultyStars": "⭐⭐⭐",
      "examples": ["grep 'pattern' file.txt"],
      "commonUseCases": ["Search for text patterns"],
      "platforms": ["Linux", "macOS", "Windows"],
      "installation": "Built-in",
      "slug": "grep",
      "searchText": "grep search text patterns...",
      "metadata": {...}
    }
  ],
  "totalCount": 357,
  "lastUpdated": "2025-08-30T12:00:00Z"
}
```

#### categories.json
```json
{
  "categories": [
    {
      "name": "Text Processing",
      "description": "Tools for searching, editing, and manipulating text content",
      "toolCount": 20,
      "averageDifficulty": 3,
      "difficultyStars": "⭐⭐⭐",
      "popularTools": ["grep", "sed", "awk"],
      "allTools": ["grep", "sed", "awk", "cut", "sort", "diff", ...]
    }
  ],
  "totalCategories": 37,
  "lastUpdated": "2025-08-30T12:00:00Z"
}
```

#### stats.json
```json
{
  "totalTools": 357,
  "totalCategories": 37,
  "totalLines": 18470,
  "lastUpdated": "2025-08-30T12:00:00Z",
  "difficultyDistribution": {...},
  "categoryInsights": [...],
  "websiteReady": true
}
```

### Updating Content

To update website content:

1. **Update Source**: Modify `TOOLS.md` or `docs/CHEATSHEET.md`
2. **Regenerate Data**: Run `./scripts/generate_site_data.sh`
3. **Test Locally**: Start development server and verify changes
4. **Deploy**: Upload updated files to hosting platform

### Performance Considerations

The website is optimized for performance:

- **Client-Side Search**: Uses Lunr.js for fast, offline search
- **Lazy Loading**: Content loaded as needed
- **Caching**: Aggressive browser caching for static assets
- **Minification**: All third-party libraries are minified
- **Responsive Images**: Optimized for different screen sizes

Target Performance Metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s  
- Search Response Time: < 100ms
- Mobile Lighthouse Score: 90+

## 🎨 Customization

### Theming

The website supports light and dark themes via CSS custom properties:

```css
:root {
  --primary-color: #2563eb;
  --background-color: #ffffff;
  --text-color: #1f2937;
  /* ... more variables ... */
}

[data-theme="dark"] {
  --background-color: #111827;
  --text-color: #f9fafb;
  /* ... dark theme overrides ... */
}
```

### Search Configuration

The website uses a Web Worker (`js/search.worker.js`) for background search indexing to prevent UI blocking during search operations. If Web Workers are not supported or the worker fails to load, the system automatically falls back to main-thread search processing.

Lunr.js search can be customized in `js/main.js`:

```javascript
const searchIndex = lunr(function () {
    this.field('name', { boost: 10 });
    this.field('description', { boost: 5 });
    this.field('category');
    this.field('examples');
    this.field('searchText');
    // Add more fields as needed
});
```

#### Search Architecture
- **Primary**: Web Worker with `js/search.worker.js` for non-blocking search
- **Fallback**: Main thread processing via `buildSearchIndexMainThread()`
- **Index**: Lunr.js full-text search across all tool fields
- **Performance**: Sub-100ms search response time target

## 📊 Analytics & Monitoring

### Built-in Analytics

The website includes basic client-side analytics:

- Search query tracking (localStorage)
- Popular tool views
- Theme preference tracking
- Performance metrics

### External Integration

For production deployments, consider integrating:

- Google Analytics or Plausible for usage analytics
- Error tracking with Sentry or similar
- Performance monitoring with Web Vitals
- User feedback collection

## 🔒 Security Considerations

### Content Security Policy

Recommended CSP headers for production:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;
```

### Data Validation

All JSON data is validated during generation:

- Schema validation for required fields
- Content sanitization for XSS prevention with DOMPurify
- Marked.js configured with safe rendering options
- Link validation for security
- File size limits for performance

## 🚧 Development Roadmap

### Phase 3: Enhancement (IN PROGRESS)

#### 3.1 Advanced Features
- [ ] Keyboard navigation for search interface
- [ ] Advanced filter combinations with URL persistence
- [ ] Tool favorites/bookmarks with localStorage
- [ ] Search result highlighting and relevance scoring
- [ ] Recent searches and popular tools tracking

#### 3.2 Performance Optimizations
- [x] Virtual scrolling for large tool lists (357+ tools)
- [x] Debounced search input handling  
- [x] Efficient DOM manipulation with element caching
- [ ] Service worker for offline capability
- [ ] Preloading for critical resources
- [ ] Bundle size and loading performance optimization

#### 3.3 User Experience Enhancements
- [x] Theme toggle with localStorage persistence
- [x] Back-to-top button with scroll detection
- [x] Loading states and empty state handling
- [ ] Tool usage analytics (optional)
- [ ] Breadcrumb navigation
- [ ] Onboarding tour for first-time users

### Phase 4: Integration (PLANNED)

#### 4.1 Script Integration
- [ ] Update `scripts/update_stats.sh` to include website data generation
- [ ] Integrate with existing validation pipeline
- [ ] Add website files to `.markdownlint.json` exclusions

#### 4.2 Documentation Updates  
- [ ] Update main `README.md` with website information
- [ ] Modify `MASTER_PLAN.md` to include Phase 5: Website Interface
- [ ] Complete comprehensive `site/README.md`

#### 4.3 Testing & Validation
- [ ] Cross-browser compatibility testing
- [ ] Mobile device testing and optimization
- [ ] Accessibility audit and improvements

### Done
- [x] Dart MCP server task tracking
- [x] Frontend development complete (3,046+ lines of code)
- [x] Data generation infrastructure complete
- [x] Core HTML structure and responsive design
- [x] Advanced search with Lunr.js integration
- [x] Dark/light theme support

## 🐛 Troubleshooting

### Common Issues

**Data Generation Fails**
- Ensure Dart SDK is installed and in PATH (`dart --version`)
- Check that `TOOLS.md` exists and is readable
- Verify write permissions for `site/data/` directory
- Use `--verbose` flag to see detailed generation progress
- Check that `dart_tools/` directory exists with parser implementation

**Search Not Working**
- Check that `lunr.min.js` is loaded correctly
- Ensure `tools.json` is generated and accessible
- Verify browser console for JavaScript errors
- If `js/search.worker.js` fails to load, search automatically falls back to main thread processing

**Styling Issues**
- Clear browser cache and hard refresh
- Check that `main.css` is loading correctly
- Verify CSS custom properties support

**Mobile Display Problems**
- Test on actual devices, not just browser dev tools
- Check viewport meta tag is present
- Verify touch interactions work correctly

### Getting Help

For development questions or issues:

1. Check the browser console for error messages
2. Review the validation script output
3. Test with minimal data to isolate issues
4. Consult the main project documentation

## 📚 Related Documentation

- **[../TOOLS.md](../TOOLS.md)** - Main CLI tools reference
- **[../docs/CHEATSHEET.md](../docs/CHEATSHEET.md)** - Command cheat sheet
- **[../TODO_SITE.md](../TODO_SITE.md)** - Development roadmap
- **[../MASTER_PLAN.md](../MASTER_PLAN.md)** - Project master plan
- **[../scripts/generate_site_data.sh](../scripts/generate_site_data.sh)** - Data generation script

## 🤝 Contributing

Contributions to the website are welcome! Areas for contribution:

- **UI/UX Improvements** - Better search interface, accessibility
- **Performance Optimization** - Loading speed, mobile performance  
- **Feature Additions** - New filtering options, advanced search
- **Browser Compatibility** - Testing across different browsers
- **Documentation** - Improve this README and code comments

Please ensure any changes maintain the self-contained nature of the website and preserve all existing functionality.

---

**Website Status:** Production Ready  
**Last Updated:** 2025-08-30  
**Total Lines of Code:** 3,046+  
**Managed via:** [Dart MCP Server](https://app.dartai.com/t/DoRPCcr8X5Rg-CLI-Tool-Context-Website-Devel)