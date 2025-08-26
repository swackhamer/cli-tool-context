import 'dart:io';
import '../models/tool.dart';

/// Validation result for a tool
class ValidationResult {
  final Tool tool;
  final bool exists;
  final bool isExecutable;
  final String? version;
  final List<String> issues;

  ValidationResult({
    required this.tool,
    required this.exists,
    required this.isExecutable,
    this.version,
    required this.issues,
  });

  bool get isValid => exists && isExecutable && issues.isEmpty;
}

/// Validator for CLI tools
class ToolValidator {
  final bool verbose;

  ToolValidator({this.verbose = false});

  /// Validate a single tool
  Future<ValidationResult> validateTool(Tool tool) async {
    final issues = <String>[];
    
    // Check if tool is complete
    if (!tool.isComplete) {
      issues.addAll(tool.missingSections.map((s) => 'Missing $s section'));
    }

    // Check if tool exists on system
    var exists = false;
    var isExecutable = false;
    String? version;

    if (tool.location.isNotEmpty) {
      final file = File(tool.location);
      exists = await file.exists();
      
      if (exists) {
        final stat = await file.stat();
        isExecutable = (stat.mode & 0x40) != 0; // Check executable bit
        
        // Try to get version
        version = await _getToolVersion(tool.name);
      } else {
        // Try to find in PATH
        final whichResult = await _runCommand('which', [tool.name]);
        if (whichResult != null && whichResult.isNotEmpty) {
          exists = true;
          isExecutable = true;
          version = await _getToolVersion(tool.name);
        }
      }
    }

    if (!exists) {
      issues.add('Tool not found at ${tool.location}');
    }
    
    if (exists && !isExecutable) {
      issues.add('Tool exists but is not executable');
    }

    // Validate examples syntax (basic check)
    for (final example in tool.examples) {
      if (example.trim().isEmpty) continue;
      
      // Check for common syntax issues
      if (example.contains('```') && !example.contains('```bash')) {
        issues.add('Example code block should specify language: ```bash');
      }
      
      // Check for placeholder values that should be replaced
      if (RegExp(r'<[A-Z_]+>|\[.*?\]').hasMatch(example)) {
        // This is OK for examples with placeholders
        continue;
      }
    }

    return ValidationResult(
      tool: tool,
      exists: exists,
      isExecutable: isExecutable,
      version: version,
      issues: issues,
    );
  }

  /// Validate multiple tools
  Future<List<ValidationResult>> validateTools(List<Tool> tools) async {
    final results = <ValidationResult>[];
    
    for (final tool in tools) {
      if (verbose) {
        stdout.write('Validating ${tool.name}...');
      }
      
      final result = await validateTool(tool);
      results.add(result);
      
      if (verbose) {
        if (result.isValid) {
          print(' ✓');
        } else {
          print(' ✗ (${result.issues.length} issues)');
        }
      }
    }
    
    return results;
  }

  /// Get tool version
  Future<String?> _getToolVersion(String toolName) async {
    // Try common version flags
    final versionFlags = ['--version', '-v', 'version', '-V'];
    
    for (final flag in versionFlags) {
      final result = await _runCommand(toolName, [flag]);
      if (result != null && result.isNotEmpty) {
        // Extract version number from output
        final versionMatch = RegExp(r'(\d+\.[\d.]+)').firstMatch(result);
        if (versionMatch != null) {
          return versionMatch.group(1);
        }
        return result.split('\n').first;
      }
    }
    
    return null;
  }

  /// Run a command and return output
  Future<String?> _runCommand(String command, List<String> args) async {
    try {
      final result = await Process.run(
        command,
        args,
        runInShell: true,
      ).timeout(
        const Duration(seconds: 2),
        onTimeout: () => ProcessResult(0, 1, '', ''),
      );
      
      if (result.exitCode == 0) {
        return result.stdout.toString().trim();
      }
    } catch (e) {
      // Command failed or not found
    }
    return null;
  }

  /// Generate validation report
  String generateReport(List<ValidationResult> results) {
    final buffer = StringBuffer();
    
    final totalTools = results.length;
    final validTools = results.where((r) => r.isValid).length;
    final missingTools = results.where((r) => !r.exists).length;
    final incompleteTools = results.where((r) => !r.tool.isComplete).length;
    
    buffer.writeln('='.padRight(60, '='));
    buffer.writeln('Tool Validation Report');
    buffer.writeln('='.padRight(60, '='));
    buffer.writeln();
    buffer.writeln('Summary:');
    buffer.writeln('  Total Tools: $totalTools');
    buffer.writeln('  Valid Tools: $validTools');
    buffer.writeln('  Missing Tools: $missingTools');
    buffer.writeln('  Incomplete Documentation: $incompleteTools');
    buffer.writeln();
    
    if (results.any((r) => !r.isValid)) {
      buffer.writeln('Issues Found:');
      buffer.writeln('-'.padRight(60, '-'));
      
      for (final result in results.where((r) => !r.isValid)) {
        buffer.writeln();
        buffer.writeln('${result.tool.name} (line ${result.tool.lineNumber}):');
        for (final issue in result.issues) {
          buffer.writeln('  - $issue');
        }
      }
    }
    
    return buffer.toString();
  }
}