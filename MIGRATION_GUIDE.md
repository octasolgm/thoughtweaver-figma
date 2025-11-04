# Migration Guide: Figma Code to Monorepo Structure

**Version:** 1.0  
**Last Updated:** November 3, 2025

This guide explains how to migrate your existing Figma-generated React/Next.js code into the monorepo structure while maintaining the ability to sync with Figma design updates.

---

## Current Situation

You have:
- ✅ Figma-generated React/Next.js code (single repo)
- ✅ Components organized by feature (home, conversation, assistant, etc.)
- ✅ UI components from shadcn/ui
- ✅ Existing functionality

You need:
- ✅ Convert to monorepo structure
- ✅ Maintain Figma sync capability
- ✅ Keep existing code working during migration
- ✅ Set up proper version control strategy

---

## Migration Strategy: Two-Phase Approach

### Phase 1: Prepare Monorepo (Keep Figma Code Separate Initially)

**Option A: Separate Repositories (Recommended for Smooth Transition)**

```
┌─────────────────────────────────────┐
│   thoughtweaver-figma (Current)    │  ← Your existing Figma code
│   - Single Next.js app             │
│   - All components                  │
│   - Master branch = Latest Figma   │
└─────────────────────────────────────┘
                ↓
        (One-time migration)
                ↓
┌─────────────────────────────────────┐
│   thoughtweaver (Monorepo)         │  ← New monorepo structure
│   ├── apps/web/                    │  ← Migrated from Figma repo
│   ├── apps/api/                    │  ← New backend
│   └── packages/ui/                  │  ← Shared components
└─────────────────────────────────────┘
```

**Option B: Single Repository with Branches**

```
thoughtweaver/
├── main                    ← Monorepo structure
├── figma-master           ← Your current Figma code
└── migration              ← Migration in progress
```

**Recommendation: Use Option A** (separate repos) because:
- ✅ Clean separation of concerns
- ✅ Can continue Figma updates in old repo
- ✅ Migrate gradually without breaking existing work
- ✅ Easier to rollback if needed

---

## Step-by-Step Migration Plan

### Step 1: Setup New Monorepo Repository

```bash
# 1. Create new monorepo repository
mkdir thoughtweaver-monorepo
cd thoughtweaver-monorepo

# 2. Initialize Turborepo
npx create-turbo@latest . --package-manager pnpm

# 3. Create directory structure
mkdir -p apps/{web,api}
mkdir -p packages/{ui,sdk,types,ai,config,utils}
mkdir -p infra/{supabase,docker,scripts}
```

### Step 2: Migrate Figma Code to Monorepo Structure

**2.1 Migrate Components**

```bash
# From your current Figma repo structure:
# src/components/home/HomePage.tsx
# src/components/conversation/ConversationView.tsx
# etc.

# To monorepo structure:
# apps/web/components/home/HomePage.tsx
# apps/web/components/conversation/ConversationView.tsx
```

**Migration Script:**

```bash
#!/bin/bash
# scripts/migrate-figma-components.sh

FIGMA_REPO="../thoughtweaver-figma"  # Your current Figma repo
MONOREPO_ROOT="."                     # New monorepo root

# Copy components
echo "Copying components..."
cp -r $FIGMA_REPO/src/components/* $MONOREPO_ROOT/apps/web/components/

# Copy UI components to shared package
echo "Copying UI components..."
cp -r $FIGMA_REPO/src/components/ui/* $MONOREPO_ROOT/packages/ui/src/components/

# Copy styles
echo "Copying styles..."
cp -r $FIGMA_REPO/src/styles/* $MONOREPO_ROOT/apps/web/styles/

# Copy assets
echo "Copying assets..."
cp -r $FIGMA_REPO/src/assets/* $MONOREPO_ROOT/apps/web/public/assets/

echo "Migration complete!"
```

**2.2 Update Import Paths**

After copying, update imports:

```typescript
// Before (Figma repo):
import { Button } from '@/components/ui/button';
import { HomePage } from '@/components/home/HomePage';

// After (Monorepo):
import { Button } from '@thoughtweaver/ui';
import { HomePage } from '@/components/home/HomePage';
```

**Automated Import Migration Script:**

```typescript
// scripts/fix-imports.ts
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const importMappings = {
  '@/components/ui/': '@thoughtweaver/ui/',
  '@/components/': '@/components/',
  '@/hooks/': '@/hooks/',
  '@/lib/': '@/lib/',
};

async function fixImports() {
  const files = glob.sync('apps/web/**/*.{ts,tsx}');
  
  for (const file of files) {
    let content = readFileSync(file, 'utf-8');
    
    // Replace imports
    for (const [old, newPath] of Object.entries(importMappings)) {
      content = content.replace(new RegExp(old, 'g'), newPath);
    }
    
    writeFileSync(file, content);
  }
}

fixImports();
```

### Step 3: Setup Figma Sync in Monorepo

**3.1 Create Figma Sync Configuration**

```typescript
// infra/figma/sync-config.ts
export const figmaSyncConfig = {
  // Your existing Figma repo
  figmaRepoPath: '../thoughtweaver-figma',
  
  // Component mapping
  componentMapping: {
    // Figma component → Monorepo location
    'Button/Primary': 'packages/ui/src/components/Button.tsx',
    'Card/Conversation': 'apps/web/components/conversation/ConversationCard.tsx',
    'Page/Home': 'apps/web/components/home/HomePage.tsx',
    // ... map all components
  },
  
  // Files to sync
  syncPaths: {
    components: 'src/components/**/*.tsx',
    styles: 'src/styles/**/*.css',
    assets: 'src/assets/**',
  },
};
```

**3.2 Create Sync Script**

```bash
#!/bin/bash
# scripts/sync-from-figma.sh

# Sync latest changes from Figma repo to monorepo

FIGMA_REPO="../thoughtweaver-figma"
MONOREPO_ROOT="."

echo "🔄 Syncing from Figma repo..."

# Pull latest from Figma repo
cd $FIGMA_REPO
git pull origin main
cd -

# Sync components
echo "📦 Syncing components..."
rsync -av --delete \
  $FIGMA_REPO/src/components/ \
  $MONOREPO_ROOT/apps/web/components/

# Sync UI components to shared package
echo "🎨 Syncing UI components..."
rsync -av --delete \
  $FIGMA_REPO/src/components/ui/ \
  $MONOREPO_ROOT/packages/ui/src/components/

# Sync styles
echo "💅 Syncing styles..."
rsync -av \
  $FIGMA_REPO/src/styles/ \
  $MONOREPO_ROOT/apps/web/styles/

# Sync assets
echo "🖼️ Syncing assets..."
rsync -av \
  $FIGMA_REPO/src/assets/ \
  $MONOREPO_ROOT/apps/web/public/assets/

echo "✅ Sync complete!"
echo "📝 Review changes and commit to monorepo"
```

### Step 4: Setup Git Workflow

**4.1 Repository Structure**

```
thoughtweaver-figma/          (Existing Figma repo)
├── main                      ← Design updates from Figma
└── releases/                 ← Tagged releases

thoughtweaver-monorepo/       (New monorepo)
├── main                      ← Production-ready code
├── develop                    ← Development branch
└── figma-sync/               ← Automated sync branch
```

**4.2 GitHub Actions for Auto-Sync**

```yaml
# .github/workflows/sync-figma.yml
name: Sync from Figma Repo

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM
  workflow_dispatch:  # Manual trigger
  repository_dispatch:
    types: [figma-updated]  # Triggered from Figma repo

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Monorepo
        uses: actions/checkout@v3
        with:
          path: monorepo
      
      - name: Checkout Figma Repo
        uses: actions/checkout@v3
        with:
          repository: your-org/thoughtweaver-figma
          path: figma-repo
          token: ${{ secrets.FIGMA_REPO_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: |
          cd monorepo
          pnpm install
      
      - name: Sync from Figma
        run: |
          cd monorepo
          bash scripts/sync-from-figma.sh
      
      - name: Check for Changes
        id: changes
        run: |
          cd monorepo
          git diff --exit-code apps/web packages/ui || echo "changed=true" >> $GITHUB_OUTPUT
      
      - name: Create Pull Request
        if: steps.changes.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          path: monorepo
          title: 'chore: sync components from Figma repo'
          body: |
            Auto-synced components from Figma repository.
            
            **Review Checklist:**
            - [ ] Components render correctly
            - [ ] No breaking changes
            - [ ] Imports updated
            - [ ] Tests pass
          branch: figma-sync/auto-$(date +%Y%m%d)
          commit-message: 'chore: sync from Figma repo'
```

### Step 5: Component Mapping File

**Create component mapping JSON:**

```json
// infra/figma/component-mapping.json
{
  "version": "1.0",
  "lastUpdated": "2025-11-03",
  "mappings": [
    {
      "figmaComponent": "Button/Primary",
      "figmaFile": "Design System",
      "monorepoPath": "packages/ui/src/components/Button.tsx",
      "category": "ui",
      "lastSynced": "2025-11-03"
    },
    {
      "figmaComponent": "Page/Home",
      "figmaFile": "Pages",
      "monorepoPath": "apps/web/components/home/HomePage.tsx",
      "category": "page",
      "lastSynced": "2025-11-03"
    },
    {
      "figmaComponent": "Card/Conversation",
      "figmaFile": "Components",
      "monorepoPath": "apps/web/components/conversation/ConversationCard.tsx",
      "category": "feature",
      "lastSynced": "2025-11-03"
    }
  ]
}
```

### Step 6: Figma Update Workflow

**When Designer Updates Figma:**

```
1. Designer updates Figma design
   ↓
2. Export code from Figma (or update manually in Figma repo)
   ↓
3. Commit to thoughtweaver-figma repo
   ↓
4. GitHub Action triggers sync
   ↓
5. Components synced to monorepo
   ↓
6. PR created automatically
   ↓
7. Developer reviews PR
   ↓
8. Merge to monorepo
```

**Manual Sync Process:**

```bash
# 1. Update Figma repo
cd ../thoughtweaver-figma
git pull origin main

# 2. Sync to monorepo
cd ../thoughtweaver-monorepo
bash scripts/sync-from-figma.sh

# 3. Review changes
git diff

# 4. Fix imports if needed
npm run fix:imports

# 5. Run tests
npm run test

# 6. Commit
git add .
git commit -m "chore: sync components from Figma"
git push
```

---

## Recommended Repository Structure

### Option 1: Two Separate Repos (Recommended)

```
GitHub Organization: thoughtweaver
├── thoughtweaver-figma           ← Figma-generated code
│   ├── main                      ← Latest Figma designs
│   └── .github/workflows/
│       └── notify-monorepo.yml   ← Notify monorepo on updates
│
└── thoughtweaver                 ← Monorepo (production)
    ├── main                      ← Production code
    ├── develop                   ← Development branch
    └── .github/workflows/
        └── sync-figma.yml        ← Sync from Figma repo
```

**Benefits:**
- ✅ Clean separation
- ✅ Figma repo can be used for design review
- ✅ Monorepo focuses on production code
- ✅ Easy to manage permissions

### Option 2: Single Repo with Submodules

```
thoughtweaver/
├── .gitmodules
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── ui/
└── figma/                        ← Git submodule
    └── (points to thoughtweaver-figma repo)
```

**Setup:**

```bash
# Add Figma repo as submodule
git submodule add https://github.com/your-org/thoughtweaver-figma figma

# Sync submodule
git submodule update --remote figma
```

---

## Migration Checklist

### Pre-Migration

- [ ] Create new monorepo repository
- [ ] Setup Turborepo structure
- [ ] Document current Figma repo structure
- [ ] Create component mapping file
- [ ] Setup Figma sync scripts

### Migration Phase 1: Components

- [ ] Copy UI components to `packages/ui`
- [ ] Copy feature components to `apps/web/components`
- [ ] Update import paths
- [ ] Fix broken imports
- [ ] Verify components render correctly

### Migration Phase 2: Pages & Routes

- [ ] Copy page components
- [ ] Setup Next.js App Router structure
- [ ] Update routing
- [ ] Verify pages work

### Migration Phase 3: Configuration

- [ ] Copy Tailwind config
- [ ] Copy environment variables
- [ ] Setup shared packages
- [ ] Configure TypeScript paths

### Migration Phase 4: Sync Setup

- [ ] Create sync scripts
- [ ] Setup GitHub Actions
- [ ] Test sync process
- [ ] Document sync workflow

### Migration Phase 5: Testing

- [ ] Run all tests
- [ ] Fix broken tests
- [ ] Update test paths
- [ ] Add migration tests

---

## Daily Workflow: Managing Figma Updates

### Scenario 1: Designer Updates Single Component

```bash
# 1. Designer updates Button in Figma
# 2. Designer commits to Figma repo

# 3. Developer syncs (manual or auto)
cd thoughtweaver-monorepo
bash scripts/sync-from-figma.sh

# 4. Review changes
git diff packages/ui/src/components/Button.tsx

# 5. Run tests
npm run test -- Button.test.tsx

# 6. Commit
git commit -m "feat: update Button component from Figma"
```

### Scenario 2: Designer Updates Multiple Pages

```bash
# 1. Designer updates multiple pages in Figma
# 2. Designer creates PR in Figma repo

# 3. After Figma PR merged, sync to monorepo
bash scripts/sync-from-figma.sh

# 4. Review all changes
git diff apps/web/components/

# 5. Fix any import issues
npm run fix:imports

# 6. Test affected pages
npm run test:e2e -- --grep "home|conversation"

# 7. Create PR in monorepo
git checkout -b sync/figma-updates-$(date +%Y%m%d)
git commit -m "chore: sync page updates from Figma"
git push
# Create PR for review
```

---

## Troubleshooting

### Issue: Import Errors After Sync

**Solution:**
```bash
# Run import fix script
npm run fix:imports

# Or manually check imports
grep -r "@/components/ui" apps/web/
# Replace with @thoughtweaver/ui
```

### Issue: Components Not Found

**Solution:**
```bash
# Check component mapping
cat infra/figma/component-mapping.json

# Verify component exists in monorepo
find . -name "Button.tsx"

# Check if it's in shared package
ls packages/ui/src/components/
```

### Issue: Styles Not Loading

**Solution:**
```bash
# Verify styles copied
ls apps/web/styles/

# Check Tailwind config
cat apps/web/tailwind.config.js

# Rebuild
npm run build
```

---

## Best Practices

### 1. Keep Figma Repo Clean

- ✅ Only commit Figma-generated code
- ✅ Tag releases for major updates
- ✅ Document breaking changes

### 2. Monorepo Best Practices

- ✅ Always review synced changes
- ✅ Run tests before committing
- ✅ Update component mapping file
- ✅ Document any manual changes

### 3. Communication

- ✅ Notify team when syncing major changes
- ✅ Document Figma → Monorepo changes
- ✅ Keep changelog updated

---

## Quick Reference Commands

```bash
# Sync from Figma repo
bash scripts/sync-from-figma.sh

# Fix imports after sync
npm run fix:imports

# Check what changed
git diff

# Test synced components
npm run test

# Update component mapping
npm run update:component-mapping

# Check sync status
npm run figma:status
```

---

## Summary

**Migration Strategy:**
1. ✅ Keep Figma repo separate initially
2. ✅ Create new monorepo structure
3. ✅ Migrate components gradually
4. ✅ Setup automated sync
5. ✅ Test thoroughly

**Ongoing Management:**
- ✅ Figma updates → Commit to Figma repo
- ✅ Auto-sync to monorepo (or manual)
- ✅ Review and test changes
- ✅ Merge to monorepo

This approach allows you to:
- ✅ Keep existing Figma workflow
- ✅ Gradually migrate to monorepo
- ✅ Maintain sync capability
- ✅ Avoid breaking existing code

**Document Maintained By**: Engineering Team  
**Update Frequency**: As migration progresses
