# CLI Tools Manager

A modern Node.js + TypeScript tool for parsing, validating, and generating JSON data from CLI tools documentation. This project replaces the previous Dart-based implementation with a more mainstream, maintainable solution.

## Features

- **Markdown Parsing**: Parse `TOOLS.md` to extract tool information, categories, and metadata
- **Tool Validation**: Check if tools exist in the system and can report version information
- **Cheatsheet Support**: Process `CHEATSHEET.md` for quick reference data
- **JSON Generation**: Create structured JSON files for website consumption
- **Statistics**: Calculate comprehensive statistics about tools and categories
- **TypeScript**: Full type safety with modern JavaScript features
- **CLI Interface**: Command-line interface with various options and flags

## Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**

### Setup

1. Navigate to the `node_tools` directory:
   ```bash
   cd node_tools
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Usage

### Command Line Interface

```bash
# Generate all JSON data files
npm run generate

# Run with TypeScript directly (development)
npm start

# Generate only statistics
npm run generate -- --stats-only

# Quiet mode (suppress output)
npm run generate -- --quiet

# Verbose mode (detailed logging)
npm run generate -- --verbose

# Skip tool validation
npm run generate -- --no-validate

# Specify custom paths
npm run generate -- --project-root /path/to/project --output-dir /path/to/output
```

### Available Options

- `--quiet, -q`: Suppress output messages
- `--verbose, -v`: Enable verbose logging  
- `--stats-only`: Generate only statistics data
- `--project-root <path>`: Specify project root directory
- `--output-dir <path>`: Specify output directory (default: `site/data`)
- `--validate`: Validate tools existence and functionality (default: true)
- `--no-validate`: Skip tool validation

### Example Usage

```bash
# Basic generation
npm run generate

# Generate with validation and verbose output
npm run generate -- --verbose --validate

# Generate only stats quietly
npm run generate -- --stats-only --quiet

# Use custom directories
npm run generate -- --project-root ../my-project --output-dir ./output
```

## Output Files

The tool generates several JSON files in the output directory:

### `tools.json`
Complete database of all tools with detailed information:
```json
{
  "schema": "cli-tools-database",
  "tools": [...],
  "totalCount": 150,
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

**Important Schema Note**: Each tool object in the `tools` array includes a `searchFields` array that contains searchable text for front-end consumption. This field is automatically generated and guaranteed to be present for all tools, containing:
- Tool name, description, category, usage information
- Common use cases and examples  
- Tags, aliases, platform information
- Installation instructions and metadata values

Consumers should use `searchFields` for full-text search functionality rather than individual fields to ensure comprehensive search coverage.

### `categories.json`
Organized categories with tool groupings:
```json
{
  "schema": "cli-tools-categories", 
  "categories": [...],
  "totalCategories": 12
}
```

### `stats.json`
Comprehensive statistics and insights:
```json
{
  "schema": "cli-tools-stats",
  "totalTools": 150,
  "difficultyDistribution": {...},
  "categoryInsights": [...],
  "websiteReady": true
}
```

### `cheatsheet.json`
Quick reference data (if `docs/CHEATSHEET.md` exists):
```json
{
  "schema": "cli-tools-cheatsheet",
  "sections": [...],
  "ready": true
}
```

### `summary.json` (Supplementary)
High-level overview and key metrics. This file is generated for supplementary analytics and is not required by the main website:
```json
{
  "schema": "cli-tools-summary",
  "overview": {...},
  "topCategories": [...],
  "validation": {...}
}
```

### `manifest.json` (Supplementary)
Metadata about the generated files. This file provides information about the generation process and is not required by the main website:
```json
{
  "schema": "cli-tools-manifest",
  "version": "1.0.0",
  "generated": "2024-01-01T00:00:00.000Z",
  "files": [...],
  "statistics": {...}
}
```

**Note**: The `manifest.json` and `summary.json` files are supplementary outputs that provide additional metadata and analytics. The main website only requires `tools.json`, `categories.json`, `stats.json`, and `cheatsheet.json`.

## Architecture

### Project Structure

```
node_tools/
├── src/
│   ├── models/         # TypeScript interfaces and data models
│   │   ├── tool.ts     # Tool model and validation
│   │   ├── category.ts # Category grouping and statistics
│   │   └── stats.ts    # Statistics calculations
│   ├── parsers/        # Markdown parsing logic
│   │   ├── tools-parser.ts      # TOOLS.md parser
│   │   └── cheatsheet-parser.ts # CHEATSHEET.md parser
│   ├── validators/     # Tool validation and verification
│   │   └── tool-validator.ts    # System tool validation
│   ├── generators/     # JSON output generation
│   │   └── json-generator.ts    # JSON file generation
│   ├── utils/          # Shared utilities
│   │   ├── file-utils.ts        # File system operations
│   │   └── logger.ts            # Logging and output
│   └── cli.ts          # Main CLI entry point
├── dist/               # Compiled JavaScript (generated)
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

### Key Components

- **Models**: TypeScript interfaces that define data structures for tools, categories, and statistics
- **Parsers**: Extract structured data from markdown files using `remark` and `remark-gfm`
- **Validators**: Check tool existence, executability, and version information using system calls
- **Generators**: Create JSON files with proper schemas for website consumption
- **CLI**: Command-line interface built with `commander.js` for easy usage

## Development

### Scripts

```bash
# Build TypeScript to JavaScript
npm run build

# Run with TypeScript directly
npm start

# Run in development mode with file watching
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Code Style

The project uses ESLint and Prettier for consistent code formatting:
- **ESLint**: TypeScript-specific linting rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking enabled

### Testing

```bash
# Run tests (when implemented)
npm test
```

## Migration from Dart

This Node.js implementation replaces the previous Dart-based tools while maintaining 100% compatibility with existing JSON schemas and shell script interfaces. Key improvements:

### Advantages of Node.js + TypeScript

- **Mainstream Adoption**: JavaScript/TypeScript is widely known
- **Rich Ecosystem**: Excellent libraries for markdown parsing, validation, and CLI tools
- **Better Tooling**: Superior IDE support, debugging, and development tools
- **Easier Maintenance**: Larger community, more developers familiar with the stack
- **Modern Features**: Latest JavaScript features with TypeScript type safety

### Compatibility

- All JSON output schemas remain identical
- Shell script interfaces unchanged
- Same command-line flags and behavior
- Equivalent validation and parsing logic

## Contributing

1. **Setup**: Follow installation instructions above
2. **Code Style**: Run `npm run lint` and `npm run format`
3. **Testing**: Ensure all generated JSON files validate correctly
4. **Documentation**: Update README if adding new features

## License

MIT License - see the project's main license file for details.

## Support

For issues, questions, or contributions, please refer to the main project repository.