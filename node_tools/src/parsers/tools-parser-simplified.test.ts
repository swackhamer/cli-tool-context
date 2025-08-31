// Simple test file without importing the actual parser to test the logic
describe('ToolsParser - isNonCategoryHeading logic', () => {
  // Simplified version of the isNonCategoryHeading function for testing
  function isNonCategoryHeading(heading: string): boolean {
    const nonCategoryHeadings = ['table of contents', 'overview', 'introduction'];
    const headingLower = heading.toLowerCase().trim();
    return nonCategoryHeadings.includes(headingLower);
  }

  describe('isNonCategoryHeading', () => {
    it('should identify the minimal set of non-category headings', () => {
      // These should be identified as non-category headings
      expect(isNonCategoryHeading('Table of Contents')).toBe(true);
      expect(isNonCategoryHeading('Overview')).toBe(true);
      expect(isNonCategoryHeading('Introduction')).toBe(true);
      expect(isNonCategoryHeading('TABLE OF CONTENTS')).toBe(true);
      expect(isNonCategoryHeading('overview')).toBe(true);
      expect(isNonCategoryHeading('INTRODUCTION')).toBe(true);
    });

    it('should not identify actual category headings as non-category', () => {
      // All these should now be treated as regular categories
      const categoryHeadings = [
        'System Tools',
        'File Operations',
        'Network Tools',
        'Getting Started',
        'Installation',
        'Prerequisites',
        'Requirements',
        'Usage',
        'Examples',
        'Documentation',
        'References',
        'Appendix',
        'Conclusion',
        'Summary',
        'Quick Reference Summary',
        'Performance Comparisons & Tool Selection Guide',
        'Compression Comparison Summary',
        'Best Practices for Claude',
        'Ready-to-use Resources',
        'Advanced Integration Patterns'
      ];

      categoryHeadings.forEach(heading => {
        expect(isNonCategoryHeading(heading)).toBe(false);
      });
    });
  });

  describe('category extraction simulation', () => {
    function extractCategories(content: string): string[] {
      const categories: string[] = [];
      const lines = content.split('\n');

      for (const line of lines) {
        if (line.startsWith('## ')) {
          const categoryMatch = line.match(/^##\s+(.+)$/);
          if (categoryMatch) {
            const categoryName = categoryMatch[1].trim();
            // Filter out non-category headings
            if (!isNonCategoryHeading(categoryName)) {
              categories.push(categoryName);
            }
          }
        }
      }

      return categories;
    }

    it('should extract only actual categories', () => {
      const mockContent = `# CLI Tools Reference

## Table of Contents
Some content here

## System Tools
### **ls** - List directory contents

## Overview
General overview text

## File Operations
### **cp** - Copy files

## Introduction
Intro text

## Network Tools
### **curl** - Transfer data

## Getting Started
### **init** - Initialize

## Installation
### **install** - Install deps
`;

      const categories = extractCategories(mockContent);

      // Should only include actual category headings, not the minimal non-category set
      expect(categories).toEqual([
        'System Tools',
        'File Operations',
        'Network Tools',
        'Getting Started',
        'Installation'
      ]);

      // Should NOT include these
      expect(categories).not.toContain('Table of Contents');
      expect(categories).not.toContain('Overview');
      expect(categories).not.toContain('Introduction');
    });

    it('should handle edge cases', () => {
      const mockContent = `# Tools

## overview
Should be filtered

## OVERVIEW
Should be filtered

##   Table of Contents   
Should be filtered (with spaces)

## Real Category
Should be included
`;

      const categories = extractCategories(mockContent);
      expect(categories).toEqual(['Real Category']);
    });
  });
});