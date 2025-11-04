# Complete Setup & Migration Guide: From Figma Code to Production Monorepo

**Version:** 2.0  
**Last Updated:** November 3, 2025  
**Status:** Production-Ready Migration Guide

This guide provides **complete step-by-step instructions** for:
1. Setting up two GitHub repositories (Figma repo + Monorepo)
2. Migrating your existing Figma-generated code
3. Building the complete monorepo structure
4. All implementation phases

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 0: Repository Setup](#phase-0-repository-setup)
3. [Phase 1: Migrate Existing Code](#phase-1-migrate-existing-code)
4. [Phase 2: Monorepo Initialization](#phase-2-monorepo-initialization)
5. [Phase 3: Backend Setup](#phase-3-backend-setup)
6. [Phase 4: Frontend Restructure](#phase-4-frontend-restructure)
7. [Phase 5: Shared Packages](#phase-5-shared-packages)
8. [Phase 6: Database Setup](#phase-6-database-setup)
9. [Phase 7: Authentication](#phase-7-authentication)
10. [Phase 8: Core Features](#phase-8-core-features)
11. [Phase 9: AI Integration](#phase-9-ai-integration)
12. [Phase 10: Billing](#phase-10-billing)
13. [Phase 11: Testing](#phase-11-testing)
14. [Phase 12: Deployment](#phase-12-deployment)
15. [Ownership Transfer](#ownership-transfer)

---

## Prerequisites

Before starting, ensure you have:

- [ ] **Node.js 18+** installed (`node --version`)
- [ ] **pnpm** installed (`npm install -g pnpm`)
- [ ] **Git** installed (`git --version`)
- [ ] **GitHub account** created
- [ ] **Supabase account** (can create later)
- [ ] **Stripe account** (can create later)
- [ ] **Access to your current codebase** (the Figma-generated code)

---

## Phase 0: Repository Setup

### Step 0.1: Create GitHub Repositories

**We'll create TWO repositories:**

1. **`thoughtweaver-figma`** - For Figma design updates (current code)
2. **`thoughtweaver`** - For production monorepo

#### Create Repository 1: Figma Repo

```bash
# On GitHub.com:
# 1. Click "New repository"
# 2. Repository name: thoughtweaver-figma
# 3. Description: "Figma-generated UI code - Design sync repository"
# 4. Visibility: Private (or Public if preferred)
# 5. Do NOT initialize with README
# 6. Click "Create repository"

# Copy the repository URL
# Example: https://github.com/YOUR_USERNAME/thoughtweaver-figma.git
```

#### Create Repository 2: Monorepo

```bash
# On GitHub.com:
# 1. Click "New repository"
# 2. Repository name: thoughtweaver
# 3. Description: "Thoughtweaver - AI-Powered Ideation Platform (Monorepo)"
# 4. Visibility: Private (or Public if preferred)
# 5. Do NOT initialize with README
# 6. Click "Create repository"

# Copy the repository URL
# Example: https://github.com/YOUR_USERNAME/thoughtweaver.git
```

### Step 0.2: Setup Figma Repository

```bash
# Navigate to your current codebase location
cd "C:\Users\Hp\Downloads\Thoughtweaver (Master) 1\src"

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Figma-generated code"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/thoughtweaver-figma.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

# Verify
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/thoughtweaver-figma.git (fetch)
# origin  https://github.com/YOUR_USERNAME/thoughtweaver-figma.git (push)
```

### Step 0.3: Verify Current Code Structure

```bash
# Check your current structure
ls -la

# Expected structure (approximately):
# App.tsx
# components/
#   ├── account/
#   ├── assistant/
#   ├── auth/
#   ├── billing/
#   ├── conversation/
#   ├── home/
#   ├── layout/
#   ├── llms/
#   ├── preferences/
#   ├── projects/
#   ├── team/
#   ├── ui/          ← shadcn/ui components
#   └── workflow/
# contexts/
# hooks/
# styles/
# types/
# constants/
# etc.
```

**Note this structure** - we'll migrate it systematically.

---

## Phase 1: Migrate Existing Code

### Step 1.1: Create Migration Directory Structure

```bash
# Create a new directory for the monorepo
cd ~  # or wherever you want the monorepo
mkdir thoughtweaver
cd thoughtweaver

# Initialize git
git init
git branch -M main

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/thoughtweaver.git

# Create initial README
cat > README.md << 'EOF'
# Thoughtweaver - AI-Powered Ideation Platform

Monorepo structure for Thoughtweaver production application.

## Repository Structure

- `apps/web/` - Next.js frontend
- `apps/api/` - NestJS backend
- `packages/ui/` - Shared UI components
- `packages/types/` - Shared TypeScript types
- `packages/sdk/` - API client SDK
- `infra/` - Infrastructure configurations

## Setup

See MIGRATION_GUIDE.md for detailed setup instructions.
EOF

git add README.md
git commit -m "Initial commit: Monorepo structure"
```

### Step 1.2: Initialize Turborepo

```bash
# Install Turborepo CLI globally
npm install -g turbo

# Initialize Turborepo
npx create-turbo@latest . --package-manager pnpm

# This will ask some questions:
# - Would you like to use pnpm? Yes
# - Which packages would you like to include? Select all or custom
#   (We'll customize this, so you can select anything for now)

# Create basic directory structure
mkdir -p apps/{web,api}
mkdir -p packages/{ui,sdk,types,ai,config,utils}
mkdir -p infra/{supabase/{migrations,seeds,policies},docker,stripe,scripts}
```

### Step 1.3: Analyze Current Code Structure

**Create a mapping document:**

```bash
# Create analysis file
cat > CODE_MIGRATION_MAP.md << 'EOF'
# Code Migration Mapping

## Current Structure → Monorepo Structure

### Components Mapping

#### Shared UI Components (→ packages/ui/)
- components/ui/* → packages/ui/src/components/ui/
  - All shadcn/ui components stay in UI package

#### Feature Components (→ apps/web/components/)
- components/home/ → apps/web/components/home/
- components/conversation/ → apps/web/components/conversation/
- components/assistant/ → apps/web/components/assistant/
- components/workflow/ → apps/web/components/workflow/
- components/projects/ → apps/web/components/projects/
- components/preferences/ → apps/web/components/preferences/
- components/account/ → apps/web/components/account/
- components/billing/ → apps/web/components/billing/
- components/team/ → apps/web/components/team/
- components/llms/ → apps/web/components/llms/
- components/auth/ → apps/web/components/auth/
- components/layout/ → apps/web/components/layout/
- components/context/ → apps/web/components/context/
- components/figma/ → apps/web/components/figma/

### Types (→ packages/types/)
- types/* → packages/types/src/

### Hooks (→ apps/web/lib/hooks/)
- hooks/* → apps/web/lib/hooks/

### Contexts (→ apps/web/lib/contexts/)
- contexts/* → apps/web/lib/contexts/

### Constants (→ packages/config/)
- constants/* → packages/config/src/constants.ts

### Styles (→ apps/web/styles/)
- styles/* → apps/web/styles/

### Root Files
- App.tsx → apps/web/app/layout.tsx (will be converted)
- main.tsx → apps/web/app/page.tsx (home page)
EOF

git add CODE_MIGRATION_MAP.md
git commit -m "docs: Add code migration mapping"
```

### Step 1.4: Copy Existing Code (Initial Migration)

```bash
# Set paths
CURRENT_CODE="C:/Users/Hp/Downloads/Thoughtweaver (Master) 1/src"
MONOREPO_ROOT="$(pwd)"

# Navigate to monorepo root
cd "$MONOREPO_ROOT"

# Create apps/web directory structure
mkdir -p apps/web/{components,lib,styles,app,public}

# Copy components (feature-specific)
echo "Copying feature components..."
cp -r "$CURRENT_CODE/components/home" apps/web/components/
cp -r "$CURRENT_CODE/components/conversation" apps/web/components/
cp -r "$CURRENT_CODE/components/assistant" apps/web/components/
cp -r "$CURRENT_CODE/components/workflow" apps/web/components/
cp -r "$CURRENT_CODE/components/projects" apps/web/components/
cp -r "$CURRENT_CODE/components/preferences" apps/web/components/
cp -r "$CURRENT_CODE/components/account" apps/web/components/
cp -r "$CURRENT_CODE/components/billing" apps/web/components/
cp -r "$CURRENT_CODE/components/team" apps/web/components/
cp -r "$CURRENT_CODE/components/llms" apps/web/components/
cp -r "$CURRENT_CODE/components/auth" apps/web/components/
cp -r "$CURRENT_CODE/components/layout" apps/web/components/
cp -r "$CURRENT_CODE/components/context" apps/web/components/
cp -r "$CURRENT_CODE/components/figma" apps/web/components/

# Copy hooks
echo "Copying hooks..."
cp -r "$CURRENT_CODE/hooks" apps/web/lib/

# Copy contexts
echo "Copying contexts..."
cp -r "$CURRENT_CODE/contexts" apps/web/lib/

# Copy styles
echo "Copying styles..."
cp -r "$CURRENT_CODE/styles" apps/web/

# Copy types (will be moved to packages/types later)
echo "Copying types..."
mkdir -p packages/types/src
cp -r "$CURRENT_CODE/types"/* packages/types/src/ 2>/dev/null || true

# Copy constants (will be moved to packages/config later)
echo "Copying constants..."
mkdir -p packages/config/src
cp "$CURRENT_CODE/constants"/* packages/config/src/ 2>/dev/null || true

# Copy UI components to shared package
echo "Copying UI components..."
mkdir -p packages/ui/src/components/ui
cp -r "$CURRENT_CODE/components/ui"/* packages/ui/src/components/ui/

# Copy assets if any
echo "Copying assets..."
if [ -d "$CURRENT_CODE/assets" ]; then
  cp -r "$CURRENT_CODE/assets" apps/web/public/
fi

echo "✅ Initial code copy complete!"
```

**Note:** If you're on Windows, use PowerShell or Git Bash for these commands.

### Step 1.5: Create Package.json Files

#### Root Package.json

```bash
cat > package.json << 'EOF'
{
  "name": "thoughtweaver",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^1.10.16",
    "typescript": "^5.2.2"
  },
  "packageManager": "pnpm@8.10.0",
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF
```

#### Apps/Web Package.json

```bash
cat > apps/web/package.json << 'EOF'
{
  "name": "@thoughtweaver/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "@thoughtweaver/ui": "workspace:*",
    "@thoughtweaver/types": "workspace:*",
    "@thoughtweaver/sdk": "workspace:*",
    "@thoughtweaver/config": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.2",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
EOF
```

#### Packages/UI Package.json

```bash
cat > packages/ui/package.json << 'EOF'
{
  "name": "@thoughtweaver/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@thoughtweaver/types": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.2"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF
```

#### Packages/Types Package.json

```bash
cat > packages/types/package.json << 'EOF'
{
  "name": "@thoughtweaver/types",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.2.2"
  }
}
EOF
```

#### Packages/SDK Package.json

```bash
cat > packages/sdk/package.json << 'EOF'
{
  "name": "@thoughtweaver/sdk",
  "version": "1.0.0",
  "main": "./src/client.ts",
  "types": "./src/client.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@thoughtweaver/types": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.2.2"
  }
}
EOF
```

#### Packages/Config Package.json

```bash
cat > packages/config/package.json << 'EOF'
{
  "name": "@thoughtweaver/config",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.2.2"
  }
}
EOF
```

### Step 1.6: Install Dependencies

```bash
# Install all dependencies
pnpm install

# This will:
# - Install all packages
# - Link workspace packages
# - Create node_modules structure
```

### Step 1.7: Commit Initial Migration

```bash
git add .
git commit -m "feat: Initial code migration from Figma repo

- Migrated all components from Figma codebase
- Setup monorepo structure
- Created package.json files
- Configured workspace dependencies"

# Push to GitHub
git push -u origin main
```

---

## Phase 2: Monorepo Initialization

### Step 2.1: Configure Turborepo

```bash
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
EOF
```

### Step 2.2: Configure TypeScript

#### Root tsconfig.json

```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@thoughtweaver/ui": ["./packages/ui/src"],
      "@thoughtweaver/types": ["./packages/types/src"],
      "@thoughtweaver/sdk": ["./packages/sdk/src"],
      "@thoughtweaver/config": ["./packages/config/src"],
      "@thoughtweaver/utils": ["./packages/utils/src"]
    }
  },
  "include": [],
  "exclude": ["node_modules"]
}
EOF
```

### Step 2.3: Setup Next.js App Structure

```bash
cd apps/web

# Initialize Next.js (if not already done)
npx create-next-app@latest . --typescript --app --tailwind --src-dir=false --import-alias "@/*" --skip-install

# This will create:
# - app/ directory
# - next.config.js
# - tailwind.config.js
# - etc.
```

**Configure Next.js:**

```bash
cat > apps/web/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@thoughtweaver/ui',
    '@thoughtweaver/types',
    '@thoughtweaver/sdk',
    '@thoughtweaver/config',
  ],
}

module.exports = nextConfig
EOF
```

**Configure Tailwind:**

```bash
cat > apps/web/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF
```

### Step 2.4: Create App Router Structure

```bash
cd apps/web

# Create app directory structure
mkdir -p app/\(auth\)/{login,signup}
mkdir -p app/\(dashboard\)/{conversations,workflows,assistants,settings,projects}
mkdir -p app/api

# Create root layout
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Thoughtweaver',
  description: 'AI-Powered Ideation Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOF

# Create home page (will be migrated from App.tsx)
cat > app/\(dashboard\)/page.tsx << 'EOF'
'use client'

import { HomePage } from '@/components/home/HomePage'

export default function Page() {
  return <HomePage />
}
EOF
```

### Step 2.5: Fix Import Paths

**Create a script to fix imports:**

```bash
cat > scripts/fix-imports.sh << 'EOF'
#!/bin/bash

# Fix imports in web app
find apps/web/components -name "*.tsx" -o -name "*.ts" | while read file; do
  # Fix UI component imports
  sed -i 's|from.*components/ui|from @thoughtweaver/ui|g' "$file"
  
  # Fix type imports
  sed -i 's|from.*types/|from @thoughtweaver/types|g' "$file"
done

echo "✅ Import paths fixed"
EOF

chmod +x scripts/fix-imports.sh
```

### Step 2.6: Create Shared Package Exports

**Packages/UI Index:**

```bash
cat > packages/ui/src/index.ts << 'EOF'
// Export all UI components
export * from './components/ui/button'
export * from './components/ui/card'
export * from './components/ui/input'
// ... add all component exports
EOF
```

**Packages/Types Index:**

```bash
cat > packages/types/src/index.ts << 'EOF'
// Export all types
export * from './user'
export * from './conversation'
export * from './assistant'
export * from './workflow'
export * from './message'
// ... add all type exports
EOF
```

### Step 2.7: Commit Monorepo Setup

```bash
git add .
git commit -m "feat: Complete monorepo initialization

- Configured Turborepo
- Setup Next.js app structure
- Created package exports
- Configured TypeScript paths
- Setup Tailwind CSS"

git push origin main
```

---

## Phase 3: Backend Setup

### Step 3.1: Initialize NestJS

```bash
cd apps/api

# Install NestJS CLI globally
npm install -g @nestjs/cli

# Initialize NestJS
nest new . --skip-git --package-manager pnpm

# This will create:
# - src/ directory
# - nest-cli.json
# - tsconfig.json
# - etc.
```

### Step 3.2: Install Backend Dependencies

```bash
cd apps/api

pnpm add @supabase/supabase-js @nestjs/config @nestjs/websockets @nestjs/platform-socket.io
pnpm add openai @anthropic-ai/sdk @google/generative-ai
pnpm add stripe
pnpm add class-validator class-transformer
pnpm add zod
pnpm add @nestjs/swagger
pnpm add -D @types/node
```

### Step 3.3: Create Core Backend Structure

```bash
cd apps/api/src

# Create directory structure
mkdir -p config
mkdir -p common/{guards,interceptors,decorators,filters}
mkdir -p database
mkdir -p modules/{auth,users,conversations,assistants,workflows,context,files,billing,ai,realtime,integrations}

# Create Supabase service
cat > database/supabase.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    this.client = createClient(supabaseUrl!, supabaseKey!);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
EOF

# Create Auth Guard
cat > common/guards/auth.guard.ts << 'EOF'
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const { data: { user }, error } = await this.supabase
      .getClient()
      .auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = user;
    return true;
  }
}
EOF

# Create User Decorator
cat > common/decorators/user.decorator.ts << 'EOF'
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
EOF
```

### Step 3.4: Configure Environment Variables

```bash
cd apps/api

cat > .env.example << 'EOF'
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
GOOGLE_API_KEY=...
GROK_API_KEY=...

# App
PORT=3001
FRONTEND_URL=http://localhost:3000
EOF

# Create .env file (copy from example)
cp .env.example .env

# Add .env to .gitignore
echo ".env" >> .gitignore
```

### Step 3.5: Create First Module (Users)

```bash
cd apps/api

nest g module users
nest g controller users
nest g service users
```

**Implement Users Service:**

```bash
cat > src/modules/users/users.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class UsersService {
  constructor(private supabase: SupabaseService) {}

  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
EOF
```

### Step 3.6: Commit Backend Setup

```bash
git add .
git commit -m "feat: Initialize NestJS backend

- Setup NestJS structure
- Create Supabase service
- Implement Auth guard
- Create Users module
- Configure environment variables"

git push origin main
```

---

## Phase 4: Frontend Restructure

### Step 4.1: Convert App.tsx to Next.js App Router

**Analyze your current App.tsx:**

```bash
# Read your current App.tsx to understand the structure
cat "C:/Users/Hp/Downloads/Thoughtweaver (Master) 1/src/App.tsx" | head -100
```

**Create equivalent Next.js structure:**

```bash
cd apps/web

# Create dashboard layout
cat > app/\(dashboard\)/layout.tsx << 'EOF'
'use client'

import { AppLayout } from '@/components/layout/AppLayout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
EOF
```

### Step 4.2: Migrate Page Components

**Create route pages:**

```bash
cd apps/web/app/\(dashboard\)

# Conversations
cat > conversations/page.tsx << 'EOF'
'use client'

// This will be implemented later
export default function ConversationsPage() {
  return <div>Conversations</div>
}
EOF

# Individual conversation
mkdir -p conversations/\[id\]
cat > conversations/\[id\]/page.tsx << 'EOF'
'use client'

import { ConversationView } from '@/components/conversation/ConversationView'

export default function ConversationPage({ params }: { params: { id: string } }) {
  return <ConversationView conversationId={params.id} />
}
EOF

# Similar structure for other pages...
```

### Step 4.3: Setup Supabase Client

```bash
cd apps/web

mkdir -p lib/supabase

cat > lib/supabase/client.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
EOF

cat > lib/supabase/server.ts << 'EOF'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
EOF
```

### Step 4.4: Create Environment Variables

```bash
cd apps/web

cat > .env.local.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

cp .env.local.example .env.local
```

### Step 4.5: Fix Component Imports

**Create a migration script:**

```bash
cat > scripts/migrate-components.ts << 'EOF'
#!/usr/bin/env ts-node

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Fix imports in all component files
const files = glob.sync('apps/web/components/**/*.{ts,tsx}');

files.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  
  // Replace relative imports with workspace imports
  content = content.replace(
    /from ['"]\.\.\/ui\//g,
    "from '@thoughtweaver/ui'"
  );
  
  content = content.replace(
    /from ['"]\.\.\/\.\.\/ui\//g,
    "from '@thoughtweaver/ui'"
  );
  
  content = content.replace(
    /from ['"]\.\.\/types\//g,
    "from '@thoughtweaver/types'"
  );
  
  writeFileSync(file, content);
  console.log(`Fixed imports in ${file}`);
});

console.log('✅ All imports fixed');
EOF

# Run the script
npx ts-node scripts/migrate-components.ts
```

### Step 4.6: Commit Frontend Restructure

```bash
git add .
git commit -m "feat: Restructure frontend for Next.js App Router

- Convert App.tsx to App Router structure
- Create route pages
- Setup Supabase clients
- Fix component imports
- Configure environment variables"

git push origin main
```

---

## Phase 5: Shared Packages

### Step 5.1: Setup Types Package

```bash
cd packages/types

# Ensure all types are exported
cat > src/index.ts << 'EOF'
// Export all type definitions
export * from './user'
export * from './conversation'
export * from './assistant'
export * from './workflow'
export * from './message'
// Add other type exports as needed
EOF

# Create TypeScript config
cat > tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

### Step 5.2: Setup SDK Package

```bash
cd packages/sdk

cat > src/client.ts << 'EOF'
import { Conversation, Message, CreateConversationDto } from '@thoughtweaver/types'

export class ThoughtweaverClient {
  constructor(
    private baseUrl: string,
    private getToken: () => Promise<string>
  ) {}

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken()
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }

  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.request<Conversation>(`/conversations/${id}`)
  }

  async sendMessage(
    conversationId: string,
    content: string
  ): Promise<Message[]> {
    return this.request<Message[]>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  }
}
EOF

cat > src/index.ts << 'EOF'
export * from './client'
EOF
```

### Step 5.3: Setup UI Package

```bash
cd packages/ui

# Create component exports
cat > src/index.ts << 'EOF'
// Export all UI components
export * from './components/ui/button'
export * from './components/ui/card'
export * from './components/ui/input'
// Add all component exports
EOF
```

### Step 5.4: Commit Shared Packages

```bash
git add .
git commit -m "feat: Setup shared packages

- Configure types package
- Create SDK client
- Setup UI package exports
- Add TypeScript configs"

git push origin main
```

---

## Phase 6: Database Setup

### Step 6.1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down:
   - Project URL
   - Anon key
   - Service role key

### Step 6.2: Create Migrations

```bash
cd infra/supabase/migrations

# Create profiles table
cat > 001_create_profiles.sql << 'EOF'
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
EOF

# Create conversations table
cat > 002_create_conversations.sql << 'EOF'
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  workflow_id UUID REFERENCES workflows(id),
  context_id UUID REFERENCES contexts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
EOF

# Add more migrations as needed...
```

### Step 6.3: Run Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 6.4: Setup RLS Policies

```bash
cd infra/supabase/policies

cat > conversations_policies.sql << 'EOF'
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);
EOF
```

### Step 6.5: Commit Database Setup

```bash
git add .
git commit -m "feat: Setup database schema

- Create migration files
- Setup RLS policies
- Configure Supabase project"

git push origin main
```

---

## Phase 7: Authentication

### Step 7.1: Backend Auth Implementation

```bash
cd apps/api

nest g module auth
nest g controller auth
nest g service auth
```

**Implement auth controller:**

```bash
cat > src/modules/auth/auth.controller.ts << 'EOF'
import { Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sync')
  @UseGuards(AuthGuard)
  async syncProfile(@CurrentUser() user: any) {
    return this.authService.syncProfile(user);
  }
}
EOF
```

### Step 7.2: Frontend Auth Implementation

```bash
cd apps/web

cat > lib/hooks/useAuth.ts << 'EOF'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (event === 'SIGNED_IN' && session) {
          // Sync profile with backend
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signInWithGoogle, signOut }
}
EOF
```

### Step 7.3: Create Auth Pages

```bash
cd apps/web/app/\(auth\)

cat > login/page.tsx << 'EOF'
'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    await signInWithGoogle()
    // Redirect will be handled by callback
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  )
}
EOF
```

### Step 7.4: Commit Authentication

```bash
git add .
git commit -m "feat: Implement authentication

- Backend auth guard and sync
- Frontend auth hooks
- Login page
- OAuth integration"

git push origin main
```

---

## Phase 8-12: Continue with Implementation Checklist

Continue following the `IMPLEMENTATION_CHECKLIST.md` for:
- Phase 8: Core Features
- Phase 9: AI Integration
- Phase 10: Billing
- Phase 11: Testing
- Phase 12: Deployment

---

## Ownership Transfer

### When Ready to Transfer to Client

```bash
# 1. Create a comprehensive README
cat > README.md << 'EOF'
# Thoughtweaver - Production Monorepo

Complete setup instructions and architecture documentation.

## Quick Start

See IMPLEMENTATION_CHECKLIST.md for detailed setup.

## Repository Structure

- `apps/web/` - Next.js frontend
- `apps/api/` - NestJS backend
- `packages/` - Shared packages
- `infra/` - Infrastructure configs

## Environment Setup

1. Copy `.env.example` files
2. Fill in all required environment variables
3. Run `pnpm install`
4. Run `pnpm dev`

## Documentation

- `TECHNICAL_ARCHITECTURE.md` - Complete architecture guide
- `IMPLEMENTATION_CHECKLIST.md` - Step-by-step implementation
- `MIGRATION_GUIDE.md` - Migration from Figma code
- `MANUAL_DECOMPOSITION_GUIDE.md` - Figma sync process
EOF

# 2. Clean up sensitive files
git rm -r --cached apps/api/.env apps/web/.env.local
git commit -m "chore: Remove sensitive files from git"

# 3. Create transfer checklist
cat > OWNERSHIP_TRANSFER.md << 'EOF'
# Ownership Transfer Checklist

## Pre-Transfer

- [ ] All code is pushed to GitHub
- [ ] All documentation is complete
- [ ] Environment variables are documented
- [ ] Access credentials are provided securely
- [ ] Deployment instructions are clear

## Transfer Steps

1. Add client as collaborator to repositories
2. Transfer repository ownership (if needed)
3. Share all credentials securely
4. Provide access to:
   - GitHub repositories
   - Supabase project
   - Stripe account
   - Deployment platforms
   - Domain/DNS settings

## Post-Transfer

- [ ] Client has access to all repositories
- [ ] Client can deploy independently
- [ ] Client has documentation access
- [ ] Support handover completed
EOF

git add .
git commit -m "docs: Add ownership transfer documentation"
```

---

## Quick Reference Commands

```bash
# Install dependencies
pnpm install

# Run development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm type-check

# Lint
pnpm lint

# Fix imports (after migration)
npx ts-node scripts/migrate-components.ts
```

---

## Troubleshooting

### Import Errors

```bash
# If you see module not found errors:
pnpm install
# Then rebuild:
pnpm build
```

### TypeScript Errors

```bash
# Run type check:
pnpm type-check

# Fix path mappings in tsconfig.json if needed
```

### Next.js Build Errors

```bash
# Clear Next.js cache:
rm -rf apps/web/.next
pnpm build
```

---

## Next Steps

1. ✅ Complete Phase 0-7 (Setup & Migration)
2. Continue with Phase 8-12 from IMPLEMENTATION_CHECKLIST.md
3. Test all features
4. Deploy to production
5. Transfer ownership when ready

---

**Document Maintained By**: Engineering Team  
**Update Frequency**: As setup process evolves
