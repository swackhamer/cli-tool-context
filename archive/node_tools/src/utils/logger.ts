import chalk from 'chalk';

export interface LoggerOptions {
  quiet: boolean;
  verbose: boolean;
  useColors: boolean;
}

export class Logger {
  private options: LoggerOptions;

  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = {
      quiet: options.quiet || false,
      verbose: options.verbose || false,
      useColors: options.useColors !== false // Default to true unless explicitly disabled
    };
  }

  updateOptions(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  logInfo(message: string): void {
    if (this.options.quiet) {return;}

    const output = this.options.useColors
      ? chalk.blue('ℹ') + ' ' + message
      : `[INFO] ${message}`;

    console.log(output);
  }

  logSuccess(message: string): void {
    if (this.options.quiet) {return;}

    const output = this.options.useColors
      ? chalk.green('✓') + ' ' + message
      : `[SUCCESS] ${message}`;

    console.log(output);
  }

  logWarning(message: string): void {
    if (this.options.quiet) {return;}

    const output = this.options.useColors
      ? chalk.yellow('⚠') + ' ' + message
      : `[WARNING] ${message}`;

    console.warn(output);
  }

  logError(message: string): void {
    const output = this.options.useColors
      ? chalk.red('✗') + ' ' + message
      : `[ERROR] ${message}`;

    console.error(output);
  }

  logVerbose(message: string): void {
    if (!this.options.verbose || this.options.quiet) {return;}

    const output = this.options.useColors
      ? chalk.gray('→ ' + message)
      : `[VERBOSE] ${message}`;

    console.log(output);
  }

  logDebug(message: string): void {
    if (!this.options.verbose || this.options.quiet) {return;}

    const output = this.options.useColors
      ? chalk.gray('[DEBUG] ' + message)
      : `[DEBUG] ${message}`;

    console.log(output);
  }

  logSection(title: string): void {
    if (this.options.quiet) {return;}

    const separator = '─'.repeat(Math.max(title.length + 4, 20));
    const output = this.options.useColors
      ? '\n' + chalk.cyan(separator) + '\n' + chalk.cyan.bold(`  ${title}`) + '\n' + chalk.cyan(separator)
      : `\n${separator}\n  ${title}\n${separator}`;

    console.log(output);
  }

  logProgress(current: number, total: number, description: string = ''): void {
    if (this.options.quiet) {return;}

    const percentage = Math.round((current / total) * 100);
    const progressBar = this.createProgressBar(current, total);

    const message = description
      ? `${progressBar} ${percentage}% ${description}`
      : `${progressBar} ${percentage}% (${current}/${total})`;

    const output = this.options.useColors
      ? chalk.blue(message)
      : message;

    // Use process.stdout.write for progress updates to allow overwriting
    process.stdout.write(`\r${output}`);

    // Add newline when complete
    if (current === total) {
      console.log();
    }
  }

  private createProgressBar(current: number, total: number, width: number = 20): string {
    const filled = Math.round((current / total) * width);
    const empty = width - filled;

    if (this.options.useColors) {
      return '[' + chalk.green('█'.repeat(filled)) + '░'.repeat(empty) + ']';
    }

    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
  }

  logTable(data: Array<Record<string, any>>, headers?: string[]): void {
    if (this.options.quiet || data.length === 0) {return;}

    const keys = headers || Object.keys(data[0]);
    const columnWidths = keys.map(key =>
      Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      )
    );

    // Header
    const headerRow = keys
      .map((key, i) => key.padEnd(columnWidths[i]))
      .join(' | ');

    const separator = columnWidths
      .map(width => '-'.repeat(width))
      .join('-+-');

    console.log();
    if (this.options.useColors) {
      console.log(chalk.bold(headerRow));
      console.log(chalk.gray(separator));
    } else {
      console.log(headerRow);
      console.log(separator);
    }

    // Data rows
    data.forEach(row => {
      const dataRow = keys
        .map((key, i) => String(row[key] || '').padEnd(columnWidths[i]))
        .join(' | ');
      console.log(dataRow);
    });

    console.log();
  }

  logStats(stats: Record<string, number | string>): void {
    if (this.options.quiet) {return;}

    console.log();
    Object.entries(stats).forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);

      const output = this.options.useColors
        ? `${chalk.cyan(capitalizedKey)}: ${chalk.bold(String(value))}`
        : `${capitalizedKey}: ${value}`;

      console.log(`  ${output}`);
    });
    console.log();
  }

  logJson(obj: any, indent: number = 2): void {
    if (this.options.quiet) {return;}

    const jsonString = JSON.stringify(obj, null, indent);

    if (this.options.useColors) {
      console.log(chalk.gray(jsonString));
    } else {
      console.log(jsonString);
    }
  }

  startTimer(label: string): void {
    if (this.options.verbose && !this.options.quiet) {
      const message = this.options.useColors
        ? chalk.gray(`⏱  Started: ${label}`)
        : `[TIMER] Started: ${label}`;
      console.log(message);
    }

    console.time(label);
  }

  endTimer(label: string): void {
    console.timeEnd(label);
  }

  measureTime<T>(label: string, fn: () => T | Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startTimer(label);

      try {
        const result = await fn();
        this.endTimer(label);
        resolve(result);
      } catch (error) {
        this.endTimer(label);
        reject(error);
      }
    });
  }

  createSpinner(message: string): { stop: (finalMessage?: string) => void } {
    if (this.options.quiet) {
      return { stop: () => {} };
    }

    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let frameIndex = 0;
    let isRunning = true;

    const interval = setInterval(() => {
      if (isRunning) {
        const frame = this.options.useColors
          ? chalk.cyan(frames[frameIndex])
          : frames[frameIndex];

        process.stdout.write(`\r${frame} ${message}`);
        frameIndex = (frameIndex + 1) % frames.length;
      }
    }, 100);

    return {
      stop: (finalMessage?: string) => {
        isRunning = false;
        clearInterval(interval);

        if (finalMessage) {
          const output = this.options.useColors
            ? `\r${chalk.green('✓')} ${finalMessage}`
            : `\r[DONE] ${finalMessage}`;
          console.log(output);
        } else {
          process.stdout.write('\r' + ' '.repeat(message.length + 2) + '\r');
        }
      }
    };
  }
}

// Default logger instance
export const logger = new Logger();

// Convenience functions for common use cases
export function logInfo(message: string): void {
  logger.logInfo(message);
}

export function logSuccess(message: string): void {
  logger.logSuccess(message);
}

export function logWarning(message: string): void {
  logger.logWarning(message);
}

export function logError(message: string): void {
  logger.logError(message);
}

export function logVerbose(message: string): void {
  logger.logVerbose(message);
}