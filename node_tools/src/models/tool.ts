export interface Tool {
  name: string;
  description: string;
  location: string;
  category: string;
  difficulty: number;
  commonUseCases: string[];
  examples: string[];
  metadata: Record<string, any>;
  lineNumber: number;
}

export interface ToolValidationResult {
  tool: Tool;
  isValid: boolean;
  exists: boolean;
  isExecutable: boolean;
  hasVersion: boolean;
  version?: string;
  errors: string[];
  warnings: string[];
  completeness: {
    hasDescription: boolean;
    hasUseCases: boolean;
    hasExamples: boolean;
    score: number;
  };
}

export interface ToolStatistics {
  totalTools: number;
  totalCategories: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  categoryInsights: CategoryInsight[];
  lastUpdated: string;
  websiteReady: boolean;
}

export interface CategoryInsight {
  name: string;
  count: number;
  percentage: number;
  averageDifficulty: number;
  completenessScore: number;
}

export function createToolFromMarkdown(
  name: string,
  description: string,
  category: string,
  content: string,
  lineNumber: number
): Tool {
  const tool: Tool = {
    name,
    description,
    location: '',
    category,
    difficulty: 1,
    commonUseCases: [],
    examples: [],
    metadata: {},
    lineNumber
  };

  // Parse difficulty from stars
  const difficultyMatch = content.match(/Difficulty:\s*(\*+)/i);
  if (difficultyMatch) {
    tool.difficulty = difficultyMatch[1].length;
  }

  // Parse location
  const locationMatch = content.match(/Location:\s*(.+)/i);
  if (locationMatch) {
    tool.location = locationMatch[1].trim();
  }

  // Parse common use cases
  const useCasesSection = content.match(/Common Use Cases:([\s\S]*?)(?=\n##|\n### |$)/i);
  if (useCasesSection) {
    const useCases = useCasesSection[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[\s\-\*]+/, '').trim())
      .filter(line => line.length > 0);
    tool.commonUseCases = useCases;
  }

  // Parse examples
  const examplesSection = content.match(/Examples?:([\s\S]*?)(?=\n##|\n### |$)/i);
  if (examplesSection) {
    const examples = [];
    const codeBlocks = examplesSection[1].match(/```[\s\S]*?```/g);
    if (codeBlocks) {
      examples.push(...codeBlocks.map(block => block.replace(/```[\w]*\n?|\n?```/g, '').trim()));
    }
    
    // Also capture single-line examples
    const singleLineExamples = examplesSection[1]
      .split('\n')
      .filter(line => line.trim().startsWith('`') && line.trim().endsWith('`'))
      .map(line => line.trim().slice(1, -1));
    
    examples.push(...singleLineExamples);
    tool.examples = examples.filter(example => example.length > 0);
  }

  // Parse metadata from any remaining structured content
  const metadataLines = content
    .split('\n')
    .filter(line => line.includes(':') && !line.startsWith('#'))
    .filter(line => !line.toLowerCase().includes('difficulty') && 
                   !line.toLowerCase().includes('location') &&
                   !line.toLowerCase().includes('common use cases') &&
                   !line.toLowerCase().includes('examples'));

  for (const line of metadataLines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');
      const value = valueParts.join(':').trim();
      if (value) {
        tool.metadata[cleanKey] = value;
      }
    }
  }

  return tool;
}

export function validateTool(tool: Tool): Omit<ToolValidationResult, 'exists' | 'isExecutable' | 'hasVersion' | 'version'> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!tool.name || tool.name.trim().length === 0) {
    errors.push('Tool name is required');
  }

  if (!tool.description || tool.description.trim().length === 0) {
    errors.push('Tool description is required');
  }

  if (!tool.category || tool.category.trim().length === 0) {
    errors.push('Tool category is required');
  }

  if (tool.difficulty < 1 || tool.difficulty > 4) {
    warnings.push('Tool difficulty should be between 1 and 4 stars');
  }

  // Completeness checks
  const completeness = {
    hasDescription: tool.description && tool.description.trim().length > 0,
    hasUseCases: tool.commonUseCases && tool.commonUseCases.length > 0,
    hasExamples: tool.examples && tool.examples.length > 0,
    score: 0
  };

  completeness.score = [
    completeness.hasDescription,
    completeness.hasUseCases,
    completeness.hasExamples
  ].filter(Boolean).length / 3;

  if (completeness.score < 0.67) {
    warnings.push('Tool documentation is incomplete (missing description, use cases, or examples)');
  }

  return {
    tool,
    isValid: errors.length === 0,
    errors,
    warnings,
    completeness
  };
}

export function getToolMissingSections(tool: Tool): string[] {
  const missing: string[] = [];

  if (!tool.description || tool.description.trim().length === 0) {
    missing.push('description');
  }

  if (!tool.commonUseCases || tool.commonUseCases.length === 0) {
    missing.push('common use cases');
  }

  if (!tool.examples || tool.examples.length === 0) {
    missing.push('examples');
  }

  if (!tool.location || tool.location.trim().length === 0) {
    missing.push('location');
  }

  return missing;
}

export function toolToJson(tool: Tool): any {
  return {
    name: tool.name,
    description: tool.description,
    location: tool.location,
    category: tool.category,
    difficulty: tool.difficulty,
    commonUseCases: tool.commonUseCases,
    examples: tool.examples,
    metadata: tool.metadata,
    lineNumber: tool.lineNumber
  };
}

export function toolsToJson(tools: Tool[]): any {
  return tools.map(toolToJson);
}