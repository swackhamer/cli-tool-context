import * as path from 'path';
import { stat, readFile, access, readdir, unlink } from 'node:fs/promises';
import { Tool, toolToJson } from '../models/tool.js';
import { Category, categoriesToJson } from '../models/category.js';
import { Statistics, statsToJson } from '../models/stats.js';
import { CheatsheetData } from '../parsers/cheatsheet-parser.js';
import { ensureDirectory, writeJsonFile } from '../utils/file-utils.js';

export class JsonGenerator {
  private generateSearchFields(tool: Tool): string[] {
    // Generate comprehensive searchFields array for tool
    const searchFields: string[] = [
      tool.name,
      tool.description || '',
      tool.category || '',
      tool.usage || '',
      tool.location || '',
      ...(tool.commonUseCases || []),
      ...(tool.examples || []).map(ex => `${ex.command} ${ex.description || ''}`),
      ...(tool.tags || []),
      ...(tool.aliases || []),
      ...(tool.platform || []),
      tool.installation || ''
    ];

    // Use denylist approach to exclude sensitive keys while allowing flexibility
    const deniedMetadataKeys = new Set(['path', 'secret', 'password', 'token', 'key', 'apiKey', 'privateKey']);
    if (tool.metadata) {
      const safeMetadata = Object.entries(tool.metadata)
        .filter(([key, value]) =>
          !deniedMetadataKeys.has(key) &&
          typeof value === 'string' &&
          value.trim().length > 0
        )
        .map(([, value]) => value as string);
      searchFields.push(...safeMetadata);
    }

    const filteredFields = searchFields.filter(field => field && field.trim().length > 0);
    return [...new Set(filteredFields)]; // Remove duplicates
  }

  async generateToolsJson(tools: Tool[], outputDir: string): Promise<string> {
    // Enhance ALL tools with guaranteed searchFields
    const enhancedTools = tools.map(tool => {
      const searchFields = this.generateSearchFields(tool);

      // Cap searchFields size to keep JSON reasonably small
      const MAX_ITEMS = 50;
      const MAX_LEN = 200;
      const compact = Array.from(new Set(searchFields
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => s.length > MAX_LEN ? s.slice(0, MAX_LEN) : s)));
      const finalFields = compact.slice(0, MAX_ITEMS);

      // Ensure searchFields is always present and non-empty (at least has tool name)
      if (finalFields.length === 0) {
        finalFields.push(tool.name);
      }
      
      // Normalize examples to always be objects with command and description
      const normalizedExamples = this.normalizeExamples(tool.examples);

      return {
        ...toolToJson(tool),
        examples: normalizedExamples,
        searchFields: finalFields
      };
    });

    const toolsData = {
      schema: 'cli-tools-database',
      tools: enhancedTools,
      totalCount: tools.length,
      ready: true,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      // Legacy fields for backward compatibility
      dataVersion: '1.0.0',
      source: 'TOOLS.md',
      sourceFile: 'TOOLS.md',
      meta: {
        generatedBy: 'cli-tools-manager',
        sourceFile: 'TOOLS.md',
        generatedAt: new Date().toISOString(),
        format: 'CLI Tools Database JSON Schema v1.0'
      }
    };

    const filePath = path.join(outputDir, 'tools.json');
    await writeJsonFile(filePath, toolsData);
    return filePath;
  }

  async generateCategoriesJson(categories: Category[], outputDir: string): Promise<string> {
    const categoriesData = {
      ...categoriesToJson(categories),
      ready: true
    };

    const filePath = path.join(outputDir, 'categories.json');
    await writeJsonFile(filePath, categoriesData);
    return filePath;
  }

  async generateStatsJson(statistics: Statistics, outputDir: string): Promise<string> {
    const statsData = statsToJson(statistics);

    const filePath = path.join(outputDir, 'stats.json');
    await writeJsonFile(filePath, statsData);
    return filePath;
  }

  async generateCheatsheetJson(cheatsheetData: CheatsheetData, outputDir: string): Promise<string> {
    const cheatsheetJson = {
      schema: 'cli-tools-cheatsheet',
      title: cheatsheetData.title,
      description: cheatsheetData.description,
      sections: cheatsheetData.sections,
      content: cheatsheetData.sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n'),
      ready: cheatsheetData.ready,
      lastUpdated: cheatsheetData.lastUpdated,
      totalSections: cheatsheetData.sections.length,
      totalExamples: cheatsheetData.sections.reduce((total, section) => {
        return total + section.subsections.reduce((subTotal, subsection) => {
          return subTotal + (subsection.examples?.length || 0);
        }, 0);
      }, 0),
      meta: {
        generatedBy: 'cli-tools-manager',
        sourceFile: 'docs/CHEATSHEET.md',
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    const filePath = path.join(outputDir, 'cheatsheet.json');
    await writeJsonFile(filePath, cheatsheetJson);
    return filePath;
  }

  async generateAllJson(
    tools: Tool[],
    categories: Category[],
    statistics: Statistics,
    cheatsheetData: CheatsheetData,
    outputDir: string
  ): Promise<string[]> {
    await ensureDirectory(outputDir);

    const generatedFiles = await Promise.all([
      this.generateToolsJson(tools, outputDir),
      this.generateCategoriesJson(categories, outputDir),
      this.generateStatsJson(statistics, outputDir),
      this.generateCheatsheetJson(cheatsheetData, outputDir)
    ]);

    // Generate a manifest file with information about all generated files
    await this.generateManifest(generatedFiles, outputDir);

    return generatedFiles;
  }

  async generateManifest(generatedFiles: string[], outputDir: string): Promise<string> {
    const fileInfos = await Promise.all(
      generatedFiles.map(async filePath => ({
        name: path.basename(filePath),
        path: path.relative(outputDir, filePath),
        fullPath: filePath,
        size: await this.getFileSize(filePath),
        lastModified: (await stat(filePath)).mtime.toISOString()
      }))
    );

    const manifest = {
      schema: 'cli-tools-manifest',
      generatedAt: new Date().toISOString(),
      generatedBy: 'cli-tools-manager',
      version: '1.0.0',
      files: fileInfos,
      totalFiles: generatedFiles.length,
      ready: true
    };

    const manifestPath = path.join(outputDir, 'manifest.json');
    await writeJsonFile(manifestPath, manifest);
    return manifestPath;
  }

  async generateSummaryJson(
    tools: Tool[],
    _categories: Category[],
    statistics: Statistics,
    outputDir: string
  ): Promise<string> {
    const summary = {
      schema: 'cli-tools-summary',
      overview: {
        totalTools: statistics.totalTools,
        totalCategories: statistics.totalCategories,
        averageDifficulty: statistics.averageDifficulty,
        completenessScore: statistics.completenessScore,
        websiteReady: statistics.websiteReady
      },
      difficulty: statistics.difficultyDistribution,
      topCategories: statistics.topCategories.slice(0, 10),
      recentlyUpdated: tools
        .sort((a, b) => (b.metadata.lastModified || '') > (a.metadata.lastModified || '') ? 1 : -1)
        .slice(0, 10)
        .map(tool => ({
          name: tool.name,
          category: tool.category,
          difficulty: tool.difficulty
        })),
      validation: statistics.validationSummary,
      ready: statistics.websiteReady,
      generatedAt: new Date().toISOString(),
      // Legacy fields for backward compatibility
      dataVersion: '1.0.0',
      source: 'TOOLS.md',
      sourceFile: 'TOOLS.md',
      meta: {
        generatedBy: 'cli-tools-manager',
        version: '1.0.0'
      }
    };

    const filePath = path.join(outputDir, 'summary.json');
    await writeJsonFile(filePath, summary);
    return filePath;
  }


  private async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  async validateJsonOutput(filePath: string): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      const errors: string[] = [];

      // Basic validation
      if (!data.schema) {
        errors.push('Missing required "schema" field');
      }

      if (!data.generatedAt && !data.lastUpdated) {
        errors.push('Missing timestamp field (generatedAt or lastUpdated)');
      }

      // Schema-specific validation
      switch (data.schema) {
      case 'cli-tools-database':
        if (!data.tools || !Array.isArray(data.tools)) {
          errors.push('Missing or invalid "tools" array');
        }
        if (typeof data.totalCount !== 'number') {
          errors.push('Missing or invalid "totalCount" field');
        }
        break;

      case 'cli-tools-categories':
        if (!data.categories || !Array.isArray(data.categories)) {
          errors.push('Missing or invalid "categories" array');
        }
        break;

      case 'cli-tools-stats':
        if (typeof data.totalTools !== 'number' || typeof data.totalCategories !== 'number') {
          errors.push('Missing or invalid statistics fields');
        }
        break;

      case 'cli-tools-cheatsheet':
        if (!data.title || !data.content) {
          errors.push('Missing required cheatsheet fields');
        }
        break;
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        errors: [`Failed to parse JSON: ${errorMessage}`]
      };
    }
  }

  async cleanOutputDirectory(outputDir: string): Promise<void> {
    try {
      const files = await readdir(outputDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      for (const file of jsonFiles) {
        await unlink(path.join(outputDir, file));
      }
    } catch (error) {
      // Directory might not exist, which is fine
    }
  }

  async getOutputDirectoryInfo(outputDir: string): Promise<{
    exists: boolean;
    files: string[];
    totalSize: number;
    lastModified: string;
  }> {
    try {
      await access(outputDir);
      const files = await readdir(outputDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      let totalSize = 0;
      let lastModified = new Date(0).toISOString();

      for (const file of jsonFiles) {
        const filePath = path.join(outputDir, file);
        const stats = await stat(filePath);
        totalSize += stats.size;
        if (stats.mtime.toISOString() > lastModified) {
          lastModified = stats.mtime.toISOString();
        }
      }

      return {
        exists: true,
        files: jsonFiles,
        totalSize,
        lastModified
      };
    } catch {
      return {
        exists: false,
        files: [],
        totalSize: 0,
        lastModified: new Date().toISOString()
      };
    }
  }
  
  private normalizeExamples(examples: any[]): { command: string; description: string }[] {
    if (!examples || !Array.isArray(examples)) {
      return [];
    }
    
    return examples.map(example => {
      // If it's already an object with command and description, return as is
      if (typeof example === 'object' && example !== null && 'command' in example) {
        return {
          command: String(example.command || ''),
          description: String(example.description || '')
        };
      }
      
      // If it's a string, convert to object format
      if (typeof example === 'string') {
        return {
          command: example,
          description: ''
        };
      }
      
      // Fallback for unexpected types
      return {
        command: String(example),
        description: ''
      };
    });
  }
}