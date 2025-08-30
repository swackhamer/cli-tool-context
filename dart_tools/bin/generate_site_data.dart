#!/usr/bin/env dart
import 'dart:io';
import 'dart:convert';
import 'package:path/path.dart' as path;

import '../lib/parsers/tools_parser.dart';
import '../lib/models/tool.dart';

/// Generate JSON data files for the CLI tools website
class SiteDataGenerator {
  final String projectRoot;
  final String outputDir;
  
  SiteDataGenerator(this.projectRoot) : outputDir = path.join(projectRoot, 'site', 'data');

  /// Generate all JSON data files
  Future<void> generateAll() async {
    print('🔄 Starting site data generation...');
    
    // Ensure output directory exists
    await Directory(outputDir).create(recursive: true);
    
    // Parse TOOLS.md
    final toolsPath = path.join(projectRoot, 'TOOLS.md');
    final parser = ToolsParser(toolsPath);
    
    print('📖 Parsing TOOLS.md...');
    await parser.parse();
    
    print('✅ Parsed ${parser.tools.length} tools across ${parser.categories.length} categories');
    
    // Generate JSON files
    await _generateToolsJson(parser);
    await _generateCategoriesJson(parser);
    await _generateStatsJson(parser);
    
    // Generate cheatsheet data if source exists
    try {
      await _generateCheatsheetData();
    } catch (e) {
      print('⚠️  Cheatsheet generation failed (optional): $e');
      // Create minimal cheatsheet.json with ready:false
      final cheatsheetData = {
        'ready': false,
        'message': 'Cheatsheet source not available',
        'content': '# CLI Cheat Sheet\n\nCheatsheet data not generated.',
        'lastUpdated': DateTime.now().toIso8601String(),
      };
      final file = File(path.join(outputDir, 'cheatsheet.json'));
      await file.writeAsString(const JsonEncoder.withIndent('  ').convert(cheatsheetData));
    }
    
    print('🎉 Site data generation complete!');
    print('📁 Output files in: $outputDir');
  }

  /// Generate tools.json with complete tool data
  Future<void> _generateToolsJson(ToolsParser parser) async {
    print('🔧 Generating tools.json...');
    
    final toolsData = {
      'schema': 'cli-tools-database',
      'dataVersion': '1.0.0',
      'tools': parser.tools.map((tool) => _enhanceToolJson(tool)).toList(),
      'lastUpdated': DateTime.now().toIso8601String(),
      'totalCount': parser.tools.length,
    };
    
    final file = File(path.join(outputDir, 'tools.json'));
    await file.writeAsString(const JsonEncoder.withIndent('  ').convert(toolsData));
    
    print('✅ Generated tools.json (${parser.tools.length} tools)');
  }

  /// Generate categories.json with category statistics
  Future<void> _generateCategoriesJson(ToolsParser parser) async {
    print('📊 Generating categories.json...');
    
    final categoriesData = {
      'schema': 'cli-tools-categories',
      'dataVersion': '1.0.0',
      'categories': parser.categories.map((category) {
        final categoryTools = parser.toolsByCategory[category] ?? [];
        final avgDifficulty = categoryTools.isEmpty ? 0 : 
            categoryTools.map((t) => t.difficulty).reduce((a, b) => a + b) / categoryTools.length;
        
        // Get popular tools (first 3, or all if less than 3)
        final popularTools = categoryTools.take(3).map((t) => t.name).toList();
        
        return {
          'id': category.toLowerCase().replaceAll(RegExp(r'\s+'), '-').replaceAll(RegExp(r'[^a-z0-9-]'), ''),
          'name': category,
          'description': _getCategoryDescription(category),
          'toolCount': categoryTools.length,
          'averageDifficulty': avgDifficulty.round(),
          'difficultyStars': '⭐' * avgDifficulty.round(),
          'popularTools': popularTools,
          'allTools': categoryTools.map((t) => t.name).toList(),
        };
      }).toList(),
      'lastUpdated': DateTime.now().toIso8601String(),
      'totalCategories': parser.categories.length,
    };
    
    final file = File(path.join(outputDir, 'categories.json'));
    await file.writeAsString(const JsonEncoder.withIndent('  ').convert(categoriesData));
    
    print('✅ Generated categories.json (${parser.categories.length} categories)');
  }

  /// Generate stats.json with overall statistics
  Future<void> _generateStatsJson(ToolsParser parser) async {
    print('📈 Generating stats.json...');
    
    final stats = parser.getStatistics();
    final enhancedStats = {
      ...stats,
      'lastUpdated': DateTime.now().toIso8601String(),
      'generationTime': DateTime.now().toIso8601String(),
      'dataVersion': '1.0.0',
      'websiteReady': true,
      
      // Enhanced difficulty distribution with stars
      'difficultyDetails': (stats['difficultyDistribution'] as Map<int, int>).map(
        (difficulty, count) => MapEntry(
          'difficulty_$difficulty',
          {
            'level': difficulty,
            'stars': '⭐' * difficulty,
            'count': count,
            'percentage': ((count / parser.tools.length) * 100).round(),
          }
        ),
      ),
      
      // Category insights
      'categoryInsights': parser.categories.map((category) {
        final categoryTools = parser.toolsByCategory[category] ?? [];
        return {
          'category': category,
          'toolCount': categoryTools.length,
          'percentage': ((categoryTools.length / parser.tools.length) * 100).round(),
          'averageDifficulty': categoryTools.isEmpty ? 0 : 
              (categoryTools.map((t) => t.difficulty).reduce((a, b) => a + b) / categoryTools.length).round(),
        };
      }).toList(),
    };
    
    final file = File(path.join(outputDir, 'stats.json'));
    await file.writeAsString(const JsonEncoder.withIndent('  ').convert(enhancedStats));
    
    print('✅ Generated stats.json with enhanced metrics');
  }



  /// Enhance tool JSON with additional web-friendly fields
  Map<String, dynamic> _enhanceToolJson(Tool tool) {
    final toolJson = tool.toJson();
    
    // Add web-friendly fields
    toolJson['id'] = tool.name.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]+'), '-');
    toolJson['difficultyStars'] = '⭐' * tool.difficulty;
    toolJson['slug'] = tool.name.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]+'), '-');
    
    // Keep original category name and add category ID
    toolJson['categoryName'] = tool.category; // Keep original human-readable name
    toolJson['categoryId'] = tool.category.toLowerCase().replaceAll(RegExp(r'\s+'), '-').replaceAll(RegExp(r'[^a-z0-9-]'), '');
    // Update category field to use ID for filtering compatibility
    toolJson['category'] = tool.category.toLowerCase().replaceAll(RegExp(r'\s+'), '-').replaceAll(RegExp(r'[^a-z0-9-]'), '');
    // Safe searchText building
    final exampleText = (tool.examples ?? [])
      .map((e) => [e.command, e.description].where((s) => s != null && s!.trim().isNotEmpty).join(' '))
      .join(' ');
    final useCasesText = (tool.commonUseCases ?? []).join(' ');

    toolJson['searchText'] = [tool.name, tool.description, tool.category, useCasesText, exampleText]
      .where((s) => s != null && s.toString().trim().isNotEmpty)
      .join(' ');
    
    // Platform detection from examples and location - conservative approach
    final platforms = <String>[];
    final locationLower = tool.location.toLowerCase();
    final examplesText = (tool.examples ?? []).map((e) => e.command).join(' ').toLowerCase();
    
    // Only add platforms we have strong evidence for
    if (locationLower.contains('built-in') || examplesText.contains('unix') || examplesText.contains('linux')) {
      platforms.addAll(['Linux', 'macOS']);
    }
    if (locationLower.contains('homebrew') || examplesText.contains('brew')) {
      platforms.add('macOS');
    }
    if (locationLower.contains('windows') || examplesText.contains('powershell') || examplesText.contains('.exe')) {
      platforms.add('Windows');
    }
    
    // Be conservative: if uncertain, use empty list or unknown rather than claiming all platforms
    if (platforms.isEmpty) {
      platforms.add('unknown'); // Indicate uncertainty rather than claiming all
    }
    
    toolJson['platforms'] = platforms.toSet().toList();
    
    // Conservative installation method detection
    if (locationLower.contains('built-in')) {
      toolJson['installation'] = 'built-in';
    } else if (locationLower.contains('homebrew') || locationLower.contains('brew')) {
      toolJson['installation'] = 'homebrew';
    } else if (locationLower.contains('npm')) {
      toolJson['installation'] = 'npm';
    } else if (locationLower.contains('pip')) {
      toolJson['installation'] = 'pip';
    } else if (locationLower.contains('apt') || locationLower.contains('package manager')) {
      toolJson['installation'] = 'package-manager';
    } else {
      // Be conservative: if we can't confidently infer, mark as unknown
      toolJson['installation'] = 'unknown';
    }
    
    return toolJson;
  }

  /// Generate cheatsheet.json from docs/CHEATSHEET.md if it exists
  Future<void> _generateCheatsheetData() async {
    print('📋 Generating cheatsheet.json...');
    
    final cheatsheetPath = path.join(projectRoot, 'docs', 'CHEATSHEET.md');
    final file = File(cheatsheetPath);
    
    if (!await file.exists()) {
      throw Exception('CHEATSHEET.md not found at $cheatsheetPath');
    }
    
    final content = await file.readAsString();
    
    final cheatsheetData = {
      'schema': 'cli-tools-cheatsheet',
      'dataVersion': '1.0.0',
      'ready': true,
      'content': content,
      'lastUpdated': DateTime.now().toIso8601String(),
      'sourceFile': 'docs/CHEATSHEET.md',
    };
    
    final outputFile = File(path.join(outputDir, 'cheatsheet.json'));
    await outputFile.writeAsString(const JsonEncoder.withIndent('  ').convert(cheatsheetData));
    
    print('✅ Generated cheatsheet.json from ${cheatsheetPath}');
  }

  /// Get category description based on category name
  String _getCategoryDescription(String category) {
    final descriptions = {
      'File Operations': 'Essential commands for managing files and directories',
      'Text Processing': 'Tools for searching, editing, and manipulating text content',
      'System Monitoring': 'Commands to monitor system resources, processes, and performance',
      'Network Tools': 'Utilities for network diagnostics, connectivity, and data transfer',
      'Git Version Control': 'Git commands for version control and repository management',
      'Archive & Compression': 'Tools for creating, extracting, and managing compressed files',
      'Process Management': 'Commands for managing running processes and system resources',
      'Development Tools': 'Programming and development utilities for various languages',
      'Search & Find': 'Powerful search tools for finding files, text, and patterns',
      'Permission & Security': 'Commands for managing file permissions and security',
      'Data Processing': 'Tools for processing, filtering, and transforming data',
      'Package Management': 'Package managers for installing and managing software',
      'System Information': 'Commands to gather information about your system',
      'Remote Access': 'Tools for remote connections and file transfers',
      'Backup & Sync': 'Utilities for backing up and synchronizing data',
    };
    
    return descriptions[category] ?? 'CLI tools and utilities for $category';
  }
}

/// Main entry point
Future<void> main(List<String> args) async {
  // Handle command line arguments
  final bool showHelp = args.contains('--help') || args.contains('-h');
  final bool quiet = args.contains('--quiet') || args.contains('-q');
  final bool verbose = args.contains('--verbose') || args.contains('-v');
  final bool statsOnly = args.contains('--stats-only');
  final projectRootArg = args.firstWhere(
    (a) => a.startsWith('--project-root='),
    orElse: () => '',
  );
  
  if (showHelp) {
    print('''
CLI Tools Website Data Generator

Usage: dart generate_site_data.dart [options]

Options:
  --help, -h              Show this help message
  --quiet, -q             Suppress non-error output
  --verbose, -v           Show detailed output
  --stats-only            Generate only stats.json file
  --project-root=PATH     Override project root directory
  
This script generates JSON data files for the CLI tools website by parsing
TOOLS.md and other documentation files. Output files are created in site/data/:

- tools.json      Complete tool database with enhanced metadata
- categories.json Category statistics and groupings
- stats.json      Overall statistics and metrics
- cheatsheet.json Cheatsheet content for web display

The script leverages existing Dart parsing infrastructure from dart_tools/lib/
to ensure consistency with other repository tools.
''');
    return;
  }
  
  // Determine project root
  String projectRoot;
  if (projectRootArg.isNotEmpty) {
    projectRoot = projectRootArg.substring('--project-root='.length);
  } else {
    // Make project root resolution robust
    final scriptDir = path.dirname(Platform.script.toFilePath());
    projectRoot = path.normalize(path.join(scriptDir, '..', '..'));
  }
  
  if (!quiet) {
    print('🚀 CLI Tools Website Data Generator');
    print('🔍 Project root: $projectRoot');
    if (statsOnly) {
      print('📊 Mode: Stats-only generation');
    }
  }
  
  try {
    final generator = SiteDataGenerator(projectRoot);
    
    if (statsOnly) {
      // Parse TOOLS.md for stats only
      final toolsPath = path.join(projectRoot, 'TOOLS.md');
      final parser = ToolsParser(toolsPath);
      
      if (!quiet) print('📖 Parsing TOOLS.md for statistics...');
      await parser.parse();
      
      if (!quiet) print('✅ Parsed ${parser.tools.length} tools across ${parser.categories.length} categories');
      
      await generator._generateStatsJson(parser);
      
      if (!quiet) print('📊 Stats-only generation complete!');
    } else {
      await generator.generateAll();
    }
    
    if (!quiet) {
      print('\n✨ All done! Website data is ready.');
      print('📁 Check site/data/ for generated JSON files.');
    }
    
    exit(0);
  } catch (e, stackTrace) {
    stderr.writeln('❌ Error generating site data: $e');
    if (verbose) {
      stderr.writeln('Stack trace: $stackTrace');
    }
    exit(1);
  }
}