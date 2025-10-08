# Documentation Update Report
## Archived Features Audit - 2025-10-07

### Summary
This report identifies all references to archived features that need to be removed from active documentation.

### Archived Items
The following have been moved to `archive/` and should not be referenced in active documentation:
- `site/` directory → `archive/site/`
- `node_tools/` directory → `archive/node_tools/`
- `scripts/generate_site_data.sh` → `archive/scripts/`
- `scripts/serve-local.sh` → `archive/scripts/`
- `docs/system_administration_tools.md` → Deleted (was duplicate)
- `TOOLS_TODO.md` → `archive/TOOLS_TODO.md`

### Files Requiring Updates

#### 1. README.md (HIGH PRIORITY)
**Outdated References:**
- Line 21: `site/` directory reference
- Lines 78-120: Entire "Website Interface" section (remove completely)
- Line 84: `cd node_tools && npm install && npm run build`
- Line 87: `scripts/generate_site_data.sh`
- Lines 91-102: Server setup instructions (remove)
- Lines 52-74: MCP Integration section (remove)
- Lines 111-119: Website features list (remove)
- Line 165: `site/index.html` reference
- Lines 318-323: "For Interactive Browsing" section (remove)
- Line 32: `docs/system_administration_tools.md` reference (doesn't exist)
- Line 147: `docs/system_administration_tools.md` reference (doesn't exist)
- Lines 331-375: Validation scripts section references generate_site_data.sh

**Action:** Major rewrite required - remove all website/node_tools sections

#### 2. CLAUDE.md (HIGH PRIORITY)
**Outdated References:**
- Line 189: `TOOLS_TODO.md` reference
- Line 194: `site/` directory reference
- Lines 197-207: Website Access section (remove completely)
- Line 201: `cd node_tools && npm install && npm run build`
- Line 202: `scripts/generate_site_data.sh`
- Line 213: `generate_site_data.sh` reference
- Tool counts may be incorrect (says 303, actual is 267)

**Action:** Remove website sections, update tool counts

#### 3. docs/DOCUMENTATION.md (MEDIUM PRIORITY)
**Outdated References:**
- Line 37: `docs/SYSTEM_ADMINISTRATION_TOOLS.md` in file structure diagram
- Line 39: `node_tools/` in file structure diagram
- Line 69: `docs/SYSTEM_ADMINISTRATION_TOOLS.md` in table
- Line 77: `node_tools` in directory naming conventions

**Action:** Update file structure diagram and remove non-existent references

#### 4. docs/PROJECT_STATUS.md (MEDIUM PRIORITY)
**Outdated References:**
- References to `node_tools/` directory
- May contain website-related status updates

**Action:** Review and remove archived feature references

#### 5. MASTER_PLAN.md (LOW PRIORITY)
**Outdated References:**
- References to `site/` directory
- References to `node_tools/` directory
- References to `scripts/generate_site_data.sh`
- References to `system_administration_tools.md`
- References to `TOOLS_TODO.md`

**Action:** Update or mark completed items as archived

### Correct Current State

**Active Documentation Structure:**
```
/
├── README.md                    # Project overview
├── TOOLS.md                     # Main CLI tools reference (267 tools)
├── CLAUDE.md                    # AI integration guide
├── MASTER_PLAN.md              # Project planning
├── tools/                       # Organized tool categories
│   ├── README.md               # 19 category files, 267 tools total
│   ├── ai-powered-tools.md (3)
│   ├── cloud-container-tools.md (13)
│   ├── data-processing-tools.md (11)
│   └── ... (15 more category files)
├── docs/                        # Project documentation
│   ├── CHEATSHEET.md
│   ├── DOCUMENTATION.md
│   ├── PROJECT_STATUS.md
│   ├── safety/
│   ├── snippets/
│   └── templates/
├── scripts/                     # Validation & maintenance scripts
│   ├── verify_tools.sh
│   ├── update_stats.sh
│   ├── run_validation_suite.sh
│   └── validate_and_fix.sh
└── archive/                     # Historical/archived content
    ├── site/                   # Archived website
    ├── node_tools/             # Archived TypeScript CLI
    ├── scripts/                # Archived website scripts
    ├── TOOLS_TODO.md
    └── other archived docs
```

**Correct Tool Count:** 267 tools across 19 categories (verified in tools/ directory)

### Recommendations

1. **Priority Order:**
   - Update README.md first (most visible)
   - Update CLAUDE.md second (AI integration)
   - Update docs/DOCUMENTATION.md third (internal standards)
   - Update other files as needed

2. **Key Messages:**
   - Project is now a **pure markdown documentation repository**
   - All tools organized in `tools/` directory by category
   - Website and code generation tools have been archived
   - Focus on maintaining TOOLS.md and tools/ directory

3. **Validation After Updates:**
   - Verify no broken links to archived content
   - Ensure all file paths are correct
   - Update any tool counts to reflect actual count (267)
   - Test that all referenced scripts exist in `scripts/`

---
*Generated: 2025-10-07*
