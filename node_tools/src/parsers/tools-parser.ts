import * as fs from 'fs/promises';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import type { Root, Heading, Text, Strong, PhrasingContent } from 'mdast';
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
  private readonly processor = remark().use(remarkGfm).use(remarkStringify);

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

    try {
      const ast = this.processor.parse(content);

      let currentCategory = '';
      let toolStartLine = 0;

      // Walk through the AST nodes
      const children = (ast as Root).children;

      for (let i = 0; i < children.length; i++) {
        const node = children[i];

        if (node.type === 'heading') {
          const heading = node as Heading;

          if (heading.depth === 2) {
            // Category heading (## Category Name)
            const categoryName = this.extractTextFromHeading(heading);

            // Skip known non-category headings
            if (this.isNonCategoryHeading(categoryName)) {
              continue;
            }

            // Preserve original category name without normalization
            currentCategory = categoryName;
            continue;
          }

          if (heading.depth === 3) {
            // Tool heading (### tool-name or ### **tool-name** - Description)
            const { toolName, description } = this.extractToolNameAndDescription(heading);
            toolStartLine = heading.position?.start.line || 0;

            if (!toolName) {
              continue; // Skip if we couldn't extract a tool name
            }

            if (!currentCategory) {
              errors.push(`Tool "${toolName}" found without a category (line ${toolStartLine})`);
              continue;
            }

            // Skip workflow sections that aren't actual tools
            if (this.isWorkflowSection(toolName, description)) {
              continue;
            }

            // Extract the tool's content section using AST-aware method
            const toolContent = this.extractToolContentFromAST(children, i + 1);

            // If no description was found in the heading, try to extract from the first paragraph
            let finalDescription = description;
            if (!finalDescription && i + 1 < children.length) {
              const nextNode = children[i + 1];
              if (nextNode.type === 'paragraph') {
                finalDescription = this.extractTextFromNodes(nextNode.children);
              }
            }

            try {
              const tool = createToolFromMarkdown(
                toolName,
                finalDescription,
                currentCategory,
                toolContent,
                toolStartLine
              );

              tools.push(tool);

              // Validate basic completeness
              if (!tool.description || tool.description.trim().length === 0) {
                warnings.push(`Tool "${toolName}" is missing description (line ${toolStartLine})`);
              }

            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              errors.push(`Failed to parse tool "${toolName}": ${errorMessage} (line ${toolStartLine})`);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Failed to parse markdown AST: ${errorMessage}`);
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

  private extractTextFromHeading(heading: Heading): string {
    const extractFromChildren = (children: PhrasingContent[]): string => {
      return children
        .map(child => {
          if (child.type === 'text') {
            return (child as Text).value;
          } else if (child.type === 'strong' && 'children' in child) {
            return extractFromChildren(child.children);
          } else if ('children' in child && Array.isArray(child.children)) {
            return extractFromChildren(child.children as PhrasingContent[]);
          } else if (child.type === 'inlineCode') {
            return (child as any).value;
          }
          return '';
        })
        .join('');
    };

    return extractFromChildren(heading.children);
  }

  private extractToolNameAndDescription(heading: Heading): { toolName: string; description: string } {
    const fullText = this.extractTextFromHeading(heading);

    // Try to extract tool name from different patterns:
    // 1. **tool-name** - Description
    // 2. tool-name - Description
    // 3. **tool-name**
    // 4. tool-name

    // Look for strong (bolded) text first
    const strongNodes = this.findStrongNodes(heading.children);
    if (strongNodes.length > 0) {
      const toolName = this.extractTextFromNodes(strongNodes[0].children);
      const dashIndex = fullText.indexOf(' - ');
      const description = dashIndex !== -1 ? fullText.substring(dashIndex + 3).trim() : '';
      return { toolName: toolName.trim(), description };
    }

    // Fallback to text-based parsing for non-bolded headers
    const dashIndex = fullText.indexOf(' - ');
    if (dashIndex !== -1) {
      const toolName = fullText.substring(0, dashIndex).trim();
      const description = fullText.substring(dashIndex + 3).trim();
      return { toolName, description };
    }

    // If no dash, assume the whole thing is the tool name
    // and try to extract description from the first paragraph after the heading
    return { toolName: fullText.trim(), description: '' };
  }

  private findStrongNodes(children: PhrasingContent[]): Strong[] {
    const strongNodes: Strong[] = [];

    for (const child of children) {
      if (child.type === 'strong') {
        strongNodes.push(child as Strong);
      }
    }

    return strongNodes;
  }

  private extractTextFromNodes(children: PhrasingContent[]): string {
    return children
      .map(child => {
        if (child.type === 'text') {
          return (child as Text).value;
        } else if ('children' in child && Array.isArray(child.children)) {
          return this.extractTextFromNodes(child.children as PhrasingContent[]);
        } else if (child.type === 'inlineCode') {
          return (child as any).value;
        }
        return '';
      })
      .join('');
  }

  private extractToolContentFromAST(children: any[], startIndex: number): string {
    const contentNodes: any[] = [];

    // Collect content until we hit another heading
    for (let i = startIndex; i < children.length; i++) {
      const node = children[i];

      // Stop at next heading (category or tool)
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        break;
      }

      contentNodes.push(node);
    }

    // Convert nodes back to markdown text
    return this.nodesToMarkdown(contentNodes);
  }

  private nodesToMarkdown(nodes: any[]): string {
    // Use remark-stringify for reliable markdown serialization
    const tree = {
      type: 'root',
      children: nodes
    };

    return this.processor.stringify(tree as any);
  }


  private isWorkflowSection(toolName: string, description: string): boolean {
    const workflowKeywords = [
      'workflow', 'process', 'procedure', 'steps', 'guide',
      'tutorial', 'example', 'sample', 'template'
    ];

    const nameAndDesc = `${toolName} ${description}`.toLowerCase();
    return workflowKeywords.some(keyword => nameAndDesc.includes(keyword));
  }

  private isNonCategoryHeading(heading: string): boolean {
    const nonCategoryHeadings = ['table of contents', 'overview', 'introduction'];

    const headingLower = heading.toLowerCase().trim();
    // Use exact match instead of substring check to avoid false positives
    return nonCategoryHeadings.includes(headingLower);
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