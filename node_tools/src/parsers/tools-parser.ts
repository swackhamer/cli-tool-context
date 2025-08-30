import * as fs from 'fs/promises';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { Tool, createToolFromMarkdown } from '../models/tool.js';
import { Category, groupToolsByCategory } from '../models/category.js';
import { Statistics, calculateStatistics, createEmptyStatistics } from '../models/stats.js';

export interface ParseResult {
  tools: Tool[];
  categories: Category[];
  statistics: Statistics;
  duplicates: string[];
  incompleteTools: Tool[];
  errors: string[];
  warnings: string[];
}

export class ToolsParser {
  private readonly processor = remark().use(remarkGfm);

  async parseToolsFile(filePath: string): Promise<ParseResult> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return this.parseToolsContent(content);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        tools: [],
        categories: [],
        statistics: createEmptyStatistics(),
        duplicates: [],
        incompleteTools: [],
        errors: [`Failed to read tools file: ${errorMessage}`],
        warnings: []
      };
    }
  }

  parseToolsContent(content: string): ParseResult {
    const tools: Tool[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const lines = content.split('\n');
    let currentCategory = '';
    let lineNumber = 0;

    for (let i = 0; i < lines.length; i++) {
      lineNumber = i + 1;
      const line = lines[i];

      // Parse category headers (## Category Name)
      if (line.startsWith('## ')) {
        const categoryMatch = line.match(/^##\s+(.+)$/);
        if (categoryMatch) {
          currentCategory = categoryMatch[1].trim();
          continue;
        }
      }

      // Parse tool headers (### **tool-name** - Description)
      if (line.startsWith('### ')) {
        const toolMatch = line.match(/^###\s+\*\*([^*]+)\*\*\s*-?\s*(.*)$/);
        if (toolMatch) {
          const toolName = toolMatch[1].trim();
          const description = toolMatch[2].trim();

          if (!currentCategory) {
            errors.push(`Tool "${toolName}" found without a category (line ${lineNumber})`);
            continue;
          }

          // Skip workflow sections that aren't actual tools
          if (this.isWorkflowSection(toolName, description)) {
            continue;
          }

          // Extract the tool's content section
          const toolContent = this.extractToolContent(lines, i);
          
          try {
            const tool = createToolFromMarkdown(
              toolName,
              description,
              currentCategory,
              toolContent,
              lineNumber
            );
            
            tools.push(tool);
            
            // Validate basic completeness
            if (!tool.description || tool.description.trim().length === 0) {
              warnings.push(`Tool "${toolName}" is missing description (line ${lineNumber})`);
            }
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errors.push(`Failed to parse tool "${toolName}": ${errorMessage} (line ${lineNumber})`);
          }
        }
      }
    }

    // Find duplicates
    const duplicates = this.findDuplicates(tools);
    
    // Find incomplete tools
    const incompleteTools = this.findIncompleteTools(tools);

    // Group tools by category
    const categories = groupToolsByCategory(tools);

    // Calculate statistics
    const statistics = calculateStatistics(tools, categories);

    return {
      tools,
      categories,
      statistics,
      duplicates,
      incompleteTools,
      errors,
      warnings
    };
  }

  private extractToolContent(lines: string[], startIndex: number): string {
    const content: string[] = [];
    let i = startIndex + 1;

    // Extract content until we hit another header or end of file
    while (i < lines.length) {
      const line = lines[i];
      
      // Stop at next category or tool header
      if (line.startsWith('## ') || line.startsWith('### ')) {
        break;
      }
      
      content.push(line);
      i++;
    }

    return content.join('\n');
  }

  private isWorkflowSection(toolName: string, description: string): boolean {
    const workflowKeywords = [
      'workflow', 'process', 'procedure', 'steps', 'guide',
      'tutorial', 'example', 'sample', 'template'
    ];

    const nameAndDesc = `${toolName} ${description}`.toLowerCase();
    return workflowKeywords.some(keyword => nameAndDesc.includes(keyword));
  }

  findDuplicates(tools: Tool[]): string[] {
    const toolNames = tools.map(tool => tool.name.toLowerCase());
    const duplicates = new Set<string>();
    const seen = new Set<string>();

    for (const name of toolNames) {
      if (seen.has(name)) {
        duplicates.add(name);
      } else {
        seen.add(name);
      }
    }

    return Array.from(duplicates);
  }

  findIncompleteTools(tools: Tool[]): Tool[] {
    return tools.filter(tool => {
      const hasDescription = tool.description && tool.description.trim().length > 0;
      const hasUseCases = tool.commonUseCases && tool.commonUseCases.length > 0;
      const hasExamples = tool.examples && tool.examples.length > 0;
      const hasLocation = tool.location && tool.location.trim().length > 0;

      // Tool is incomplete if it's missing 2 or more essential sections
      const completeSections = [hasDescription, hasUseCases, hasExamples, hasLocation]
        .filter(Boolean).length;
      
      return completeSections < 3;
    });
  }

  getStatistics(tools: Tool[]): Statistics {
    const categories = groupToolsByCategory(tools);
    return calculateStatistics(tools, categories);
  }

  async validateMarkdownStructure(filePath: string): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const errors: string[] = [];

      // Use remark to parse and validate markdown structure
      try {
        this.processor.parse(content);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Markdown syntax error: ${errorMessage}`);
      }

      // Additional structural validation
      const lines = content.split('\n');
      let hasCategories = false;
      let hasTools = false;

      for (const line of lines) {
        if (line.startsWith('## ')) {
          hasCategories = true;
        }
        if (line.startsWith('### **')) {
          hasTools = true;
        }
      }

      if (!hasCategories) {
        errors.push('No categories found (expected lines starting with "## ")');
      }

      if (!hasTools) {
        errors.push('No tools found (expected lines starting with "### **")');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        errors: [`Failed to validate markdown: ${errorMessage}`]
      };
    }
  }

  async extractCategories(filePath: string): Promise<string[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const categories: string[] = [];
      const lines = content.split('\n');

      for (const line of lines) {
        if (line.startsWith('## ')) {
          const categoryMatch = line.match(/^##\s+(.+)$/);
          if (categoryMatch) {
            categories.push(categoryMatch[1].trim());
          }
        }
      }

      return categories;
    } catch (error) {
      return [];
    }
  }
}