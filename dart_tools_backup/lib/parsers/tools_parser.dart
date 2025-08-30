import 'dart:io';
import '../models/tool.dart';

/// Parser for TOOLS.md file
class ToolsParser {
  final String filePath;
  final List<Tool> tools = [];
  final Map<String, List<Tool>> toolsByCategory = {};
  final List<String> categories = [];
  int totalLines = 0;

  ToolsParser(this.filePath);

  /// Parse the TOOLS.md file
  Future<void> parse() async {
    final file = File(filePath);
    if (!await file.exists()) {
      throw Exception('TOOLS.md file not found at $filePath');
    }

    final lines = await file.readAsLines();
    totalLines = lines.length;

    String currentCategory = '';
    final toolBuffer = StringBuffer();
    int toolStartLine = 0;
    bool inToolSection = false;

    for (int i = 0; i < lines.length; i++) {
      final line = lines[i];

      // Detect category headers (## Category Name)
      if (line.startsWith('## ') && !line.startsWith('## Table of Contents')) {
        // Save previous tool if exists
        if (inToolSection && toolBuffer.isNotEmpty) {
          _addTool(toolBuffer.toString(), currentCategory, toolStartLine);
          toolBuffer.clear();
        }
        
        currentCategory = line.substring(3).trim();
        // Remove emoji and clean category name
        currentCategory = currentCategory.replaceAll(RegExp(r'[^\w\s&-]'), '').trim();
        
        if (!categories.contains(currentCategory)) {
          categories.add(currentCategory);
          toolsByCategory[currentCategory] = [];
        }
        inToolSection = false;
      }
      // Detect tool headers (### **tool-name** - Description)
      else if (line.startsWith('### **')) {
        // Save previous tool if exists
        if (inToolSection && toolBuffer.isNotEmpty) {
          _addTool(toolBuffer.toString(), currentCategory, toolStartLine);
          toolBuffer.clear();
        }
        
        toolStartLine = i + 1; // Line numbers are 1-based
        inToolSection = true;
        toolBuffer.writeln(line);
      }
      // Continue collecting tool content
      else if (inToolSection) {
        // Check if we've reached another section
        if (line.startsWith('## ') || line.startsWith('---')) {
          _addTool(toolBuffer.toString(), currentCategory, toolStartLine);
          toolBuffer.clear();
          inToolSection = false;
          
          // Re-process this line if it's a category header
          if (line.startsWith('## ')) {
            i--; // Reprocess this line
          }
        } else {
          toolBuffer.writeln(line);
        }
      }
    }

    // Don't forget the last tool
    if (inToolSection && toolBuffer.isNotEmpty) {
      _addTool(toolBuffer.toString(), currentCategory, toolStartLine);
    }
  }

  /// Add a tool to the collection
  void _addTool(String markdown, String category, int lineNumber) {
    if (markdown.trim().isEmpty || category.isEmpty) return;

    try {
      final tool = Tool.fromMarkdown(markdown, category, lineNumber);
      
      // Skip workflow sections that aren't actual tools
      if (tool.name.contains('Workflow') || 
          tool.name.contains('Patterns') ||
          tool.name.contains('Choosing the Right Tool')) {
        return;
      }
      
      tools.add(tool);
      toolsByCategory[category]?.add(tool);
    } catch (e) {
      print('Error parsing tool at line $lineNumber: $e');
    }
  }

  /// Find duplicate tools
  List<List<Tool>> findDuplicates() {
    final duplicates = <List<Tool>>[];
    final seen = <String, List<Tool>>{};

    for (final tool in tools) {
      final key = tool.name.toLowerCase();
      seen.putIfAbsent(key, () => []).add(tool);
    }

    for (final entry in seen.entries) {
      if (entry.value.length > 1) {
        duplicates.add(entry.value);
      }
    }

    return duplicates;
  }

  /// Find tools with missing sections
  List<Tool> findIncompleteTools() {
    return tools.where((tool) => !tool.isComplete).toList();
  }

  /// Get statistics
  Map<String, dynamic> getStatistics() {
    final difficultyDistribution = <int, int>{};
    
    for (final tool in tools) {
      difficultyDistribution[tool.difficulty] = 
          (difficultyDistribution[tool.difficulty] ?? 0) + 1;
    }

    return {
      'totalTools': tools.length,
      'totalCategories': categories.length,
      'totalLines': totalLines,
      'toolsByCategory': toolsByCategory.map((k, v) => MapEntry(k, v.length)),
      'difficultyDistribution': difficultyDistribution,
      'duplicateCount': findDuplicates().length,
      'incompleteCount': findIncompleteTools().length,
    };
  }
}