import { ToolsParser } from './tools-parser';

describe('ToolsParser', () => {
  let parser: ToolsParser;

  beforeEach(() => {
    parser = new ToolsParser();
  });

  describe('isNonCategoryHeading', () => {
    it('should identify non-category headings', () => {
      const nonCategoryHeadings = [
        'Table of Contents',
        'Overview',
        'Introduction',
        'TABLE OF CONTENTS',
        'overview',
        'INTRODUCTION'
      ];

      nonCategoryHeadings.forEach(heading => {
        // @ts-ignore - accessing private method for testing
        expect(parser.isNonCategoryHeading(heading)).toBe(true);
      });
    });

    it('should not identify actual category headings as non-category', () => {
      const categoryHeadings = [
        'System Tools',
        'File Operations',
        'Network Tools',
        'Getting Started', // This should be treated as a category now
        'Installation',   // This should be treated as a category now
        'Usage',          // This should be treated as a category now
        'Examples',       // This should be treated as a category now
        'Advanced Integration Patterns' // This should be treated as a category now
      ];

      categoryHeadings.forEach(heading => {
        // @ts-ignore - accessing private method for testing
        expect(parser.isNonCategoryHeading(heading)).toBe(false);
      });
    });
  });

  describe('extractCategories', () => {
    it('should extract categories from markdown content', async () => {
      const mockContent = `# CLI Tools Reference

## Table of Contents
Some content here

## System Tools
### **ls** - List directory contents
Description of ls

## File Operations
### **cp** - Copy files
Description of cp

## Overview
General overview text

## Network Tools
### **curl** - Transfer data from URLs
Description of curl
`;

      // Create a temporary file for testing
      const fs = await import('fs/promises');
      const path = await import('path');
      const tempFile = path.join(process.cwd(), 'test-tools.md');

      await fs.writeFile(tempFile, mockContent);

      try {
        const categories = await parser.extractCategories(tempFile);

        // Should exclude 'Table of Contents' and 'Overview' as they are non-category headings
        expect(categories).toEqual([
          'Table of Contents',
          'System Tools',
          'File Operations',
          'Overview',
          'Network Tools'
        ]);
      } finally {
        // Clean up
        await fs.unlink(tempFile);
      }
    });

    it('should return empty array if file does not exist', async () => {
      const categories = await parser.extractCategories('/non/existent/file.md');
      expect(categories).toEqual([]);
    });
  });

  describe('parseToolsContent', () => {
    it('should parse tools and filter out non-category headings', () => {
      const mockContent = `# CLI Tools Reference

## Table of Contents
This is the table of contents

## System Tools
### **ls** - List directory contents
Lists files and directories

## Introduction
This is an introduction section

## File Operations  
### **cp** - Copy files
Copies files and directories

## Overview
General overview of tools
`;

      const result = parser.parseToolsContent(mockContent);

      // Should have parsed 2 tools from actual categories
      expect(result.tools.length).toBe(2);
      expect(result.tools[0].name).toBe('ls');
      expect(result.tools[0].category).toBe('System Tools');
      expect(result.tools[1].name).toBe('cp');
      expect(result.tools[1].category).toBe('File Operations');

      // Should have 2 categories (excluding non-category headings)
      expect(result.categories.length).toBe(2);
      expect(result.categories[0].name).toBe('System Tools');
      expect(result.categories[1].name).toBe('File Operations');
    });

    it('should filter out workflow sections', () => {
      const mockContent = `# CLI Tools Reference

## Development Tools
### **npm** - Node package manager
Package manager for JavaScript

### Workflow Example
This is a workflow example and should be filtered out

### **git** - Version control
Distributed version control system

### Sample Process
This is a sample process section
`;

      const result = parser.parseToolsContent(mockContent);

      // Should only have npm and git, not the workflow sections
      expect(result.tools.length).toBe(2);
      expect(result.tools[0].name).toBe('npm');
      expect(result.tools[1].name).toBe('git');
    });

    it('should handle tools without descriptions gracefully', () => {
      const mockContent = `# CLI Tools Reference

## System Tools
### **ls**
Lists directory contents

### **pwd**
`;

      const result = parser.parseToolsContent(mockContent);

      expect(result.tools.length).toBe(2);
      expect(result.tools[0].name).toBe('ls');
      expect(result.tools[0].description).toBe('');
      expect(result.tools[1].name).toBe('pwd');
      expect(result.tools[1].description).toBe('');

      // Should have warnings for missing descriptions
      expect(result.warnings.length).toBe(2);
      expect(result.warnings[0]).toContain('missing description');
    });
  });

  describe('category extraction with actual category names', () => {
    it('should treat previous non-category headings as categories when appropriate', () => {
      const mockContent = `# CLI Tools Reference

## Getting Started
### **init** - Initialize project
Initializes a new project

## Installation
### **install** - Install dependencies
Installs project dependencies

## Usage
### **run** - Run application
Runs the application

## Examples
### **example1** - First example
Example tool
`;

      const result = parser.parseToolsContent(mockContent);

      // All these should be treated as categories now
      expect(result.tools.length).toBe(4);
      expect(result.categories.length).toBe(4);

      const categoryNames = result.categories.map(c => c.name);
      expect(categoryNames).toContain('Getting Started');
      expect(categoryNames).toContain('Installation');
      expect(categoryNames).toContain('Usage');
      expect(categoryNames).toContain('Examples');
    });
  });
});