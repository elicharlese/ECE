# ECE Naming Strategy & Conventions

## Version: 2.0

## Date: July 24, 2025

---

## Overview

This document establishes comprehensive naming conventions for the ECE project to ensure consistency, clarity, and maintainability across all components, documentation, and development phases.

---

## Patch Naming Strategy

### Patch Documentation Structure

```text
patches/
├── FEATURE_MAPPING.md                      # Map patches to features
├── 3d-visualization/
│   └── sources/
│       ├── PATCH6_SUMMARY.md               # High-level summary
│       └── PATCH6_CHECKLIST.md             # Implementation checklist
├── enterprise-compliance/
│   └── sources/
│       ├── PATCH7_SUMMARY.md
│       └── PATCH7_CHECKLIST.md
└── ...                                     # Additional feature folders
```

### Patch Naming Conventions

#### File Naming

- **Master Archive**: `PATCHES_X-Y_ARCHIVE.md` (e.g., `PATCHES_1-5_ARCHIVE.md`)
- **Cycle Master**: `PATCHES_X-Y_MASTER.md` (e.g., `PATCHES_6-10_MASTER.md`)
- **Individual Patches**: `PATCH_X_FEATURE_NAME.md` (e.g., `PATCH_6_3D_TRADING.md`)
- **Checklist Files**: `PATCHX_CHECKLIST.md` (e.g., `PATCH6_CHECKLIST.md`)
- **Summary Files**: `PATCHX_SUMMARY.md` (e.g., `PATCH6_SUMMARY.md`)

#### Folder Naming

- **Patch Folders**: `patch-X/` (lowercase with hyphen, e.g., `patch-6/`)

#### Feature Naming Guidelines

- Use UPPERCASE for major concepts: `3D_TRADING`, `ENTERPRISE`, `AI_ANALYTICS`
- Use descriptive, concise names that reflect core functionality
- Avoid abbreviations unless universally understood
- Maximum 3 words connected by underscores

---

## Git & Version Control

### Branch Naming

- **Feature Branches**: `patch-X/feature-name` (e.g., `patch-6/3d-trading`)
- **Hotfix Branches**: `hotfix/issue-description`
- **Release Branches**: `release/vX.Y.Z`
- **Archive Branches**: `archive/patches-X-Y`

### Commit Message Standards

```text
🚀 PATCH X: Feature implementation milestone

- Implement core feature functionality
- Add comprehensive test coverage
- Update documentation and guides
- Prepare for integration testing

Closes: #issue-number
```

#### Commit Types

- `🚀 PATCH X:` - Major patch milestone
- `⚡ PATCH X:` - Feature implementation progress  
- `🐛 PATCH X:` - Bug fix within patch
- `📋 PATCH X:` - Documentation update
- `✅ PATCH X:` - Patch completion
- `🗂️` - Archive operations
- `📦` - Build/deployment changes

### Tag Naming

- **Patch Completion**: `patch-X-complete` (e.g., `patch-6-complete`)
- **Archive Tags**: `patches-X-Y-archive` (e.g., `patches-6-10-archive`)
- **Release Tags**: `v-X.Y.Z` (e.g., `v-2.1.0`)

---

## Component & Code Naming

### React Components

```typescript
// Component files: PascalCase
TradingCard.tsx
MarketplaceDashboard.tsx
UserProfile.tsx

// Component props: camelCase with descriptive interfaces
interface TradingCardProps {
  cardData: CardData;
  onTradeAction: (action: TradeAction) => void;
  isAnimated?: boolean;
}
```

### API Endpoints

```http
GET  /api/v1/patches/{patchId}/status
POST /api/v1/patches/{patchId}/complete  
GET  /api/v1/archive/patches/{cycleId}
```

### Database Collections/Tables

```text
// MongoDB Collections
patches_metadata
patch_progress_tracking
archive_cycles

// Table naming (if SQL)
patch_metadata
patch_progress
archive_cycles
```

---

## File System Organization

### Directory Structure Standards

```text
/apps/
├── ece-web/                    # Main web application
├── ece-mobile/                 # Mobile application
└── desktop/                   # Desktop application

/libs/
├── shared-ui/                  # Reusable UI components
├── shared-types/               # TypeScript type definitions
└── shared-business-logic/      # Core business logic

/docs/
├── core/                       # Core project docs
├── development/                # Development guides
└── deployment/                 # Deployment docs

/patches/
├── FEATURE_MAPPING.md          # Feature mapping for migrated patches
└── <feature>/sources/          # Feature-aligned patch docs

/e2e/
├── ece-web-e2e/               # Web app E2E tests
└── web-e2e/                   # Additional web tests
```

### Asset Naming

```text
// Images
hero-background.jpg
trading-card-template.svg
patch-6-3d-preview.png

// Icons  
icon-trading.svg
icon-enterprise-24x24.png
badge-ai-analytics.svg

// Fonts
ECE-Primary-Regular.woff2
ECE-Primary-Bold.woff2
```

---

## Archive System Integration

### Archive Naming Strategy

```text
PATCHES_1-5_ARCHIVE.md          # Complete 5-patch archive
PATCHES_6-10_ARCHIVE.md         # Next 5-patch archive (future)
PATCHES_11-15_ARCHIVE.md        # Future archive
```

### Archive Content Organization

```markdown
# PATCHES X-Y ARCHIVE
## Cycle Summary: [Descriptive Title]

### Archive Metadata
- **Cycle Start**: Date
- **Cycle End**: Date  
- **Total Patches**: 5
- **Major Features**: List key features
- **Git References**: Commit ranges

### Individual Patch Summaries
#### PATCH X: FEATURE_NAME
- **Duration**: X weeks
- **Status**: ✅ Complete
- **Key Deliverables**: List items
- **Lessons Learned**: Insights
```

### Archive File Lifecycle

1. **Active Development**: Individual `PATCH_X_FEATURE.md` files
2. **Completion**: Consolidate into `PATCHES_X-Y_ARCHIVE.md`
3. **Cleanup**: Remove individual files, maintain archive
4. **Reference**: Archive remains permanent historical record

---

## Consistency Guidelines

### Language & Terminology

- **Patches**: Always capitalized when referring to development phases
- **Features**: Use descriptive, user-facing language
- **Technical Terms**: Maintain consistent terminology across docs
- **Acronyms**: Define on first use, then use consistently

### Documentation Standards

- **Headers**: Use sentence case for readability
- **File Names**: Follow established patterns exactly
- **Status Indicators**: Use emoji for visual consistency
- **Dates**: ISO format (YYYY-MM-DD) for sorting

### Code Standards

- **Variables**: camelCase for JavaScript/TypeScript
- **Constants**: UPPER_CASE for configuration values
- **Classes**: PascalCase for all class definitions
- **Files**: kebab-case for utility files, PascalCase for components

---

## Migration & Compliance

### Existing File Updates

When updating existing files to match naming strategy:
1. **Plan Migration**: Document current → target naming
2. **Update References**: Ensure all links and imports updated  
3. **Test Thoroughly**: Verify no broken references
4. **Commit Atomically**: Group related changes in single commits

### Compliance Checking

Regular reviews should verify:

- [ ] All new files follow naming conventions
- [ ] Git commits use standard message format
- [ ] Documentation structure matches guidelines
- [ ] Archive system properly maintained

---

## Tools & Automation

### Naming Validation

```bash
# Check patch naming compliance (feature-based structure)
find patches -type f -path '*/sources/PATCH_*.md' | grep -v "PATCHES_.*_ARCHIVE"

# Validate feature/sources folder structure
find patches -type d -path 'patches/*/sources' | wc -l
```

### Auto-completion Support

```json
// VSCode snippets for consistent naming
{
  "patch-doc": {
    "prefix": "patch-doc",
    "body": [
      "# ECE Patch ${1:X}: ${2:Feature Name}",
      "## Date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      "## Status: 🚀 Planned",
      "",
      "---",
      "",
      "## Overview",
      "${3:Description}",
      ""
    ]
  }
}
```

---

**Last Updated**: July 24, 2025  
**Maintained By**: ECE Development Team  
**Review Schedule**: With each patch cycle  
**Version**: 2.0
