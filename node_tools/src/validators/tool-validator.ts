import { access } from 'node:fs/promises';
import { constants as FS_CONSTANTS } from 'node:fs';
import { execa } from 'execa';
import which from 'which';
import { Tool, ToolValidationResult, getToolMissingSections } from '../models/tool.js';

export interface ValidationReport {
  totalTools: number;
  validatedTools: number;
  validTools: number;
  invalidTools: number;
  missingTools: number;
  results: ToolValidationResult[];
  summary: {
    existsCount: number;
    executableCount: number;
    hasVersionCount: number;
    completeTools: number;
    averageCompleteness: number;
  };
  errors: string[];
  generatedAt: string;
}

export class ToolValidator {
  private readonly versionCommands = ['--version', '-v', 'version', '-V', '--help'];
  private readonly timeoutMs = 2000;

  async validateTool(tool: Tool): Promise<ToolValidationResult> {
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

    // Check completeness
    const completeness = {
      hasDescription: Boolean(tool.description && tool.description.trim().length > 0),
      hasUseCases: Boolean(tool.commonUseCases && tool.commonUseCases.length > 0),
      hasExamples: Boolean(tool.examples && tool.examples.length > 0),
      hasLocation: Boolean(tool.location && tool.location.trim().length > 0),
      score: 0
    };

    const sections = [
      completeness.hasDescription,
      completeness.hasUseCases,
      completeness.hasExamples,
      completeness.hasLocation
    ];
    completeness.score = sections.filter(Boolean).length / sections.length;

    if (completeness.score < 0.75) {
      const missingSections = getToolMissingSections(tool);
      warnings.push(`Tool documentation is incomplete (missing: ${missingSections.join(', ')})`);
    }

    // Check if tool exists in system
    let exists = false;
    let isExecutable = false;
    let hasVersion = false;
    let version: string | undefined;

    try {
      if (tool.location && tool.location.trim().length > 0) {
        exists = await this.checkToolExists(tool.location);
        
        if (exists) {
          isExecutable = await this.checkIsExecutable(tool.location);
          
          if (isExecutable) {
            const versionResult = await this.getToolVersion(tool.location);
            hasVersion = versionResult.hasVersion;
            version = versionResult.version;
          }
        }
      } else {
        warnings.push('Tool location not specified');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      warnings.push(`Failed to validate tool existence: ${errorMessage}`);
    }

    // Validate examples syntax
    if (tool.examples && tool.examples.length > 0) {
      for (const example of tool.examples) {
        if (!this.validateExampleSyntax(example)) {
          warnings.push('Some examples may have syntax issues');
          break;
        }
      }
    }

    const isValid = errors.length === 0;

    const result: ToolValidationResult = {
      tool,
      isValid,
      exists,
      isExecutable,
      hasVersion,
      errors,
      warnings,
      completeness
    };

    if (version !== undefined) {
      result.version = version;
    }

    return result;
  }

  async validateTools(tools: Tool[]): Promise<ToolValidationResult[]> {
    const results: ToolValidationResult[] = [];
    
    for (const tool of tools) {
      try {
        const result = await this.validateTool(tool);
        results.push(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          tool,
          isValid: false,
          exists: false,
          isExecutable: false,
          hasVersion: false,
          errors: [`Validation failed: ${errorMessage}`],
          warnings: [],
          completeness: {
            hasDescription: false,
            hasUseCases: false,
            hasExamples: false,
            hasLocation: false,
            score: 0
          }
        });
      }
    }

    return results;
  }

  async generateReport(tools: Tool[]): Promise<ValidationReport> {
    const results = await this.validateTools(tools);
    
    const validatedTools = results.length;
    const validTools = results.filter(r => r.isValid).length;
    const invalidTools = results.filter(r => !r.isValid).length;
    const missingTools = results.filter(r => !r.exists).length;
    
    const summary = {
      existsCount: results.filter(r => r.exists).length,
      executableCount: results.filter(r => r.isExecutable).length,
      hasVersionCount: results.filter(r => r.hasVersion).length,
      completeTools: results.filter(r => r.completeness.score >= 0.75).length,
      averageCompleteness: validatedTools > 0 
        ? results.reduce((sum, r) => sum + r.completeness.score, 0) / validatedTools 
        : 0
    };

    const errors = results
      .flatMap(r => r.errors.map(error => `${r.tool.name}: ${error}`))
      .slice(0, 20); // Limit to first 20 errors

    return {
      totalTools: tools.length,
      validatedTools,
      validTools,
      invalidTools,
      missingTools,
      results,
      summary,
      errors,
      generatedAt: new Date().toISOString()
    };
  }

  private async checkToolExists(toolLocation: string): Promise<boolean> {
    try {
      // First try to find it in PATH
      await which(toolLocation);
      return true;
    } catch {
      // If not in PATH, check if it's a file path
      try {
        await access(toolLocation, FS_CONSTANTS.F_OK);
        return true;
      } catch {
        return false;
      }
    }
  }

  private async checkIsExecutable(toolLocation: string): Promise<boolean> {
    try {
      // Check if it's executable using fs.access
      await access(toolLocation, FS_CONSTANTS.X_OK);
      return true;
    } catch {
      // If not a direct path, try to resolve from PATH
      try {
        const resolvedPath = await which(toolLocation);
        await access(resolvedPath, FS_CONSTANTS.X_OK);
        return true;
      } catch {
        return false;
      }
    }
  }

  private async getToolVersion(toolLocation: string): Promise<{ hasVersion: boolean; version?: string }> {
    for (const versionFlag of this.versionCommands) {
      try {
        const result = await this.executeWithTimeout(toolLocation, [versionFlag]);
        
        if (result.stdout || result.stderr) {
          const output = result.stdout || result.stderr;
          const version = this.extractVersionFromOutput(output);
          return {
            hasVersion: true,
            version: version || output.split('\n')[0].trim()
          };
        }
      } catch (error) {
        // Continue to next version command
        continue;
      }
    }

    return { hasVersion: false };
  }

  private async executeWithTimeout(
    command: string, 
    args: string[]
  ): Promise<{ stdout: string; stderr: string }> {
    try {
      const result = await execa(command, args, {
        timeout: this.timeoutMs,
        reject: false
      });
      
      return {
        stdout: result.stdout || '',
        stderr: result.stderr || ''
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('timed out')) {
        throw new Error('Command timeout');
      }
      throw error;
    }
  }

  private extractVersionFromOutput(output: string): string | undefined {
    const versionRegex = /(?:version|v\.?)\s*:?\s*([0-9]+(?:\.[0-9]+)*(?:-[a-zA-Z0-9]+)*)/i;
    const match = output.match(versionRegex);
    return match?.[1];
  }

  private validateExampleSyntax(example: string | { command: string; description: string }): boolean {
    const command = typeof example === 'string' ? example : example.command;
    
    // Basic syntax validation for common shell patterns
    const invalidPatterns = [
      /\$\s*$/, // Ends with $ prompt
      /^\s*[{}]\s*$/, // Just brackets
      /^[^a-zA-Z0-9_\/\-\.]/, // Starts with invalid characters
    ];

    return !invalidPatterns.some(pattern => pattern.test(command));
  }

  async validateToolsInBatch(
    tools: Tool[], 
    batchSize: number = 10
  ): Promise<ToolValidationResult[]> {
    const results: ToolValidationResult[] = [];
    
    for (let i = 0; i < tools.length; i += batchSize) {
      const batch = tools.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(tool => this.validateTool(tool))
      );
      results.push(...batchResults);
    }

    return results;
  }

  getValidationSummary(results: ToolValidationResult[]): string {
    const total = results.length;
    const valid = results.filter(r => r.isValid).length;
    const exists = results.filter(r => r.exists).length;
    const executable = results.filter(r => r.isExecutable).length;
    const hasVersion = results.filter(r => r.hasVersion).length;
    
    const avgCompleteness = total > 0 
      ? Math.round((results.reduce((sum, r) => sum + r.completeness.score, 0) / total) * 100)
      : 0;

    return [
      `Validated ${total} tools:`,
      `• ${valid} valid (${Math.round((valid/total)*100)}%)`,
      `• ${exists} exist in system (${Math.round((exists/total)*100)}%)`,
      `• ${executable} executable (${Math.round((executable/total)*100)}%)`,
      `• ${hasVersion} have version info (${Math.round((hasVersion/total)*100)}%)`,
      `• Average completeness: ${avgCompleteness}%`
    ].join('\n');
  }
}