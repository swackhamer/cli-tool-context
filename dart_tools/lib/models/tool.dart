/// Model class representing a CLI tool
class Tool {
  final String name;
  final String description;
  final String location;
  final String category;
  final int difficulty;
  final List<String> commonUseCases;
  final List<String> examples;
  final Map<String, dynamic> metadata;
  final int lineNumber;

  Tool({
    required this.name,
    required this.description,
    required this.location,
    required this.category,
    required this.difficulty,
    required this.commonUseCases,
    required this.examples,
    this.metadata = const {},
    this.lineNumber = 0,
  });

  /// Create Tool from markdown section
  factory Tool.fromMarkdown(String markdown, String category, int lineNumber) {
    final lines = markdown.split('\n');
    var name = '';
    var description = '';
    var location = '';
    var difficulty = 0;
    final commonUseCases = <String>[];
    final examples = <String>[];
    final metadata = <String, dynamic>{};

    // Parse tool name from header
    final headerMatch = RegExp(r'^###\s+\*\*([^*]+)\*\*\s+-\s+(.+)$');
    for (final line in lines) {
      final match = headerMatch.firstMatch(line);
      if (match != null) {
        name = match.group(1)!.trim();
        description = match.group(2)!.trim();
        break;
      }
    }

    // Parse other fields
    var inExamples = false;
    var inUseCases = false;
    var inMetadata = false;
    
    for (final line in lines) {
      // Parse location
      if (line.startsWith('**Location**:')) {
        location = line.substring('**Location**:'.length).trim();
        location = location.replaceAll('`', '');
      }
      // Parse difficulty
      else if (line.startsWith('**Difficulty**:')) {
        difficulty = '⭐'.allMatches(line).length;
      }
      // Parse metadata block
      else if (line.contains('<!-- meta')) {
        inMetadata = true;
      } else if (inMetadata && line.contains('-->')) {
        inMetadata = false;
      } else if (inMetadata) {
        final metaParts = line.split(':');
        if (metaParts.length >= 2) {
          final key = metaParts[0].trim();
          final value = metaParts.sublist(1).join(':').trim();
          metadata[key] = value;
        }
      }
      // Parse common use cases
      else if (line.contains('**Common Use Cases**:')) {
        inUseCases = true;
        inExamples = false;
      } else if (inUseCases && line.startsWith('-')) {
        commonUseCases.add(line.substring(1).trim());
      }
      // Parse examples
      else if (line.contains('**Examples**:')) {
        inExamples = true;
        inUseCases = false;
      } else if (inExamples && line.isNotEmpty && !line.startsWith('**')) {
        examples.add(line);
      }
    }

    return Tool(
      name: name,
      description: description,
      location: location,
      category: category,
      difficulty: difficulty,
      commonUseCases: commonUseCases,
      examples: examples,
      metadata: metadata,
      lineNumber: lineNumber,
    );
  }

  /// Check if tool has all required sections
  bool get isComplete {
    return name.isNotEmpty &&
        description.isNotEmpty &&
        location.isNotEmpty &&
        examples.isNotEmpty;
  }

  /// Get missing sections
  List<String> get missingSections {
    final missing = <String>[];
    if (description.isEmpty) missing.add('Description');
    if (location.isEmpty) missing.add('Location');
    if (examples.isEmpty) missing.add('Examples');
    if (commonUseCases.isEmpty) missing.add('Common Use Cases');
    return missing;
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() => {
        'name': name,
        'description': description,
        'location': location,
        'category': category,
        'difficulty': difficulty,
        'commonUseCases': commonUseCases,
        'examples': examples,
        'metadata': metadata,
        'lineNumber': lineNumber,
      };

  @override
  String toString() => 'Tool($name in $category)';
}