# Quick Reference Guide - Technology Decisions

**Version:** 1.0  
**Last Updated:** November 3, 2025

This is a quick reference guide for key technology decisions and architecture patterns in Thoughtweaver.

---

## 🎯 Key Architecture Decisions

### **Supabase Usage Strategy**

| Component | Frontend | Backend | Reason |
|-----------|----------|---------|--------|
| **Auth (Login)** | ✅ Yes | ❌ No | Better UX, direct OAuth |
| **Auth (Verify)** | ❌ No | ✅ Yes | Security: backend validates |
| **Database** | ❌ No | ✅ Yes | Security: service key never exposed |
| **Storage (Upload)** | ✅ Yes | ❌ No | Performance: direct upload |
| **Storage (Metadata)** | ❌ No | ✅ Yes | Backend manages business logic |
| **Realtime (UI)** | ⚙️ Optional | ❌ No | Simple UI updates |
| **Realtime (AI)** | ❌ No | ✅ Yes | Controlled streaming |

### **Why This Split?**

- ✅ **Security**: Service keys never exposed to clients
- ✅ **Consistency**: Single source of truth (backend)
- ✅ **Performance**: Direct uploads bypass backend for large files
- ✅ **Multi-platform**: Same API works for web, desktop, mobile

---

## 📦 Monorepo Structure

```
thoughtweaver/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # NestJS backend
│   ├── desktop/      # Electron (Phase 2)
│   └── mobile/       # React Native (Phase 2)
│
├── packages/
│   ├── ui/           # Shared React components
│   ├── sdk/          # API client
│   ├── types/        # Shared TypeScript types
│   ├── ai/           # AI utilities
│   ├── config/       # Shared config
│   └── utils/        # Shared utilities
│
└── infra/
    ├── supabase/     # DB migrations, policies
    ├── docker/       # Docker configs
    └── scripts/      # Automation scripts
```

---

## 🔐 Authentication Flow

```
1. User clicks "Sign in with Google" (Frontend)
   ↓
2. Supabase Auth redirects to Google OAuth
   ↓
3. Google callback → Supabase returns JWT
   ↓
4. Frontend stores JWT in localStorage
   ↓
5. Frontend sends JWT to backend: Authorization: Bearer <token>
   ↓
6. Backend verifies JWT with Supabase
   ↓
7. Backend creates/updates user profile in DB
   ↓
8. All subsequent requests include JWT in header
```

**Key Points:**
- Frontend initiates auth (better UX)
- Backend verifies every request (security)
- JWT stored client-side, verified server-side

---

## 💾 Data Flow Patterns

### **Creating a Conversation**

```
Frontend (Next.js)
  ↓ POST /conversations { prompt, assistants, workflow }
Backend (NestJS)
  ↓ Verify JWT (AuthGuard)
  ↓ Create conversation in DB (Supabase)
  ↓ Execute workflow steps
  ↓ Call LLM APIs (OpenAI/Anthropic/etc)
  ↓ Stream responses via WebSocket
Frontend
  ↓ Receive streaming messages
  ↓ Update UI in real-time
```

### **File Upload**

```
Frontend (Next.js)
  ↓ Upload directly to Supabase Storage
Supabase Storage
  ↓ Return file URL
Frontend
  ↓ POST /files/notify { storagePath, metadata }
Backend (NestJS)
  ↓ Process file (extract text, generate embeddings)
  ↓ Store metadata in DB
Frontend
  ↓ File ready for use
```

---

## 🤖 AI Integration Pattern

### **Adapter Pattern**

```typescript
// Base interface
interface LLMAdapter {
  generate(prompt, options): Promise<Response>;
  stream(prompt, options): AsyncGenerator<string>;
}

// Implementations
- OpenAIAdapter (GPT-5, GPT-5-mini)
- AnthropicAdapter (Claude Sonnet 4.5, Haiku 4.5)
- GoogleAdapter (Gemini 2.5 Pro, Flash)
- GrokAdapter (Grok-4)

// AI Service registers adapters
aiService.register('gpt-5', openaiAdapter);
aiService.register('claude-sonnet-4.5', anthropicAdapter);
```

### **Workflow Execution**

```
1. User submits prompt with workflow
   ↓
2. Backend loads workflow steps
   ↓
3. For each step:
   a. Load selected assistants
   b. Build prompt with system prompt
   c. Call LLM via adapter
   d. Stream response via WebSocket
   ↓
4. Save messages to database
```

---

## 🧾 Billing Flow

```
Frontend (Next.js)
  ↓ User clicks "Upgrade to Pro"
  ↓ POST /billing/create-checkout-session
Backend (NestJS)
  ↓ Create Stripe checkout session
  ↓ Return checkout URL
Frontend
  ↓ Redirect to Stripe checkout
Stripe
  ↓ User completes payment
  ↓ Webhook → POST /billing/webhook
Backend
  ↓ Update subscription in DB
  ↓ Update user plan
Frontend
  ↓ Poll or receive event → Update UI
```

---

## 🔌 Third-Party Integrations

**All integrations happen in backend only:**

- ✅ Google Drive (import documents)
- ✅ Notion (import pages)
- ✅ Slack (notifications)
- ✅ Stripe (billing)

**Why backend only?**
- Security: API keys never exposed
- Centralized: Easier to manage
- Consistent: Same logic for all platforms

---

## 📱 Multi-Platform Strategy

### **Web (Next.js)**
- Uses `@thoughtweaver/ui` components
- Uses `@thoughtweaver/sdk` for API calls
- Direct Supabase Auth

### **Desktop (Electron)**
- Reuses `@thoughtweaver/ui` components
- Uses `@thoughtweaver/sdk` for API calls
- Same API endpoints as web
- Electron handles OAuth redirects

### **Mobile (React Native)**
- Limited reuse of UI components (different primitives)
- Uses `@thoughtweaver/sdk` for API calls
- Same API endpoints as web
- Native OAuth flows

---

## 🗄️ Database Architecture

### **Supabase PostgreSQL**

**Why Supabase over Neon?**
- ✅ Built-in RLS (Row Level Security)
- ✅ Real-time subscriptions
- ✅ Storage integration
- ✅ Auth integration
- ✅ Managed service

### **Key Tables**

- `profiles` - User profiles
- `conversations` - Conversation threads
- `messages` - Individual messages
- `assistants` - AI assistants (default + custom)
- `workflows` - Workflow definitions
- `contexts` - Context information
- `files` - File metadata
- `subscriptions` - Stripe subscriptions
- `usage_tracking` - Usage metrics

### **RLS Policies**

```sql
-- Example: Users can only see their own conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🛠️ Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Monorepo** | Turborepo | Build orchestration |
| **Frontend** | Next.js 14+ | Web application |
| **Backend** | NestJS | API server |
| **Database** | Supabase PostgreSQL | Data storage |
| **Auth** | Supabase Auth | Authentication |
| **Storage** | Supabase Storage | File storage |
| **Billing** | Stripe | Payments |
| **AI** | OpenAI, Anthropic, Google, Grok | LLM providers |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | UI styling |
| **Components** | Shadcn/ui | UI components |

---

## 🚀 Deployment Architecture

```
Frontend (Vercel)
  ↓
CDN → Static Assets
  ↓
Next.js App Router
  ↓
API Calls → Backend (Railway/Render)
  ↓
NestJS API Server
  ↓
  ├─→ Supabase (Database + Auth + Storage)
  ├─→ Stripe (Billing)
  └─→ LLM APIs (OpenAI, Anthropic, etc.)
```

---

## 🔒 Security Checklist

- [ ] Never expose service keys in frontend
- [ ] Always verify JWT in backend
- [ ] Use RLS policies for data access
- [ ] Validate all inputs with Zod
- [ ] Rate limit API endpoints
- [ ] Use HTTPS everywhere
- [ ] Environment variables for secrets
- [ ] Regular security audits

---

## 📚 Key Files Reference

### **Backend**
- `apps/api/src/database/supabase.service.ts` - Supabase client
- `apps/api/src/common/guards/auth.guard.ts` - JWT verification
- `apps/api/src/modules/ai/ai.service.ts` - LLM orchestration
- `apps/api/src/modules/conversations/conversations.controller.ts` - API endpoints

### **Frontend**
- `apps/web/lib/supabase/client.ts` - Supabase client (anon key)
- `apps/web/lib/hooks/useAuth.ts` - Auth hook
- `apps/web/lib/api/client.ts` - API client wrapper
- `apps/web/app/(dashboard)/**` - App Router pages

### **Shared**
- `packages/types/src/**` - TypeScript types
- `packages/sdk/src/client.ts` - API client
- `packages/ui/src/**` - Shared React components

### **Database**
- `infra/supabase/migrations/**` - SQL migrations
- `infra/supabase/policies/**` - RLS policies
- `infra/supabase/seeds/**` - Seed data

---

## 🎓 Learning Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)

---

## ❓ Common Questions

### **Q: Why not use Supabase client in frontend for database?**
**A:** Security - service keys must never be exposed. Backend controls all data access.

### **Q: Why Supabase Auth in frontend?**
**A:** Better UX - direct OAuth redirects work better client-side.

### **Q: Can we use Neon instead of Supabase?**
**A:** Yes, but you'll lose RLS, real-time, and storage integration. Not recommended.

### **Q: Why NestJS instead of Express?**
**A:** Better structure, built-in DI, decorators, TypeScript-first. Easier to scale.

### **Q: Why monorepo?**
**A:** Shared code, consistent types, easier refactoring, single deployment pipeline.

---

**Quick Reference Maintained By**: Engineering Team  
**Update Frequency**: As architecture evolves
