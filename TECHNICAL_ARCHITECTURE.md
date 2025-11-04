# Thoughtweaver - Complete Technical Architecture Guide

**Version:** 2.0  
**Last Updated:** November 3, 2025  
**Status:** Production-Ready Architecture Specification

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Monorepo Structure](#monorepo-structure)
3. [Technology Stack & Responsibilities](#technology-stack--responsibilities)
4. [Supabase Integration Strategy](#supabase-integration-strategy)
5. [Database Architecture](#database-architecture)
6. [Backend Architecture (NestJS)](#backend-architecture-nestjs)
7. [Frontend Architecture (Next.js)](#frontend-architecture-nextjs)
8. [Shared Packages](#shared-packages)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Authentication Flow](#authentication-flow)
11. [AI Integration Flow](#ai-integration-flow)
12. [Billing Integration Flow](#billing-integration-flow)
13. [Third-Party Integrations](#third-party-integrations)
14. [Multi-Platform Strategy](#multi-platform-strategy)
15. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
16. [Code Structure Examples](#code-structure-examples)
17. [Deployment Architecture](#deployment-architecture)
18. [Figma UI Management & Design Sync Workflow](#figma-ui-management--design-sync-workflow)
19. [Testing Strategy & Quality Gates](#testing-strategy--quality-gates)
20. [Security Architecture](#security-architecture)

---

## Executive Summary

### Architecture Decision: **Monorepo + Modular API Design**

**Core Principle:** Single backend API (NestJS) serves all platforms (web, desktop, mobile) through a unified SDK. This ensures:
- ✅ Consistent business logic across platforms
- ✅ Single source of truth for data
- ✅ Easier maintenance and updates
- ✅ Type-safe shared contracts

**Key Technologies:**
- **Monorepo:** Turborepo (recommended) or Nx
- **Frontend:** Next.js 14+ (App Router)
- **Backend:** NestJS (TypeScript)
- **Database:** Supabase PostgreSQL (via NestJS only)
- **Auth:** Supabase Auth (frontend initiates, backend verifies)
- **Storage:** Supabase Storage (frontend uploads, backend manages metadata)
- **Billing:** Stripe (backend only)
- **AI:** NestJS orchestrates all LLM APIs

---

## Monorepo Structure

```
thoughtweaver/
│
├── apps/
│   ├── web/                      # Next.js 14+ (App Router)
│   │   ├── app/                  # Next.js App Router pages
│   │   ├── components/           # Next.js-specific components
│   │   ├── lib/                  # Next.js utilities
│   │   ├── public/               # Static assets
│   │   └── package.json
│   │
│   ├── api/                      # NestJS Backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/          # Feature modules
│   │   │   ├── common/           # Guards, interceptors, decorators
│   │   │   └── config/           # Configuration
│   │   └── package.json
│   │
│   ├── desktop/                  # Electron App (Phase 2)
│   │   ├── src/
│   │   │   ├── main/             # Electron main process
│   │   │   ├── renderer/         # Reuses packages/ui
│   │   │   └── preload/
│   │   └── package.json
│   │
│   └── mobile/                   # React Native App (Phase 2)
│       ├── src/
│       │   ├── screens/
│       │   ├── components/       # Reuses packages/ui where possible
│       │   └── navigation/
│       └── package.json
│
├── packages/
│   ├── ui/                       # Shared React UI Components
│   │   ├── src/
│   │   │   ├── components/       # Reusable React components
│   │   │   ├── hooks/            # Shared React hooks
│   │   │   └── styles/           # Shared styles
│   │   └── package.json
│   │
│   ├── sdk/                      # Auto-generated NestJS API Client
│   │   ├── src/
│   │   │   ├── client.ts         # Type-safe API client
│   │   │   ├── types/            # API types (from backend)
│   │   │   └── hooks/            # React Query hooks (optional)
│   │   └── package.json
│   │
│   ├── types/                    # Shared TypeScript Types
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   ├── conversation.ts
│   │   │   ├── assistant.ts
│   │   │   ├── workflow.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ai/                       # AI Utilities & Adapters
│   │   ├── src/
│   │   │   ├── adapters/         # LLM adapter interfaces
│   │   │   ├── prompts/          # Prompt templates
│   │   │   ├── models/           # Model registry
│   │   │   └── utils/            # AI utilities
│   │   └── package.json
│   │
│   ├── config/                   # Shared Configuration
│   │   ├── src/
│   │   │   ├── env.ts            # Zod schema for env vars
│   │   │   └── constants.ts      # Shared constants
│   │   └── package.json
│   │
│   └── utils/                    # Shared Utilities
│       ├── src/
│       │   ├── logger.ts
│       │   ├── date.ts
│       │   ├── validation.ts
│       │   └── index.ts
│       └── package.json
│
├── infra/
│   ├── supabase/
│   │   ├── migrations/            # SQL migrations
│   │   ├── seeds/                # Seed data
│   │   └── policies/              # RLS policies
│   │
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.web
│   │   └── docker-compose.yml
│   │
│   ├── stripe/
│   │   └── webhooks/              # Webhook handlers
│   │
│   └── scripts/
│       ├── setup.sh
│       ├── migrate.sh
│       └── deploy.sh
│
├── turbo.json                    # Turborepo config
├── package.json                  # Root package.json
├── pnpm-workspace.yaml           # pnpm workspace config
└── .gitignore
```

---

## Technology Stack & Responsibilities

### Technology Responsibility Matrix

| Feature/Layer | Technology | Frontend (Next.js) | Backend (NestJS) | Why This Split |
|--------------|------------|-------------------|------------------|----------------|
| **UI/UX** | Next.js + Tailwind + Shadcn/UI | ✅ Renders UI | ❌ | UI belongs in frontend |
| **API Gateway** | NestJS | ❌ | ✅ All API endpoints | Single API for all platforms |
| **Authentication Initiation** | Supabase Auth (Client SDK) | ✅ Login UI, OAuth flow | ❌ | Better UX, direct OAuth redirect |
| **Auth Verification** | Supabase Auth (JWT) | ❌ | ✅ Verifies JWT on every request | Security: backend validates |
| **Database Reads/Writes** | Supabase PostgreSQL | ❌ | ✅ All DB operations via service key | Security: backend controls data |
| **Realtime Subscriptions** | Supabase Realtime | ✅ UI updates (optional) | ✅ AI streaming via NestJS | UI sync vs controlled streams |
| **File Storage Upload** | Supabase Storage | ✅ Direct uploads | ❌ | Performance: direct upload |
| **File Metadata/Processing** | Supabase Storage + NestJS | ❌ | ✅ Stores metadata, processes files | Backend manages business logic |
| **Billing** | Stripe | ❌ | ✅ All Stripe operations | Security: keys never exposed |
| **AI/LLM Calls** | OpenAI/Anthropic/Gemini SDKs | ❌ | ✅ Orchestrates all LLM calls | Cost control, rate limiting |
| **Third-Party Integrations** | Various APIs | ❌ | ✅ All integrations | Centralized, secure |
| **Type Safety** | TypeScript + Zod | ✅ Uses shared types | ✅ Uses shared types | Consistency across platforms |

### Key Architectural Decisions

#### 1. **Why Supabase DB Access Only in Backend?**

✅ **Security**: Service key never exposed to clients  
✅ **Consistency**: Single source of truth for business logic  
✅ **Control**: Backend enforces validation, rate limiting, business rules  
✅ **Multi-platform**: Same API works for web, desktop, mobile  

#### 2. **Why Supabase Auth in Frontend?**

✅ **Better UX**: Direct OAuth redirects, no backend roundtrip  
✅ **Session Management**: Supabase handles refresh tokens automatically  
✅ **Standard Pattern**: OAuth flow works best client-side  

#### 3. **Why Supabase Storage Direct Upload?**

✅ **Performance**: Bypasses backend for large files  
✅ **Cost**: Reduces backend load  
✅ **Scalability**: Supabase handles CDN distribution  

**Trade-off**: Backend still manages metadata and processing via webhooks/notifications.

---

## Supabase Integration Strategy

### Decision Matrix: Frontend vs Backend

| Supabase Feature | Used By | Purpose | Implementation |
|-----------------|---------|---------|----------------|
| **Auth (Login)** | Frontend | User authentication | `supabase.auth.signInWithOAuth()` |
| **Auth (Verify)** | Backend | JWT verification | `supabase.auth.verifyJWT()` |
| **Database** | Backend Only | All queries | `supabase.from('table').select()` via service key |
| **Realtime (UI)** | Frontend Optional | UI updates | `supabase.channel().subscribe()` |
| **Realtime (AI)** | Backend | AI streaming | NestJS WebSocket gateway |
| **Storage (Upload)** | Frontend | File uploads | `supabase.storage.from('bucket').upload()` |
| **Storage (Metadata)** | Backend | File processing | Webhooks → NestJS processes |

### Implementation Pattern

```typescript
// ❌ NEVER DO THIS IN FRONTEND
// This exposes service key to client
const supabase = createClient(url, SERVICE_KEY); // DON'T!

// ✅ DO THIS IN FRONTEND
// Only use anon key for auth
const supabase = createClient(url, ANON_KEY);

// ✅ DO THIS IN BACKEND
// Service key only in backend
const supabase = createClient(url, SERVICE_KEY);
```

---

## Database Architecture

### PostgreSQL Schema (Supabase)

**Why Supabase PostgreSQL instead of Neon?**
- ✅ Built-in RLS (Row Level Security)
- ✅ Real-time subscriptions
- ✅ Storage integration
- ✅ Auth integration
- ✅ Managed service (less ops)

### Core Tables

```sql
-- Users (managed by Supabase Auth)
-- Extended profile table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
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

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  assistant_id UUID REFERENCES assistants(id),
  model_used TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Assistants
CREATE TABLE assistants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  color TEXT,
  system_prompt TEXT NOT NULL,
  personality JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_custom BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (is_custom OR is_default) -- Must be one or the other
);

-- Workflows
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_custom BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contexts
CREATE TABLE contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  context_type TEXT NOT NULL CHECK (context_type IN ('user', 'project', 'team', 'conversation')),
  is_system_inferred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions (Stripe)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  conversations_count INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams (Phase 2)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members (Phase 2)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  status TEXT NOT NULL CHECK (status IN ('active', 'pending')),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  UNIQUE(team_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_assistants_user_id ON assistants(user_id);
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_contexts_user_id ON contexts(user_id);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Example: Users can only see their own conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

---

## Backend Architecture (NestJS)

### Directory Structure

```
apps/api/src/
├── main.ts                      # Bootstrap
├── app.module.ts                # Root module
│
├── config/                      # Configuration modules
│   ├── database.config.ts       # Supabase config
│   ├── auth.config.ts           # JWT config
│   ├── stripe.config.ts         # Stripe config
│   └── ai.config.ts             # LLM API keys
│
├── common/                      # Shared utilities
│   ├── guards/
│   │   └── auth.guard.ts        # JWT verification guard
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── decorators/
│   │   ├── user.decorator.ts    # @CurrentUser()
│   │   └── public.decorator.ts  # @Public() route
│   └── filters/
│       └── http-exception.filter.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── strategies/
│   │       └── supabase-jwt.strategy.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── conversations/
│   │   ├── conversations.module.ts
│   │   ├── conversations.controller.ts
│   │   ├── conversations.service.ts
│   │   ├── dto/
│   │   │   ├── create-conversation.dto.ts
│   │   │   ├── send-message.dto.ts
│   │   │   └── update-conversation.dto.ts
│   │   └── entities/
│   │       └── conversation.entity.ts
│   │
│   ├── assistants/
│   │   ├── assistants.module.ts
│   │   ├── assistants.controller.ts
│   │   ├── assistants.service.ts
│   │   └── dto/
│   │
│   ├── workflows/
│   │   ├── workflows.module.ts
│   │   ├── workflows.controller.ts
│   │   ├── workflows.service.ts
│   │   └── dto/
│   │
│   ├── context/
│   │   ├── context.module.ts
│   │   ├── context.controller.ts
│   │   ├── context.service.ts
│   │   └── dto/
│   │
│   ├── files/
│   │   ├── files.module.ts
│   │   ├── files.controller.ts
│   │   ├── files.service.ts
│   │   └── dto/
│   │
│   ├── billing/
│   │   ├── billing.module.ts
│   │   ├── billing.controller.ts
│   │   ├── billing.service.ts
│   │   ├── webhooks/
│   │   │   └── stripe.webhook.ts
│   │   └── dto/
│   │
│   ├── ai/
│   │   ├── ai.module.ts
│   │   ├── ai.service.ts
│   │   ├── adapters/
│   │   │   ├── openai.adapter.ts
│   │   │   ├── anthropic.adapter.ts
│   │   │   ├── google.adapter.ts
│   │   │   └── grok.adapter.ts
│   │   ├── orchestrator/
│   │   │   └── workflow-orchestrator.ts
│   │   └── types/
│   │       └── llm.types.ts
│   │
│   ├── realtime/
│   │   ├── realtime.module.ts
│   │   ├── realtime.gateway.ts  # WebSocket gateway
│   │   └── realtime.service.ts
│   │
│   └── integrations/
│       ├── integrations.module.ts
│       ├── google/
│       │   ├── google.service.ts
│       │   └── google.controller.ts
│       ├── notion/
│       ├── slack/
│       └── ...
│
└── database/
    ├── supabase.service.ts       # Supabase client wrapper
    └── migrations/
```

### Module Responsibilities

| Module | Responsibilities |
|--------|-----------------|
| `auth` | JWT verification, user profile sync on first login |
| `users` | User profile CRUD, preferences, settings |
| `conversations` | Conversation CRUD, message handling, history |
| `assistants` | Assistant CRUD, system prompt management |
| `workflows` | Workflow CRUD, execution orchestration |
| `context` | Context management, extraction, inference |
| `files` | File metadata, processing, analysis |
| `billing` | Stripe integration, subscription management, usage tracking |
| `ai` | LLM adapter pattern, multi-model gateway, prompt orchestration |
| `realtime` | WebSocket gateway for AI streaming |
| `integrations` | Third-party API integrations |

---

## Frontend Architecture (Next.js)

### Directory Structure

```
apps/web/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── page.tsx              # Home page
│   │   ├── conversations/
│   │   │   ├── page.tsx          # Conversations list
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Conversation detail
│   │   ├── workflows/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── assistants/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   ├── account/
│   │   │   ├── billing/
│   │   │   └── llms/
│   │   └── projects/
│   │
│   ├── api/                      # Next.js API routes (optional proxies)
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts      # Stripe webhook proxy (if needed)
│   │
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/                   # Next.js-specific components
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── conversations/
│   │   ├── ConversationList.tsx
│   │   ├── ConversationView.tsx
│   │   └── MessageBubble.tsx
│   ├── assistants/
│   │   ├── AssistantGrid.tsx
│   │   └── AssistantCard.tsx
│   └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase client (anon key)
│   │   └── server.ts             # Server-side Supabase (for SSR)
│   │
│   ├── api/
│   │   └── client.ts             # Wrapper for @thoughtweaver/sdk
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useConversations.ts
│   │   └── ...
│   │
│   └── state/
│       └── stores/               # Zustand stores (optional)
│           ├── auth.store.ts
│           └── conversation.store.ts
│
├── styles/
│   └── globals.css               # Global styles
│
└── public/
    └── assets/
```

---

## Shared Packages

### 1. `@thoughtweaver/types`

**Purpose:** Shared TypeScript interfaces, DTOs, enums

```typescript
// packages/types/src/conversation.ts
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  workflowId?: string;
  contextId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  assistantId?: string;
  modelUsed?: string;
  tokensUsed?: number;
  createdAt: Date;
}

// packages/types/src/assistant.ts
export interface Assistant {
  id: string;
  userId?: string;
  teamId?: string;
  name: string;
  description: string;
  avatarUrl?: string;
  color: string;
  systemPrompt: string;
  personality: Personality;
  isCustom: boolean;
  isDefault: boolean;
}

export interface Personality {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  emotionalStability: number;
}
```

### 2. `@thoughtweaver/sdk`

**Purpose:** Auto-generated or manually maintained API client

```typescript
// packages/sdk/src/client.ts
import { Conversation, Message, CreateConversationDto } from '@thoughtweaver/types';

export class ThoughtweaverClient {
  constructor(private baseUrl: string, private token: string) {}

  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    const response = await fetch(`${this.baseUrl}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(dto),
    });
    return response.json();
  }

  async sendMessage(
    conversationId: string,
    content: string,
    assistantIds: string[]
  ): Promise<Message[]> {
    // Implementation
  }
}
```

### 3. `@thoughtweaver/ui`

**Purpose:** Shared React components (used by Next.js and Electron)

```typescript
// packages/ui/src/components/AssistantCard.tsx
export function AssistantCard({ assistant }: { assistant: Assistant }) {
  // Reusable component
}

// packages/ui/src/components/MessageBubble.tsx
export function MessageBubble({ message }: { message: Message }) {
  // Reusable component
}
```

### 4. `@thoughtweaver/ai`

**Purpose:** AI utilities, prompt templates, model adapters (shared by backend)

```typescript
// packages/ai/src/prompts/workflow-prompts.ts
export const WORKFLOW_PROMPTS = {
  ideation: (context: string) => `
    You are an ideation assistant. Context: ${context}
    Generate creative ideas...
  `,
};

// packages/ai/src/models/registry.ts
export const MODEL_REGISTRY = {
  'gpt-5': { provider: 'openai', adapter: 'openai' },
  'claude-sonnet-4.5': { provider: 'anthropic', adapter: 'anthropic' },
};
```

---

## Data Flow Diagrams

### 1. User Authentication Flow

```
┌─────────┐                    ┌──────────┐                    ┌──────────┐
│  User   │                    │  Next.js │                    │ Supabase │
│         │                    │          │                    │   Auth   │
└────┬────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ 1. Click "Sign in with Google"│                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │ 2. Redirect to OAuth
     │                               │───────────────────────────────>│
     │                               │                               │
     │                               │ 3. OAuth callback with code
     │                               │<───────────────────────────────│
     │                               │                               │
     │                               │ 4. Exchange code for JWT
     │                               │───────────────────────────────>│
     │                               │                               │
     │                               │ 5. Return JWT + user
     │                               │<───────────────────────────────│
     │                               │                               │
     │                               │ 6. Store JWT in localStorage
     │                               │                               │
     │                               │ 7. Notify NestJS (create profile)
     │                               │───────────────────────────────>│
     │                               │                               │
     │                               │ 8. Create/update profile in DB
     │                               │                               │
     │                               │ 9. Return success
     │                               │<───────────────────────────────│
     │                               │                               │
     │ 10. Redirect to dashboard    │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
```

### 2. Conversation Creation Flow

```
┌─────────┐                    ┌──────────┐                    ┌──────────┐
│  User   │                    │  Next.js │                    │ NestJS   │
│         │                    │          │                    │   API    │
└────┬────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ 1. Fill prompt, select assistants/workflow
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │ 2. POST /conversations
     │                               │    { prompt, assistants, workflow }
     │                               │───────────────────────────────>│
     │                               │                               │
     │                               │ 3. Verify JWT (Auth Guard)
     │                               │                               │
     │                               │ 4. Create conversation in DB
     │                               │                               │
     │                               │ 5. Create initial user message
     │                               │                               │
     │                               │ 6. Execute workflow steps
     │                               │    ┌───────────────────────────┐
     │                               │    │ AI Module                 │
     │                               │    │ - Load assistants         │
     │                               │    │ - Call LLM APIs           │
     │                               │    │ - Stream responses       │
     │                               │    └───────────────────────────┘
     │                               │                               │
     │                               │ 7. Stream responses via WS
     │                               │<───────────────────────────────│
     │                               │                               │
     │ 8. Display streaming messages│                               │
     │<──────────────────────────────│                               │
     │                               │                               │
```

### 3. File Upload Flow

```
┌─────────┐                    ┌──────────┐                    ┌──────────┐
│  User   │                    │  Next.js │                    │ Supabase │
│         │                    │          │                    │ Storage  │
└────┬────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ 1. Select file                 │                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │ 2. Upload directly to Storage
     │                               │    (bypasses backend)
     │                               │───────────────────────────────>│
     │                               │                               │
     │                               │ 3. Return file URL
     │                               │<───────────────────────────────│
     │                               │                               │
     │                               │ 4. POST /files/notify
     │                               │    { storagePath, metadata }
     │                               │───────────────────────────────>│
     │                               │                               │
     │                               │ 5. NestJS processes file
     │                               │    - Extract text
     │                               │    - Generate embeddings
     │                               │    - Store metadata
     │                               │                               │
     │                               │ 6. Return file record
     │                               │<───────────────────────────────│
     │                               │                               │
     │ 7. File ready for use         │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
```

---

## Authentication Flow

### Detailed Implementation

#### Frontend (Next.js)

```typescript
// apps/web/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Anon key only!
);

// apps/web/lib/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        // On first login, notify backend to create profile
        if (event === 'SIGNED_IN' && session) {
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return { user, loading, signInWithGoogle };
}
```

#### Backend (NestJS)

```typescript
// apps/api/src/modules/auth/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) return false;

    // Verify JWT with Supabase
    const { data: { user }, error } = await this.supabase.client.auth.getUser(token);
    
    if (error || !user) return false;

    // Attach user to request
    request.user = user;
    return true;
  }
}

// apps/api/src/modules/auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  @Post('sync')
  @UseGuards(AuthGuard)
  async syncProfile(@CurrentUser() user: User) {
    // Create or update user profile
    const { data: profile } = await this.supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: user.user_metadata?.full_name || user.email,
        avatar_url: user.user_metadata?.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return profile;
  }
}
```

---

## AI Integration Flow

### LLM Adapter Pattern

```typescript
// apps/api/src/modules/ai/adapters/base.adapter.ts
export interface LLMAdapter {
  generate(prompt: string, options: LLMOptions): Promise<LLMResponse>;
  stream(prompt: string, options: LLMOptions): AsyncGenerator<string>;
}

// apps/api/src/modules/ai/adapters/openai.adapter.ts
@Injectable()
export class OpenAIAdapter implements LLMAdapter {
  constructor(private openai: OpenAIApi) {}

  async generate(prompt: string, options: LLMOptions): Promise<LLMResponse> {
    const response = await this.openai.createChatCompletion({
      model: options.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature,
    });

    return {
      content: response.data.choices[0].message.content,
      tokensUsed: response.data.usage.total_tokens,
      model: options.model,
    };
  }

  async *stream(prompt: string, options: LLMOptions): AsyncGenerator<string> {
    const stream = await this.openai.createChatCompletion({
      model: options.model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }, { responseType: 'stream' });

    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || '';
    }
  }
}

// apps/api/src/modules/ai/ai.service.ts
@Injectable()
export class AIService {
  private adapters: Map<string, LLMAdapter> = new Map();

  constructor(
    private openaiAdapter: OpenAIAdapter,
    private anthropicAdapter: AnthropicAdapter,
    private googleAdapter: GoogleAdapter,
  ) {
    this.adapters.set('gpt-5', this.openaiAdapter);
    this.adapters.set('claude-sonnet-4.5', this.anthropicAdapter);
    // ... etc
  }

  async generate(
    model: string,
    prompt: string,
    systemPrompt?: string,
    options?: LLMOptions,
  ): Promise<LLMResponse> {
    const adapter = this.adapters.get(model);
    if (!adapter) throw new Error(`Unknown model: ${model}`);

    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${prompt}` 
      : prompt;

    return adapter.generate(fullPrompt, options);
  }

  async stream(
    model: string,
    prompt: string,
    systemPrompt?: string,
  ): AsyncGenerator<string> {
    const adapter = this.adapters.get(model);
    if (!adapter) throw new Error(`Unknown model: ${model}`);

    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${prompt}` 
      : prompt;

    yield* adapter.stream(fullPrompt, {});
  }
}
```

### Workflow Orchestration

```typescript
// apps/api/src/modules/workflows/workflow-orchestrator.ts
@Injectable()
export class WorkflowOrchestrator {
  constructor(
    private aiService: AIService,
    private conversationService: ConversationService,
  ) {}

  async executeWorkflow(
    workflow: Workflow,
    conversationId: string,
    userPrompt: string,
    assistants: Assistant[],
  ) {
    const messages: Message[] = [];

    // Execute each workflow step sequentially
    for (const step of workflow.steps) {
      // For each assistant, generate response
      for (const assistant of assistants) {
        const prompt = this.buildPrompt(step, userPrompt, assistant);
        
        // Stream response
        const responseChunks: string[] = [];
        for await (const chunk of this.aiService.stream(
          assistant.model,
          prompt,
          assistant.systemPrompt,
        )) {
          responseChunks.push(chunk);
          // Emit via WebSocket
          this.realtimeGateway.emitMessage(conversationId, {
            assistantId: assistant.id,
            content: chunk,
            isComplete: false,
          });
        }

        // Save complete message
        const message = await this.conversationService.addMessage(
          conversationId,
          {
            role: 'assistant',
            content: responseChunks.join(''),
            assistantId: assistant.id,
          },
        );

        messages.push(message);
      }
    }

    return messages;
  }
}
```

---

## Billing Integration Flow

### Stripe Integration

```typescript
// apps/api/src/modules/billing/billing.service.ts
@Injectable()
export class BillingService {
  constructor(
    private stripe: Stripe,
    private supabase: SupabaseService,
  ) {}

  async createCheckoutSession(
    userId: string,
    planType: 'pro' | 'enterprise',
  ): Promise<string> {
    // Create Stripe customer if doesn't exist
    const customer = await this.getOrCreateCustomer(userId);

    // Create checkout session
    const session = await this.stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planType} Plan`,
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: planType === 'pro' ? 2900 : 9900, // $29 or $99
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/settings/billing?canceled=true`,
    });

    return session.url;
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
    }
  }
}
```

---

## Third-Party Integrations

### Integration Architecture

All third-party integrations happen in **NestJS backend only**:

```typescript
// apps/api/src/modules/integrations/google/google.service.ts
@Injectable()
export class GoogleService {
  constructor(
    private oauth2Client: OAuth2Client,
    private driveService: drive_v3.Drive,
  ) {}

  async importDocument(userId: string, fileId: string): Promise<string> {
    // Fetch document from Google Drive
    const file = await this.driveService.files.get({
      fileId,
      alt: 'media',
    });

    // Extract text content
    const content = this.extractText(file.data);

    // Store in Supabase Storage
    const storagePath = await this.uploadToStorage(userId, content);

    // Create file record
    await this.filesService.createFile({
      userId,
      storagePath,
      source: 'google_drive',
      sourceId: fileId,
    });

    return storagePath;
  }
}
```

---

## Multi-Platform Strategy

### Web (Next.js)
- ✅ Uses `@thoughtweaver/ui` components
- ✅ Uses `@thoughtweaver/sdk` for API calls
- ✅ Direct Supabase Auth for login

### Desktop (Electron - Phase 2)
- ✅ Reuses `@thoughtweaver/ui` components
- ✅ Uses `@thoughtweaver/sdk` for API calls
- ✅ Same API endpoints as web
- ✅ Electron main process handles OAuth redirects

### Mobile (React Native - Phase 2)
- ⚠️ Limited reuse of `@thoughtweaver/ui` (React Native components differ)
- ✅ Uses `@thoughtweaver/sdk` for API calls
- ✅ Same API endpoints as web
- ✅ Native OAuth flows

---

## Step-by-Step Implementation Guide

### Phase 1: Setup Monorepo

```bash
# 1. Initialize Turborepo
npm install -g turbo
npx create-turbo@latest thoughtweaver

# 2. Setup pnpm workspace
echo "packages/*" > pnpm-workspace.yaml

# 3. Create package structure
mkdir -p apps/{web,api,desktop,mobile}
mkdir -p packages/{ui,sdk,types,ai,config,utils}
mkdir -p infra/{supabase,docker,stripe,scripts}

# 4. Install dependencies
pnpm install
```

### Phase 2: Setup Backend (NestJS)

```bash
cd apps/api

# 1. Initialize NestJS
nest new . --skip-git

# 2. Install dependencies
pnpm add @supabase/supabase-js @nestjs/config @nestjs/websockets
pnpm add openai @anthropic-ai/sdk @google/generative-ai
pnpm add stripe @stripe/stripe-js

# 3. Setup Supabase client
# Create src/database/supabase.service.ts

# 4. Setup Auth guard
# Create src/common/guards/auth.guard.ts

# 5. Create first module (users)
nest g module users
nest g controller users
nest g service users
```

### Phase 3: Setup Frontend (Next.js)

```bash
cd apps/web

# 1. Initialize Next.js
npx create-next-app@latest . --typescript --app --tailwind

# 2. Install dependencies
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
pnpm add @thoughtweaver/ui @thoughtweaver/sdk @thoughtweaver/types

# 3. Setup Supabase client
# Create lib/supabase/client.ts

# 4. Setup API client wrapper
# Create lib/api/client.ts
```

### Phase 4: Setup Shared Packages

```bash
# 1. Create types package
cd packages/types
pnpm init
# Add TypeScript types

# 2. Create SDK package
cd packages/sdk
pnpm init
# Add API client

# 3. Create UI package
cd packages/ui
pnpm init
# Add React components
```

### Phase 5: Database Setup

```bash
# 1. Create Supabase project
# Go to supabase.com and create project

# 2. Run migrations
cd infra/supabase/migrations
# Create migration files

# 3. Setup RLS policies
cd infra/supabase/policies
# Create policy files

# 4. Seed default data
cd infra/supabase/seeds
# Create seed files for default assistants/workflows
```

---

## Code Structure Examples

### Example 1: Backend - Conversation Controller

```typescript
// apps/api/src/modules/conversations/conversations.controller.ts
import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto, SendMessageDto } from './dto';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversationsService.create(user.id, dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.conversationsService.findOne(id, user.id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: User,
  ) {
    return this.conversationsService.sendMessage(id, user.id, dto);
  }
}
```

### Example 2: Frontend - Conversation Page

```typescript
// apps/web/app/(dashboard)/conversations/[id]/page.tsx
'use client';

import { use } from 'react';
import { ThoughtweaverClient } from '@thoughtweaver/sdk';
import { ConversationView } from '@thoughtweaver/ui';

export default function ConversationPage({ params }: { params: { id: string } }) {
  const conversationId = use(Promise.resolve(params.id));
  const client = new ThoughtweaverClient(
    process.env.NEXT_PUBLIC_API_URL!,
    await getAuthToken(),
  );

  const conversation = await client.getConversation(conversationId);

  return <ConversationView conversation={conversation} />;
}
```

### Example 3: Shared Types

```typescript
// packages/types/src/conversation.ts
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  workflowId?: string;
  contextId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConversationDto {
  title: string;
  prompt: string;
  workflowId?: string;
  assistantIds: string[];
  modelId: string;
}
```

---

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────────────┐
│                         CDN (Vercel)                         │
│                    Next.js Static Assets                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                        │
│                      Next.js App Router                      │
│              apps/web (deployed to Vercel)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Railway/Render)                  │
│                    NestJS API Server                         │
│              apps/api (deployed to Railway)                  │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Supabase   │   │    Stripe    │   │  LLM APIs    │
│  PostgreSQL  │   │   (Billing)  │   │  (OpenAI,    │
│              │   │              │   │  Claude, etc)│
└──────────────┘   └──────────────┘   └──────────────┘
```

### Environment Variables

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_API_URL=https://api.thoughtweaver.com
```

**Backend (.env):**
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx  # NEVER expose this!
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_xxx
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-xxx
GOOGLE_API_KEY=xxx
```

---

## Figma UI Management & Design Sync Workflow

### Overview

Since Thoughtweaver has existing React/Next.js code from Figma, we need a systematic approach to manage UI updates when designers modify the Figma designs. This section outlines the workflow, tools, and best practices for keeping code in sync with design changes.

### Design-to-Code Workflow

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Designer  │         │   Developer   │         │    Code     │
│   (Figma)   │         │   (Review)    │         │  (React/TS) │
└──────┬──────┘         └───────┬───────┘         └──────┬──────┘
       │                         │                        │
       │ 1. Design Changes        │                        │
       │─────────────────────────>│                        │
       │                         │                        │
       │ 2. Export Specs/Tokens  │                        │
       │    (Figma API)          │                        │
       │─────────────────────────>│                        │
       │                         │                        │
       │                         │ 3. Review Changes      │
       │                         │    Identify Impact     │
       │                         │                        │
       │                         │ 4. Update Components   │
       │                         │───────────────────────>│
       │                         │                        │
       │                         │ 5. Run Tests           │
       │                         │                        │
       │                         │ 6. Visual Regression   │
       │                         │    Testing             │
       │                         │                        │
       │                         │ 7. Deploy              │
       │                         │                        │
```

### Tools & Setup

#### 1. Figma Integration Tools

**Recommended Stack:**
- **Figma API** - Automated design token extraction
- **Figma to Code Plugins** - Convert components to React code
- **Figma Variables** - Design tokens (colors, spacing, typography)
- **GitHub Actions** - Automated sync workflows

#### 2. Design Token Management

```typescript
// packages/ui/src/tokens/design-tokens.ts
// Auto-generated from Figma Variables

export const designTokens = {
  colors: {
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      // ... auto-synced from Figma
      500: '#8b5cf6', // Purple primary
      900: '#581c87',
    },
    // ... other color tokens
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    // ... auto-synced from Figma
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Georgia', 'serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      // ... auto-synced from Figma
    },
  },
} as const;
```

### Directory Structure for Design Assets

```
apps/web/
├── design/
│   ├── figma/
│   │   ├── tokens/              # Auto-generated design tokens
│   │   │   ├── colors.json
│   │   │   ├── spacing.json
│   │   │   └── typography.json
│   │   ├── components/          # Figma component specs
│   │   │   ├── Button.spec.json
│   │   │   ├── Card.spec.json
│   │   │   └── ...
│   │   └── screens/              # Screen design specs
│   │       ├── HomePage.spec.json
│   │       └── ConversationView.spec.json
│   │
│   ├── screenshots/              # Visual regression test images
│   │   ├── baseline/
│   │   └── current/
│   │
│   └── changelog.md             # Design change log
│
├── components/                   # React components
│   ├── ui/                      # Base UI components (from shadcn)
│   ├── home/
│   │   └── HomePage.tsx         # Maps to Figma design
│   └── conversation/
│       └── ConversationView.tsx  # Maps to Figma design
```

### Workflow: Handling Design Changes

#### Step 1: Designer Updates Figma

**Designer Responsibilities:**
- Update Figma designs
- Use Figma Variables for design tokens
- Add comments for complex interactions
- Tag components with version numbers
- Notify developer via Slack/GitHub issue

#### Step 2: Automated Token Sync

```bash
# scripts/sync-figma-tokens.sh
#!/bin/bash

# Fetch design tokens from Figma API
FIGMA_API_KEY=$FIGMA_API_KEY
FIGMA_FILE_KEY=$FIGMA_FILE_KEY

# Extract tokens
curl -H "X-Figma-Token: $FIGMA_API_KEY" \
  "https://api.figma.com/v1/files/$FIGMA_FILE_KEY/variables/local" \
  > design/figma/tokens/variables.json

# Convert to TypeScript
node scripts/convert-tokens.js > packages/ui/src/tokens/design-tokens.ts

# Update Tailwind config
node scripts/update-tailwind-config.js
```

**GitHub Action Workflow:**

```yaml
# .github/workflows/sync-figma.yml
name: Sync Figma Design Tokens

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:  # Manual trigger

jobs:
  sync-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Fetch Figma Tokens
        env:
          FIGMA_API_KEY: ${{ secrets.FIGMA_API_KEY }}
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
        run: |
          bash scripts/sync-figma-tokens.sh
      
      - name: Check for Changes
        id: changes
        run: |
          git diff --exit-code packages/ui/src/tokens/ || echo "changed=true" >> $GITHUB_OUTPUT
      
      - name: Create PR if Changes
        if: steps.changes.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'chore: sync design tokens from Figma'
          body: 'Auto-generated PR from Figma design token sync'
          branch: auto/sync-figma-tokens
```

#### Step 3: Developer Review Process

**When Designer Notifies of Changes:**

1. **Review Figma Design**
   - Open Figma file
   - Check component changes
   - Review spacing, colors, typography
   - Note any new components or removed components

2. **Impact Analysis**
   ```markdown
   ## Design Change Impact Analysis
   
   **Designer:** [Name]
   **Date:** [Date]
   **Figma Link:** [Link]
   
   ### Changes Identified:
   - [ ] Color palette updated
   - [ ] Spacing system changed
   - [ ] New component added
   - [ ] Component removed
   - [ ] Layout changes
   - [ ] Typography updates
   
   ### Affected Components:
   - components/home/HomePage.tsx
   - components/conversation/ConversationView.tsx
   - packages/ui/src/components/Button.tsx
   
   ### Breaking Changes:
   - [ ] Yes (requires migration)
   - [ ] No (backward compatible)
   
   ### Estimated Effort:
   - Hours: [X]
   - Complexity: [Low/Medium/High]
   ```

3. **Create Development Task**
   - Create GitHub issue with checklist
   - Label: `design-update`
   - Assign to developer
   - Link to Figma design

4. **Sync Design Tokens**
   ```bash
   # Run manual sync if needed
   npm run sync:figma
   ```

#### Step 4: Update Components

**Component Update Checklist:**

```typescript
// Example: Updating HomePage component after design change

// Before: Old design
export function HomePage() {
  return (
    <div className="p-6">  // Old spacing
      <h1 className="text-2xl text-purple-600">  // Old color
        Welcome
      </h1>
    </div>
  );
}

// After: New design (using design tokens)
import { designTokens } from '@thoughtweaver/ui/tokens';

export function HomePage() {
  return (
    <div className="p-8" style={{ padding: designTokens.spacing.lg }}>
      <h1 
        className="text-3xl" 
        style={{ color: designTokens.colors.primary[500] }}
      >
        Welcome
      </h1>
    </div>
  );
}
```

**Update Process:**

1. **Update Base Components First**
   - Update `packages/ui/src/components/` first
   - Ensure backward compatibility
   - Add migration guide if breaking

2. **Update Page Components**
   - Update `apps/web/components/` pages
   - Reference Figma specs
   - Maintain functionality

3. **Update Tests**
   - Update component tests
   - Update visual regression tests
   - Update snapshot tests

#### Step 5: Visual Regression Testing

```typescript
// tests/visual-regression/HomePage.test.tsx
import { test, expect } from '@playwright/test';
import { HomePage } from '@/components/home/HomePage';

test.describe('HomePage Visual Regression', () => {
  test('matches Figma design', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Compare with baseline screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.2, // 20% pixel difference allowed
    });
  });
  
  test('matches Figma design - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });
});
```

**Visual Regression Workflow:**

```bash
# Generate baseline screenshots
npm run test:visual:baseline

# Run visual regression tests
npm run test:visual

# Update baseline if changes are intentional
npm run test:visual:update
```

### Component Mapping Strategy

**Mapping Figma Components to React Components:**

```typescript
// design/figma/component-mapping.json
{
  "figmaComponents": {
    "Button/Primary": {
      "reactComponent": "packages/ui/src/components/Button.tsx",
      "variant": "default",
      "lastUpdated": "2025-11-03",
      "figmaLink": "https://figma.com/file/xxx"
    },
    "Card/Conversation": {
      "reactComponent": "components/conversation/ConversationCard.tsx",
      "lastUpdated": "2025-11-03",
      "figmaLink": "https://figma.com/file/xxx"
    }
  }
}
```

### Best Practices

#### For Designers

1. **Use Figma Variables**
   - Define colors, spacing, typography as variables
   - Use consistent naming conventions
   - Document design decisions in Figma comments

2. **Component Organization**
   - Organize components in Figma similar to React structure
   - Use consistent naming (PascalCase for components)
   - Maintain component hierarchy

3. **Change Communication**
   - Create GitHub issue for major changes
   - Tag affected components
   - Provide before/after screenshots
   - Note breaking changes

4. **Design System Consistency**
   - Follow established design tokens
   - Use existing components when possible
   - Document new patterns

#### For Developers

1. **Component Structure**
   - Mirror Figma component structure in code
   - Use same naming conventions
   - Keep component props aligned with Figma variants

2. **Design Token Usage**
   - Always use design tokens, never hardcode values
   - Import from `@thoughtweaver/ui/tokens`
   - Update Tailwind config with tokens

3. **Change Management**
   - Review Figma designs before implementing
   - Create migration plan for breaking changes
   - Update tests alongside code changes
   - Document component changes

4. **Code Organization**
   ```typescript
   // Good: Organized by feature, matches Figma structure
   components/
     home/
       HomePage.tsx
       HomePage.test.tsx
     conversation/
       ConversationView.tsx
       ConversationCard.tsx
   
   // Bad: Flat structure, hard to map to Figma
   components/
     HomePage.tsx
     ConversationView.tsx
   ```

### Automated Tools Setup

#### 1. Figma API Integration

```typescript
// scripts/sync-figma-components.ts
import { FigmaApi } from '@figma/api';

const figma = new FigmaApi(process.env.FIGMA_API_KEY);

async function syncComponents() {
  const file = await figma.getFile(process.env.FIGMA_FILE_KEY);
  
  // Extract components
  const components = extractComponents(file);
  
  // Generate component specs
  for (const component of components) {
    await generateComponentSpec(component);
  }
  
  // Update component mapping
  await updateComponentMapping(components);
}
```

#### 2. Design Token Generator

```typescript
// scripts/generate-design-tokens.ts
import { FigmaApi } from '@figma/api';

async function generateTokens() {
  const figma = new FigmaApi(process.env.FIGMA_API_KEY);
  const file = await figma.getFile(process.env.FIGMA_FILE_KEY);
  
  // Extract variables
  const variables = extractVariables(file);
  
  // Convert to TypeScript
  const tokens = convertToTokens(variables);
  
  // Write to file
  await writeFile('packages/ui/src/tokens/design-tokens.ts', tokens);
  
  // Update Tailwind config
  await updateTailwindConfig(tokens);
}
```

### Change Management Process

#### For Minor Changes (Colors, Spacing)

1. Designer updates Figma Variables
2. Automated sync runs (daily)
3. Developer reviews PR
4. Merge updates tokens
5. Components automatically use new tokens

#### For Major Changes (New Components, Layout)

1. Designer creates design in Figma
2. Designer creates GitHub issue with:
   - Figma link
   - Screenshots
   - Change description
   - Impact assessment
3. Developer reviews and estimates
4. Developer implements changes
5. Visual regression tests run
6. Code review
7. Merge and deploy

### Documentation

**Component Documentation Template:**

```markdown
# ComponentName

**Figma Design:** [Link]
**Last Updated:** [Date]
**Designer:** [Name]

## Description
[Component description]

## Design Specs
- Colors: [Token names]
- Spacing: [Token names]
- Typography: [Token names]

## Variants
- Primary
- Secondary
- etc.

## Props
[Component props documentation]

## Usage
\`\`\`tsx
<ComponentName variant="primary" />
\`\`\`

## Changelog
- 2025-11-03: Updated colors to match new design system
```

---

## Testing Strategy & Quality Gates

### Overview

Thoughtweaver requires comprehensive testing at multiple levels to ensure code quality, reliability, and maintainability. This section outlines the testing strategy, including unit tests, integration tests, E2E tests, component tests, and automated quality gates (like CodeRabbit).

### Testing Pyramid

```
                    ┌─────────────┐
                    │   E2E Tests │  (Few, Critical Paths)
                    │  (Playwright)│
                    └─────────────┘
                  ┌─────────────────┐
                  │ Integration Tests│  (API, Database)
                  │   (Jest/Vitest)  │
                  └─────────────────┘
              ┌───────────────────────┐
              │   Component Tests       │  (React Components)
              │ (React Testing Library) │
              └───────────────────────┘
          ┌───────────────────────────────┐
          │      Unit Tests                │  (Functions, Utils)
          │      (Jest/Vitest)             │
          └───────────────────────────────┘
      ┌───────────────────────────────────────┐
      │    Visual Regression Tests            │  (UI Changes)
      │    (Playwright, Chromatic)             │
      └───────────────────────────────────────┘
```

### Testing Tools Stack

| Test Type | Tool | Purpose |
|-----------|------|---------|
| **Unit Tests** | Jest/Vitest | Test individual functions, utilities |
| **Component Tests** | React Testing Library | Test React components in isolation |
| **Integration Tests** | Jest/Vitest + Supertest | Test API endpoints, database |
| **E2E Tests** | Playwright | Test full user flows |
| **Visual Regression** | Playwright + Chromatic | Compare UI against baseline |
| **Code Quality** | ESLint, Prettier | Code style and quality |
| **Type Safety** | TypeScript | Compile-time type checking |
| **Code Review** | CodeRabbit, GitHub Actions | Automated PR reviews |

### Test Directory Structure

```
thoughtweaver/
├── apps/
│   ├── web/
│   │   ├── __tests__/
│   │   │   ├── unit/              # Unit tests
│   │   │   ├── components/        # Component tests
│   │   │   ├── integration/      # Integration tests
│   │   │   └── e2e/               # E2E tests
│   │   │
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.test.tsx  # Co-located tests
│   │   │
│   │   └── tests/
│   │       ├── visual-regression/  # Visual tests
│   │       └── fixtures/           # Test fixtures
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── conversations/
│   │   │   │   │   ├── conversations.controller.spec.ts
│   │   │   │   │   ├── conversations.service.spec.ts
│   │   │   │   │   └── conversations.e2e-spec.ts
│   │   │   │
│   │   └── test/
│   │       ├── jest.config.ts
│   │       ├── setup.ts
│   │       └── fixtures/
│   │
└── packages/
    ├── ui/
    │   ├── src/
    │   │   └── components/
    │   │       └── Button/
    │   │           ├── Button.tsx
    │   │           └── Button.test.tsx
    │   │
    └── utils/
        └── src/
            └── __tests__/
                └── logger.test.ts
```

### 1. Unit Tests

**Purpose:** Test individual functions, utilities, and business logic in isolation.

**Coverage Target:** 80%+ for utilities and business logic

**Example:**

```typescript
// apps/api/src/modules/conversations/conversations.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { SupabaseService } from '../../database/supabase.service';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let supabaseService: jest.Mocked<SupabaseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: SupabaseService,
          useValue: {
            createConversation: jest.fn(),
            getConversation: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
    supabaseService = module.get(SupabaseService);
  });

  describe('create', () => {
    it('should create a conversation', async () => {
      const userId = 'user-123';
      const dto = {
        title: 'Test Conversation',
        prompt: 'Test prompt',
        assistantIds: ['assistant-1'],
        modelId: 'gpt-5',
      };

      supabaseService.createConversation.mockResolvedValue({
        id: 'conv-123',
        ...dto,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(userId, dto);

      expect(result).toBeDefined();
      expect(result.id).toBe('conv-123');
      expect(supabaseService.createConversation).toHaveBeenCalledWith(
        userId,
        expect.objectContaining(dto),
      );
    });

    it('should throw error if title is empty', async () => {
      const userId = 'user-123';
      const dto = {
        title: '',
        prompt: 'Test prompt',
        assistantIds: [],
        modelId: 'gpt-5',
      };

      await expect(service.create(userId, dto)).rejects.toThrow();
    });
  });
});
```

**Running Unit Tests:**

```bash
# Backend unit tests
cd apps/api
npm run test

# Frontend unit tests
cd apps/web
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### 2. Component Tests

**Purpose:** Test React components in isolation, ensuring they render correctly and handle user interactions.

**Coverage Target:** 70%+ for components

**Example:**

```typescript
// apps/web/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant styles correctly', () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container.firstChild).toHaveClass('bg-purple-500');
  });
});
```

**Component Test Best Practices:**

1. **Test User Behavior, Not Implementation**
   ```typescript
   // ❌ Bad: Testing implementation details
   expect(component.state.isOpen).toBe(true);
   
   // ✅ Good: Testing user-visible behavior
   expect(screen.getByText('Modal Content')).toBeVisible();
   ```

2. **Use Accessible Queries**
   ```typescript
   // ✅ Prefer accessible queries
   screen.getByRole('button', { name: /submit/i });
   screen.getByLabelText('Email');
   screen.getByPlaceholderText('Enter your name');
   ```

3. **Test Edge Cases**
   ```typescript
   it('handles empty input gracefully', () => {
     // Test empty state
   });
   
   it('handles long text overflow', () => {
     // Test overflow behavior
   });
   ```

### 3. Integration Tests

**Purpose:** Test interactions between multiple components, API endpoints, and database.

**Coverage Target:** 60%+ for critical flows

**Example - API Integration:**

```typescript
// apps/api/src/modules/conversations/conversations.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('ConversationsController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup test user and get auth token
    authToken = await setupTestUser();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/conversations (POST)', () => {
    it('should create a conversation', () => {
      return request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Conversation',
          prompt: 'Test prompt',
          assistantIds: ['assistant-1'],
          modelId: 'gpt-5',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Conversation');
        });
    });

    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .post('/conversations')
        .send({ title: 'Test' })
        .expect(401);
    });
  });

  describe('/conversations/:id/messages (POST)', () => {
    it('should send a message and get AI response', async () => {
      // Create conversation first
      const createRes = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test',
          prompt: 'Hello',
          assistantIds: ['assistant-1'],
          modelId: 'gpt-5',
        });

      const conversationId = createRes.body.id;

      // Send message
      return request(app.getHttpServer())
        .post(`/conversations/${conversationId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Follow-up question',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveLength(2); // User message + AI response
        });
    });
  });
});
```

**Example - Database Integration:**

```typescript
// apps/api/src/modules/conversations/conversations.integration.spec.ts
import { Test } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { SupabaseService } from '../../database/supabase.service';
import { createTestDatabase } from '../../test/database';

describe('ConversationsService Integration', () => {
  let service: ConversationsService;
  let supabase: SupabaseService;
  let testDb: any;

  beforeAll(async () => {
    testDb = await createTestDatabase();
    const module = await Test.createTestingModule({
      providers: [
        ConversationsService,
        SupabaseService,
      ],
    }).compile();

    service = module.get(ConversationsService);
    supabase = module.get(SupabaseService);
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  it('should create and retrieve conversation from database', async () => {
    const conversation = await service.create('user-123', {
      title: 'Integration Test',
      prompt: 'Test prompt',
      assistantIds: ['assistant-1'],
      modelId: 'gpt-5',
    });

    const retrieved = await service.findOne(conversation.id, 'user-123');
    expect(retrieved).toBeDefined();
    expect(retrieved.title).toBe('Integration Test');
  });
});
```

### 4. E2E Tests (End-to-End)

**Purpose:** Test complete user flows from start to finish.

**Coverage Target:** All critical user journeys

**Example:**

```typescript
// apps/web/tests/e2e/conversation-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Conversation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login user
    await page.goto('/login');
    await page.click('text=Sign in with Google');
    // Mock OAuth flow
    await page.waitForURL('/');
  });

  test('user can create a new conversation', async ({ page }) => {
    // Navigate to home
    await page.goto('/');
    
    // Fill prompt
    await page.fill('textarea[placeholder*="challenge"]', 'How to improve productivity?');
    
    // Select assistants
    await page.click('text=All Rounder');
    await page.click('text=Productivity Coach');
    
    // Select model
    await page.click('button:has-text("Model")');
    await page.click('text=GPT-5');
    
    // Start conversation
    await page.click('button:has-text("Start weaving")');
    
    // Verify redirected to conversation
    await expect(page).toHaveURL(/\/conversations\/[a-z0-9-]+/);
    
    // Verify conversation title
    await expect(page.locator('h1')).toContainText('How to improve productivity');
    
    // Verify messages appear
    await expect(page.locator('[data-testid="message"]')).toHaveCount(2); // User + AI
  });

  test('user can send follow-up message', async ({ page }) => {
    // Assuming conversation already exists
    await page.goto('/conversations/test-conv-id');
    
    // Send follow-up
    await page.fill('textarea[placeholder*="message"]', 'Can you elaborate?');
    await page.click('button:has-text("Send")');
    
    // Verify new message appears
    await expect(page.locator('[data-testid="message"]')).toHaveCount(4); // 2 original + 2 new
  });

  test('user can switch assistants mid-conversation', async ({ page }) => {
    await page.goto('/conversations/test-conv-id');
    
    // Open assistant selector
    await page.click('button[aria-label="Select assistants"]');
    
    // Select different assistant
    await page.click('text=Marketing Expert');
    
    // Send message
    await page.fill('textarea', 'Marketing perspective?');
    await page.click('button:has-text("Send")');
    
    // Verify Marketing Expert responds
    await expect(page.locator('[data-testid="assistant-avatar"]').last())
      .toHaveAttribute('data-assistant-id', 'marketing-expert');
  });
});
```

**E2E Test Organization:**

```typescript
// tests/e2e/
├── auth/
│   ├── login.spec.ts
│   └── signup.spec.ts
├── conversations/
│   ├── create-conversation.spec.ts
│   ├── send-message.spec.ts
│   └── switch-assistants.spec.ts
├── workflows/
│   └── create-workflow.spec.ts
├── assistants/
│   ├── create-assistant.spec.ts
│   └── edit-assistant.spec.ts
└── billing/
    └── upgrade-plan.spec.ts
```

### 5. Visual Regression Tests

**Purpose:** Detect unintended visual changes in UI components.

**Tools:** Playwright + Chromatic (optional)

**Example:**

```typescript
// apps/web/tests/visual-regression/components.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Components', () => {
  test('Button component matches design', async ({ page }) => {
    await page.goto('/test-components');
    
    // Primary button
    await expect(page.locator('[data-testid="button-primary"]'))
      .toHaveScreenshot('button-primary.png');
    
    // Secondary button
    await expect(page.locator('[data-testid="button-secondary"]'))
      .toHaveScreenshot('button-secondary.png');
  });

  test('ConversationCard matches design', async ({ page }) => {
    await page.goto('/test-components');
    
    await expect(page.locator('[data-testid="conversation-card"]'))
      .toHaveScreenshot('conversation-card.png', {
        fullPage: false,
        threshold: 0.2, // 20% pixel difference allowed
      });
  });
});
```

**Visual Regression Workflow:**

```bash
# Generate baseline screenshots
npm run test:visual:baseline

# Run visual regression tests
npm run test:visual

# Update baseline (when design changes are intentional)
npm run test:visual:update

# Compare with Figma designs
npm run test:visual:figma
```

### 6. Test Configuration

**Jest Configuration (Backend):**

```typescript
// apps/api/jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.interface.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
```

**Vitest Configuration (Frontend):**

```typescript
// apps/web/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.spec.ts',
      ],
    },
  },
});
```

**Playwright Configuration:**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 7. Code Quality Gates

#### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

#### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

#### GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run test:unit
      - run: pnpm run test:component
      - run: pnpm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run test:e2e
```

### 8. CodeRabbit Integration

**Purpose:** Automated code review and quality checks.

**Setup:**

1. **Install CodeRabbit GitHub App**
   - Go to GitHub → Settings → Integrations
   - Install CodeRabbit

2. **Configure `.coderabbit.yaml`:**

```yaml
# .coderabbit.yaml
language:
  - typescript
  - javascript

rules:
  - name: "Require tests for new features"
    type: "file"
    condition: "new_files"
    checks:
      - type: "test_coverage"
        min_coverage: 70

  - name: "Check for TypeScript types"
    type: "code"
    checks:
      - type: "no_any"
        severity: "warning"

  - name: "Require error handling"
    type: "code"
    checks:
      - type: "try_catch"
        severity: "error"

reviews:
  auto_review: true
  review_comment_language: "en"
  path_filters:
    - "apps/**/*.ts"
    - "apps/**/*.tsx"
    - "packages/**/*.ts"
```

**CodeRabbit Features:**

- ✅ Automated code review
- ✅ Security vulnerability detection
- ✅ Code quality suggestions
- ✅ Test coverage checks
- ✅ Performance recommendations
- ✅ Accessibility checks

### 9. Test Coverage Requirements

**Coverage Targets:**

| Component Type | Target Coverage | Critical Coverage |
|---------------|----------------|-------------------|
| **Utilities** | 90%+ | 100% |
| **Services** | 80%+ | 90%+ |
| **Controllers** | 70%+ | 80%+ |
| **Components** | 70%+ | 80%+ |
| **Hooks** | 80%+ | 90%+ |
| **E2E Flows** | 100% critical paths | N/A |

**Coverage Reports:**

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html

# Check coverage thresholds
npm run test:coverage:check
```

### 10. Testing Best Practices

#### Writing Good Tests

1. **AAA Pattern (Arrange, Act, Assert)**
   ```typescript
   it('should calculate total correctly', () => {
     // Arrange
     const items = [{ price: 10 }, { price: 20 }];
     
     // Act
     const total = calculateTotal(items);
     
     // Assert
     expect(total).toBe(30);
   });
   ```

2. **Test One Thing**
   ```typescript
   // ❌ Bad: Testing multiple things
   it('should validate and save user', () => {
     // Too many assertions
   });
   
   // ✅ Good: Test one thing
   it('should validate email format', () => {
     // Single assertion
   });
   ```

3. **Use Descriptive Test Names**
   ```typescript
   // ❌ Bad
   it('test 1', () => {});
   
   // ✅ Good
   it('should return error when email is invalid', () => {});
   ```

4. **Mock External Dependencies**
   ```typescript
   // Mock API calls
   jest.mock('@/lib/api/client', () => ({
     getApiClient: jest.fn(),
   }));
   ```

#### Test Maintenance

1. **Keep Tests Updated**
   - Update tests when code changes
   - Remove obsolete tests
   - Refactor tests regularly

2. **Avoid Flaky Tests**
   - Use stable selectors
   - Wait for async operations
   - Mock time-dependent code

3. **Test Data Management**
   ```typescript
   // Use test fixtures
   import { createTestUser } from '../fixtures/user';
   
   it('should create conversation', async () => {
     const user = await createTestUser();
     // Test with fixture
   });
   ```

### 11. Test Execution Strategy

**Pre-Commit Hooks:**

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:unit"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{ts,tsx}": [
      "jest --findRelatedTests --passWithNoTests"
    ]
  }
}
```

**CI Pipeline:**

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup
        run: pnpm install
      
      - name: Lint
        run: pnpm run lint
      
      - name: Type Check
        run: pnpm run type-check
      
      - name: Unit Tests
        run: pnpm run test:unit
      
      - name: Component Tests
        run: pnpm run test:component
      
      - name: E2E Tests
        run: pnpm run test:e2e
      
      - name: Visual Regression
        run: pnpm run test:visual
      
      - name: Coverage Report
        run: pnpm run test:coverage
```

### 12. Test Documentation

**Test Plan Template:**

```markdown
# Test Plan: [Feature Name]

## Overview
[Feature description]

## Test Scope
- [ ] Unit tests
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Visual regression

## Test Cases

### TC-001: [Test Case Name]
**Priority:** High
**Steps:**
1. Step 1
2. Step 2
3. Step 3

**Expected:** Expected result

## Coverage
- Target: 80%
- Current: [X]%

## Risks
- [Risk 1]
- [Risk 2]
```

### Migration from Existing Figma Code

**Current Situation:** You have existing Figma-generated React/Next.js code that needs to be migrated to the monorepo structure.

**Key Challenge:** Figma exports whole pages, but monorepo needs modular components.

**Solution:** Three-layer decomposition strategy:

```
Figma Page (Whole) → Decompose → Modular Components
    ↓                      ↓              ↓
HomePage.tsx    →    [Header, PromptInput, AssistantSelector]  →  Button.tsx, Card.tsx, etc.
```

**Recommended Approach:** Use a two-repository strategy:

1. **Keep existing Figma repo** (`thoughtweaver-figma`) for design updates
2. **Create new monorepo** (`thoughtweaver`) for production code
3. **Decompose Figma pages** into modular components **manually** during sync (see guide below)
4. **Selective updates** - only update changed sections/components manually

**Workflow:**
```
Designer Updates Figma Page
    ↓
Commit Whole Page to Figma Repo
    ↓
Developer Reviews Changes (git diff)
    ↓
Manually Identify Changed Sections
    ↓
Manually Extract Changed Sections → Modular Components
    ↓
Update Affected Components Selectively
    ↓
Test & Create PR in Monorepo
    ↓
Review & Merge
```

**Decomposition Process:**
- ✅ **Manual Process:** Requires developer judgment and understanding of architecture
- ✅ **One-Time Setup:** Initial decomposition done once per page (2-4 hours)
- ✅ **Selective Updates:** When Figma changes, only update affected components (10-30 min)
- ✅ **Component Mapping:** Track which Figma sections map to which React components

**See:** 
- `MIGRATION_GUIDE.md` - Migration steps and scripts
- `MANUAL_DECOMPOSITION_GUIDE.md` - **Step-by-step manual process** with code examples

---

## Security Architecture

### Security Layers

1. **Authentication**: Supabase Auth + JWT verification
2. **Authorization**: RLS policies + NestJS guards
3. **API Security**: Rate limiting, input validation
4. **Data Security**: Encryption at rest (Supabase), TLS in transit
5. **Key Management**: Environment variables, never commit secrets

### Best Practices

- ✅ Never expose service keys in frontend
- ✅ Always verify JWT in backend
- ✅ Use RLS policies for data access
- ✅ Validate all inputs with Zod
- ✅ Rate limit API endpoints
- ✅ Use HTTPS everywhere
- ✅ Regular security audits

---

## Summary

### Key Takeaways

1. **Monorepo Structure**: Turborepo for build orchestration
2. **Backend Controls Data**: All DB operations via NestJS with service key
3. **Frontend Handles Auth**: OAuth flows in Next.js, backend verifies
4. **Shared Packages**: Types, SDK, UI components reused across platforms
5. **Modular Design**: Each feature is a NestJS module
6. **Single API**: One backend serves web, desktop, mobile
7. **Type Safety**: Shared TypeScript types ensure consistency

### Next Steps

1. ✅ Setup monorepo structure
2. ✅ Initialize NestJS backend
3. ✅ Initialize Next.js frontend
4. ✅ Setup Supabase project and migrations
5. ✅ Implement authentication flow
6. ✅ Create first API endpoints
7. ✅ Connect frontend to backend
8. ✅ Implement AI integration
9. ✅ Add billing integration
10. ✅ Deploy to production

---

**Document Maintained By**: Engineering Team  
**Review Cycle**: After major architecture changes  
**Related Documents**: PRD.md, Architecture.md, Guardrails.md

