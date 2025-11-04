# Quick Start: Migration & Setup Summary

**Version:** 1.0  
**Last Updated:** November 3, 2025

This is a **quick reference** for the complete migration and setup process. For detailed instructions, see `COMPLETE_SETUP_GUIDE.md`.

---

## 🎯 Overview

You're migrating from:
- **Current:** Single repo with Figma-generated code
- **To:** Two repos (Figma repo + Monorepo)

---

## 📋 Phase 0: Repository Setup (30 minutes)

### Step 1: Create GitHub Repos

```bash
# On GitHub.com, create:
1. thoughtweaver-figma (for design updates)
2. thoughtweaver (for production monorepo)
```

### Step 2: Push Current Code to Figma Repo

```bash
cd "C:\Users\Hp\Downloads\Thoughtweaver (Master) 1\src"
git init
git add .
git commit -m "Initial commit: Figma-generated code"
git remote add origin https://github.com/YOUR_USERNAME/thoughtweaver-figma.git
git push -u origin main
```

### Step 3: Initialize Monorepo

```bash
# Create new directory
mkdir thoughtweaver && cd thoughtweaver
git init
git remote add origin https://github.com/YOUR_USERNAME/thoughtweaver.git

# Initialize Turborepo
npx create-turbo@latest . --package-manager pnpm
```

---

## 📦 Phase 1: Migrate Existing Code (1-2 hours)

### Option A: Use Migration Script

```bash
# Make script executable
chmod +x scripts/migrate.sh

# Run migration script
./scripts/migrate.sh

# Or on Windows (Git Bash):
bash scripts/migrate.sh
```

### Option B: Manual Copy

```bash
# Set your current code path
CURRENT_CODE="C:/Users/Hp/Downloads/Thoughtweaver (Master) 1/src"

# Copy components
cp -r "$CURRENT_CODE/components/home" apps/web/components/
cp -r "$CURRENT_CODE/components/conversation" apps/web/components/
# ... (see COMPLETE_SETUP_GUIDE.md for full list)

# Copy UI components
cp -r "$CURRENT_CODE/components/ui"/* packages/ui/src/components/ui/

# Copy hooks, contexts, styles, etc.
cp -r "$CURRENT_CODE/hooks" apps/web/lib/
cp -r "$CURRENT_CODE/contexts" apps/web/lib/
cp -r "$CURRENT_CODE/styles" apps/web/
```

---

## ⚙️ Phase 2: Monorepo Configuration (30 minutes)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Package.json Files

See `COMPLETE_SETUP_GUIDE.md` Phase 2 for all package.json configurations.

### 3. Setup Next.js

```bash
cd apps/web
npx create-next-app@latest . --typescript --app --tailwind --skip-install
pnpm install
```

### 4. Fix Import Paths

```bash
# Create and run import fix script
npx ts-node scripts/migrate-components.ts
```

---

## 🗄️ Phase 3: Backend Setup (1-2 hours)

```bash
cd apps/api

# Initialize NestJS
nest new . --skip-git --package-manager pnpm

# Install dependencies
pnpm add @supabase/supabase-js @nestjs/config @nestjs/websockets
pnpm add openai @anthropic-ai/sdk @google/generative-ai stripe

# Create core services
# (See COMPLETE_SETUP_GUIDE.md Phase 3 for details)
```

---

## 🎨 Phase 4: Frontend Restructure (1-2 hours)

### Convert App.tsx to Next.js App Router

```bash
# Create app directory structure
mkdir -p apps/web/app/\(auth\)/{login,signup}
mkdir -p apps/web/app/\(dashboard\)/{conversations,workflows,assistants}

# Create layout files
# (See COMPLETE_SETUP_GUIDE.md Phase 4 for details)
```

### Setup Supabase Client

```bash
# Create lib/supabase/client.ts
# Create lib/supabase/server.ts
# (See COMPLETE_SETUP_GUIDE.md Phase 4 for code)
```

---

## 📚 Phase 5: Shared Packages (30 minutes)

```bash
# Setup types package
cd packages/types
# Export all types in src/index.ts

# Setup SDK package
cd packages/sdk
# Create client.ts with API client

# Setup UI package
cd packages/ui
# Export all components in src/index.ts
```

---

## 🗃️ Phase 6: Database Setup (1 hour)

```bash
# 1. Create Supabase project at supabase.com
# 2. Create migration files in infra/supabase/migrations/
# 3. Run migrations:
supabase db push

# 4. Setup RLS policies
# (See COMPLETE_SETUP_GUIDE.md Phase 6 for details)
```

---

## 🔐 Phase 7: Authentication (1-2 hours)

### Backend

```bash
cd apps/api
nest g module auth
nest g controller auth
nest g service auth

# Implement auth guard and controller
# (See COMPLETE_SETUP_GUIDE.md Phase 7)
```

### Frontend

```bash
cd apps/web

# Create useAuth hook
# Create login page
# Setup OAuth flow
# (See COMPLETE_SETUP_GUIDE.md Phase 7)
```

---

## 🚀 Quick Commands Reference

```bash
# Development
pnpm dev                    # Run all apps in dev mode
pnpm build                  # Build all packages
pnpm test                   # Run all tests
pnpm lint                   # Lint all packages
pnpm type-check            # Type check all packages

# Individual apps
cd apps/web && pnpm dev     # Run frontend only
cd apps/api && pnpm start:dev  # Run backend only

# Fix imports
npx ts-node scripts/migrate-components.ts

# Migration
bash scripts/migrate.sh     # Interactive migration helper
```

---

## 📁 Final Structure

```
thoughtweaver/
├── apps/
│   ├── web/              # Next.js frontend (migrated from Figma)
│   └── api/              # NestJS backend (new)
├── packages/
│   ├── ui/               # Shared UI components (from Figma)
│   ├── types/            # Shared types (from Figma)
│   ├── sdk/              # API client (new)
│   └── config/           # Shared config (from Figma)
├── infra/
│   └── supabase/         # Database migrations
└── scripts/
    └── migrate.sh         # Migration helper
```

---

## ✅ Checklist

### Phase 0: Setup
- [ ] Created GitHub repos (Figma + Monorepo)
- [ ] Pushed current code to Figma repo
- [ ] Initialized monorepo with Turborepo

### Phase 1: Migration
- [ ] Copied all components
- [ ] Copied UI components to shared package
- [ ] Copied hooks, contexts, styles
- [ ] Copied types and constants

### Phase 2: Configuration
- [ ] Created all package.json files
- [ ] Installed dependencies
- [ ] Configured TypeScript
- [ ] Setup Next.js structure

### Phase 3: Backend
- [ ] Initialized NestJS
- [ ] Created Supabase service
- [ ] Created Auth guard
- [ ] Created Users module

### Phase 4: Frontend
- [ ] Converted App.tsx to App Router
- [ ] Created route pages
- [ ] Setup Supabase clients
- [ ] Fixed all imports

### Phase 5: Packages
- [ ] Setup types package
- [ ] Setup SDK package
- [ ] Setup UI package exports

### Phase 6: Database
- [ ] Created Supabase project
- [ ] Created migrations
- [ ] Setup RLS policies

### Phase 7: Auth
- [ ] Backend auth implemented
- [ ] Frontend auth hooks created
- [ ] Login page created

### Remaining Phases
- [ ] Phase 8: Core Features (from IMPLEMENTATION_CHECKLIST.md)
- [ ] Phase 9: AI Integration
- [ ] Phase 10: Billing
- [ ] Phase 11: Testing
- [ ] Phase 12: Deployment

---

## 🔗 Documentation Links

- **Complete Setup Guide:** `COMPLETE_SETUP_GUIDE.md` (detailed step-by-step)
- **Implementation Checklist:** `IMPLEMENTATION_CHECKLIST.md` (all phases)
- **Technical Architecture:** `TECHNICAL_ARCHITECTURE.md` (architecture details)
- **Migration Guide:** `MIGRATION_GUIDE.md` (migration strategy)
- **Manual Decomposition:** `MANUAL_DECOMPOSITION_GUIDE.md` (Figma sync)

---

## 🆘 Troubleshooting

### "Module not found" errors
```bash
pnpm install
pnpm build
```

### TypeScript errors
```bash
pnpm type-check
# Fix paths in tsconfig.json if needed
```

### Import errors
```bash
# Run import fix script
npx ts-node scripts/migrate-components.ts
```

### Next.js build errors
```bash
cd apps/web
rm -rf .next
pnpm build
```

---

## 📞 Next Steps

1. **Follow Phase 0-7** from this guide
2. **Continue with Phase 8-12** from `IMPLEMENTATION_CHECKLIST.md`
3. **Test everything** thoroughly
4. **Deploy** when ready
5. **Transfer ownership** using `OWNERSHIP_TRANSFER.md` (in COMPLETE_SETUP_GUIDE.md)

---

**Estimated Total Time:** 8-12 hours for initial setup (Phases 0-7)

**Need Help?** Check the detailed guides:
- `COMPLETE_SETUP_GUIDE.md` for step-by-step instructions
- `IMPLEMENTATION_CHECKLIST.md` for all phases
