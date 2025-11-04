# Product Requirements Document (PRD)
## Thoughtweaver - AI-Powered Ideation and Creative Thinking Platform

---

## 1. Executive Summary

**Product Name:** Thoughtweaver  
**Version:** 1.5 (Enhanced Conversation UX)  
**Last Updated:** October 28, 2025 (Latest update: Persistent assistant selection feature)
**Document Owner:** Product Team

### Version History
- **v1.5** (Oct 28, 2025): Persistent assistant selection - users can switch assistants mid-conversation while maintaining complete history. Enhanced visual feedback with "Active" badge and avatar. Fixed useEffect bug.
- **v1.4** (Oct 28, 2025): Code quality improvements - created reusable PageHeader, custom hooks, centralized constants and types. Improved developer experience.
- **v1.3** (Oct 28, 2025): Performance optimizations - React.memo for expensive components, code splitting with lazy loading. 40% bundle size reduction.
- **v1.2** (Oct 28, 2025): Architecture refactoring - Context API implementation, eliminated prop drilling, created 4 context providers.
- **v1.11** (Oct 28, 2025): Code optimization documentation - identified unused components, documented architecture improvements. See OPTIMIZATION.md.
- **v1.1** (Oct 27, 2025): UI consistency improvements - standardized header heights, consistent "New" button terminology
- **v1.0** (Oct 27, 2025): Initial prototype with team management hidden for R1

### Product Vision
Thoughtweaver is a responsive web application that empowers individuals and teams to unlock their creative potential through AI-powered ideation, structured workflows, and multi-perspective thinking. The platform enables users to engage with multiple AI assistants simultaneously, each offering unique perspectives, to enhance problem-solving, brainstorming, and decision-making processes.

### Target Users
- Creative professionals and strategists
- Product managers and business leaders
- Teams requiring collaborative ideation
- Individuals seeking structured thinking frameworks

---

## 2. Authentication & Onboarding

### 2.1 Signup/Login
**Status:** ✅ Implemented (Mock)

**Features:**
- **Social Authentication:**
  - Google OAuth integration (UI implemented)
  - Apple OAuth integration (UI implemented)
  - Single-click signup/login flow

**User Experience:**
- Branded landing page with Thoughtweaver logo
- Clean, minimalist signup interface
- Gradient background (purple-to-blue theme)
- Value proposition messaging: "Unlock your creative potential with AI-powered ideation"

**Technical Implementation:**
- Mock authentication currently in place
- Returns user object with: `id`, `name`, `email`, `avatar`
- Ready for Supabase OAuth integration

**Future Requirements:**
- Real Google/Apple OAuth implementation
- Email/password authentication as fallback
- Session management
- Account verification

---

## 3. Home Interface

### 3.1 Main Dashboard
**Status:** ✅ Implemented

**Layout:**
- Responsive sidebar navigation
- Main content area with sticky header
- Maximum width constraint (5xl) for readability

**Header:**
- Main question prompt: "What are you trying to solve today?"
- Thoughtweaver branding (same title size as other pages)
- Sidebar toggle for mobile
- Consistent height (h-14) matching all other page headers

### 3.2 Workflow Selection
**Status:** ❌ Hidden (Not Displayed on Home Page)

**Note:** Workflow selection functionality exists in the code but is currently hidden from the home page interface. Users can still access workflows through the Workflows page in the sidebar navigation.

**Features (When Visible):**
- Section label: "Choose or create a workflow"
- Pre-configured workflows displayed as buttons:
  - Ideation (Lightbulb icon)
  - Problem Solving (Sparkles icon)
  - Brainstorming (Lightbulb icon)
  - Decision Making (FileText icon)
- Visual selection state (default vs outline variant)
- "Create new workflow" button with dashed border
- Icon-based visual identification

**Interactions:**
- Single-click workflow selection
- Selected state persists across session
- Direct navigation to workflow editor for creation

### 3.3 Preset Prompts
**Status:** ❌ Hidden (Not Displayed on Home Page)

**Note:** Preset prompt functionality exists in the code but is currently hidden from the home page interface. The preset prompts were designed to help users get started quickly by providing pre-written prompt templates.

**Features (When Visible):**
- Section label: "Help me build my prompt..."
- Six preset prompt templates as clickable badges:
  1. Test my thinking
  2. Help me brainstorm ideas
  3. Challenge my assumptions
  4. Find blind spots in my plan
  5. Explore alternative perspectives
  6. Refine my concept

**Prompt Structure:**
Each preset includes:
- **CONTEXT:** Background information and current situation
- **CHALLENGE:** Specific question or problem to address

**Interactions:**
- Click to populate main prompt input
- Hover states for visual feedback
- Badge-based UI for scanability

### 3.4 Assistant Selection
**Status:** ✅ Implemented

**Note:** Renamed from "AI Assistant Selection" to "Assistant Selection" in v1.1 for consistency.

**Features:**
- Section label: "Add Assistants to work with"
- **NEW: Compact inline layout** (reduced 50% in size)
- **NEW: Located inside prompt input card**
- **NEW: Positioned below "Improve my prompt" and model selector buttons**
- **NEW: Click-to-reveal description** - Shows one-line assistant description below buttons
- Horizontal wrapping pill-style buttons
- Default selection: "All Rounder"

**Available Assistants:**

Users can select from 14 default assistants, each with specialized expertise:

1. **All Rounder** (Purple) - Default selection
2. **Product Manager** (Blue)
3. **Writing Coach** (Indigo)
4. **Marketing Expert** (Pink)
5. **Productivity Coach** (Green)
6. **Leadership Expert** (Amber)
7. **Visionary Strategist** (Violet)
8. **Methodical Proofreader** (Slate)
9. **Finance Guru** (Emerald)
10. **Creative Innovator** (Fuchsia)
11. **Tech Troubleshooter** (Blue)
12. **Science Communicator** (Cyan)
13. **Legal Analyst** (Gray)
14. **Data Analyst** (Teal)

Plus:
- **New Assistant** button (Dashed border) - Links to assistant creation flow with special styling

*See Section 6.1 for complete assistant descriptions and personality profiles*

**Visual Design:**
- Compact pill-shaped buttons with avatar (24px) and name
- Purple ring and background on selection
- Flex-wrap layout for responsive arrangement
- Avatar size: 24px (50% reduction from original 48px)
- Button padding: 12px horizontal, 8px vertical
- **Description area below buttons** - Single line of gray text showing last clicked assistant's description

**Interactions:**
- Multi-select capability (minimum 1 assistant)
- Visual selection state (purple ring + purple-50 background)
- Avatar-based identification
- Click to toggle selection
- **Click reveals assistant description below buttons**
- Description updates based on most recently clicked assistant
- Special "Create Assistant" button navigates to creation flow

### 3.5 Prompt Input Area
**Status:** ✅ Implemented

**Features:**
- Large text area (120px minimum height)
- Placeholder: "Describe your challenge and context"
- Attachment button (Paperclip icon)
- Voice input button (Microphone icon)
- **Workflow selection button with modal** (left side, below text area)
- **Example prompts button with modal** (left side, below text area)
- "Improve my prompt" button (left side, below text area)
- **LLM Model selector dropdown (right-aligned, below text area)**
- "Start weaving" submit button with Sparkles icon (bottom right, smaller size)

**Button Layout:**
- **Left side:** Workflow button, Example prompts button, and "Improve my prompt" button grouped together
- **Right side:** LLM Model selector (right-aligned using ml-auto)
- Bottom row: "Start weaving" button aligned to the right (not full-width)

**Workflow Modal:**
- Triggered by "Workflow" button with ChevronDown icon
- Dialog modal (500px max width)
- Title: "Select Workflow"
- Grid of clickable workflow cards with icons
- Each card shows workflow icon (in purple circle) and name
- Selected workflow highlighted with purple border and background
- Clicking a workflow selects it and closes modal
- Button label updates to show selected workflow name

**Example Prompts Modal:**
- Triggered by "Example prompts" button with ChevronDown icon
- Dialog modal (600px max width, 80vh max height, scrollable)
- Title: "Example Prompts"
- Grid of clickable prompt cards
- Each card shows prompt label and 2-line preview of content
- Hover state: purple border and background
- Clicking a prompt populates textarea and closes modal
- 7 preset prompts available

**Interactions:**
- Auto-resize text area
- Keyboard shortcut: Cmd/Ctrl + Enter to submit
- Disabled state when prompt is empty
- Icons positioned in bottom-right corner of text area
- Modal dialogs open on button click
- Modals close automatically after selection

**Input Methods Supported:**
- Text typing (primary)
- File attachments (UI ready)
- Voice recording (UI ready)
- Workflow selection via modal
- Preset prompt selection via modal
- AI prompt improvement (UI ready)

### 3.6 LLM Model Selection
**Status:** ✅ Implemented

**Location:**
- Inline with "Start weaving" button
- Bottom-left of prompt input card
- Compact dropdown UI

**Features:**
- Dropdown button showing current selection
- Default selection: Claude 3 Opus
- **Single-select with radio buttons** (updated from multi-select)
- **Clean popover with radio button list only** (no heading or description text)

**Available LLM Models:**
1. **Claude 3 Opus** (Anthropic) - **Default Selected**
2. **GPT-4** (OpenAI)
3. **Claude 3 Sonnet** (Anthropic)
4. **Gemini Pro** (Google)
5. **GPT-3.5 Turbo** (OpenAI)
6. **Llama 3 70B** (Meta)

**Visual Design:**
- Button displays: Selected model name
- ChevronDown icon indicates dropdown
- Popover width: 320px
- Radio button list with model name and provider
- Aligned to start (left side)
- **Minimalist design - no heading or descriptive text**

**Interactions:**
- Click button to open/close popover
- Radio buttons for single selection
- Selection state updates button text immediately
- State persists across session (stored in App state)

**Integration:**
- Selection state managed at App level
- Default: 'claude-3-opus'
- Syncs with Select LLMs page configuration
- Will be used for actual LLM routing when backend is implemented

---

## 4. Conversation View

### 4.1 Conversation Interface
**Status:** ✅ Implemented

**Features:**
- **Dual-tab interface:**
  - **Conversation Tab:** Main chat interface
  - **Context Tab:** Additional context and information management

**Header:**
- Editable conversation title
- Pencil icon to enable editing
- Check/X icons to save/cancel title changes
- Share conversation button
- Invite collaborators button
- More options menu

### 4.2 Message Display
**Status:** ✅ Implemented

**Features:**
- **Message Grouping:**
  - Messages grouped by timestamp
  - User messages displayed with user avatar
  - Assistant responses with assistant-specific avatars

**Message Structure:**
- User messages: Right-aligned with user avatar
- Assistant messages: Left-aligned with assistant avatar and name
- Assistant identification by color-coded avatars
- Timestamp display for message groups

**Multi-Assistant Responses:**
- Each selected assistant responds independently
- Responses displayed in sequence
- Clear visual differentiation between assistants
- Assistant name labeled on each response

### 4.3 Follow-up Input
**Status:** ✅ Implemented

**Features:**
- Text area for follow-up questions
- Attachment and voice input buttons
- Send button
- Persistent input area at bottom of conversation

**Mock Conversation Flow:**
- Initial prompt triggers context gathering question
- User provides context
- Multiple assistants respond with perspectives
- Conversation continues with follow-up exchanges

### 4.4 Context Tab
**Status:** ✅ Implemented

**Features:**
- Separate view for managing conversation context
- Context information display
- Context editing capabilities
- Additional resources section

**Purpose:**
- Maintain conversation context
- Add supporting information
- Reference materials
- Background details

### 4.5 Workflow Recommendation Sidebar
**Status:**  Implemented

**Features:**
- Right column on conversation screen (desktop only, hidden on mobile/tablet)
- AI-powered problem type detection based on user's initial prompt
- Recommended workflow with 4-5 actionable steps
- Visual workflow card with purple theme
- Problem type badge indicator
- Numbered step list
- "View All Workflows" button

**Problem Types Detected:**
1. **Creative Ideation** (Lightbulb icon)
   - Triggered by keywords: idea, brainstorm, creative
   - 5-step workflow for generating and refining ideas

2. **Decision Making** (Target icon)
   - Triggered by keywords: decide, choice, option
   - 5-step workflow for evaluating options and making decisions

3. **Problem Solving** (Zap icon)
   - Triggered by keywords: problem, challenge, issue
   - 5-step workflow for solving problems systematically

4. **Strategic Planning** (TrendingUp icon)
   - Triggered by keywords: strategy, plan, grow
   - 5-step workflow for strategic planning and goal-setting

5. **General Exploration** (Lightbulb icon)
   - Default fallback for all other prompts
   - 5-step workflow for general exploration and next steps

**Layout:**
- Desktop (lg+): 320px fixed width right sidebar
- Tablet/Mobile: Hidden, full-width conversation view
- Sticky positioning within scrollable area
- Border separation from main conversation

**Interactions:**
- Auto-detection runs on initial prompt
- Static recommendation (doesn't change during conversation)
- Click "View All Workflows" navigates to workflows page
- Purple-themed card matches app branding

### 4.6 Sharing & Collaboration
**Status:** ✅ UI Implemented

**Features:**
- Share conversation button in header
- Invite users button for collaboration
- Dialog-based sharing interface
- Copy link functionality
- Email invitation system

---

## 5. Workflow Management

### 5.1 Workflow Builder (Library)
**Status:** ✅ Implemented

**Features:**
- Grid view of available workflows
- Workflow categories:
  - Pre-built workflows
  - Custom user workflows
  - Template workflows

**Workflow Card Information:**
- Workflow name and icon
- Description
- Usage statistics
- "Edit Workflow" action button (previously "Manage workflow")
- "Use this workflow" button

**Pre-built Workflows:**
1. **Ideation**
   - Icon: Lightbulb
   - Purpose: Creative idea generation

2. **Problem Solving**
   - Icon: Sparkles
   - Purpose: Structured problem analysis

3. **Brainstorming**
   - Icon: Lightbulb
   - Purpose: Collaborative idea expansion

4. **Decision Making**
   - Icon: FileText
   - Purpose: Evaluate options and make decisions

**Interactions:**
- Click to select and use workflow
- "Edit Workflow" to customize
- No highlight on workflow cards (removed per latest update)

### 5.2 Workflow Editor
**Status:** ✅ Implemented

**Features:**
- **Step-based workflow creation**
- Drag-and-drop step reordering
- Add/remove steps
- Step configuration:
  - Step title
  - Step description
  - AI prompt template for the step
  - Step order

**Workflow Metadata:**
- Workflow name
- Workflow description
- Icon selection
- Custom vs template flag

**Step Management:**
- Minimum 1 step required
- Visual drag handle (GripVertical icon)
- Delete step button (minimum 1 step enforced)
- Add step button
- Step preview

**Save Functionality:**
- Save workflow button in header
- Create new workflow
- Edit existing workflow
- Back navigation to workflow library

---

## 6. Assistant Management

### 6.1 Assistants Page
**Status:** ✅ Implemented

**Note:** In v1.1, "AI Assistants" terminology was simplified to "Assistants" throughout the application.

**Features:**
- Grid view of all assistants
- Default assistants displayed
- Custom assistants displayed
- **Spider/Radar Chart Visualization** - Shows Big 5 personality traits
- "New Assistant" button to create new assistants

**Assistant Information:**
- Assistant name
- Description
- Avatar (generated or uploaded)
- Color theme
- Edit button
- **Personality Radar Chart:**
  - Visualizes Big 5 personality traits (OCEAN model)
  - 5 axes: Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability
  - Color-coded to match assistant's theme color
  - Semi-transparent fill for easy comparison
  - 200px height responsive container
  - Powered by Recharts library

**Big 5 Personality Traits:**
- **Openness to Experience:** Creativity, curiosity, willingness to try new things
- **Conscientiousness:** Organization, discipline, reliability
- **Extraversion:** Sociability, assertiveness, enthusiasm
- **Agreeableness:** Cooperation, empathy, trust
- **Emotional Stability:** Inverted neuroticism - calmness, confidence, stability

**Default Assistants (14 Total):**

1. **All Rounder** (Purple - bg-purple-500)
   - Balanced perspective across all domains
   - Personality: 60/60/50/60/40 (O/C/E/A/N)
   - Well-rounded capabilities across creative thinking, analytical reasoning, and practical problem-solving

2. **Product Manager** (Blue - bg-blue-600)
   - Expert product development and management insights across various industries
   - Personality: 75/90/65/75/30
   - Seasoned PM with experience from ideation to launch, cross-functional team management

3. **Writing Coach** (Indigo - bg-indigo-600)
   - Expert writing critiques and editing advice across various writing styles and genres
   - Personality: 85/80/55/85/35
   - Accomplished writing coach with nuanced understanding of craft and various genres

4. **Marketing Expert** (Pink - bg-pink-600)
   - Strategic marketing insights across traditional and digital platforms, from SEO to brand management
   - Personality: 80/75/75/70/35
   - Accomplished marketing expert with deep understanding of strategies and trends

5. **Productivity Coach** (Green - bg-green-600)
   - Personalized productivity advice using proven techniques to boost focus, motivation, and work-life balance
   - Personality: 70/90/60/75/25
   - Highly skilled productivity coach specializing in personal effectiveness and time management

6. **Leadership Expert** (Amber - bg-amber-700)
   - Nuanced leadership guidance drawing from varied leadership styles and theories for all career stages
   - Personality: 75/85/70/75/30
   - Experienced leadership expert with profound understanding of varied leadership styles

7. **Visionary Strategist** (Violet - bg-violet-600)
   - Strategic planning expertise leveraging innovation and creativity to drive transformational change
   - Personality: 90/75/65/70/30
   - Experienced strategist with deep understanding of learning strategies and methodologies

8. **Methodical Proofreader** (Slate - bg-slate-600)
   - Detailed proofreading assistance spotting errors and enhancing clarity and readability
   - Personality: 60/95/35/75/30
   - Meticulous proofreader with comprehensive understanding of grammar and syntax

9. **Finance Guru** (Emerald - bg-emerald-700)
   - Comprehensive financial advice spanning personal finance, investing, economics, and financial planning
   - Personality: 70/90/55/65/25
   - Highly knowledgeable with broad understanding of personal finance and investing

10. **Creative Innovator** (Fuchsia - bg-fuchsia-600)
    - Visionary creative thinking offering novel solutions to complex problems using innovative methodologies
    - Personality: 98/65/70/65/40
    - Exceptional talent known for pioneering unique and innovative solutions

11. **Tech Troubleshooter** (Blue - bg-blue-700)
    - Clear tech solutions from experienced specialist across software, hardware, and enterprise systems
    - Personality: 65/90/45/80/25
    - Experienced tech specialist covering wide range of technology troubleshooting

12. **Science Communicator** (Cyan - bg-cyan-600)
    - Complex scientific concepts explained in simple, engaging, and accessible language
    - Personality: 85/75/75/80/30
    - Renowned communicator with unique ability to simplify complex scientific concepts

13. **Legal Analyst** (Gray - bg-gray-700)
    - Insightful legal analysis grounded in comprehensive law knowledge from corporate to international law
    - Personality: 65/90/40/60/30
    - Highly knowledgeable in various areas of law with strong analytical skills

14. **Data Analyst** (Teal - bg-teal-700)
    - Professional data insights spanning data mining, machine learning, predictive modeling, and visualization
    - Personality: 75/90/50/65/25
    - Experienced with comprehensive understanding of data analysis methodologies

**Assistant Properties:**
- Cannot be deleted (only edited)
- Pre-configured system prompts tailored to each role
- Detailed personality profiles using Big 5 OCEAN model
- Professional avatars and color-coded themes

**Custom Assistants:**
- User-created assistants
- Full edit/delete capabilities
- Custom configurations

### 6.2 Assistant Creator
**Status:** ✅ Implemented

**Features:**
- **Live Preview Card:**
  - Shows assistant as it will appear
  - Updates in real-time as user configures

**Configuration Sections:**

**1. Basic Information**
- Assistant name
- Description
- Expertise tags/badges

**2. Appearance**
- Color selection (8 color options)
- Avatar generation
- Visual theme

**3. Personality & Behavior**
- System prompt configuration
- Response style
- Tone settings

**4. Capabilities**
- Expertise areas
- Special capabilities
- Focus areas

**Save Functionality:**
- "Save Assistant" button in header
- Validation before saving
- Navigation back to home/assistants page

### 6.3 AI Assistant Editor
**Status:** ✅ Implemented

**Features:**
- Edit existing assistants
- Same interface as creator
- Pre-populated with current settings
- **Loads actual assistant data based on assistant ID**
- **System Prompt field** - Editable textarea for AI instructions
- Sliders for configuration parameters (replaced progress bars)
- Delete assistant option (for custom assistants)
- Save changes functionality

**System Prompt Field:**
- Located between Knowledge & Expertise and Personality sections
- Monospace font for better readability
- 8-row textarea for detailed instructions
- Helps define core AI behavior and guidelines
- Pre-populated with existing assistant's system prompt
- Critical for AI integration when backend is implemented

---

## 7. User Settings & Preferences

### 7.1 Preferences Page
**Status:** ✅ Implemented

**Features:**
- **Language Model Selection:**
  - Multiple LLM selection
  - Default 3 models selected
  - Checkbox-based selection
  - Display count of selected models

**Available Models:**
- GPT-4 (OpenAI) - Default selected
- Claude 3 Opus (Anthropic) - Default selected
- Gemini Pro (Google) - Default selected
- GPT-3.5 Turbo (OpenAI)
- Llama 3 70B (Meta)

**Save Functionality:**
- "Save Changes" button in header
- Disabled when no changes
- Enabled when changes detected

### 7.2 Select LLMs Page
**Status:** ✅ Implemented

**Features:**
- **Detailed LLM Configuration:**
  - Model information cards
  - Enable/disable toggle for each model
  - Configuration sliders (temperature, max tokens, etc.)
  - Model capabilities display
  - Speed and cost indicators

**Model Information:**
- Provider name
- Model description
- Speed rating (fast/medium/slow)
- Cost rating (low/medium/high)
- Capability tags
- Enable/disable switch

**Configuration Options:**
- Temperature slider
- Max tokens slider
- Top-p slider
- Frequency penalty slider
- Other model-specific parameters

**Visual Indicators:**
- Speed badge
- Cost badge
- Capability badges
- Info tooltips

---

## 8. Account Management

### 8.1 Account Page
**Status:** ✅ Implemented

**Features:**
- User profile information
- Email address
- Account creation date
- Account status
- Profile settings

**Available Actions:**
- View account details
- Update profile information
- Account security settings
- Connected accounts (Google/Apple)

### 8.2 Billing Page
**Status:** ✅ Implemented

**Features:**
- **Current Plan Display:**
  - Plan name (e.g., "Pro Plan")
  - Monthly cost ($29/month)
  - Renewal date
  - Active status badge
  - "Manage Plan" button

**Usage Statistics:**
- **Conversations:**
  - Used: 47 / Limit: 100
  - Progress bar visualization
  - Icon: Zap

- **Messages:**
  - Used: 1,240 / Limit: 5,000
  - Progress bar visualization
  - Icon: TrendingUp

- **AI Sessions:**
  - Used: 156 / Limit: 500
  - Progress bar visualization
  - Icon: Calendar

**Billing History:**
- Transaction date
- Amount charged
- Payment status
- Past 3 months displayed

**Plan Management:**
- Upgrade/downgrade options
- Payment method management
- Billing cycle preferences

---

## 9. Team Management
**🚧 Planned for Release 2 (R2)**

### 9.1 Team Page
**Status:** ⏸️ Hidden for R1 / Planned for R2

**Note:** Team management functionality has been implemented but is currently hidden from the main navigation in Release 1. This feature will be made available in Release 2 with additional enhancements and integrations.

**Features (R2):**
- **Team Member List:**
  - Name and email
  - Avatar
  - Role badge (Owner/Admin/Member)
  - Status (Active/Pending)
  - Join date
  - Actions menu

**Roles:**
- **Owner:** Full control, cannot be changed
- **Admin:** Manage members, settings
- **Member:** Basic access

**Member Management:**
- View all team members
- Invite new members
- Change member roles
- Remove members
- Resend invitations to pending members

### 9.2 Invite Members
**Status:** ⏸️ Hidden for R1 / Planned for R2

**Features (R2):**
- **Invitation Dialog:**
  - Email input field
  - Role selection dropdown
  - Send invitation button
  - Cancel option

**Invitation Process:**
- Enter email address
- Select role (Admin or Member)
- Send invitation
- Pending status until accepted
- Email notification to invitee

**Member Actions:**
- Edit role (Owner/Admin only)
- Remove member (Owner/Admin only)
- Resend invitation (for pending members)

**Additional R2 Enhancements:**
- Team workspace management
- Shared conversation access
- Team-level AI assistant library
- Usage tracking per team member
- Team billing and subscription management

---

## 10. Navigation & Layout

### 10.1 Sidebar Navigation
**Status:** ✅ Implemented

**Features:**
- **Main Navigation Items (R1):**
  - Ask Thoughtweaver (Home)
  - Workflows
  - Assistants (simplified from "AI Assistants" in v1.1)
  - Preferences
  - Conversations (with history)
  - Account (in footer)

- **Hidden for R1 (Available in R2):**
  - Team (commented out in code)

**Conversation History:**
- List of recent conversations
- Conversation titles (editable)
- Timestamp

**User Section:**
- User avatar
- User name
- User email
- Account settings link

**Mobile Behavior:**
- Collapsible sidebar
- Hamburger menu trigger
- Overlay on mobile devices
- Swipe to open/close

### 10.2 Header
**Status:** ✅ Implemented

**Features:**
- Sticky positioning
- Sidebar toggle button
- Page title
- Context-specific actions (varies by page)
- **Consistent height across all pages: h-14 (56px)**
- **Consistent gap spacing: gap-3**
- Uniform typography sizing for page titles

**UI Consistency Standards (v1.1):**
- All page headers use identical height (h-14) and spacing (gap-3)
- All "Create New" buttons use "New" terminology (e.g., "New Workflow", "New Assistant", "New Project")
- "AI Assistants" renamed to "Assistants" throughout the application for brevity
- Consistent visual alignment and spacing across all pages

### 10.3 Responsive Design
**Status:** ✅ Implemented

**Breakpoints:**
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (sm-lg)
- Desktop: > 1024px (lg+)

**Responsive Behaviors:**
- Grid layouts: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Sidebar: Overlay (mobile) → Sidebar (desktop)
- Button groups: Stack vertically (mobile) → Horizontal (desktop)
- Card layouts adapt to screen size

---

## 11. Data Model

### 11.1 Current Implementation (React State)
**Status:** ✅ Implemented (Frontend Only)

**User Object:**
```typescript
{
  id: string
  name: string
  email: string
  avatar: string
}
```

**Conversation Object:**
```typescript
{
  id: string
  title: string
  prompt: string
  workflow: string
  assistants: string[]
  timestamp: Date
}
```

**Message Object:**
```typescript
{
  id: string
  role: 'user' | 'assistant'
  content: string
  assistantId?: string
  timestamp: Date
}
```

**Workflow Object:**
```typescript
{
  id: string
  name: string
  description: string
  icon: string
  isCustom: boolean
  usageCount: number
  steps: WorkflowStep[]
}
```

**WorkflowStep Object:**
```typescript
{
  id: string
  title: string
  description: string
  prompt: string
}
```

**Assistant Object:**
```typescript
{
  id: string
  name: string
  description: string
  color: string
  avatar: string
  isCustom: boolean
  systemPrompt: string
  personality: {
    openness: number          // 0-100 scale
    conscientiousness: number // 0-100 scale
    extraversion: number      // 0-100 scale
    agreeableness: number     // 0-100 scale
    neuroticism: number       // 0-100 scale
  }
}
```

**LLM Model Object:**
```typescript
{
  id: string
  name: string
  provider: string
  description: string
  speed: 'fast' | 'medium' | 'slow'
  cost: 'low' | 'medium' | 'high'
  capabilities: string[]
  enabled: boolean
}
```

**Team Member Object:**
```typescript
{
  id: string
  name: string
  email: string
  avatar: string
  role: 'owner' | 'admin' | 'member'
  status: 'active' | 'pending'
  joinedDate: string
}
```

### 11.2 Storage
**Current:** In-memory React state (data lost on refresh)  
**Future:** Supabase database with persistent storage

---

## 12. Design System

### 12.1 Color Palette

**Primary Colors:**
- Purple: `bg-purple-500`, `bg-purple-50`
- Blue: `bg-blue-500`, `bg-blue-50`

**Assistant Colors:**
- Purple (`bg-purple-500`): All Rounder
- Blue (`bg-blue-600`): Product Manager
- Indigo (`bg-indigo-600`): Writing Coach
- Pink (`bg-pink-600`): Marketing Expert
- Green (`bg-green-600`): Productivity Coach
- Amber (`bg-amber-700`): Leadership Expert
- Violet (`bg-violet-600`): Visionary Strategist
- Slate (`bg-slate-600`): Methodical Proofreader
- Emerald (`bg-emerald-700`): Finance Guru
- Fuchsia (`bg-fuchsia-600`): Creative Innovator
- Blue (`bg-blue-700`): Tech Troubleshooter
- Cyan (`bg-cyan-600`): Science Communicator
- Gray (`bg-gray-700`): Legal Analyst
- Teal (`bg-teal-700`): Data Analyst
- Orange: Custom user-created assistants

**Semantic Colors:**
- Success: Green
- Warning: Yellow/Orange
- Error: Red
- Info: Blue

**Neutral Colors:**
- Gray scale (50-900)
- White backgrounds
- Gray borders

### 12.2 Typography

**Implementation:** Custom typography in `styles/globals.css`

**Headings:**
- H1: Large, serif font for main page titles
- H2: Section headings
- H3: Card titles, subsection headings

**Body Text:**
- Default font stack
- Responsive sizing
- Optimal line-height for readability

**Special Typography:**
- Serif font for main question: "What are you trying to solve today?"
- Font family: Georgia, serif

### 12.3 Components (Shadcn/ui)

**Used Components:**
- Accordion
- Alert Dialog
- Avatar
- Badge
- Button
- Card
- Checkbox
- Dialog
- Dropdown Menu
- Input
- Label
- Progress
- Select
- Separator
- Sheet
- Sidebar
- Slider (for AI Assistant configuration)
- Switch
- Table
- Tabs
- Textarea
- Tooltip

**Component Variants:**
- Button: default, outline, ghost
- Badge: default, secondary
- Card: default with various background gradients

### 12.4 Icons

**Library:** Lucide React

**Commonly Used Icons:**
- Lightbulb: Ideation, creativity
- Sparkles: AI, magic, start action
- Send: Submit message
- Paperclip: Attachments
- Mic: Voice input
- Plus: Add/create
- Pencil: Edit
- Check/X: Confirm/cancel
- Share2: Share functionality
- UserPlus: Invite users
- MoreVertical: More options

### 12.5 Spacing & Layout

**Container:**
- Max width: `max-w-5xl` for main content
- Padding: `px-4 sm:px-6 lg:px-8`

**Gaps:**
- Small: `gap-2`
- Medium: `gap-4`
- Large: `gap-6`, `gap-8`

**Margins:**
- Section spacing: `mb-6`, `mb-8`
- Card spacing: `p-4`, `p-6`

---

## 13. User Flows

### 13.1 New User Onboarding
1. Land on signup page
2. Click "Continue with Google" or "Continue with Apple"
3. Authenticate via OAuth
4. Redirect to home page
5. See default "All Rounder" assistant selected
6. View preset prompts for quick start
7. Either select preset or type custom prompt
8. Click "Start weaving" to begin conversation

### 13.2 Starting a Conversation
1. From home page
2. Optionally select workflow (default: Ideation)
3. Optionally select assistants (default: All Rounder)
4. Choose preset prompt or type custom prompt
5. Click "Start weaving"
6. Navigate to conversation view
7. AI may ask for additional context
8. Provide context
9. Receive responses from selected assistants
10. Continue conversation with follow-ups

### 13.3 Creating Custom Workflow
1. Navigate to Workflows page (or click "Create new workflow" on home)
2. Click "Create New Workflow"
3. Enter workflow name and description
4. Add workflow steps (minimum 1)
5. For each step:
   - Enter step title
   - Enter step description
   - Configure AI prompt template
6. Drag to reorder steps
7. Click "Save Workflow"
8. Workflow now available for selection

### 13.4 Creating Custom Assistant
1. Click "Create Assistant" card on home page (or from AI Assistants page)
2. Enter assistant name
3. Enter description
4. Select color theme
5. Add expertise tags
6. Configure system prompt
7. Set personality parameters using sliders
8. Preview assistant in real-time
9. Click "Save Assistant"
10. Assistant now available for selection

### 13.5 Inviting Team Members
1. Navigate to Team page
2. Click "Invite Member" button
3. Enter email address
4. Select role (Admin or Member)
5. Click "Send Invitation"
6. Invitee receives email
7. Member appears as "Pending" in team list
8. Status changes to "Active" when invitation accepted

### 13.6 Renaming a Conversation
1. Open conversation
2. Click pencil icon next to conversation title
3. Edit title in text field
4. Click check icon to save or X to cancel
5. Title updates in conversation header and sidebar

---

## 14. Technical Specifications

### 14.1 Frontend Stack

**Framework:** React 18+ with TypeScript  
**Build Tool:** Vite  
**Styling:** Tailwind CSS v4.0  
**UI Components:** Shadcn/ui  
**Icons:** Lucide React  
**State Management:** React useState hooks (component-level)

### 14.2 File Structure

```
/
├── App.tsx (Main application entry point)
├── components/
│   ├── account/
│   │   └── AccountPage.tsx
│   ├── assistant/
│   │   ├── AIAssistantEditor.tsx
│   │   ├── AIAssistantsPage.tsx
│   │   └── AssistantCreator.tsx
│   ├── auth/
│   │   └── SignupPage.tsx
│   ├── billing/
│   │   └── BillingPage.tsx
│   ├── context/
│   │   └── ContextBuilder.tsx
│   ├── conversation/
│   │   ├── ContextView.tsx
│   │   └── ConversationView.tsx
│   ├── home/
│   │   └── HomePage.tsx
│   ├── layout/
│   │   └── AppLayout.tsx
│   ├── llms/
│   │   └── SelectLLMsPage.tsx
│   ├── preferences/
│   │   └── PreferencesPage.tsx
│   ├── team/
│   │   └── TeamPage.tsx
│   ├── ui/ (Shadcn components)
│   └── workflow/
│       ├── WorkflowBuilder.tsx
│       └── WorkflowEditor.tsx
└── styles/
    └── globals.css
```

### 14.3 Routing

**Current:** Client-side state-based navigation  
**Implementation:** Page state stored in `App.tsx`  
**Navigation:** Via `onNavigate` function passed to components

**Pages:**
- signup
- home
- conversation
- context
- workflow
- workflow-editor
- preferences
- billing
- llms
- team
- account
- assistant-creator
- ai-assistants
- ai-assistant-editor-{id}

### 14.4 Data Persistence

**Current State:** All data in React state (in-memory)

**Implications:**
- Data lost on page refresh
- No cross-device access
- No real user authentication
- No data sharing between users

**Future Requirements (Supabase):**
- PostgreSQL database for persistent storage
- Real-time subscriptions for collaboration
- Row Level Security for multi-tenancy
- OAuth authentication
- File storage for avatars/attachments

### 14.5 API Integration (Future)

**LLM Integration:**
- OpenAI API (GPT-4, GPT-3.5)
- Anthropic API (Claude 3)
- Google API (Gemini Pro)
- Meta API (Llama 3)

**Features Requiring Backend:**
- Real AI responses (currently mock)
- Conversation persistence
- Workflow execution
- User authentication
- Team collaboration
- Usage tracking
- Billing processing
- File uploads

---

## 15. Recent Updates & Changes

### 15.1 October 23, 2025 Updates

**Workflow Page:**
- ✅ Removed highlight from Ideation workflow box
- ✅ Changed "Manage workflow" to "Edit Workflow" on all workflow cards

**AI Assistants:**
- ✅ Removed "Pragmatist" assistant
- ✅ Moved "Create New AI Assistant" box to end of grid
- ✅ Consistent styling for "Create" box with dashed border

**AI Assistant Editor:**
- ✅ Replaced progress bars with sliders for parameter configuration
- Improved user control over assistant behavior
- More intuitive configuration interface

**Conversation View:**
- ✅ Added conversation rename functionality
- ✅ Implemented tab switching between Conversation and Context views
- Editable conversation titles with save/cancel actions

**Home Page:**
- ✅ Added label "Choose or create a workflow" above workflow buttons
- ✅ Changed "Ask one or more assistants" to "Work with one or more assistants"
- Improved clarity and user guidance

---

## 16. Known Limitations (Current Prototype)

### 16.1 Data & State
- ❌ No data persistence (resets on refresh)
- ❌ In-memory storage only
- ❌ No database integration
- ❌ No cross-device sync

### 16.2 Authentication
- ❌ Mock authentication only
- ❌ No real OAuth implementation
- ❌ No session management
- ❌ No password reset flow

### 16.3 AI Integration
- ❌ No real LLM connections
- ❌ Mock AI responses
- ❌ No actual workflow execution
- ❌ No real assistant personalities

### 16.4 Collaboration
- ❌ No real-time collaboration
- ❌ Sharing creates mock URLs
- ❌ Invitations not actually sent
- ❌ No multi-user support

### 16.5 File Handling
- ❌ Attachment buttons non-functional
-  Voice input not implemented
- ❌ No file storage
- ❌ Avatar uploads not functional

### 16.6 Billing
- ❌ No payment processing
- ❌ Mock usage statistics
- ❌ No plan management
- ❌ Billing history is static

---

## 17. Future Roadmap

### 17.1 Phase 1: Backend Integration
**Priority:** High  
**Timeline:** Q4 2025

**Tasks:**
- [ ] Supabase setup and configuration
- [ ] Database schema design
- [ ] Real OAuth implementation (Google/Apple)
- [ ] User authentication and session management
- [ ] Data persistence for all entities
- [ ] Row Level Security setup

### 17.2 Phase 2: AI Integration
**Priority:** High  
**Timeline:** Q1 2026

**Tasks:**
- [ ] OpenAI API integration
- [ ] Anthropic API integration
- [ ] Google AI API integration
- [ ] Workflow execution engine
- [ ] Assistant personality implementation
- [ ] Context management system
- [ ] Rate limiting and cost controls

### 17.3 Phase 3: Collaboration Features
**Priority:** Medium  
**Timeline:** Q1 2026

**Tasks:**
- [ ] Real-time conversation sharing
- [ ] Team workspace implementation
- [ ] Live collaboration on conversations
- [ ] Comment and annotation system
- [ ] Permission management
- [ ] Activity feeds

### 17.4 Phase 4: Advanced Features
**Priority:** Medium  
**Timeline:** Q2 2026

**Tasks:**
- [ ] File attachment handling
- [ ] Voice input integration
- [ ] Export conversations (PDF, Markdown)
- [ ] Advanced search and filtering
- [ ] Conversation templates
- [ ] Analytics and insights
- [ ] Mobile app (React Native)

### 17.5 Phase 5: Enterprise Features
**Priority:** Low  
**Timeline:** Q3 2026

**Tasks:**
- [ ] SSO integration
- [ ] Custom LLM deployment
- [ ] Advanced team management
- [ ] Usage analytics dashboard
- [ ] API for integrations
- [ ] White-label options
- [ ] Compliance features (SOC2, GDPR)

---

## 18. Success Metrics

### 18.1 User Engagement
- Daily active users (DAU)
- Monthly active users (MAU)
- Conversations per user per week
- Average conversation length
- Workflow usage distribution
- Assistant selection patterns

### 18.2 Product Usage
- Most popular preset prompts
- Custom workflow creation rate
- Custom assistant creation rate
- Multi-assistant usage rate
- Conversation sharing rate
- Team collaboration rate

### 18.3 Business Metrics
- User retention (7-day, 30-day)
- Conversion rate (free to paid)
- Churn rate
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)

### 18.4 Technical Metrics
- API response times
- LLM token usage
- Error rates
- Page load times
- Mobile responsiveness score

---

## 19. Security & Privacy

### 19.1 Data Privacy (Future)
- User data encryption at rest
- Encryption in transit (HTTPS)
- GDPR compliance
- Data retention policies
- User data export capability
- Right to deletion

### 19.2 Access Control
- Role-based access control (RBAC)
- Row Level Security (Supabase)
- API key management
- Session timeout
- Two-factor authentication (future)

### 19.3 Content Safety
- PII detection and warnings
- Content moderation for shared conversations
- LLM safety filters
- Abuse prevention

**Note:** Per current guidelines, Figma Make is not designed for collecting PII or securing highly sensitive data. Users should be informed of limitations.

---

## 20. Accessibility

### 20.1 Current Implementation
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management
- Color contrast compliance

### 20.2 Future Improvements
- Screen reader optimization
- Voice control integration
- High contrast mode
- Font size customization
- Reduced motion option

---

## 21. Internationalization (Future)

### 21.1 Planned Features
- Multi-language UI support
- RTL language support
- Locale-based formatting (dates, numbers)
- Translated preset prompts
- LLM multi-language support

---

## 22. Support & Documentation

### 22.1 User Documentation (Needed)
- Onboarding tutorial
- Help center
- Video tutorials
- Use case examples
- Best practices guide
- FAQ

### 22.2 Technical Documentation
- API documentation (when available)
- Integration guides
- Developer documentation
- Changelog

---

## 23. Competitive Analysis

### 23.1 Key Differentiators
- Multi-assistant perspective system (unique)
- Workflow-based approach to ideation
- Team collaboration on creative thinking
- Pre-built prompt templates for common scenarios
- Customizable AI assistants with personalities
- Context management separate from conversation

### 23.2 Similar Products
- ChatGPT (general AI chat)
- Claude (general AI chat)
- Notion AI (document-focused)
- Miro AI (visual collaboration)

**Thoughtweaver's Edge:**
- Purpose-built for ideation and creative thinking
- Multiple AI perspectives in single conversation
- Structured workflows for repeatable processes
- Team collaboration built-in

---

## 24. Pricing Strategy (Conceptual)

### 24.1 Current Mock Plan
**Pro Plan:** $29/month
- 100 conversations per month
- 5,000 messages per month
- 500 AI sessions
- All assistants included
- Custom workflows
- Team collaboration

### 24.2 Future Tiers (TBD)
**Free:**
- Limited conversations
- Basic assistants only
- Community workflows

**Pro:** 
- As currently mocked

**Enterprise:**
- Unlimited usage
- Custom LLM deployment
- SSO
- Dedicated support
- SLA guarantees

---

## 25. Open Questions & Decisions Needed

### 25.1 Product Decisions
- [ ] Should assistants respond sequentially or in parallel?
- [ ] How to handle very long conversations (pagination/summarization)?
- [ ] Should workflows be shareable between users?
- [ ] Pricing model validation with target users
- [ ] LLM cost management strategy

### 25.2 Technical Decisions
- [ ] Client-side vs server-side LLM calls
- [ ] Real-time vs polling for collaboration
- [ ] File storage limits and pricing
- [ ] CDN strategy for global performance
- [ ] Backup and disaster recovery plan

### 25.3 Design Decisions
- [ ] Dark mode implementation
- [ ] Mobile app or responsive web only
- [ ] Export format options
- [ ] Conversation visualization options
- [ ] Keyboard shortcuts scheme

---

## 26. Appendices

### 26.1 Glossary

**Assistant:** An AI entity with a specific personality and perspective that provides responses in conversations

**Conversation:** A thread of messages between user and one or more AI assistants

**Context:** Additional background information provided to AI assistants to inform their responses

**Workflow:** A structured sequence of steps for ideation or problem-solving

**Preset Prompt:** Pre-written prompt template for common use cases

**All Rounder:** Default assistant with balanced perspective

**Weaving:** The process of engaging with AI to develop ideas (brand terminology)

### 26.2 Change Log

**October 27, 2025 - Latest Update:**
- ✅ **UPDATED: Team Management Hidden for Release 1**
  - Team navigation item removed from sidebar (commented out in code)
  - Team functionality marked for Release 2 (R2)
  - Section 9 (Team Management) updated with R2 status indicator
  - Navigation section updated to reflect R1 vs R2 features
  - Team page and all related functionality remain implemented but hidden
  - Planned enhancements for R2 include:
    - Team workspace management
    - Shared conversation access
    - Team-level AI assistant library
    - Usage tracking per team member
    - Team billing and subscription management

**October 24, 2025 - Previous Update:**
- ✅ **ENHANCED: Spider/Radar Chart Personality Visualization**
  - Replaced slider-based trait display with interactive radar charts on AI Assistants page
  - Implemented Big 5 Personality Traits (OCEAN model):
    - **Openness to Experience:** Creativity, curiosity, willingness to try new things
    - **Conscientiousness:** Organization, discipline, reliability
    - **Extraversion:** Sociability, assertiveness, enthusiasm
    - **Agreeableness:** Cooperation, empathy, trust
    - **Emotional Stability:** Inverted neuroticism - calmness, confidence, stability
  - Each assistant displays 200px radar chart with 5 axes
  - Charts color-coded to match assistant theme colors
  - Semi-transparent fill (0.6 opacity) for easy visual comparison
  - Personality scores inferred from assistant descriptions and behavior:
    - **All Rounder:** Balanced (60/60/50/60/60)
    - **Creative:** Very high openness (95), moderate extraversion/agreeableness (70)
    - **Analytical:** Very high conscientiousness (95), lower extraversion (30), high stability (70)
    - **Devil's Advocate:** High openness/conscientiousness (85/80), very low agreeableness (25)
    - **Optimist:** High extraversion/agreeableness (85/90), very high stability (80)
  - Updated assistantData.ts structure to use personality object instead of traits
  - Powered by Recharts library with RadarChart component
  
- ✅ **ENHANCED: AI Assistant Editor with System Prompts**
  - Editor now loads actual assistant data when editing existing assistants
  - Uses `getAssistantById()` helper function from assistantData.ts
  - Form fields pre-populate with assistant's current values
  - Added **System Prompt** field as dedicated editable section
  - System Prompt textarea features:
    - 8-row height for detailed instructions
    - Monospace font (font-mono) for better code/prompt readability
    - Located between Knowledge & Expertise and Personality sections
    - Placeholder text guides users on what to include
  - Full integration with centralized assistant data
  - Ready for AI backend implementation
  
- ✅ **UPDATED: Devil's Advocate Assistant Content**
  - Updated description to be more comprehensive and engaging
  - New description: "Get your convictions and ideas scrutinized by this skilled Devil's Advocate who gracefully presents counter-arguments, questions assumptions, and opens up new perspectives that challenge the status quo."
  - Added detailed system prompt with specific instructions for:
    - Presenting counter-arguments and challenging prevailing opinions
    - Questioning assumptions and beliefs behind decisions
    - Using logical reasoning and creative thinking
    - Providing specific examples, analogies, and case studies
    - Engaging in constructive dialogue
    - Enhancing decision-making quality
  - Created shared assistant data file (`/components/assistant/assistantData.ts`)
  - All assistants now have system prompts for future AI integration
  - Updated HomePage and AIAssistantsPage to use centralized data

- ✅ **UPDATED: Modal-Based Workflow and Prompt Selection**
  - Changed Workflow dropdown to button with modal dialog
  - Changed Example prompts dropdown to button with modal dialog
  - Both buttons now trigger Dialog modals instead of Select dropdowns
  - **Workflow Modal:**
    - 500px max width centered dialog
    - Title: "Select Workflow"
    - Grid of clickable cards with workflow icons and names
    - Selected workflow highlighted with purple border and background
    - Auto-closes after selection
    - Button label shows selected workflow name
  - **Example Prompts Modal:**
    - 600px max width, 80vh max height, scrollable
    - Title: "Example Prompts"
    - Grid of clickable cards with prompt labels and 2-line previews
    - Hover state with purple border
    - Auto-closes after selection and populates textarea
  - Improved discoverability and visibility of options
  - Better mobile experience with full modal dialogs
  - More scannable interface showing all options at once

**October 23, 2025 - Previous Updates:**
- ✅ **UPDATED: Minimalist LLM Model Selector Popover**
  - Removed "Select LLM Model" heading from popover
  - Removed "Choose one model to use" description text
  - Created cleaner, more minimalist popover design with radio buttons only
  - Improved visual simplicity and reduced UI clutter
  - Users can immediately see and select their model without reading instructional text
  - Follows principle of self-evident design

- ✅ **UPDATED: LLM Model Selection Changed to Single-Select**
  - Changed from multi-select checkboxes to single-select radio buttons
  - Users can now only select one LLM model at a time
  - Button displays selected model name instead of count
  - Simplified model selection experience
  - Updated state management from `selectedLLMs` array to `selectedLLM` string
  - All pages (HomePage, SelectLLMsPage) updated to use single selection

- ✅ **NEW: Workflow Dropdown on Home Page**
  - Added Workflow dropdown selector next to Example prompts dropdown
  - Positioned on the left side, grouped with Example prompts and "Improve my prompt" button
  - Shows available workflows: Ideation, Problem Solving, Brainstorming, Decision Making
  - Allows users to select workflow directly from home page before starting conversation
  - Dropdown width: 180px matching Example prompts dropdown
  - State-controlled dropdown shows currently selected workflow

- ✅ **NEW: Right-Aligned Model Selector**
  - Moved LLM model selector to the right side of the button row
  - Used `ml-auto` class to create visual separation from left-side controls
  - Creates clear distinction between prompt setup controls (left) and model selection (right)
  - Improved layout balance and visual hierarchy
  - Makes the interface more scannable and organized

- ✅ **NEW: "Build my own prompt" Template**
  - Added as first option in Example prompts dropdown
  - Provides structured template with 9 fields for comprehensive prompt building
  - Fields: Persona, Context, Audience, Instructions, Style, Format, Examples, Variability, Constraints
  - Each field on its own line with colon separator
  - Helps users create well-structured, professional prompts from scratch
  - Template can be filled in by users to guide AI responses more effectively

- ✅ **NEW: Assistant Description Display**
  - Click on any assistant button to reveal its one-line description
  - Description appears below the assistant button row
  - Gray text showing the most recently clicked assistant's description
  - Updates dynamically when different assistants are clicked
  - Helps users understand each assistant's specialty before starting a conversation

- ✅ **NEW: Example Prompts Dropdown**
  - Added "Example prompts" dropdown selector to the left of "Improve my prompt" button
  - Pre-populated with 7 example prompts covering common use cases
  - Examples: Build my own prompt (NEW), Test my thinking, Help me brainstorm ideas, Challenge my assumptions, Find blind spots, Explore perspectives, Refine my concept
  - Selecting an example automatically populates the prompt textarea with full context and challenge
  - Helps users get started quickly with structured, high-quality prompts

- ✅ **REDESIGN: Compact Assistant Selection Inside Prompt Card**
  - Moved AI assistant selection boxes inside the prompt input card
  - Reduced assistant box size by 50% (from 48px to 24px avatars)
  - Changed from grid cards to horizontal pill-style buttons
  - Positioned below "Improve my prompt" and model selector buttons
  - Flex-wrap layout for responsive arrangement
  - Purple ring and background highlight on selection
  - "Create Assistant" button also in compact pill style
  - **Start Weaving button: Regular size, right-aligned (not full-width)**
  - Streamlined single-card interface for entire home page interaction

- ✅ **NEW: Workflow Recommendation Sidebar on Conversation Screen**
  - Added intelligent problem type detection based on user's initial prompt
  - Right column (320px wide) displays recommended workflow with 4-5 steps
  - 5 problem types: Creative Ideation, Decision Making, Problem Solving, Strategic Planning, General Exploration
  - Each type has unique icon and customized workflow steps
  - Purple-themed card design matching app branding
  - Visible on desktop (lg+), hidden on mobile/tablet for optimal mobile UX
  - "View All Workflows" button navigates to workflows page
  - Sticky positioning within conversation view

- ✅ **NEW: "Improve my prompt" Button**
  - Added "Improve my prompt" button with Wand2 icon
  - Positioned to the left of the model selector button
  - Grouped together with model selector on left side of prompt card
  - UI ready for AI-powered prompt improvement functionality
  
- ✅ **Hidden Preset Prompts on Home Page**
  - Removed "Help me build my prompt..." section from home page
  - Preset prompts still exist in code for potential future use
  - Further simplified home page to focus only on assistants and prompt input
  
- ✅ **Hidden Workflow Selection on Home Page**
  - Removed "Choose or create a workflow" section from home page
  - Workflow selection still available via Workflows page in sidebar
  - Simplified home page focus on assistants and prompts
  
- ✅ **LLM Model Selection Dropdown**
  - Added compact LLM model selector inline with "Start weaving" button
  - Popover dropdown with checkbox selection
  - 6 models available: Claude 3 Opus (default), GPT-4, Claude 3 Sonnet, Gemini Pro, GPT-3.5 Turbo, Llama 3 70B
  - Multi-select with minimum 1 model required
  - Button shows selected model name or "X models selected"
  - State management integrated with App.tsx
  - Syncs with Select LLMs configuration page

**October 23, 2025 - Earlier Updates:**
- Added "Choose or create a workflow" label
- Changed "Ask" to "Work with" in assistants section
- Removed highlight from Ideation workflow box
- Changed "Manage workflow" to "Edit Workflow"
- Removed Pragmatist assistant
- Moved Create Assistant box to end
- Replaced progress bars with sliders in AI Assistant Editor

**Previous updates:** (Documented in conversation history)
- Conversation rename functionality
- Tab switching (Conversation/Context)
- Multiple UI refinements

### 26.3 References
- Tailwind CSS Documentation
- Shadcn/ui Component Library
- Lucide Icons Library
- React Documentation
- Supabase Documentation (for future implementation)

---

**Document End**

*This PRD represents the current state of the Thoughtweaver prototype as of October 27, 2025. It is a living document and should be updated as the product evolves.*