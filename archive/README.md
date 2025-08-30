# Archive Directory

This directory contains deprecated and archived components from the CLI tools documentation project.

## Contents

### `dart_tools_deprecated/`
The original Dart implementation of the parsing and data generation system, replaced by the Node.js + TypeScript implementation in August 2025.

**What it contains:**
- Complete Dart source code for markdown parsing
- Tool validation and JSON generation logic
- Dart package configuration and dependencies
- Original entry points and command-line interfaces

**Why it's archived:**
- Migrated to Node.js + TypeScript for better maintainability
- Preserved for reference and potential rollback
- Historical record of the project's evolution

### `dart_tools_backup_deprecated/`
Backup copy of the original Dart tools, preserved alongside the main deprecated version.

## Migration Information

For detailed information about the migration from Dart to Node.js, see:
- **[DART_MIGRATION.md](./DART_MIGRATION.md)** - Comprehensive migration documentation
- **[../node_tools/README.md](../node_tools/README.md)** - New Node.js implementation

## Using Archived Code

### If you need to run the old Dart version:

1. **Prerequisites:**
   ```bash
   # Install Dart SDK (if not already installed)
   # macOS: brew install dart
   # Or visit: https://dart.dev/get-dart
   ```

2. **Running the archived version:**
   ```bash
   cd archive/dart_tools_deprecated
   dart pub get  # Install dependencies
   dart run bin/generate_site_data.dart --help
   ```

3. **Generate data with Dart version:**
   ```bash
   cd archive/dart_tools_deprecated
   dart run bin/generate_site_data.dart --verbose
   ```

### For development reference:

```bash
# Compare old and new implementations
diff -r dart_tools_deprecated/lib/ ../node_tools/src/

# View original Dart models
cat dart_tools_deprecated/lib/models/tool.dart

# Study original parsing logic
cat dart_tools_deprecated/lib/parsers/tools_parser.dart
```

## Important Notes

⚠️ **Deprecation Warning:** The Dart implementation is no longer maintained. Use the new Node.js implementation in `node_tools/` for all current development.

✅ **Compatibility:** Both implementations generate identical JSON output and maintain the same shell script interfaces.

🔄 **Rollback:** These archived files can be used for emergency rollback if critical issues are discovered with the Node.js implementation.

## Support

For questions about:
- **Current implementation:** See `node_tools/README.md`
- **Migration process:** See `DART_MIGRATION.md`
- **Archived Dart code:** Refer to original documentation within the archived directories

---

*This archive preserves the evolution of the CLI tools documentation project and serves as a reference for the successful migration to a more maintainable technology stack.*