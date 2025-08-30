import { readFile, writeFile, access, mkdir, stat, copyFile as fsCopyFile, unlink, readdir, rename } from 'node:fs/promises';
import { constants as FS_CONSTANTS } from 'node:fs';
import * as path from 'path';

export async function readFileAsync(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, 'utf-8');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to read file ${filePath}: ${errorMessage}`);
  }
}

export async function writeJsonFile(filePath: string, data: any): Promise<void> {
  try {
    await ensureDirectory(path.dirname(filePath));
    const jsonContent = JSON.stringify(data, null, 2);
    
    // Write atomically by writing to a temporary file first
    const tempFilePath = `${filePath}.tmp`;
    await writeFile(tempFilePath, jsonContent, 'utf-8');
    await rename(tempFilePath, filePath);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to write JSON file ${filePath}: ${errorMessage}`);
  }
}

export async function writeFileAsync(filePath: string, content: string): Promise<void> {
  try {
    await ensureDirectory(path.dirname(filePath));
    await writeFile(filePath, content, 'utf-8');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to write file ${filePath}: ${errorMessage}`);
  }
}

export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await access(dirPath);
  } catch {
    try {
      await mkdir(dirPath, { recursive: true, mode: 0o755 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create directory ${dirPath}: ${errorMessage}`);
    }
  }
}

export async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, FS_CONSTANTS.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function checkFileReadable(filePath: string): Promise<boolean> {
  try {
    await access(filePath, FS_CONSTANTS.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function checkFileWritable(filePath: string): Promise<boolean> {
  try {
    await access(filePath, FS_CONSTANTS.W_OK);
    return true;
  } catch {
    return false;
  }
}

export async function getFileStats(filePath: string): Promise<{
  exists: boolean;
  size: number;
  lastModified: string;
  isDirectory: boolean;
  isFile: boolean;
} | null> {
  try {
    const stats = await stat(filePath);
    return {
      exists: true,
      size: stats.size,
      lastModified: stats.mtime.toISOString(),
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    };
  } catch {
    return null;
  }
}

export async function copyFile(sourcePath: string, destinationPath: string): Promise<void> {
  try {
    await ensureDirectory(path.dirname(destinationPath));
    await fsCopyFile(sourcePath, destinationPath);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to copy file from ${sourcePath} to ${destinationPath}: ${errorMessage}`);
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to delete file ${filePath}: ${errorMessage}`);
  }
}

export async function listDirectoryFiles(
  dirPath: string, 
  extension?: string
): Promise<string[]> {
  try {
    const files = await readdir(dirPath);
    
    if (extension) {
      return files.filter(file => file.endsWith(extension));
    }
    
    return files;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to list directory ${dirPath}: ${errorMessage}`);
  }
}

export async function findProjectRoot(
  startPath: string = process.cwd(), 
  requiredIndicators: string[] = ['TOOLS.md']
): Promise<string | null> {
  let currentPath = path.resolve(startPath);
  
  while (currentPath !== path.parse(currentPath).root) {
    // Check for primary indicators first (TOOLS.md and .git)
    const primaryIndicators = ['TOOLS.md', '.git'];
    
    for (const indicator of primaryIndicators) {
      const indicatorPath = path.join(currentPath, indicator);
      if (await checkFileExists(indicatorPath)) {
        // If we find TOOLS.md, always return immediately
        if (indicator === 'TOOLS.md') {
          return currentPath;
        }
        // For .git, only return if TOOLS.md is not required or not found higher up
        if (indicator === '.git' && !requiredIndicators.includes('TOOLS.md')) {
          return currentPath;
        }
      }
    }
    
    // Check if any required indicators are present
    for (const indicator of requiredIndicators) {
      const indicatorPath = path.join(currentPath, indicator);
      if (await checkFileExists(indicatorPath)) {
        return currentPath;
      }
    }
    
    currentPath = path.dirname(currentPath);
  }
  
  return null;
}

export function resolveRelativePath(basePath: string, relativePath: string): string {
  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }
  
  return path.resolve(basePath, relativePath);
}

export function getRelativePath(fromPath: string, toPath: string): string {
  return path.relative(fromPath, toPath);
}

export function joinPaths(...paths: string[]): string {
  return path.join(...paths);
}

export function getFileExtension(filePath: string): string {
  return path.extname(filePath);
}

export function getFileName(filePath: string, withExtension: boolean = true): string {
  const baseName = path.basename(filePath);
  
  if (withExtension) {
    return baseName;
  }
  
  return path.parse(baseName).name;
}

export function getDirectoryName(filePath: string): string {
  return path.dirname(filePath);
}

export async function createBackup(filePath: string): Promise<string> {
  const backupPath = `${filePath}.backup.${Date.now()}`;
  await copyFile(filePath, backupPath);
  return backupPath;
}

export async function cleanupTempFiles(directory: string, pattern: RegExp = /\.tmp$/): Promise<number> {
  try {
    const files = await readdir(directory);
    const tempFiles = files.filter(file => pattern.test(file));
    
    let cleanedCount = 0;
    for (const file of tempFiles) {
      try {
        await unlink(path.join(directory, file));
        cleanedCount++;
      } catch {
        // Ignore errors when cleaning up temp files
      }
    }
    
    return cleanedCount;
  } catch {
    return 0;
  }
}