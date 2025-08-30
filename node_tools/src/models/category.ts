import { Tool } from './tool.js';

export interface Category {
  name: string;
  toolCount: number;
  description?: string;
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
    name,
    toolCount: tools.length,
    description: getCategoryDescription(name),
    tools
  };
}

export function getCategoryDescription(categoryName: string): string {
  const descriptions: Record<string, string> = {
    'text processing': 'Tools for manipulating, analyzing, and transforming text files and streams',
    'file operations': 'Tools for managing files and directories, including copying, moving, and organizing',
    'system monitoring': 'Tools for monitoring system resources, processes, and performance metrics',
    'network utilities': 'Tools for network diagnostics, monitoring, and communication',
    'development': 'Tools for software development, debugging, and code management',
    'compression': 'Tools for compressing and decompressing files and archives',
    'search': 'Tools for finding files, text patterns, and system information',
    'version control': 'Tools for managing code versions and collaborative development',
    'package management': 'Tools for installing, updating, and managing software packages',
    'productivity': 'Tools for enhancing workflow and general productivity tasks',
    'security': 'Tools for security analysis, encryption, and system hardening',
    'containers': 'Tools for container management and orchestration',
    'cloud': 'Tools for cloud platform management and deployment',
    'databases': 'Tools for database management and operations',
    'multimedia': 'Tools for processing images, audio, and video files'
  };

  return descriptions[categoryName.toLowerCase()] || `Tools in the ${categoryName} category`;
}

export function getCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    'text processing': '📝',
    'file operations': '📁',
    'system monitoring': '📊',
    'network utilities': '🌐',
    'development': '💻',
    'compression': '🗜️',
    'search': '🔍',
    'version control': '🔀',
    'package management': '📦',
    'productivity': '⚡',
    'security': '🔒',
    'containers': '🐳',
    'cloud': '☁️',
    'databases': '🗄️',
    'multimedia': '🎬'
  };

  return icons[categoryName.toLowerCase()] || '🔧';
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

  const topTools = tools
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
      name: category.name,
      toolCount: category.toolCount,
      description: category.description,
      icon: getCategoryIcon(category.name),
      tools: category.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        difficulty: tool.difficulty
      }))
    })),
    totalCategories: categories.length,
    lastUpdated: new Date().toISOString()
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