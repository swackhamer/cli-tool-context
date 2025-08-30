import * as fs from 'fs/promises';
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
      const content = await fs.readFile(filePath, 'utf-8');
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
    const lines = content.split('\n');
    let title = 'CLI Tools Cheatsheet';
    let description = 'Quick reference for CLI tools';
    const sections: CheatsheetSection[] = [];
    
    let currentSection: CheatsheetSection | null = null;
    let currentSubsection: CheatsheetSubsection | null = null;
    let currentContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Extract title from first # heading
      if (line.startsWith('# ') && !title.includes('CLI')) {
        title = line.substring(2).trim();
        continue;
      }

      // Parse section headers (## Level 2)
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection) {
          if (currentSubsection) {
            currentSubsection.content = currentContent.join('\n').trim();
            if (currentSubsection.title || currentSubsection.content) {
              currentSection.subsections.push(currentSubsection);
            }
          } else if (currentContent.length > 0) {
            currentSection.content = currentContent.join('\n').trim();
          }
          sections.push(currentSection);
        }

        // Start new section
        currentSection = {
          title: line.substring(3).trim(),
          content: '',
          subsections: [],
          level: 2
        };
        currentSubsection = null;
        currentContent = [];
        continue;
      }

      // Parse subsection headers (### Level 3)
      if (line.startsWith('### ')) {
        // Save previous subsection
        if (currentSubsection) {
          currentSubsection.content = currentContent.join('\n').trim();
          if (currentSection) {
            currentSection.subsections.push(currentSubsection);
          }
        }

        // Start new subsection
        currentSubsection = {
          title: line.substring(4).trim(),
          content: '',
          examples: [],
          level: 3
        };
        currentContent = [];
        continue;
      }

      // Handle code blocks and examples
      if (line.startsWith('```')) {
        const codeBlock = this.extractCodeBlock(lines, i);
        if (codeBlock) {
          if (currentSubsection) {
            currentSubsection.examples.push(codeBlock.content);
          }
          currentContent.push(codeBlock.fullBlock);
          i = codeBlock.endIndex;
          continue;
        }
      }

      // Handle inline code examples
      if (line.includes('`') && !line.startsWith('```')) {
        const inlineCode = line.match(/`([^`]+)`/g);
        if (inlineCode && currentSubsection) {
          inlineCode.forEach(code => {
            const cleanCode = code.slice(1, -1); // Remove backticks
            if (cleanCode.length > 0 && !currentSubsection!.examples.includes(cleanCode)) {
              currentSubsection!.examples.push(cleanCode);
            }
          });
        }
      }

      // Collect regular content
      if (line.length > 0 || currentContent.length > 0) {
        currentContent.push(lines[i]);
      }
    }

    // Save final section/subsection
    if (currentSection) {
      if (currentSubsection) {
        currentSubsection.content = currentContent.join('\n').trim();
        if (currentSubsection.title || currentSubsection.content) {
          currentSection.subsections.push(currentSubsection);
        }
      } else if (currentContent.length > 0) {
        currentSection.content = currentContent.join('\n').trim();
      }
      sections.push(currentSection);
    }

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

  private extractCodeBlock(lines: string[], startIndex: number): { content: string; fullBlock: string; endIndex: number } | null {
    const startLine = lines[startIndex];
    const language = startLine.substring(3).trim();
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
      const content = await fs.readFile(filePath, 'utf-8');
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