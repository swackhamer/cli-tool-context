#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { ToolsParser } from './parsers/tools-parser.js';
import { CheatsheetParser } from './parsers/cheatsheet-parser.js';
import { ToolValidator } from './validators/tool-validator.js';
import { JsonGenerator } from './generators/json-generator.js';
import { Logger } from './utils/logger.js';
import { findProjectRoot, checkFileExists } from './utils/file-utils.js';
import { calculateStatistics } from './models/stats.js';
import { groupToolsByCategory } from './models/category.js';

interface CliOptions {
  quiet: boolean;
  verbose: boolean;
  statsOnly: boolean;
  projectRoot?: string;
  outputDir?: string;
  validate: boolean;
}

class CliToolsManager {
  private logger: Logger;
  private toolsParser: ToolsParser;
  private cheatsheetParser: CheatsheetParser;
  private toolValidator: ToolValidator;
  private jsonGenerator: JsonGenerator;

  constructor() {
    this.logger = new Logger();
    this.toolsParser = new ToolsParser();
    this.cheatsheetParser = new CheatsheetParser();
    this.toolValidator = new ToolValidator();
    this.jsonGenerator = new JsonGenerator();
  }

  async run(): Promise<number> {
    const program = new Command();

    program
      .name('cli-tools')
      .description('CLI tools documentation generator and manager')
      .version('1.0.0')
      .option('-q, --quiet', 'suppress output messages', false)
      .option('-v, --verbose', 'enable verbose logging', false)
      .option('--stats-only', 'generate only statistics data', false)
      .option('--project-root <path>', 'specify project root directory')
      .option('--output-dir <path>', 'specify output directory', 'site/data')
      .option('--validate', 'validate tools existence and functionality', false)
      .option('--no-validate', 'skip tool validation')
      .parse();

    const options = program.opts<CliOptions>();
    
    // Configure logger
    this.logger.updateOptions({
      quiet: options.quiet,
      verbose: options.verbose
    });

    try {
      return await this.generateSiteData(options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.logError(`Failed to generate site data: ${errorMessage}`);
      return 1;
    }
  }

  private async generateSiteData(options: CliOptions): Promise<number> {
    // Find project root
    let projectRoot: string;
    if (options.projectRoot) {
      projectRoot = options.projectRoot;
      this.logger.logVerbose(`Using specified project root: ${projectRoot}`);
    } else {
      const detectedRoot = await findProjectRoot();
      if (!detectedRoot) {
        this.logger.logWarning('Could not detect project root (no TOOLS.md or .git found)');
        this.logger.logInfo('Using current working directory as project root');
        projectRoot = process.cwd();
      } else {
        projectRoot = detectedRoot;
        this.logger.logVerbose(`Detected project root: ${projectRoot}`);
      }
    }

    // Define file paths
    const toolsFilePath = path.join(projectRoot, 'TOOLS.md');
    const cheatsheetFilePath = path.join(projectRoot, 'docs', 'CHEATSHEET.md');
    const outputDir = path.isAbsolute(options.outputDir || 'site/data') 
      ? options.outputDir || 'site/data'
      : path.join(projectRoot, options.outputDir || 'site/data');

    this.logger.logVerbose(`Output directory: ${outputDir}`);

    // Check if required files exist
    if (!await checkFileExists(toolsFilePath)) {
      this.logger.logError(`TOOLS.md not found at: ${toolsFilePath}`);
      return 1;
    }

    // Start generation process
    if (!options.quiet) {
      this.logger.logSection('CLI Tools Data Generation');
      this.logger.logInfo(`Processing ${path.relative(projectRoot, toolsFilePath)}`);
    }

    // Parse tools
    this.logger.logVerbose('Parsing TOOLS.md...');
    const parseSpinner = this.logger.createSpinner('Parsing tools documentation');
    
    let parseResult;
    try {
      parseResult = await this.toolsParser.parseToolsFile(toolsFilePath);
      parseSpinner.stop(`Parsed ${parseResult.tools.length} tools in ${parseResult.categories.length} categories`);
    } catch (error) {
      parseSpinner.stop();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.logError(`Failed to parse tools: ${errorMessage}`);
      return 1;
    }

    // Report parsing issues
    if (parseResult.errors.length > 0) {
      this.logger.logWarning(`Found ${parseResult.errors.length} parsing errors:`);
      parseResult.errors.slice(0, 5).forEach(error => this.logger.logError(error));
      if (parseResult.errors.length > 5) {
        this.logger.logWarning(`... and ${parseResult.errors.length - 5} more errors`);
      }
    }

    if (parseResult.warnings.length > 0 && options.verbose) {
      this.logger.logWarning(`Found ${parseResult.warnings.length} warnings:`);
      parseResult.warnings.slice(0, 10).forEach(warning => this.logger.logVerbose(warning));
    }

    // Validate tools if requested
    let validationResults: any[] = [];
    if (options.validate && parseResult.tools.length > 0) {
      this.logger.logVerbose('Validating tool existence and functionality...');
      const validationSpinner = this.logger.createSpinner('Validating tools');
      
      try {
        validationResults = await this.toolValidator.validateTools(parseResult.tools);
        const validCount = validationResults.filter(r => r.isValid).length;
        const existsCount = validationResults.filter(r => r.exists).length;
        
        validationSpinner.stop(`Validated ${parseResult.tools.length} tools (${validCount} valid, ${existsCount} exist)`);
        
        if (options.verbose) {
          this.logger.logVerbose(this.toolValidator.getValidationSummary(validationResults));
        }
      } catch (error) {
        validationSpinner.stop();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.logWarning(`Tool validation failed: ${errorMessage}`);
        validationResults = [];
      }
    }

    // Parse cheatsheet if it exists, otherwise create minimal data
    let cheatsheetData;
    if (await checkFileExists(cheatsheetFilePath)) {
      this.logger.logVerbose('Parsing CHEATSHEET.md...');
      try {
        cheatsheetData = await this.cheatsheetParser.parseCheatsheetFile(cheatsheetFilePath);
        this.logger.logVerbose(`Parsed cheatsheet with ${cheatsheetData.sections.length} sections`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.logWarning(`Failed to parse cheatsheet: ${errorMessage}`);
        cheatsheetData = this.createFallbackCheatsheetData();
      }
    } else {
      this.logger.logVerbose('No cheatsheet found, creating fallback data');
      cheatsheetData = this.createFallbackCheatsheetData();
    }

    // Calculate updated statistics with validation data
    const categories = groupToolsByCategory(parseResult.tools);
    const statistics = calculateStatistics(parseResult.tools, categories, validationResults);

    // Generate JSON files
    this.logger.logVerbose('Generating JSON files...');
    const generationSpinner = this.logger.createSpinner('Writing JSON data files');

    try {
      const generatedFiles: string[] = [];

      if (options.statsOnly) {
        // Generate only statistics
        const statsFile = await this.jsonGenerator.generateStatsJson(statistics, outputDir);
        generatedFiles.push(statsFile);
      } else {
        // Generate all files
        generatedFiles.push(await this.jsonGenerator.generateToolsJson(parseResult.tools, outputDir));
        generatedFiles.push(await this.jsonGenerator.generateCategoriesJson(categories, outputDir));
        generatedFiles.push(await this.jsonGenerator.generateStatsJson(statistics, outputDir));
        generatedFiles.push(await this.jsonGenerator.generateCheatsheetJson(cheatsheetData, outputDir));

        // Generate summary file
        generatedFiles.push(await this.jsonGenerator.generateSummaryJson(
          parseResult.tools, categories, statistics, outputDir
        ));
      }

      generationSpinner.stop(`Generated ${generatedFiles.length} JSON files`);
      
      // Report generated files
      if (options.verbose) {
        this.logger.logInfo('Generated files:');
        for (const file of generatedFiles) {
          this.logger.logVerbose(`  • ${path.relative(projectRoot, file)}`);
        }
      }

    } catch (error) {
      generationSpinner.stop();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.logError(`Failed to generate JSON files: ${errorMessage}`);
      return 1;
    }

    // Display final statistics
    if (!options.quiet) {
      this.logger.logSection('Generation Summary');
      
      this.logger.logStats({
        'Total tools': statistics.totalTools,
        'Categories': statistics.totalCategories,
        'Average difficulty': `${statistics.averageDifficulty}/5`,
        'Completeness': `${Math.round(statistics.completenessScore * 100)}%`,
        'Website ready': statistics.websiteReady ? 'Yes' : 'No'
      });

      if (validationResults && options.verbose) {
        const validCount = validationResults.filter(r => r.isValid).length;
        const existsCount = validationResults.filter(r => r.exists).length;
        const hasVersionCount = validationResults.filter(r => r.hasVersion).length;

        this.logger.logStats({
          'Valid tools': validCount,
          'Tools found': existsCount,
          'Tools with version': hasVersionCount
        });
      }

      if (parseResult.duplicates.length > 0) {
        this.logger.logWarning(`Found ${parseResult.duplicates.length} duplicate tools`);
      }

      if (parseResult.incompleteTools.length > 0) {
        this.logger.logWarning(`Found ${parseResult.incompleteTools.length} incomplete tools`);
      }

      this.logger.logSuccess('Site data generation completed successfully!');
    }

    return 0;
  }

  private createFallbackCheatsheetData() {
    return {
      title: 'CLI Tools Cheatsheet',
      description: '',
      sections: [],
      ready: false,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const manager = new CliToolsManager();
  manager.run().then(code => process.exit(code)).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

export { CliToolsManager };