import { Tool } from './tool.js';
import { Category, CategoryStatistics, calculateCategoryStatistics } from './category.js';

export interface Statistics {
  totalTools: number;
  totalCategories: number;
  difficultyDistribution: DifficultyDistribution;
  categoryInsights: CategoryInsight[];
  lastUpdated: string;
  websiteReady: boolean;
  validationSummary: ValidationSummary;
  topCategories: string[];
  averageDifficulty: number;
  completenessScore: number;
}

export interface DifficultyDistribution {
  easy: number;    // 1 star
  medium: number;  // 2 stars
  hard: number;    // 3 stars
  expert: number;  // 4 stars
  legend: number;  // 5 stars
}

export interface CategoryInsight {
  name: string;
  count: number;
  percentage: number;
  averageDifficulty: number;
  completenessScore: number;
  topTools: string[];
  growth?: number;
}

export interface ValidationSummary {
  totalValidated: number;
  validTools: number;
  invalidTools: number;
  warningCount: number;
  averageCompleteness: number;
  missingTools: number;
}

export function calculateDifficultyDistribution(tools: Tool[]): DifficultyDistribution {
  const distribution = { easy: 0, medium: 0, hard: 0, expert: 0, legend: 0 };

  for (const tool of tools) {
    switch (tool.difficulty) {
      case 1:
        distribution.easy++;
        break;
      case 2:
        distribution.medium++;
        break;
      case 3:
        distribution.hard++;
        break;
      case 4:
        distribution.expert++;
        break;
      case 5:
        distribution.legend++;
        break;
      default:
        // Default to easy for invalid difficulty values
        distribution.easy++;
        break;
    }
  }

  return distribution;
}

export function calculateStatistics(
  tools: Tool[], 
  categories: Category[], 
  validationResults?: any[]
): Statistics {
  const totalTools = tools.length;
  const totalCategories = categories.length;
  
  const difficultyDistribution = calculateDifficultyDistribution(tools);
  
  const categoryInsights: CategoryInsight[] = categories.map(category => {
    const stats = calculateCategoryStatistics(category, totalTools);
    return {
      name: stats.name,
      count: stats.count,
      percentage: stats.percentage,
      averageDifficulty: stats.averageDifficulty,
      completenessScore: stats.completenessScore,
      topTools: stats.topTools
    };
  }).sort((a, b) => b.count - a.count);

  const topCategories = categoryInsights
    .slice(0, 5)
    .map(insight => insight.name);

  const averageDifficulty = totalTools > 0
    ? tools.reduce((sum, tool) => sum + tool.difficulty, 0) / totalTools
    : 0;

  const completenessScore = totalTools > 0
    ? tools.reduce((sum, tool) => {
        const hasDescription = tool.description && tool.description.trim().length > 0;
        const hasUseCases = tool.commonUseCases && tool.commonUseCases.length > 0;
        const hasExamples = tool.examples && tool.examples.length > 0;
        return sum + ([hasDescription, hasUseCases, hasExamples].filter(Boolean).length / 3);
      }, 0) / totalTools
    : 0;

  let validationSummary: ValidationSummary = {
    totalValidated: 0,
    validTools: 0,
    invalidTools: 0,
    warningCount: 0,
    averageCompleteness: completenessScore,
    missingTools: 0
  };

  if (validationResults) {
    validationSummary.totalValidated = validationResults.length;
    validationSummary.validTools = validationResults.filter(r => r.isValid).length;
    validationSummary.invalidTools = validationResults.filter(r => !r.isValid).length;
    validationSummary.warningCount = validationResults.reduce((sum, r) => sum + (r.warnings?.length || 0), 0);
    validationSummary.missingTools = validationResults.filter(r => !r.exists).length;
  }

  const websiteReady = totalTools > 0 && 
                      totalCategories > 0 && 
                      completenessScore > 0.5 &&
                      validationSummary.invalidTools < validationSummary.totalValidated * 0.1;

  return {
    totalTools,
    totalCategories,
    difficultyDistribution,
    categoryInsights,
    lastUpdated: new Date().toISOString(),
    websiteReady,
    validationSummary,
    topCategories,
    averageDifficulty: Math.round(averageDifficulty * 100) / 100,
    completenessScore: Math.round(completenessScore * 100) / 100
  };
}

export function statsToJson(stats: Statistics): any {
  return {
    schema: 'cli-tools-stats',
    totalTools: stats.totalTools,
    totalCategories: stats.totalCategories,
    difficultyDistribution: stats.difficultyDistribution,
    categoryInsights: stats.categoryInsights,
    lastUpdated: stats.lastUpdated,
    websiteReady: stats.websiteReady,
    ready: stats.websiteReady,
    validationSummary: stats.validationSummary,
    topCategories: stats.topCategories,
    averageDifficulty: stats.averageDifficulty,
    completenessScore: stats.completenessScore,
    meta: {
      generatedBy: 'cli-tools-manager',
      version: '1.0.0',
      generatedAt: new Date().toISOString()
    }
  };
}

export function createEmptyStatistics(): Statistics {
  return {
    totalTools: 0,
    totalCategories: 0,
    difficultyDistribution: { easy: 0, medium: 0, hard: 0, expert: 0, legend: 0 },
    categoryInsights: [],
    lastUpdated: new Date().toISOString(),
    websiteReady: false,
    validationSummary: {
      totalValidated: 0,
      validTools: 0,
      invalidTools: 0,
      warningCount: 0,
      averageCompleteness: 0,
      missingTools: 0
    },
    topCategories: [],
    averageDifficulty: 0,
    completenessScore: 0
  };
}

export function getStatisticsSummary(stats: Statistics): string {
  const summary = [
    `Total tools: ${stats.totalTools}`,
    `Categories: ${stats.totalCategories}`,
    `Average difficulty: ${stats.averageDifficulty}/5`,
    `Completeness: ${Math.round(stats.completenessScore * 100)}%`,
    `Website ready: ${stats.websiteReady ? 'Yes' : 'No'}`
  ];

  return summary.join(', ');
}