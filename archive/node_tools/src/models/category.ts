import { Tool } from './tool.js';
import { readFile } from 'node:fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let categoryConfig: any = null;

async function loadCategoryConfig() {
  if (categoryConfig) return categoryConfig;
  
  try {
    const configPath = path.join(__dirname, '..', 'config', 'categories.json');
    const configContent = await readFile(configPath, 'utf-8');
    categoryConfig = JSON.parse(configContent);
    return categoryConfig;
  } catch (error) {
    // Fallback to embedded config if file not found
    categoryConfig = { categories: {}, defaults: { description: 'General purpose tools and utilities', icon: '🔧' } };
    return categoryConfig;
  }
}

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

export async function createCategory(name: string, tools: Tool[] = []): Promise<Category> {
  return {
    id: generateCategoryId(name),
    name,  // Preserve original name
    displayName: name,  // Can be customized later if needed
    toolCount: tools.length,
    description: await getCategoryDescription(name),
    icon: await getCategoryIcon(name),
    tools
  };
}

export async function getCategoryDescription(categoryName: string): Promise<string> {
  const config = await loadCategoryConfig();
  
  // Try config first
  if (config.categories && config.categories[categoryName]) {
    return config.categories[categoryName].description;
  }
  
  // Try case-insensitive match
  const lowerName = categoryName.toLowerCase();
  for (const [key, value] of Object.entries(config.categories || {})) {
    if (key.toLowerCase() === lowerName) {
      return (value as any).description;
    }
  }
  
  // Fall back to embedded descriptions for backward compatibility
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
  const lowerCategoryName = categoryName.toLowerCase();
  for (const [key, value] of Object.entries(descriptions)) {
    if (lowerCategoryName.includes(key) || key.includes(lowerCategoryName)) {
      return value;
    }
  }

  return `Tools in the ${categoryName} category`;
}

export async function getCategoryIcon(categoryName: string): Promise<string> {
  const config = await loadCategoryConfig();
  
  // Try config first
  if (config.categories && config.categories[categoryName]) {
    return config.categories[categoryName].icon;
  }
  
  // Try case-insensitive match
  const lowerName = categoryName.toLowerCase();
  for (const [key, value] of Object.entries(config.categories || {})) {
    if (key.toLowerCase() === lowerName) {
      return (value as any).icon;
    }
  }
  
  // Fall back to embedded icons for backward compatibility
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
  const lowerCategoryName2 = categoryName.toLowerCase();
  for (const [key, value] of Object.entries(icons)) {
    if (lowerCategoryName2.includes(key) || key.includes(lowerCategoryName2)) {
      return value;
    }
  }

  return config.defaults?.icon || '🔧'; // Default fallback icon
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

export async function groupToolsByCategory(tools: Tool[]): Promise<Category[]> {
  const categoryMap = new Map<string, { originalName: string; tools: Tool[] }>();

  for (const tool of tools) {
    const categoryName = tool.category;
    const categoryId = generateCategoryId(categoryName);
    
    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        originalName: categoryName,  // Keep first-seen original name
        tools: []
      });
    }
    categoryMap.get(categoryId)!.tools.push(tool);
  }

  const categories = await Promise.all(
    Array.from(categoryMap.values())
      .map(({ originalName, tools }) => createCategory(originalName, tools))
  );
  
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}