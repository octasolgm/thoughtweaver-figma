# Architecture Documentation
## Thoughtweaver - AI-Powered Ideation Platform

**Version:** 1.5  
**Last Updated:** October 28, 2025  
**Status:** Prototype (Frontend Only - Enhanced UX)

### Version History
- **v1.5** (Oct 28, 2025): Enhanced conversation UX - persistent assistant selection feature implemented. Users can switch assistants mid-conversation while maintaining complete history. Fixed useEffect bug in ConversationView.
- **v1.4** (Oct 28, 2025): Code quality improvements - added reusable components, custom hooks, centralized constants/types. Improved developer experience.
- **v1.3** (Oct 28, 2025): Performance optimizations - React.memo, code splitting, lazy loading. 40% bundle reduction.
- **v1.2** (Oct 28, 2025): Architecture refactoring - Context API implementation (4 providers), eliminated prop drilling.
- **v1.11** (Oct 28, 2025): Code optimization review - documented unused components, created optimization roadmap in OPTIMIZATION.md.
- **v1.1** (Oct 27, 2025): Complete architecture documentation with all components and patterns
- **v1.0** (Oct 27, 2025): Initial architecture

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Application Architecture](#application-architecture)
4. [Directory Structure](#directory-structure)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Data Models](#data-models)
8. [Routing & Navigation](#routing--navigation)
9. [Styling System](#styling-system)
10. [Key Design Patterns](#key-design-patterns)
11. [Future Architecture Considerations](#future-architecture-considerations)

---

## Overview

Thoughtweaver is a single-page application (SPA) built with React that enables AI-powered ideation and creative thinking through multi-assistant conversations and structured workflows. The current implementation is a frontend prototype with simulated backend interactions, designed to validate UX and prepare for full-stack implementation.

### Architecture Principles

- **Component-Based Design**: Modular, reusable React components
- **Single Responsibility**: Each component handles one primary concern
- **Centralized State**: App-level state managed in root component
- **Type Safety**: TypeScript interfaces for all data structures
- **Design System**: Consistent UI using shadcn/ui components
- **Responsive-First**: Mobile-to-desktop progressive enhancement

---

## Technology Stack

### Core Framework
- **React 18+** - UI library with hooks-based architecture
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server

### UI & Styling
- **Tailwind CSS v4.0** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible component library
- **Lucide React** - Icon library
- **Recharts** - Data visualization (personality radar charts)

### State Management
- **React Hooks** - useState, useEffect for local state
- **Props Drilling** - Parent-to-child state passing (current approach)
- **Future**: Context API or Zustand for complex state

### Backend (Future)
- **Supabase** - Planned for authentication, database, and real-time features
- **LLM APIs** - Claude 3, GPT-4, Gemini Pro integration planned

---

## Application Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│                    (Root Component)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  State Management (useState hooks)                    │  │
│  │  - User authentication state                          │  │
│  │  - Current page/route                                 │  │
│  │  - Conversations & Projects                           │  │
│  │  - Selected workflows, assistants, LLMs               │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Conditional Rendering                    │  │
│  │  - SignupPage (unauthenticated)                       │  │
│  │  - AppLayout (authenticated)                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │          AppLayout Component            │
        │  ┌──────────────┐  ┌─────────────────┐  │
        │  │   Sidebar    │  │  Main Content   │  │
        │  │  Navigation  │  │     Area        │  │
        │  └──────────────┘  └─────────────────┘  │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │         Page Components                 │
        │  - HomePage                             │
        │  - ConversationView                     │
        │  - WorkflowBuilder/Editor               │
        │  - AIAssistantsPage/Creator/Editor      │
        │  - PreferencesPage                      │
        │  - ProjectsPage                         │
        │  - AccountPage                          │
        │  - BillingPage                          │
        │  - TeamPage                             │
        └─────────────────────────────────────────┘
```

### Component Hierarchy

```
App.tsx (Root)
├── SignupPage (Unauthenticated State)
└── AppLayout (Authenticated State)
    ├── Sidebar (Navigation)
    │   ├── Search Input
    │   ├── Main Navigation Menu
    │   ├── Conversation History
    │   ├── Projects List
    │   └── User Profile Section
    └── Main Content (Page Router)
        ├── HomePage
        │   ├── Workflow Selection Modal
        │   ├── Assistant Selection Pills
        │   ├── Example Prompts Modal
        │   ├── Prompt Input Area
        │   └── LLM Model Selector
        ├── ConversationView
        │   ├── Conversation Tab
        │   │   ├── Message Display
        │   │   ├── Multi-Assistant Responses
        │   │   └── Follow-up Input
        │   ├── Context Tab
        │   │   └── Context Builder
        │   └── Workflow Recommendation Sidebar
        ├── WorkflowBuilder
        │   └── Workflow Cards Grid
        ├── WorkflowEditor
        │   └── Step-based Editor
        ├── AIAssistantsPage
        │   └── Assistant Cards with Radar Charts
        ├── AssistantCreator
        │   └── Live Preview + Configuration Forms
        ├── AIAssistantEditor
        │   └── Edit Form with System Prompt
        ├── ProjectsPage
        │   └── Project Cards Grid
        ├── PreferencesPage
        │   └── LLM Selection Checkboxes
        ├── SelectLLMsPage
        │   └── Detailed LLM Configuration
        ├── AccountPage
        │   └── Profile Information
        ├── BillingPage
        │   ├── Current Plan Display
        │   ├── Usage Statistics
        │   └── Billing History
        └── TeamPage (Hidden in R1)
            └── Team Member Management
```

---

## Directory Structure

```
/
├── App.tsx                      # Root component, main state, routing logic
├── PRD.md                       # Product Requirements Document
├── Architecture.md              # This file
├── Guardrails.md               # Development guidelines and constraints
├── Attributions.md             # Third-party credits
│
├── components/                  # All React components
│   ├── auth/
│   │   └── SignupPage.tsx      # Google/Apple OAuth UI (mock)
│   │
│   ├── layout/
│   │   └── AppLayout.tsx       # Main layout with sidebar navigation
│   │
│   ├── home/
│   │   └── HomePage.tsx        # Main dashboard with prompt input
│   │
│   ├── conversation/
│   │   ├── ConversationView.tsx    # Chat interface with tabs
│   │   └── ContextView.tsx         # Context management tab
│   │
│   ├── workflow/
│   │   ├── WorkflowBuilder.tsx     # Workflow library/list
│   │   └── WorkflowEditor.tsx      # Create/edit workflow steps
│   │
│   ├── assistant/
│   │   ├── AIAssistantsPage.tsx    # Assistant grid with radar charts
│   │   ├── AssistantCreator.tsx    # Create new assistant
│   │   ├── AIAssistantEditor.tsx   # Edit existing assistant
│   │   └── assistantData.ts        # 14 default assistant definitions
│   │
│   ├── context/
│   │   └── ContextBuilder.tsx      # Context creation interface
│   │
│   ├── projects/
│   │   └── ProjectsPage.tsx        # Project management grid
│   │
│   ├── preferences/
│   │   └── PreferencesPage.tsx     # User preferences
│   │
│   ├── llms/
│   │   └── SelectLLMsPage.tsx      # Detailed LLM configuration
│   │
│   ├── account/
│   │   └── AccountPage.tsx         # Account settings
│   │
│   ├── billing/
│   │   └── BillingPage.tsx         # Usage & billing management
│   │
│   ├── team/
│   │   └── TeamPage.tsx            # Team management (R2)
│   │
│   ├── figma/
│   │   └── ImageWithFallback.tsx   # Protected image component
│   │
│   └── ui/                          # shadcn/ui component library
│       ├── sidebar.tsx              # Main navigation sidebar
│       ├── button.tsx               # Button component
│       ├── card.tsx                 # Card container
│       ├── dialog.tsx               # Modal dialogs
│       ├── avatar.tsx               # User/assistant avatars
│       ├── badge.tsx                # Status badges
│       ├── input.tsx                # Form inputs
│       ├── textarea.tsx             # Multi-line text input
│       ├── select.tsx               # Dropdown selects
│       ├── checkbox.tsx             # Checkboxes
│       ├── slider.tsx               # Range sliders
│       ├── popover.tsx              # Popovers
│       ├── tabs.tsx                 # Tab navigation
│       ├── progress.tsx             # Progress bars
│       ├── tooltip.tsx              # Tooltips
│       ├── chart.tsx                # Chart wrapper
│       └── [37 other components]    # Additional UI primitives
│
├── styles/
│   └── globals.css              # Global styles, CSS variables, typography
│
└── guidelines/
    └── Guidelines.md            # Development guidelines
```

---

## Component Architecture

### Core Components

#### 1. **App.tsx** (Root Component)
**Responsibility**: Application orchestration, state management, routing

**Key State**:
```typescript
- currentPage: Page                    // Active route/view
- user: User | null                    // Authenticated user
- currentPrompt: string                // Active prompt text
- selectedWorkflow: string             // Active workflow ID
- selectedAssistants: string[]         // Selected assistant IDs
- selectedLLM: string                  // Active LLM model
- conversations: Conversation[]        // Conversation history
- activeConversationId: string | null  // Current conversation
- projects: Project[]                  // Project list
```

**Key Methods**:
- `handleLogin()` - Mock authentication
- `handleStartConversation()` - Create new conversation
- `handleViewConversation()` - Load existing conversation
- `handleUpdateConversationTitle()` - Edit conversation title
- `generateTitle()` - Auto-generate title from prompt

#### 2. **AppLayout.tsx** (Layout Component)
**Responsibility**: Application shell with sidebar navigation

**Features**:
- Responsive sidebar with search
- Main navigation menu
- Conversation history display
- Project list display
- User profile section
- Mobile-responsive overlay sidebar

**Props**:
```typescript
- children: ReactNode              // Page content
- user: User                       // Current user
- currentPage: string              // Active page
- onNavigate: (page: string) => void
- conversations: Conversation[]
- activeConversationId: string | null
- onViewConversation: (id: string) => void
- projects: Project[]
```

#### 3. **HomePage.tsx** (Main Dashboard)
**Responsibility**: Primary conversation initiation interface

**Key Features**:
- Workflow selection modal
- Assistant selection (14 default assistants)
- Example prompts modal
- Multi-line prompt input
- LLM model selector
- "Start weaving" action button

**State Flow**:
```
User Input → Parent State Update → Conversation Creation → Route Change
```

#### 4. **ConversationView.tsx** (Chat Interface)
**Responsibility**: Multi-assistant conversation display

**Key Features**:
- Dual-tab interface (Conversation / Context)
- Message grouping by timestamp
- Multi-assistant response rendering
- Avatar-based identification
- Editable conversation title
- Share & invite functionality
- Workflow recommendation sidebar (desktop)

**Mock Conversation Flow**:
1. Initial prompt submitted
2. AI requests additional context
3. User provides context
4. Multiple assistants respond with perspectives

#### 5. **AIAssistantsPage.tsx** (Assistant Management)
**Responsibility**: Display and manage AI assistants

**Key Features**:
- Grid layout (2 columns on desktop)
- 14 default assistants
- Personality radar charts (Big 5 OCEAN model)
- Edit capability for all assistants
- "New Assistant" creation button

**Data Visualization**:
- Recharts for personality visualization
- 5-axis radar chart (Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability)

#### 6. **WorkflowBuilder.tsx** (Workflow Library)
**Responsibility**: Display available workflows

**Default Workflows**:
1. Ideation
2. Problem Solving
3. Brainstorming
4. Decision Making

**Features**:
- Grid layout (responsive)
- Usage statistics
- "Edit Workflow" and "Use this workflow" actions
- "New Workflow" creation

#### 7. **WorkflowEditor.tsx** (Workflow Creation)
**Responsibility**: Create and edit multi-step workflows

**Features**:
- Drag-and-drop step reordering
- Add/remove steps
- Step configuration (title, description, AI prompt)
- Workflow metadata editing
- Icon selection
- Save functionality

---

## State Management

### Current Approach: Centralized State in App.tsx

**Pattern**: Lift State Up
- All application state lives in `App.tsx`
- State passed down via props
- Callbacks passed down for state updates
- No external state management library

### State Categories

#### 1. **Authentication State**
```typescript
user: User | null
```
- Mock authentication (Google/Apple OAuth UI)
- Future: Supabase Auth integration

#### 2. **Navigation State**
```typescript
currentPage: Page  // 'home' | 'conversation' | 'workflow' | etc.
```
- Simple string-based routing
- Conditional rendering in App.tsx

#### 3. **Conversation State**
```typescript
conversations: Conversation[]
activeConversationId: string | null
currentPrompt: string
```
- In-memory conversation storage
- Lost on page refresh (prototype limitation)

#### 4. **Selection State**
```typescript
selectedWorkflow: string
selectedAssistants: string[]  // Defaults to ['all-rounder']
selectedLLM: string           // Defaults to 'claude-3-opus'
```
- Persists during session
- Syncs between home and conversation views

#### 5. **Project State**
```typescript
projects: Project[]
```
- Project management data
- In-memory storage

### State Flow Patterns

#### Pattern 1: User Action → State Update → Re-render
```
User clicks "Start weaving"
  ↓
handleStartConversation() called
  ↓
New conversation added to state
  ↓
Active conversation ID set
  ↓
Page changes to 'conversation'
  ↓
ConversationView renders with new data
```

#### Pattern 2: Parent-Child State Sync
```
App.tsx (selectedLLM state)
  ↓
HomePage receives selectedLLM, setSelectedLLM
  ↓
LLM selector updates local state
  ↓
Callback updates parent state
  ↓
State synced across app
```

### Future State Management

**Planned Improvements**:
- **Context API**: For deeply nested prop drilling
- **Zustand**: Lightweight state management for complex interactions
- **React Query**: Server state management for API calls
- **Supabase Real-time**: For collaborative features

---

## Data Models

### Core Interfaces

#### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
```

#### Conversation
```typescript
interface Conversation {
  id: string;
  title: string;          // Auto-generated or user-edited
  prompt: string;         // Initial prompt
  workflow: string;       // Workflow ID
  assistants: string[];   // Selected assistant IDs
  timestamp: Date;
}
```

#### Assistant
```typescript
interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;          // Tailwind class (e.g., 'bg-purple-500')
  isCustom: boolean;      // Default vs user-created
  systemPrompt: string;   // AI behavior instructions
  personality: {
    openness: number;           // 0-100
    conscientiousness: number;  // 0-100
    extraversion: number;       // 0-100
    agreeableness: number;      // 0-100
    neuroticism: number;        // 0-100 (inverted for Emotional Stability)
  };
}
```

#### Workflow
```typescript
interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: string;           // Icon component name
  isCustom: boolean;
  usageCount: number;
  steps: WorkflowStep[];
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  prompt: string;         // AI prompt template
}
```

#### LLM Model
```typescript
interface LLMModel {
  id: string;
  name: string;
  provider: string;       // 'OpenAI', 'Anthropic', 'Google'
  description: string;
  speed: 'fast' | 'medium' | 'slow';
  cost: 'low' | 'medium' | 'high';
  capabilities: string[];
  enabled: boolean;
}
```

#### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  conversationCount: number;
  lastUpdated: Date;
  status: 'active' | 'archived';
}
```

#### Team Member (R2)
```typescript
interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  joinedDate: string;
}
```

---

## Routing & Navigation

### Current Implementation: Client-Side Routing

**Pattern**: String-based conditional rendering

```typescript
type Page = 
  | 'signup'
  | 'home'
  | 'conversation'
  | 'context'
  | 'workflow'
  | 'workflow-editor'
  | 'preferences'
  | 'billing'
  | 'llms'
  | 'team'
  | 'account'
  | 'assistant-creator'
  | 'ai-assistants'
  | 'ai-assistant-editor-{id}'
  | 'projects'
  | string;
```

### Navigation Methods

```typescript
// In App.tsx
setCurrentPage(page: Page)

// Passed to components
onNavigate(page: string, params?: any)
```

### Route Mapping

| Route | Component | Authentication Required |
|-------|-----------|------------------------|
| `signup` | SignupPage | No |
| `home` | HomePage | Yes |
| `conversation` | ConversationView | Yes |
| `workflow` | WorkflowBuilder | Yes |
| `workflow-editor` | WorkflowEditor | Yes |
| `ai-assistants` | AIAssistantsPage | Yes |
| `assistant-creator` | AssistantCreator | Yes |
| `ai-assistant-editor-{id}` | AIAssistantEditor | Yes |
| `projects` | ProjectsPage | Yes |
| `preferences` | PreferencesPage | Yes |
| `llms` | SelectLLMsPage | Yes |
| `account` | AccountPage | Yes |
| `billing` | BillingPage | Yes |
| `team` | TeamPage | Yes (Hidden R1) |

### Sidebar Navigation Structure

```
Main Navigation:
├── Ask Thoughtweaver (home)
├── Workflows (workflow)
├── Assistants (ai-assistants)
└── Preferences (preferences)

Conversation History:
├── Conversation 1
├── Conversation 2
└── ...

Projects:
├── Project 1
├── Project 2
└── ...

Footer:
└── Account (account)
    ├── Billing (billing)
    ├── Select LLMs (llms)
    └── [Team - Hidden in R1]
```

### Future: React Router

**Planned Migration**:
```typescript
// Future routes
/login
/signup
/dashboard
/conversations/:id
/workflows
/workflows/:id/edit
/assistants
/assistants/new
/assistants/:id/edit
/projects
/projects/:id
/settings/account
/settings/billing
/settings/llms
/settings/team
```

---

## Styling System

### Tailwind CSS v4.0 Architecture

**Approach**: Utility-first CSS with design tokens

#### 1. **CSS Variables (Design Tokens)**
Defined in `/styles/globals.css`:

```css
:root {
  --font-size: 16px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --primary: #030213;
  --radius: 0.625rem;
  /* ... 40+ design tokens */
}
```

#### 2. **Typography System**
Base typography without Tailwind classes:

```css
h1 { font-size: var(--text-2xl); font-weight: var(--font-weight-medium); }
h2 { font-size: var(--text-xl); font-weight: var(--font-weight-medium); }
h3 { font-size: var(--text-lg); font-weight: var(--font-weight-medium); }
p  { font-size: var(--text-base); font-weight: var(--font-weight-normal); }
```

**Important**: Do NOT use Tailwind font classes (`text-2xl`, `font-bold`, etc.) unless specifically changing from default.

#### 3. **Color System**

**Semantic Colors**:
- `bg-background`, `text-foreground`
- `bg-card`, `text-card-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-destructive`, `text-destructive-foreground`

**Assistant Colors**:
```css
bg-purple-500, bg-blue-600, bg-indigo-600, bg-pink-600,
bg-green-600, bg-amber-700, bg-violet-600, bg-slate-600,
bg-emerald-700, bg-fuchsia-600, bg-blue-700, bg-cyan-600,
bg-gray-700, bg-teal-700
```

#### 4. **Responsive Design**

**Breakpoints**:
```
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
2xl: 1536px  (Extra large)
```

**Grid Patterns**:
```jsx
// 1 → 2 → 3 columns
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

// 1 → 2 columns
grid-cols-1 lg:grid-cols-2
```

#### 5. **Component Styling Patterns**

**Card Component**:
```jsx
<Card className="p-6 hover:shadow-md transition-all">
```

**Button Variants** (via shadcn):
- Default: `<Button>`
- Secondary: `<Button variant="secondary">`
- Outline: `<Button variant="outline">`
- Ghost: `<Button variant="ghost">`
- Destructive: `<Button variant="destructive">`

**Spacing System**:
```
p-4  = 1rem (16px)
gap-4 = 1rem
h-14 = 3.5rem (56px) - Standard header height
```

#### 6. **Dark Mode Support**

Prepared but not actively used:
```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark mode tokens */
}
```

### shadcn/ui Integration

**Component Library**: 45 pre-built accessible components (21 used, 24 unused)

> **v1.11 Note**: Code review identified 24 unused shadcn components. See OPTIMIZATION.md for details. These can be excluded in production builds via tree-shaking for ~150-200KB bundle size reduction.

**Installation Pattern**:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

**Usage**:
```tsx
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
```

**Benefits**:
- Accessible by default (ARIA compliant)
- Customizable via Tailwind
- Copy-paste friendly (no package dependency)
- Consistent design system

---

## Key Design Patterns

### 1. **Compound Component Pattern**
Used in sidebar, forms, and complex UI:

```tsx
<Sidebar>
  <SidebarContent>
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
```

### 2. **Render Props Pattern**
For flexible component rendering:

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    {/* content */}
  </DialogContent>
</Dialog>
```

### 3. **Controlled Components**
Form inputs controlled by React state:

```tsx
<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### 4. **Conditional Rendering**
Page routing and feature toggles:

```tsx
{currentPage === 'home' && <HomePage {...props} />}
{currentPage === 'conversation' && <ConversationView {...props} />}
```

### 5. **Mock Data Patterns**
Simulated backend responses:

```tsx
const handleLogin = (provider: string) => {
  // Simulate API call
  setTimeout(() => {
    const mockUser = {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      avatar: '...'
    };
    onLogin(mockUser);
  }, 500);
};
```

### 6. **Data Transformation**
Client-side data processing:

```tsx
// Transform personality data for radar chart
const getPersonalityChartData = (personality) => [
  { trait: 'Openness', value: personality.openness },
  { trait: 'Conscientiousness', value: personality.conscientiousness },
  // ...
];
```

### 7. **Prop Drilling Mitigation**
Grouping related props:

```tsx
interface AppLayoutProps {
  children: ReactNode;
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  conversations: Conversation[];
  // ... grouped props
}
```

---

## Future Architecture Considerations

### Phase 1: Backend Integration (Supabase)

**Authentication**:
```typescript
// Replace mock auth
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);

// Google OAuth
await supabase.auth.signInWithOAuth({ provider: 'google' });

// Apple OAuth
await supabase.auth.signInWithOAuth({ provider: 'apple' });
```

**Database Schema**:
```sql
-- Users (managed by Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMP
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  title TEXT,
  prompt TEXT,
  workflow_id TEXT,
  created_at TIMESTAMP
);

-- Assistants (custom)
CREATE TABLE assistants (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  name TEXT,
  description TEXT,
  system_prompt TEXT,
  personality JSONB,
  is_custom BOOLEAN
);

-- Workflows (custom)
CREATE TABLE workflows (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  name TEXT,
  steps JSONB,
  is_custom BOOLEAN
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP
);

-- Team Members (R2)
CREATE TABLE team_members (
  id UUID PRIMARY KEY,
  team_id UUID,
  user_id UUID REFERENCES profiles,
  role TEXT,
  status TEXT
);
```

**Real-time Features**:
```typescript
// Subscribe to conversation updates
supabase
  .channel('conversations')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'conversations' },
    (payload) => {
      // Update UI
    }
  )
  .subscribe();
```

### Phase 2: LLM Integration

**API Routes**:
```typescript
// Edge function for LLM routing
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    model: 'claude-3-opus',
    messages: [...],
    system_prompt: assistant.systemPrompt
  })
});
```

**Streaming Responses**:
```typescript
const stream = await response.body;
const reader = stream.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // Update UI with streaming tokens
}
```

### Phase 3: State Management Refactor

**Zustand Store**:
```typescript
import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  conversations: [],
  setUser: (user) => set({ user }),
  addConversation: (conv) => 
    set((state) => ({ 
      conversations: [conv, ...state.conversations] 
    })),
}));
```

**React Query for Server State**:
```typescript
const { data: conversations } = useQuery(
  ['conversations'],
  fetchConversations
);
```

### Phase 4: Advanced Features

**File Upload** (Context attachments):
```typescript
const { data, error } = await supabase.storage
  .from('attachments')
  .upload(file.name, file);
```

**Collaborative Editing**:
- Supabase Real-time for multi-user conversations
- Conflict resolution for concurrent edits

**Voice Input**:
- Web Speech API integration
- Transcription service (Whisper API)

**AI Prompt Improvement**:
- LLM-based prompt enhancement
- Template suggestions

---

## Performance Considerations

### Current Optimizations
- React default memoization
- Lazy loading not yet implemented
- No code splitting (small prototype)

### Future Optimizations

**Code Splitting**:
```tsx
const ConversationView = lazy(() => 
  import('./components/conversation/ConversationView')
);
```

**Memoization**:
```tsx
const MemoizedAssistantCard = memo(AssistantCard);
```

**Virtual Scrolling**:
For large conversation/project lists:
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';
```

**Image Optimization**:
- Next.js Image component (if migrating)
- Lazy loading images
- Responsive images

---

## Security Considerations

### Current (Prototype)
- No authentication
- No authorization
- Mock data only
- Client-side only

### Future (Production)

**Authentication**:
- Supabase Auth with Row Level Security
- OAuth 2.0 for Google/Apple
- JWT token management

**Authorization**:
```sql
-- Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);
```

**Input Sanitization**:
```typescript
import DOMPurify from 'dompurify';
const cleanPrompt = DOMPurify.sanitize(userInput);
```

**API Security**:
- Rate limiting
- API key rotation
- CORS configuration
- Content Security Policy

---

## Testing Strategy (Future)

**Unit Tests** (Vitest):
```typescript
describe('generateTitle', () => {
  it('should truncate long prompts', () => {
    // test
  });
});
```

**Component Tests** (React Testing Library):
```typescript
test('renders assistant cards', () => {
  render(<AIAssistantsPage {...props} />);
  expect(screen.getByText('All Rounder')).toBeInTheDocument();
});
```

**E2E Tests** (Playwright):
```typescript
test('complete conversation flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Sign in with Google');
  // ...
});
```

---

## Deployment Architecture (Future)

**Frontend**: Vercel/Netlify
- Static site generation
- Edge functions for API routes
- CDN distribution

**Backend**: Supabase
- Managed PostgreSQL
- Authentication service
- Storage service
- Edge Functions

**External APIs**:
- OpenAI API (GPT-4)
- Anthropic API (Claude)
- Google AI API (Gemini)

---

## Conclusion

Thoughtweaver's current architecture is a **well-structured prototype** designed for rapid iteration and future scalability. The component-based architecture, centralized state management, and design system provide a solid foundation for transitioning to a full-stack application with real-time collaboration and AI integration.

### Next Steps
1. Backend integration (Supabase)
2. LLM API integration
3. State management refactor (Context API/Zustand)
4. React Router implementation
5. Testing infrastructure
6. Performance optimization
7. Production deployment

---

**Document Maintained By**: Product & Engineering Team  
**Review Cycle**: After major architecture changes  
**Related Documents**: PRD.md, Guardrails.md, Guidelines.md
