# Manual Decomposition Guide: Figma Pages to Modular Components

**Version:** 1.0  
**Last Updated:** November 3, 2025

This guide provides a **practical, step-by-step manual process** for breaking Figma pages into modular components. This is a **one-time or periodic manual task** that requires developer judgment.

---

## The Reality: Manual Decomposition

**Key Point:** Decomposition is **primarily manual** because:
- ✅ Requires understanding of code architecture
- ✅ Requires judgment on what's reusable vs feature-specific
- ✅ Requires proper abstraction and prop design
- ✅ Can't be fully automated (requires human decision-making)

**However:** We can automate parts of it (detection, extraction scripts) to make it faster.

---

## Step-by-Step Manual Process

### Phase 1: Initial Decomposition (One-Time Setup)

#### Step 1: Analyze Figma Page Structure

**1.1 Open Figma Design**

```
┌─────────────────────────────────────────┐
│         Figma: HomePage.tsx              │
│  ┌────────────────────────────────────┐ │
│  │ Header Section                      │ │
│  │  - Logo                             │ │
│  │  - Button (Sign in)                │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ Prompt Input Section                │ │
│  │  - Large Textarea                   │ │
│  │  - Attachment Button                │ │
│  │  - Voice Button                     │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ Assistant Selection Section         │ │
│  │  - Multiple Assistant Cards        │ │
│  │  - Each card has Avatar + Name     │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ Footer Section                      │ │
│  │  - Links                            │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Step 2: Identify Reusable Components

**Manual Analysis Checklist:**

```markdown
## Component Analysis: HomePage.tsx

### Section 1: Header
- [ ] Logo → Can be reused? YES → `packages/ui/src/components/Logo.tsx`
- [ ] Button → Can be reused? YES → `packages/ui/src/components/Button.tsx`
- [ ] Header container → Feature-specific? YES → Keep in `apps/web/components/home/HomePage.tsx`

### Section 2: Prompt Input
- [ ] Textarea → Can be reused? YES → `packages/ui/src/components/Textarea.tsx`
- [ ] Icon buttons → Can be reused? YES → `packages/ui/src/components/IconButton.tsx`
- [ ] Entire prompt section → Feature-specific? YES → `apps/web/components/home/PromptInput.tsx`

### Section 3: Assistant Selection
- [ ] Assistant Card → Can be reused? YES → `packages/ui/src/components/AssistantCard.tsx`
- [ ] Card grid → Feature-specific? YES → `apps/web/components/home/AssistantSelector.tsx`

### Section 4: Footer
- [ ] Footer links → Can be reused? YES → `packages/ui/src/components/Footer.tsx`
```

#### Step 3: Create Component Mapping File

**Manually create this file:**

```json
// infra/figma/component-mapping.json
{
  "pages": {
    "HomePage": {
      "figmaFile": "Pages/Home",
      "figmaUrl": "https://figma.com/file/xxx",
      "sections": [
        {
          "id": "header",
          "figmaName": "Header Section",
          "figmaNodeId": "I123:456",
          "lineStart": 10,
          "lineEnd": 50,
          "components": [
            {
              "name": "Logo",
              "path": "packages/ui/src/components/Logo.tsx",
              "type": "shared",
              "extracted": false
            },
            {
              "name": "Button",
              "path": "packages/ui/src/components/Button.tsx",
              "type": "shared",
              "extracted": false
            }
          ]
        },
        {
          "id": "prompt-input",
          "figmaName": "Prompt Input Section",
          "figmaNodeId": "I789:012",
          "lineStart": 52,
          "lineEnd": 120,
          "components": [
            {
              "name": "PromptInput",
              "path": "apps/web/components/home/PromptInput.tsx",
              "type": "feature",
              "uses": [
                "packages/ui/src/components/Textarea.tsx",
                "packages/ui/src/components/IconButton.tsx"
              ],
              "extracted": false
            }
          ]
        }
      ]
    }
  }
}
```

---

## Phase 2: Manual Extraction Process

### Example: Extracting Button Component

#### Step 1: Open Figma Code

```typescript
// From Figma repo: components/home/HomePage.tsx
export function HomePage() {
  return (
    <div className="container">
      {/* Header Section */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" />
          <h1>Thoughtweaver</h1>
        </div>
        <button 
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => console.log('Sign in')}
        >
          Sign in
        </button>
      </header>
      
      {/* Rest of page... */}
    </div>
  );
}
```

#### Step 2: Identify Button Code

**Find the button element:**
```tsx
<button 
  className="bg-purple-500 text-white px-4 py-2 rounded"
  onClick={() => console.log('Sign in')}
>
  Sign in
</button>
```

#### Step 3: Extract to Shared Component

**Create the component:**

```typescript
// packages/ui/src/components/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@thoughtweaver/ui/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'rounded font-medium transition-colors',
        // Variant styles
        variant === 'default' && 'bg-purple-500 text-white hover:bg-purple-600',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        // Size styles
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-6 py-3 text-lg',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### Step 4: Update HomePage to Use New Component

```typescript
// apps/web/components/home/HomePage.tsx
import { Button } from '@thoughtweaver/ui';

export function HomePage() {
  return (
    <div className="container">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" />
          <h1>Thoughtweaver</h1>
        </div>
        <Button onClick={() => console.log('Sign in')}>
          Sign in
        </Button>
      </header>
      
      {/* Rest of page... */}
    </div>
  );
}
```

#### Step 5: Update Component Mapping

```json
{
  "components": [
    {
      "name": "Button",
      "path": "packages/ui/src/components/Button.tsx",
      "type": "shared",
      "extracted": true,  // ✅ Mark as extracted
      "extractedDate": "2025-11-03",
      "usedIn": [
        "apps/web/components/home/HomePage.tsx",
        "apps/web/components/conversation/ConversationView.tsx"
      ]
    }
  ]
}
```

---

## Phase 3: When Figma Updates (Selective Manual Update)

### Scenario: Designer Changes Button Color

#### Step 1: Compare Old vs New

```bash
# In Figma repo
cd ../thoughtweaver-figma
git diff HEAD~1 components/home/HomePage.tsx
```

**See the change:**
```diff
- <button className="bg-purple-500 ...">
+ <button className="bg-purple-600 ...">
```

#### Step 2: Identify What Changed

**Manual analysis:**
- ✅ Button color changed (purple-500 → purple-600)
- ✅ This is in Header section
- ✅ Button is a shared component
- ✅ Need to update `packages/ui/src/components/Button.tsx`

#### Step 3: Update Only the Changed Component

```typescript
// packages/ui/src/components/Button.tsx
// Only change the color, keep everything else

export function Button({ variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded font-medium transition-colors',
        // ✅ Updated: purple-500 → purple-600
        variant === 'default' && 'bg-purple-600 text-white hover:bg-purple-700',
        // ... rest unchanged
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### Step 4: Test Affected Components

```bash
# Run tests for Button
npm run test -- Button.test.tsx

# Run tests for pages using Button
npm run test -- HomePage.test.tsx
npm run test -- ConversationView.test.tsx
```

---

## Practical Workflow: Day-to-Day

### When Designer Updates Figma

**Workflow:**

```bash
# 1. Get updated Figma code
cd ../thoughtweaver-figma
git pull origin main

# 2. See what changed
git diff HEAD~1 -- components/home/HomePage.tsx

# 3. Identify changed sections manually
# Look at the diff:
# - Changed colors/styles → Update shared components
# - Changed layout → Update page component
# - New sections → Extract new components

# 4. Open component mapping file
code infra/figma/component-mapping.json

# 5. Find which components are affected
# Example: Button color changed → affects Button.tsx

# 6. Update the component
code packages/ui/src/components/Button.tsx
# Make the change manually

# 7. Test
npm run test

# 8. Commit
git add .
git commit -m "feat: update Button color from Figma HomePage"
```

---

## Semi-Automated Helper Script

**Create a helper script to make it easier:**

```typescript
// scripts/helper-extract-component.ts
/**
 * Helper script to extract components from Figma code
 * 
 * Usage:
 * node scripts/helper-extract-component.ts \
 *   --from=../thoughtweaver-figma/components/home/HomePage.tsx \
 *   --section=header \
 *   --component=Button \
 *   --to=packages/ui/src/components/Button.tsx
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

interface ExtractOptions {
  from: string;
  section: string;
  component: string;
  to: string;
}

function extractComponent(options: ExtractOptions) {
  console.log(`📦 Extracting ${options.component} from ${options.from}...`);
  
  // 1. Read Figma file
  const figmaCode = readFileSync(options.from, 'utf-8');
  
  // 2. Find section (you define line ranges manually)
  const mapping = JSON.parse(
    readFileSync('infra/figma/component-mapping.json', 'utf-8')
  );
  
  const page = mapping.pages['HomePage'];
  const section = page.sections.find((s: any) => s.id === options.section);
  
  if (!section) {
    console.error(`❌ Section ${options.section} not found`);
    return;
  }
  
  // 3. Extract lines
  const lines = figmaCode.split('\n');
  const sectionCode = lines
    .slice(section.lineStart - 1, section.lineEnd)
    .join('\n');
  
  // 4. Extract component code (manual regex for now)
  const componentMatch = extractComponentCode(sectionCode, options.component);
  
  if (!componentMatch) {
    console.error(`❌ Component ${options.component} not found in section`);
    return;
  }
  
  // 5. Generate component file
  const componentCode = generateComponent(options.component, componentMatch);
  
  // 6. Write to destination
  writeFileSync(options.to, componentCode);
  
  console.log(`✅ Extracted to ${options.to}`);
  console.log(`⚠️  Please review and clean up the code manually!`);
}

function extractComponentCode(code: string, componentName: string): string | null {
  // Simple regex to find button-like code
  // This is a helper - you'll still need to clean it up manually
  const buttonRegex = /<button[^>]*>[\s\S]*?<\/button>/;
  const match = code.match(buttonRegex);
  return match ? match[0] : null;
}

function generateComponent(name: string, code: string): string {
  // Generate basic component structure
  // You'll need to manually refine this
  return `
import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ${name}Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ${name}({ children, ...props }: ${name}Props) {
  return (
    ${code}
  );
}
  `;
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: ExtractOptions = {
    from: args.find(arg => arg.startsWith('--from='))?.split('=')[1] || '',
    section: args.find(arg => arg.startsWith('--section='))?.split('=')[1] || '',
    component: args.find(arg => arg.startsWith('--component='))?.split('=')[1] || '',
    to: args.find(arg => arg.startsWith('--to='))?.split('=')[1] || '',
  };
  
  extractComponent(options);
}
```

**Usage:**

```bash
# Helper script (still requires manual cleanup)
node scripts/helper-extract-component.ts \
  --from=../thoughtweaver-figma/components/home/HomePage.tsx \
  --section=header \
  --component=Button \
  --to=packages/ui/src/components/Button.tsx

# Then manually review and clean up
code packages/ui/src/components/Button.tsx
```

---

## Complete Manual Process Example

### Example: Decomposing HomePage

**1. Original Figma Code:**

```typescript
// Figma repo: components/home/HomePage.tsx (500 lines, everything in one file)
export function HomePage() {
  return (
    <div>
      {/* 100 lines of header code */}
      {/* 150 lines of prompt input code */}
      {/* 200 lines of assistant selection code */}
      {/* 50 lines of footer code */}
    </div>
  );
}
```

**2. Manual Decomposition Steps:**

#### Step A: Extract Header Components

```bash
# Open Figma file
code ../thoughtweaver-figma/components/home/HomePage.tsx

# Find header section (lines 10-50)
# Copy Logo code → Create packages/ui/src/components/Logo.tsx
# Copy Button code → Create packages/ui/src/components/Button.tsx
```

**Result:**
```typescript
// packages/ui/src/components/Logo.tsx (NEW)
export function Logo() { /* extracted */ }

// packages/ui/src/components/Button.tsx (NEW)
export function Button() { /* extracted */ }
```

#### Step B: Extract Prompt Input Section

```bash
# Find prompt section (lines 52-200)
# Extract entire section → apps/web/components/home/PromptInput.tsx
```

**Result:**
```typescript
// apps/web/components/home/PromptInput.tsx (NEW)
import { Textarea } from '@thoughtweaver/ui';
import { IconButton } from '@thoughtweaver/ui';

export function PromptInput() {
  return (
    <div>
      <Textarea />
      <IconButton icon="paperclip" />
      <IconButton icon="mic" />
    </div>
  );
}
```

#### Step C: Extract Assistant Selection

```bash
# Find assistant section (lines 202-400)
# Extract card → packages/ui/src/components/AssistantCard.tsx
# Extract selector → apps/web/components/home/AssistantSelector.tsx
```

**Result:**
```typescript
// packages/ui/src/components/AssistantCard.tsx (NEW)
export function AssistantCard({ assistant }: { assistant: Assistant }) {
  return <div>{assistant.name}</div>;
}

// apps/web/components/home/AssistantSelector.tsx (NEW)
import { AssistantCard } from '@thoughtweaver/ui';

export function AssistantSelector() {
  return (
    <div>
      {assistants.map(a => <AssistantCard key={a.id} assistant={a} />)}
    </div>
  );
}
```

#### Step D: Rebuild HomePage Using Modules

```typescript
// apps/web/components/home/HomePage.tsx (REFACTORED)
import { Logo, Button } from '@thoughtweaver/ui';
import { PromptInput } from './PromptInput';
import { AssistantSelector } from './AssistantSelector';

export function HomePage() {
  return (
    <div>
      <header>
        <Logo />
        <Button>Sign in</Button>
      </header>
      
      <PromptInput />
      
      <AssistantSelector />
      
      <footer>...</footer>
    </div>
  );
}
```

**Before:** 500 lines in one file  
**After:** 
- 50 lines in HomePage.tsx (orchestrator)
- 100 lines in PromptInput.tsx (feature)
- 80 lines in AssistantSelector.tsx (feature)
- 30 lines in Button.tsx (shared)
- 20 lines in Logo.tsx (shared)
- 40 lines in AssistantCard.tsx (shared)

---

## When Figma Updates: Manual Update Process

### Scenario: Designer Changes Button Style

**1. See change in Figma repo:**

```diff
# ../thoughtweaver-figma/components/home/HomePage.tsx
- <button className="bg-purple-500 px-4 py-2">
+ <button className="bg-purple-600 px-5 py-3">
```

**2. Identify impact:**

```bash
# Check component mapping
cat infra/figma/component-mapping.json | grep -A 5 "Button"

# Output:
# "name": "Button",
# "path": "packages/ui/src/components/Button.tsx",
# "type": "shared"
```

**3. Update Button component:**

```typescript
// packages/ui/src/components/Button.tsx
// Change:
variant === 'default' && 'bg-purple-500 px-4 py-2'
// To:
variant === 'default' && 'bg-purple-600 px-5 py-3'
```

**4. Test:**

```bash
npm run test -- Button.test.tsx
```

**5. Commit:**

```bash
git commit -m "feat: update Button styles from Figma"
```

---

## Tool to Help (But Still Manual Review)

### Visual Diff Tool

```bash
# scripts/compare-figma-changes.sh
#!/bin/bash

FIGMA_REPO="../thoughtweaver-figma"
MONOREPO_ROOT="."

echo "🔍 Comparing Figma changes..."

# Get changed files
CHANGED_FILES=$(cd $FIGMA_REPO && git diff --name-only HEAD~1)

for file in $CHANGED_FILES; do
  echo ""
  echo "📄 File: $file"
  
  # Show diff
  cd $FIGMA_REPO
  git diff HEAD~1 -- "$file" > /tmp/figma-diff.txt
  cd -
  
  # Find affected components
  COMPONENTS=$(grep -E "(Button|Card|Input)" /tmp/figma-diff.txt || echo "No components found")
  
  echo "Affected components:"
  echo "$COMPONENTS"
  
  echo ""
  echo "Suggested actions:"
  echo "1. Review diff: git diff $FIGMA_REPO/$file"
  echo "2. Check component mapping: infra/figma/component-mapping.json"
  echo "3. Update affected components manually"
done
```

---

## Best Practices for Manual Decomposition

### 1. Do It Once, Update Selectively

- ✅ **Initial decomposition:** Manual, thorough (one-time)
- ✅ **Updates:** Manual, but only changed sections

### 2. Document Your Decisions

```typescript
/**
 * Button Component
 * 
 * Extracted from: Figma HomePage / Header Section
 * Figma Node ID: I123:456
 * Extraction Date: 2025-11-03
 * 
 * Shared component used in:
 * - HomePage
 * - ConversationView  
 * - SettingsPage
 * 
 * When Figma updates Button:
 * 1. Check if change is in Header section
 * 2. Update this file
 * 3. Test all pages using Button
 */
export function Button() { }
```

### 3. Keep Component Mapping Updated

```json
{
  "Button": {
    "extracted": true,
    "lastUpdated": "2025-11-03",
    "figmaSource": "HomePage/Header",
    "usedIn": ["HomePage", "ConversationView"]
  }
}
```

### 4. Use Helper Scripts (But Review Manually)

```bash
# Helper extracts code, but you review and clean up
node scripts/helper-extract-component.ts --component=Button

# Then manually:
# 1. Review extracted code
# 2. Add proper props
# 3. Add TypeScript types
# 4. Remove page-specific code
# 5. Test
```

---

## Summary: Manual Process

**Initial Decomposition:**
1. ✅ Open Figma code
2. ✅ Identify sections manually
3. ✅ Extract components one by one
4. ✅ Create component mapping file
5. ✅ Rebuild page using modules

**When Figma Updates:**
1. ✅ See what changed (git diff)
2. ✅ Check component mapping
3. ✅ Update only affected components
4. ✅ Test
5. ✅ Commit

**Key Point:** 
- Decomposition is **manual** (requires judgment)
- Updates are **selective** (only changed parts)
- Helper scripts can **assist** but don't replace manual review

**Time Investment:**
- Initial decomposition: 2-4 hours per page
- Updates: 10-30 minutes per change

---

**Document Maintained By**: Engineering Team  
**Update Frequency**: As process evolves
