import { readFile } from 'node:fs/promises';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';

export interface CheatsheetSection {
  title: string;
  content: string;
  subsections: CheatsheetSubsection[];
  level: number;
}

export interface CheatsheetSubsection {
  title: string;
  content: string;
  examples: string[];
  level: number;
}

export interface CheatsheetData {
  title: string;
  description: string;
  sections: CheatsheetSection[];
  lastUpdated: string;
  ready: boolean;
}

export class CheatsheetParser {
  private readonly processor = remark().use(remarkGfm);

  async parseCheatsheetFile(filePath: string): Promise<CheatsheetData> {
    try {
      const content = await readFile(filePath, 'utf-8');
      return this.parseCheatsheetContent(content);
    } catch (error) {
      return {
        title: 'CLI Tools Cheatsheet',
        description: 'Quick reference for CLI tools',
        sections: [],
        lastUpdated: new Date().toISOString(),
        ready: false
      };
    }
  }

  parseCheatsheetContent(content: string): CheatsheetData {
    // Parse content using remark AST
    const ast = this.processor.parse(content);
    const root = ast as any;
    
    let title = 'CLI Tools Cheatsheet';
    let description = 'Quick reference for CLI tools';
    const sections: CheatsheetSection[] = [];

    let currentSection: CheatsheetSection | null = null;
    let currentSubsection: CheatsheetSubsection | null = null;
    let contentBuffer: any[] = [];

    // Walk through AST nodes
    for (const node of root.children || []) {
      // Extract title from first H1
      if (node.type === 'heading' && node.depth === 1 && !title) {
        const headingText = this.getNodeText(node);
        if (headingText) {
          title = headingText;
        }
        continue;
      }

      // Handle H2 sections
      if (node.type === 'heading' && node.depth === 2) {
        // Save previous section
        this.saveSection(currentSection, currentSubsection, contentBuffer, sections);
        
        // Start new section
        currentSection = {
          title: this.getNodeText(node),
          content: '',
          subsections: [],
          level: 2
        };
        currentSubsection = null;
        contentBuffer = [];
        continue;
      }

      // Handle H3 subsections
      if (node.type === 'heading' && node.depth === 3) {
        // Save previous subsection
        if (currentSubsection && currentSection) {
          currentSubsection.content = this.processContentBuffer(contentBuffer);
          currentSection.subsections.push(currentSubsection);
        } else if (currentSection && contentBuffer.length > 0) {
          currentSection.content = this.processContentBuffer(contentBuffer);
        }
        
        // Start new subsection
        currentSubsection = {
          title: this.getNodeText(node),
          content: '',
          examples: [],
          level: 3
        };
        contentBuffer = [];
        continue;
      }

      // Handle code blocks
      if (node.type === 'code') {
        const codeContent = node.value || '';
        if (currentSubsection) {
          currentSubsection.examples.push(codeContent);
        }
        contentBuffer.push(node);
        continue;
      }

      // Handle paragraphs with inline code
      if (node.type === 'paragraph') {
        this.extractInlineCode(node, currentSubsection);
        contentBuffer.push(node);
        continue;
      }

      // Collect other content nodes
      if (node.type !== 'heading') {
        contentBuffer.push(node);
      }
    }

    // Save final section/subsection
    this.saveSection(currentSection, currentSubsection, contentBuffer, sections);

    // Extract description from first paragraph or use default
    if (sections.length > 0 && sections[0].content) {
      const firstParagraph = sections[0].content.split('\n')[0];
      if (firstParagraph && !firstParagraph.startsWith('#')) {
        description = firstParagraph.trim();
      }
    }

    return {
      title,
      description,
      sections,
      lastUpdated: new Date().toISOString(),
      ready: sections.length > 0
    };
  }

  private saveSection(
    section: CheatsheetSection | null,
    subsection: CheatsheetSubsection | null,
    contentBuffer: any[],
    sections: CheatsheetSection[]
  ): void {
    if (!section) return;
    
    if (subsection) {
      subsection.content = this.processContentBuffer(contentBuffer);
      if (subsection.title || subsection.content) {
        section.subsections.push(subsection);
      }
    } else if (contentBuffer.length > 0) {
      section.content = this.processContentBuffer(contentBuffer);
    }
    
    sections.push(section);
  }

  private processContentBuffer(buffer: any[]): string {
    return buffer
      .map(node => this.processor.stringify(node))
      .join('\n')
      .trim();
  }

  private getNodeText(node: any): string {
    if (!node.children) return '';
    
    const extractText = (child: any): string => {
      if (child.type === 'text') return child.value || '';
      if (child.children) return child.children.map(extractText).join('');
      return '';
    };
    
    return node.children.map(extractText).join('');
  }

  private extractInlineCode(node: any, subsection: CheatsheetSubsection | null): void {
    if (!subsection || !node.children) return;
    
    const extractCode = (child: any): void => {
      if (child.type === 'inlineCode' && child.value) {
        if (!subsection.examples.includes(child.value)) {
          subsection.examples.push(child.value);
        }
      }
      if (child.children) {
        child.children.forEach(extractCode);
      }
    };
    
    node.children.forEach(extractCode);
  }

  private extractCodeBlock(lines: string[], startIndex: number): { content: string; fullBlock: string; endIndex: number } | null {
    const startLine = lines[startIndex];
    // const language = startLine.substring(3).trim();
    const codeLines: string[] = [];
    let endIndex = startIndex + 1;

    while (endIndex < lines.length && !lines[endIndex].startsWith('```')) {
      codeLines.push(lines[endIndex]);
      endIndex++;
    }

    if (endIndex >= lines.length) {
      return null; // Unclosed code block
    }

    const content = codeLines.join('\n').trim();
    const fullBlock = [startLine, ...codeLines, lines[endIndex]].join('\n');

    return {
      content,
      fullBlock,
      endIndex
    };
  }

  generateCheatsheetJson(cheatsheetData: CheatsheetData): any {
    return {
      schema: 'cli-tools-cheatsheet',
      title: cheatsheetData.title,
      description: cheatsheetData.description,
      sections: cheatsheetData.sections.map(section => ({
        title: section.title,
        content: section.content,
        level: section.level,
        subsections: section.subsections.map(subsection => ({
          title: subsection.title,
          content: subsection.content,
          level: subsection.level,
          examples: subsection.examples,
          exampleCount: subsection.examples.length
        }))
      })),
      lastUpdated: cheatsheetData.lastUpdated,
      ready: cheatsheetData.ready,
      totalSections: cheatsheetData.sections.length,
      totalExamples: cheatsheetData.sections.reduce((total, section) => {
        return total + section.subsections.reduce((subTotal, subsection) => {
          return subTotal + subsection.examples.length;
        }, 0);
      }, 0),
      meta: {
        generatedBy: 'cli-tools-manager',
        version: '1.0.0',
        generatedAt: new Date().toISOString()
      }
    };
  }

  async validateCheatsheetStructure(filePath: string): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const errors: string[] = [];

      // Use remark to parse and validate markdown structure
      try {
        this.processor.parse(content);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Markdown syntax error: ${errorMessage}`);
      }

      // Check for basic structure
      const lines = content.split('\n');
      let hasTitle = false;
      let hasSections = false;
      let hasContent = false;

      for (const line of lines) {
        if (line.startsWith('# ')) {
          hasTitle = true;
        }
        if (line.startsWith('## ')) {
          hasSections = true;
        }
        if (line.includes('`') || line.startsWith('```')) {
          hasContent = true;
        }
      }

      if (!hasTitle) {
        errors.push('No title found (expected line starting with "# ")');
      }

      if (!hasSections) {
        errors.push('No sections found (expected lines starting with "## ")');
      }

      if (!hasContent) {
        errors.push('No code examples found (expected backticks or code blocks)');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        errors: [`Failed to validate cheatsheet: ${errorMessage}`]
      };
    }
  }

  extractQuickReference(cheatsheetData: CheatsheetData): { command: string; description: string }[] {
    const quickRef: { command: string; description: string }[] = [];

    for (const section of cheatsheetData.sections) {
      for (const subsection of section.subsections) {
        for (const example of subsection.examples) {
          // Extract command and create description
          const command = example.split('\n')[0]; // First line of example
          const description = subsection.title || section.title;

          if (command && description) {
            quickRef.push({
              command: command.trim(),
              description: description.trim()
            });
          }
        }
      }
    }

    return quickRef;
  }
}