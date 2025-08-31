import { Tool } from './tool.js';

export function cleanCategoryName(name: string): string {
  return name.replace(/[^\w\s&-]/g, '').trim();
}

export function generateCategoryId(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/[^\w\s&-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface Category {
  id: string;
  name: string;  // Original name as appears in TOOLS.md
  displayName?: string;  // Optional display-friendly name
  toolCount: number;
  description?: string;
  icon?: string;
  tools: Tool[];
}

export interface CategoryStatistics {
  name: string;
  count: number;
  percentage: number;
  averageDifficulty: number;
  completenessScore: number;
  topTools: string[];
}

export function createCategory(name: string, tools: Tool[] = []): Category {
  return {
    id: generateCategoryId(name),
    name,  // Preserve original name
    displayName: name,  // Can be customized later if needed
    toolCount: tools.length,
    description: getCategoryDescription(name),
    icon: getCategoryIcon(name),
    tools
  };
}

export function getCategoryDescription(categoryName: string): string {
  const descriptions: Record<string, string> = {
    // Exact matches from site expectations
    'file & directory operations': 'Tools for managing files and directories, including copying, moving, and organizing',
    'file operations': 'Tools for managing files and directories, including copying, moving, and organizing',
    'text processing': 'Tools for manipulating, analyzing, and transforming text files and streams',
    'system monitoring': 'Tools for monitoring system resources, processes, and performance metrics',
    'system administration': 'Tools for system configuration, maintenance, and administrative tasks',
    'network tools': 'Tools for network diagnostics, monitoring, and communication',
    'git version control': 'Tools for managing code versions and collaborative development with Git',
    'archive & compression tools': 'Tools for compressing and decompressing files and archives',
    'process management': 'Tools for managing system processes and job control',
    'development tools': 'Tools for software development, debugging, and code management',
    'search & find': 'Tools for finding files, text patterns, and system information',
    'permission & security': 'Tools for security analysis, encryption, and system hardening',
    'data processing': 'Tools for processing, analyzing, and transforming data',
    'package management': 'Tools for installing, updating, and managing software packages',
    'system information': 'Tools for displaying system and hardware information',
    'remote access': 'Tools for remote system access and communication',
    'backup & sync': 'Tools for data backup and synchronization',

    // Legacy/common variations
    'version control': 'Tools for managing code versions and collaborative development',
    'compression': 'Tools for compressing and decompressing files and archives',
    'search': 'Tools for finding files, text patterns, and system information',
    'security': 'Tools for security analysis, encryption, and system hardening',
    'network utilities': 'Tools for network diagnostics, monitoring, and communication',
    'development': 'Tools for software development, debugging, and code management',
    'productivity': 'Tools for enhancing workflow and general productivity tasks',
    'containers': 'Tools for container management and orchestration',
    'cloud': 'Tools for cloud platform management and deployment',
    'databases': 'Tools for database management and operations',
    'multimedia': 'Tools for processing images, audio, and video files'
  };

  // Try exact match first
  const exact = descriptions[categoryName.toLowerCase()];
  if (exact) {return exact;}

  // Try partial matches for flexibility
  const lowerName = categoryName.toLowerCase();
  for (const [key, value] of Object.entries(descriptions)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return value;
    }
  }

  return `Tools in the ${categoryName} category`;
}

export function getCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    // Exact matches from site expectations
    'file operations': '📁',
    'file & directory operations': '📁',
    'text processing': '📝',
    'system monitoring': '📊',
    'system administration': '⚙️',
    'network tools': '🌐',
    'git version control': '🔀',
    'archive & compression tools': '🗜️',
    'process management': '⚡',
    'development tools': '💻',
    'search & find': '🔍',
    'permission & security': '🔒',
    'data processing': '📊',
    'package management': '📦',
    'system information': 'ℹ️',
    'remote access': '🌐',
    'backup & sync': '💾',

    // Legacy/common variations for backward compatibility
    'version control': '🔀',
    'compression': '🗜️',
    'archive & compression': '🗜️',
    'search': '🔍',
    'security': '🔒',
    'network utilities': '🌐',
    'development': '💻',
    'productivity': '⚡',
    'containers': '🐳',
    'cloud': '☁️',
    'databases': '🗄️',
    'multimedia': '🎬',
    'file': '📁',
    'text': '📝',
    'system': '⚙️',
    'network': '🌐',
    'git': '🔀'
  };

  // Try exact match first
  const exact = icons[categoryName.toLowerCase()];
  if (exact) {return exact;}

  // Try partial matches for flexibility
  const lowerName = categoryName.toLowerCase();
  for (const [key, value] of Object.entries(icons)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return value;
    }
  }

  return '🔧'; // Default fallback icon
}

export function calculateCategoryStatistics(category: Category, totalTools: number): CategoryStatistics {
  const tools = category.tools;
  const count = tools.length;
  const percentage = totalTools > 0 ? (count / totalTools) * 100 : 0;

  const averageDifficulty = count > 0
    ? tools.reduce((sum, tool) => sum + tool.difficulty, 0) / count
    : 0;

  const completenessScore = count > 0
    ? tools.reduce((sum, tool) => {
      const hasDescription = tool.description && tool.description.trim().length > 0;
      const hasUseCases = tool.commonUseCases && tool.commonUseCases.length > 0;
      const hasExamples = tool.examples && tool.examples.length > 0;
      return sum + ([hasDescription, hasUseCases, hasExamples].filter(Boolean).length / 3);
    }, 0) / count
    : 0;

  const topTools = [...tools]
    .sort((a, b) => {
      // Sort by completeness first, then by number of examples, then alphabetically
      const aCompleteness = [
        a.description && a.description.trim().length > 0,
        a.commonUseCases && a.commonUseCases.length > 0,
        a.examples && a.examples.length > 0
      ].filter(Boolean).length;

      const bCompleteness = [
        b.description && b.description.trim().length > 0,
        b.commonUseCases && b.commonUseCases.length > 0,
        b.examples && b.examples.length > 0
      ].filter(Boolean).length;

      if (aCompleteness !== bCompleteness) {
        return bCompleteness - aCompleteness;
      }

      const aExamples = a.examples ? a.examples.length : 0;
      const bExamples = b.examples ? b.examples.length : 0;

      if (aExamples !== bExamples) {
        return bExamples - aExamples;
      }

      return a.name.localeCompare(b.name);
    })
    .slice(0, 5)
    .map(tool => tool.name);

  return {
    name: category.name,
    count,
    percentage: Math.round(percentage * 100) / 100,
    averageDifficulty: Math.round(averageDifficulty * 100) / 100,
    completenessScore: Math.round(completenessScore * 100) / 100,
    topTools
  };
}

export function categoriesToJson(categories: Category[]): any {
  return {
    schema: 'cli-tools-categories',
    categories: categories.map(category => ({
      id: category.id,
      name: category.name,
      toolCount: category.toolCount,
      description: category.description,
      icon: category.icon,
      tools: category.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        difficulty: tool.difficulty
      }))
    })),
    totalCategories: categories.length,
    lastUpdated: new Date().toISOString(),
    ready: true,
    // Legacy fields for backward compatibility
    dataVersion: '1.0.0',
    source: 'TOOLS.md',
    sourceFile: 'TOOLS.md'
  };
}

export function groupToolsByCategory(tools: Tool[]): Category[] {
  const categoryMap = new Map<string, Tool[]>();

  for (const tool of tools) {
    const categoryName = tool.category;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, []);
    }
    categoryMap.get(categoryName)!.push(tool);
  }

  return Array.from(categoryMap.entries())
    .map(([name, tools]) => createCategory(name, tools))
    .sort((a, b) => a.name.localeCompare(b.name));
}