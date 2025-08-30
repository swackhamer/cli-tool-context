export interface ToolExample {
  command: string;
  description: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  difficulty: number;
  commonUseCases: string[];
  examples: ToolExample[];
  platform?: string[];
  installation?: string;
  aliases?: string[];
  tags?: string[];
  usage?: string;
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
    hasLocation: boolean;
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

function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function createToolFromMarkdown(
  name: string,
  description: string,
  category: string,
  content: string,
  lineNumber: number
): Tool {
  const tool: Tool = {
    id: generateId(name),
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
  function parseDifficulty(content: string): number {
    // Enhanced star emoji patterns with variations
    // ⭐ (U+2B50), ⭐️ (U+2B50 + U+FE0F), ★ (U+2605), ✭ (U+272D), ☆ (U+2606)
    const starEmojiPatterns = [
      /[⭐️⭐★✭☆]{1,5}/g, // Main star emojis
      /[⭐]{1,5}[\uFE0F]*/g, // ⭐ with optional variation selector
      /[\*]{1,5}(?=\s|$)/g, // Asterisks as fallback
    ];
    
    // First try to find star emojis in various forms
    for (const pattern of starEmojiPatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        // Find the longest match (most stars)
        const longestMatch = matches.reduce((longest, current) => 
          current.length > longest.length ? current : longest
        );
        
        // Count actual star characters (excluding variation selectors)
        const starCount = longestMatch.replace(/[\uFE0F]/g, '').length;
        if (starCount >= 1 && starCount <= 5) {
          return starCount;
        }
      }
    }
    
    // Look for lines containing only stars (common pattern in TOOLS.md)
    const starOnlyLines = content.split('\n').find(line => {
      const trimmed = line.trim();
      return /^[⭐️⭐★✭☆*]{1,5}$/.test(trimmed);
    });
    
    if (starOnlyLines) {
      const starCount = starOnlyLines.trim().replace(/[\uFE0F]/g, '').length;
      if (starCount >= 1 && starCount <= 5) {
        return starCount;
      }
    }
    
    // Look for difficulty field with stars
    const difficultyStarMatch = content.match(/(?:difficulty|rating):\s*([⭐️⭐★✭☆*]{1,5})/i);
    if (difficultyStarMatch) {
      const starCount = difficultyStarMatch[1].replace(/[\uFE0F]/g, '').length;
      if (starCount >= 1 && starCount <= 5) {
        return starCount;
      }
    }
    
    // Look for headings with stars (e.g., "### ⭐⭐⭐ Intermediate")
    const headingStarMatch = content.match(/^#+\s*([⭐️⭐★✭☆*]{1,5})/m);
    if (headingStarMatch) {
      const starCount = headingStarMatch[1].replace(/[\uFE0F]/g, '').length;
      if (starCount >= 1 && starCount <= 5) {
        return starCount;
      }
    }
    
    // Fallback to traditional patterns
    const difficultyMatch = content.match(/difficulty:\s*(\*+)/i);
    if (difficultyMatch) {
      return Math.min(difficultyMatch[1].length, 5);
    }
    
    // Fallback to numeric patterns
    const numericMatch = content.match(/difficulty:\s*(\d)/i);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      return Math.min(Math.max(num, 1), 5); // Clamp between 1 and 5
    }
    
    // Look for difficulty level words and convert to stars
    const levelMatch = content.match(/difficulty:\s*(beginner|easy|intermediate|advanced|hard|expert)/i);
    if (levelMatch) {
      const level = levelMatch[1].toLowerCase();
      switch (level) {
        case 'beginner':
        case 'easy':
          return 1;
        case 'intermediate':
          return 3;
        case 'advanced':
        case 'hard':
          return 4;
        case 'expert':
          return 5;
        default:
          return 2;
      }
    }
    
    return 1; // Default difficulty
  }
  
  tool.difficulty = parseDifficulty(content);

  // Parse location
  const locationMatch = content.match(/Location:\s*(.+)/i);
  if (locationMatch) {
    tool.location = locationMatch[1].replace(/`/g, '').trim();
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
    const examples: ToolExample[] = [];
    const codeBlocks = examplesSection[1].match(/```[\s\S]*?```/g);
    if (codeBlocks) {
      examples.push(...codeBlocks.map(block => {
        const cleanBlock = block.replace(/```[\w]*\n?|\n?```/g, '').trim();
        const lines = cleanBlock.split('\n');
        const command = lines[0].trim();
        
        // Check if next line is a comment that could be a description
        if (lines.length > 1 && (lines[1].trim().startsWith('#') || lines[1].trim().startsWith('//'))) {
          const description = lines[1].replace(/^[\s#\/]*/, '').trim();
          return { command, description };
        }
        
        return { command, description: '' };
      }));
    }
    
    // Also capture single-line examples
    const singleLineExamples = examplesSection[1]
      .split('\n')
      .filter(line => line.trim().startsWith('`') && line.trim().endsWith('`'))
      .map(line => ({ command: line.trim().slice(1, -1), description: '' }));
    
    examples.push(...singleLineExamples);
    tool.examples = examples.filter(example => example.command && example.command.length > 0);
  }

  // Parse usage information
  const usageMatch = content.match(/Usage:\s*(.+)/i);
  if (usageMatch) {
    tool.usage = usageMatch[1].trim();
    tool.metadata.usage = usageMatch[1].trim();
  }
  
  // Parse tags/keywords/aliases
  const tagsMatch = content.match(/(?:Tags|Keywords):\s*(.+)/i);
  if (tagsMatch) {
    tool.tags = tagsMatch[1].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    tool.metadata.tags = tool.tags;
  }
  
  // Parse aliases
  const aliasesMatch = content.match(/Aliases:\s*(.+)/i);
  if (aliasesMatch) {
    tool.aliases = aliasesMatch[1].split(',').map(alias => alias.trim()).filter(alias => alias.length > 0);
    tool.metadata.aliases = tool.aliases;
  }
  
  // Parse platform
  const platformMatch = content.match(/Platform:\s*(.+)/i);
  if (platformMatch) {
    tool.platform = platformMatch[1].split(',').map(p => p.trim()).filter(p => p.length > 0);
    tool.metadata.platform = tool.platform;
  }
  
  // Parse installation
  const installationMatch = content.match(/Installation:\s*(.+)/i);
  if (installationMatch) {
    tool.installation = installationMatch[1].trim();
    tool.metadata.installation = tool.installation;
  }

  // Parse metadata from any remaining structured content
  const metadataLines = content
    .split('\n')
    .filter(line => line.includes(':') && !line.startsWith('#'))
    .filter(line => !line.toLowerCase().includes('difficulty') && 
                   !line.toLowerCase().includes('location') &&
                   !line.toLowerCase().includes('common use cases') &&
                   !line.toLowerCase().includes('examples') &&
                   !line.toLowerCase().includes('usage') &&
                   !line.toLowerCase().includes('tags') &&
                   !line.toLowerCase().includes('keywords') &&
                   !line.toLowerCase().includes('aliases') &&
                   !line.toLowerCase().includes('platform') &&
                   !line.toLowerCase().includes('installation'));

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

  if (tool.difficulty < 1 || tool.difficulty > 5) {
    warnings.push('Tool difficulty should be between 1 and 5 stars');
  }

  // Completeness checks
  const completeness = {
    hasDescription: Boolean(tool.description && tool.description.trim().length > 0),
    hasUseCases: Boolean(tool.commonUseCases && tool.commonUseCases.length > 0),
    hasExamples: Boolean(tool.examples && tool.examples.length > 0),
    hasLocation: Boolean(tool.location && tool.location.trim().length > 0),
    score: 0
  };

  completeness.score = [
    completeness.hasDescription,
    completeness.hasUseCases,
    completeness.hasExamples,
    completeness.hasLocation
  ].filter(Boolean).length / 4;

  if (completeness.score < 0.75) {
    const missingSections = getToolMissingSections(tool);
    warnings.push(`Tool documentation is incomplete (missing: ${missingSections.join(', ')})`);
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
  const result: any = {
    id: tool.id,
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
  
  // Include normalized metadata fields at top-level
  if (tool.usage) {
    result.usage = tool.usage;
  }
  
  if (tool.tags) {
    result.tags = tool.tags;
  }
  
  if (tool.platform) {
    result.platform = tool.platform;
  }
  
  if (tool.installation) {
    result.installation = tool.installation;
  }
  
  if (tool.aliases) {
    result.aliases = tool.aliases;
  }
  
  return result;
}

export function toolsToJson(tools: Tool[]): any {
  return tools.map(toolToJson);
}