# Figma Page Decomposition & Modular Sync Strategy

**Version:** 1.0  
**Last Updated:** November 3, 2025

This guide explains how to handle Figma's whole-page designs when your monorepo uses modular components.

---

## The Problem

**Figma Exports:**
- ❌ Whole pages as single components
- ❌ `HomePage.tsx` (entire page)
- ❌ `ConversationView.tsx` (entire page)
- ❌ Not modular

**Monorepo Needs:**
- ✅ Modular components: `Button.tsx`, `Card.tsx`, `PromptInput.tsx`
- ✅ Reusable pieces
- ✅ Shared components in `packages/ui`

**Challenge:**
- How to sync when Figma updates a whole page?
- How to track which parts changed?
- How to update only affected modular components?

---

## Solution: Three-Layer Mapping Strategy

### Layer 1: Figma Page → Monorepo Page (Reference)
### Layer 2: Figma Components → Modular Components (Reusable)
### Layer 3: Change Detection → Selective Updates

```
┌─────────────────────────────────────────────────────────┐
│                  Figma Design Layer                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │  HomePage (Whole Page)                             │  │
│  │  ├── Header Section                                │  │
│  │  ├── PromptInput Section                           │  │
│  │  ├── AssistantSelection Section                    │  │
│  │  └── Footer Section                                │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↓
              (Decomposition Mapping)
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Monorepo Modular Layer                      │
│  ┌────────────────────────────────────────────────────┐  │
│  │  packages/ui/ (Shared)                           │  │
│  │  ├── Button.tsx ← from Header Section             │  │
│  │  ├── Input.tsx ← from PromptInput Section         │  │
│  │  └── AssistantCard.tsx ← from Selection Section  │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  apps/web/components/home/                        │  │
│  │  ├── HomePage.tsx ← Orchestrates modules          │  │
│  │  ├── PromptInput.tsx ← Modular piece              │  │
│  │  ├── AssistantSelector.tsx ← Modular piece        │  │
│  │  └── WorkflowSelector.tsx ← Modular piece         │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Decompose Figma Pages into Modular Components

### Initial Decomposition Process

**1.1 Analyze Figma Page Structure**

```typescript
// infra/figma/decomposition-map.json
{
  "pages": {
    "HomePage": {
      "figmaFile": "Pages/Home",
      "figmaUrl": "https://figma.com/file/xxx",
      "sections": [
        {
          "id": "header",
          "figmaName": "Header Section",
          "figmaId": "I123:456",
          "modularComponents": [
            "packages/ui/src/components/Button.tsx",
            "packages/ui/src/components/Logo.tsx"
          ],
          "pageComponent": "apps/web/components/home/HomePage.tsx"
        },
        {
          "id": "prompt-input",
          "figmaName": "Prompt Input Section",
          "figmaId": "I789:012",
          "modularComponents": [
            "packages/ui/src/components/Textarea.tsx",
            "apps/web/components/home/PromptInput.tsx"
          ],
          "pageComponent": "apps/web/components/home/HomePage.tsx"
        },
        {
          "id": "assistant-selection",
          "figmaName": "Assistant Selection",
          "figmaId": "I345:678",
          "modularComponents": [
            "packages/ui/src/components/AssistantCard.tsx",
            "apps/web/components/home/AssistantSelector.tsx"
          ],
          "pageComponent": "apps/web/components/home/HomePage.tsx"
        }
      ]
    }
  }
}
```

**1.2 Create Modular Components from Figma Sections**

```bash
# When syncing HomePage from Figma, extract sections:

# 1. Extract Header Section → Button component
# Figma: HomePage/Header/Button
# Output: packages/ui/src/components/Button.tsx

# 2. Extract Prompt Input Section → PromptInput component
# Figma: HomePage/PromptInput
# Output: apps/web/components/home/PromptInput.tsx

# 3. Extract Assistant Selection → AssistantSelector component
# Figma: HomePage/AssistantSelection
# Output: apps/web/components/home/AssistantSelector.tsx

# 4. Create Page Component that uses modules
# Output: apps/web/components/home/HomePage.tsx
```

---

## Step 2: Component Extraction Script

```typescript
// scripts/extract-modular-components.ts
import { readFileSync, writeFileSync } from 'fs';
import { parse } from '@figma/api';

interface FigmaSection {
  id: string;
  name: string;
  nodeId: string;
  outputPath: string;
  type: 'shared' | 'feature';
}

async function extractModularComponents(figmaPage: any) {
  const decompositionMap = JSON.parse(
    readFileSync('infra/figma/decomposition-map.json', 'utf-8')
  );
  
  const page = decompositionMap.pages[figmaPage.name];
  
  for (const section of page.sections) {
    // Extract section from Figma page
    const sectionCode = await extractSectionFromPage(
      figmaPage,
      section.figmaId
    );
    
    // Determine if it's shared or feature-specific
    const isShared = section.modularComponents.some(
      path => path.includes('packages/ui')
    );
    
    if (isShared) {
      // Extract to shared package
      const componentName = extractComponentName(sectionCode);
      const sharedPath = `packages/ui/src/components/${componentName}.tsx`;
      
      writeFileSync(sharedPath, sectionCode);
      console.log(`✅ Extracted shared component: ${sharedPath}`);
    } else {
      // Extract to feature folder
      const featurePath = section.modularComponents[0];
      writeFileSync(featurePath, sectionCode);
      console.log(`✅ Extracted feature component: ${featurePath}`);
    }
  }
  
  // Generate page component that imports modules
  await generatePageComponent(page);
}

function extractComponentName(code: string): string {
  // Extract component name from code
  const match = code.match(/export\s+(?:function|const)\s+(\w+)/);
  return match ? match[1] : 'Component';
}

async function generatePageComponent(page: any) {
  const imports = page.sections.map((section: any) => {
    const componentPath = section.modularComponents[0];
    const componentName = componentPath.split('/').pop().replace('.tsx', '');
    return `import { ${componentName} } from '${getImportPath(componentPath)}';`;
  }).join('\n');
  
  const pageComponent = `
import React from 'react';
${imports}

export function ${page.name}() {
  return (
    <div className="page-container">
      {page.sections.map((section: any) => (
        <${section.id} key={section.id} />
      ))}
    </div>
  );
}
  `;
  
  writeFileSync(`apps/web/components/${page.name}/${page.name}.tsx`, pageComponent);
}
```

---

## Step 3: Change Detection & Selective Updates

### Detect What Changed in Figma

```typescript
// scripts/detect-figma-changes.ts
import { FigmaApi } from '@figma/api';

interface ChangeDetection {
  changedSections: string[];
  affectedComponents: string[];
  changeType: 'layout' | 'style' | 'content' | 'structure';
}

async function detectChanges(
  oldFigmaFile: any,
  newFigmaFile: any
): Promise<ChangeDetection> {
  const decompositionMap = JSON.parse(
    readFileSync('infra/figma/decomposition-map.json', 'utf-8')
  );
  
  const changes: ChangeDetection = {
    changedSections: [],
    affectedComponents: [],
    changeType: 'style',
  };
  
  // Compare Figma sections
  for (const pageName in decompositionMap.pages) {
    const page = decompositionMap.pages[pageName];
    
    for (const section of page.sections) {
      const oldSection = findSection(oldFigmaFile, section.figmaId);
      const newSection = findSection(newFigmaFile, section.figmaId);
      
      if (hasChanged(oldSection, newSection)) {
        changes.changedSections.push(section.id);
        changes.affectedComponents.push(...section.modularComponents);
        
        // Determine change type
        if (hasLayoutChange(oldSection, newSection)) {
          changes.changeType = 'layout';
        } else if (hasStyleChange(oldSection, newSection)) {
          changes.changeType = 'style';
        }
      }
    }
  }
  
  return changes;
}

function hasChanged(old: any, new_: any): boolean {
  // Compare node IDs, styles, content
  return (
    old.id !== new_.id ||
    JSON.stringify(old.styles) !== JSON.stringify(new_.styles) ||
    old.content !== new_.content
  );
}
```

### Selective Update Script

```bash
#!/bin/bash
# scripts/sync-figma-selective.sh

# 1. Detect what changed
echo "🔍 Detecting changes..."
CHANGES=$(node scripts/detect-figma-changes.js)

# 2. Extract only changed sections
echo "📦 Extracting changed components..."
for section in $CHANGES.changedSections; do
  echo "Updating section: $section"
  
  # Extract from Figma
  node scripts/extract-section.js --section=$section
  
  # Update affected components
  for component in $CHANGES.affectedComponents; do
    echo "Updating component: $component"
    # Merge changes into existing component
    node scripts/merge-component-changes.js \
      --figma=$FIGMA_REPO/components/$section.tsx \
      --target=$component
  done
done

# 3. Update page component if needed
if [ "$CHANGES.changeType" == "structure" ]; then
  echo "🔄 Regenerating page component..."
  node scripts/generate-page-component.js
fi

echo "✅ Selective sync complete!"
```

---

## Step 4: Component Mapping File (Detailed)

```json
// infra/figma/component-mapping-detailed.json
{
  "version": "1.0",
  "lastUpdated": "2025-11-03",
  "pages": {
    "HomePage": {
      "figmaFile": "Pages/Home",
      "figmaNodeId": "123:456",
      "monorepoPath": "apps/web/components/home/HomePage.tsx",
      "sections": [
        {
          "id": "header",
          "figmaName": "Header",
          "figmaNodeId": "123:457",
          "extractedComponents": [
            {
              "name": "Button",
              "path": "packages/ui/src/components/Button.tsx",
              "type": "shared",
              "props": ["variant", "size", "children"],
              "lastSynced": "2025-11-03"
            },
            {
              "name": "Logo",
              "path": "packages/ui/src/components/Logo.tsx",
              "type": "shared",
              "props": ["size"],
              "lastSynced": "2025-11-03"
            }
          ]
        },
        {
          "id": "prompt-input",
          "figmaName": "Prompt Input",
          "figmaNodeId": "123:458",
          "extractedComponents": [
            {
              "name": "PromptInput",
              "path": "apps/web/components/home/PromptInput.tsx",
              "type": "feature",
              "uses": [
                "packages/ui/src/components/Textarea.tsx",
                "packages/ui/src/components/Button.tsx"
              ],
              "lastSynced": "2025-11-03"
            }
          ]
        },
        {
          "id": "assistant-selection",
          "figmaName": "Assistant Selection",
          "figmaNodeId": "123:459",
          "extractedComponents": [
            {
              "name": "AssistantCard",
              "path": "packages/ui/src/components/AssistantCard.tsx",
              "type": "shared",
              "props": ["assistant", "selected", "onSelect"],
              "lastSynced": "2025-11-03"
            },
            {
              "name": "AssistantSelector",
              "path": "apps/web/components/home/AssistantSelector.tsx",
              "type": "feature",
              "uses": [
                "packages/ui/src/components/AssistantCard.tsx"
              ],
              "lastSynced": "2025-11-03"
            }
          ]
        }
      ]
    }
  }
}
```

---

## Step 5: Smart Sync Workflow

### Workflow When Figma Updates

```
1. Designer updates Figma HomePage
   ↓
2. Sync script detects changes:
   - Header section changed (Button styles)
   - PromptInput section unchanged
   - AssistantSelection unchanged
   ↓
3. Selective extraction:
   ✅ Extract only Header section
   ✅ Update Button.tsx (shared component)
   ✅ Update HomePage.tsx (imports Button)
   ❌ Skip PromptInput (no changes)
   ❌ Skip AssistantSelector (no changes)
   ↓
4. Run tests for affected components:
   ✅ Button.test.tsx
   ✅ HomePage.test.tsx
   ↓
5. Create PR with only changed files
```

### Implementation

```typescript
// scripts/smart-sync.ts
import { detectChanges } from './detect-figma-changes';
import { extractModularComponents } from './extract-modular-components';

async function smartSync(figmaRepoPath: string) {
  console.log('🔄 Starting smart sync...');
  
  // 1. Load current Figma file
  const currentFigma = await loadFigmaFile(figmaRepoPath);
  
  // 2. Load previous version (from git)
  const previousFigma = await loadPreviousVersion();
  
  // 3. Detect changes
  const changes = await detectChanges(previousFigma, currentFigma);
  
  console.log(`📊 Detected changes:`);
  console.log(`  - Sections changed: ${changes.changedSections.length}`);
  console.log(`  - Components affected: ${changes.affectedComponents.length}`);
  console.log(`  - Change type: ${changes.changeType}`);
  
  // 4. Extract only changed sections
  for (const sectionId of changes.changedSections) {
    console.log(`📦 Extracting section: ${sectionId}`);
    
    const section = findSection(currentFigma, sectionId);
    await extractModularComponents(section);
  }
  
  // 5. Update page components if structure changed
  if (changes.changeType === 'structure') {
    console.log('🔄 Regenerating page components...');
    await regeneratePageComponents(changes);
  }
  
  // 6. Run tests for affected components
  console.log('🧪 Running tests for affected components...');
  await runTests(changes.affectedComponents);
  
  console.log('✅ Smart sync complete!');
}

// Run smart sync
smartSync('../thoughtweaver-figma');
```

---

## Step 6: Manual Component Extraction Guide

### When Figma Updates Whole Page

**Option A: Manual Extraction (Recommended for First Time)**

```bash
# 1. Get updated Figma page
cd ../thoughtweaver-figma
git pull
cd ../thoughtweaver-monorepo

# 2. Review what changed
git diff HEAD~1 ../thoughtweaver-figma/components/home/HomePage.tsx

# 3. Identify changed sections
# Look for:
# - Changed colors/styles → Update shared components
# - Changed layout → Update feature components
# - New sections → Extract new components

# 4. Extract changed sections manually
# Copy relevant code from Figma file
# Paste into modular component files
# Update imports

# 5. Test
npm run test

# 6. Commit
git commit -m "feat: update Button component from Figma HomePage"
```

**Option B: Semi-Automated Extraction**

```bash
# 1. Run extraction script with section IDs
node scripts/extract-section.js \
  --figma=../thoughtweaver-figma/components/home/HomePage.tsx \
  --section=header \
  --output=packages/ui/src/components/Button.tsx

# 2. Review extracted code
code packages/ui/src/components/Button.tsx

# 3. Manual cleanup if needed
# Remove page-specific code
# Add proper props
# Update imports

# 4. Test
npm run test -- Button.test.tsx
```

---

## Step 7: Component Relationship Mapping

```typescript
// infra/figma/component-relationships.ts
export const componentRelationships = {
  // Figma Page → Modular Components
  'HomePage': {
    // Shared components (used across multiple pages)
    shared: [
      'Button',
      'Input',
      'Card',
      'Avatar',
    ],
    // Feature-specific components
    feature: [
      'PromptInput',
      'AssistantSelector',
      'WorkflowSelector',
    ],
    // Page component (orchestrates modules)
    page: 'HomePage',
  },
  
  // Which components are shared?
  sharedComponents: {
    'Button': ['HomePage', 'ConversationView', 'SettingsPage'],
    'Card': ['HomePage', 'ConversationView', 'AssistantsPage'],
    'Input': ['HomePage', 'ConversationView', 'SettingsPage'],
  },
  
  // Component dependencies
  dependencies: {
    'PromptInput': ['Textarea', 'Button'],
    'AssistantSelector': ['AssistantCard', 'Button'],
    'ConversationView': ['MessageBubble', 'Input', 'Button'],
  },
};
```

---

## Step 8: Update Strategy Matrix

| Figma Change Type | What to Update | Strategy |
|-------------------|----------------|----------|
| **Button color changed** | `packages/ui/Button.tsx` | Update shared component |
| **HomePage layout changed** | `apps/web/components/home/HomePage.tsx` | Update page component only |
| **New section added** | Extract new component + Update page | Extract → Add to page |
| **Section removed** | Remove component + Update page | Remove → Update imports |
| **Shared component changed** | Update shared + All pages using it | Update shared → Test all pages |

---

## Practical Example: HomePage Update

### Scenario: Designer Changes Button Color in HomePage

```bash
# 1. Figma repo updated
cd ../thoughtweaver-figma
git pull
# HomePage.tsx updated with new button color

# 2. Detect changes
cd ../thoughtweaver-monorepo
node scripts/detect-figma-changes.js
# Output: Button component changed in header section

# 3. Extract only Button component
node scripts/extract-component.js \
  --from=../thoughtweaver-figma/components/home/HomePage.tsx \
  --section=header \
  --component=Button \
  --to=packages/ui/src/components/Button.tsx

# 4. Review extracted code
# Manual cleanup: Remove page-specific code, keep only Button

# 5. Update component mapping
node scripts/update-mapping.js \
  --component=Button \
  --lastSynced=$(date +%Y-%m-%d)

# 6. Test affected components
npm run test -- Button.test.tsx
npm run test -- HomePage.test.tsx  # Uses Button

# 7. Commit
git add packages/ui/src/components/Button.tsx
git commit -m "feat: update Button styles from Figma HomePage"
```

---

## Best Practices

### 1. Always Extract to Modular Components

```typescript
// ❌ Bad: Keep whole page from Figma
import HomePage from '../figma/HomePage';  // DON'T DO THIS

// ✅ Good: Use modular components
import { Button } from '@thoughtweaver/ui';
import { PromptInput } from '@/components/home/PromptInput';
import { AssistantSelector } from '@/components/home/AssistantSelector';

export function HomePage() {
  return (
    <div>
      <Button>Click me</Button>
      <PromptInput />
      <AssistantSelector />
    </div>
  );
}
```

### 2. Track Component Origins

```typescript
// Add comment to track Figma source
/**
 * Button Component
 * 
 * Extracted from: Figma HomePage / Header Section
 * Figma Node ID: I123:456
 * Last synced: 2025-11-03
 * 
 * Shared component - used in:
 * - HomePage
 * - ConversationView
 * - SettingsPage
 */
export function Button({ variant, children }: ButtonProps) {
  // Component code
}
```

### 3. Incremental Updates

- ✅ Update only changed sections
- ✅ Test affected components
- ✅ Update component mapping file
- ✅ Document changes

---

## Summary

**Key Strategy:**
1. ✅ Decompose Figma pages into modular components
2. ✅ Track component relationships (mapping file)
3. ✅ Detect changes selectively
4. ✅ Update only affected components
5. ✅ Keep page components as orchestrators

**Workflow:**
```
Figma Updates Whole Page
    ↓
Detect Changed Sections
    ↓
Extract Only Changed Sections
    ↓
Update Modular Components
    ↓
Update Page Component (if structure changed)
    ↓
Test & Commit
```

This approach ensures:
- ✅ Modular architecture maintained
- ✅ Only changed components updated
- ✅ Shared components reused properly
- ✅ Minimal manual work

**Document Maintained By**: Engineering Team  
**Update Frequency**: As decomposition strategy evolves
