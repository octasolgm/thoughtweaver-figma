# Developer Guide
## Thoughtweaver v1.4

**Quick reference for developers working on Thoughtweaver**

---

## 🚀 Quick Start

### Project Structure
```
/Thoughtweaver
├── App.tsx                 # Main application entry point
├── components/             # React components
│   ├── shared/            # Reusable components (NEW in v1.4)
│   ├── ui/                # shadcn/ui components
│   ├── home/              # Home page components
│   ├── conversation/      # Conversation components
│   ├── assistant/         # Assistant components
│   └── ...
├── contexts/              # Context providers (NEW in v1.2)
├── hooks/                 # Custom hooks (NEW in v1.4)
├── constants/             # App constants (NEW in v1.4)
├── types/                 # Type definitions (NEW in v1.4)
└── styles/               # Global styles
```

---

## 📦 Import Patterns

### Use Centralized Exports
```tsx
// ✅ Good - Use centralized exports
import { useNavigate, useConversation } from '../hooks';
import { useAuth, useNavigation } from '../contexts';
import { DEFAULT_LLM, WORKFLOWS } from '../constants';
import { User, Conversation, Assistant } from '../types';

// ❌ Avoid - Direct imports
import { useNavigate } from '../hooks/useNavigate';
import { AuthContext } from '../contexts/AuthContext';
```

### Component Imports
```tsx
// UI Components
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';

// Shared Components
import { PageHeader } from './components/shared/PageHeader';

// Icons
import { Plus, Settings, User } from 'lucide-react';
```

---

## 🎨 Creating New Pages

### Template for New Page Component
```tsx
import { Button } from '../ui/button';
import { PageHeader } from '../shared/PageHeader';
import { useNavigate } from '../../hooks';

export function MyNewPage() {
  const { navigate } = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <PageHeader 
        title="My New Page"
        action={
          <Button onClick={() => console.log('Action')}>
            Action
          </Button>
        }
      />
      
      <main className="flex-1 overflow-auto p-6">
        {/* Page content */}
      </main>
    </div>
  );
}
```

### Using PageHeader Component
```tsx
// Simple header
<PageHeader title="Page Title" />

// With action button
<PageHeader 
  title="Settings" 
  action={<Button>Save</Button>}
/>

// With back button
<PageHeader 
  title="Edit Assistant" 
  backButton 
  onBack={() => navigate('ai-assistants')}
/>

// With custom title content
<PageHeader 
  title={
    isEditing ? (
      <Input value={title} onChange={handleChange} />
    ) : (
      <h2>{title}</h2>
    )
  }
/>
```

---

## 🔧 Using Custom Hooks

### Navigation
```tsx
import { useNavigate } from '../hooks';

function MyComponent() {
  const { navigate, currentPage, goBack, goHome } = useNavigate();

  return (
    <>
      <Button onClick={() => navigate('home')}>Home</Button>
      <Button onClick={goBack}>Back</Button>
      {currentPage === 'home' && <p>You're home!</p>}
    </>
  );
}
```

### Conversation Management
```tsx
import { useConversation } from '../hooks';

function ConversationManager() {
  const { 
    conversation, 
    updateTitle, 
    createConversation,
    deleteConversation,
    searchConversations 
  } = useConversation('conv-123');

  const handleCreate = () => {
    createConversation({
      title: 'New Conversation',
      prompt: 'Tell me about...',
      workflow: 'ideation',
      assistants: ['all-rounder']
    });
  };

  return (
    <div>
      <h1>{conversation?.title}</h1>
      <Button onClick={() => updateTitle('New Title')}>
        Rename
      </Button>
      <Button onClick={handleCreate}>New</Button>
    </div>
  );
}
```

### Assistant Selection
```tsx
import { useAssistantSelection } from '../hooks';

function AssistantSelector() {
  const { 
    selectedAssistants,
    toggleAssistant,
    isSelected,
    canSelectMore,
    remainingSlots
  } = useAssistantSelection();

  return (
    <div>
      <p>Selected: {selectedAssistants.length}</p>
      <p>Remaining: {remainingSlots}</p>
      
      <Button 
        onClick={() => toggleAssistant('all-rounder')}
        disabled={!canSelectMore && !isSelected('all-rounder')}
      >
        {isSelected('all-rounder') ? 'Deselect' : 'Select'}
      </Button>
    </div>
  );
}
```

---

## 🎯 Using Context Providers

### Available Contexts
```tsx
import { 
  useAuth,           // User authentication
  useNavigation,     // Page navigation
  useConversation,   // Conversation state (context-level)
  useSelection       // Workflow & assistant selection
} from '../contexts';
```

### Auth Context
```tsx
const { user, login, logout, isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <LoginPage />;
}

return <p>Welcome, {user.name}!</p>;
```

### Navigation Context
```tsx
const { currentPage, setCurrentPage } = useNavigation();

// Direct usage (or use useNavigate hook for better API)
setCurrentPage('home');
```

### Selection Context
```tsx
const { 
  selectedWorkflow, 
  setSelectedWorkflow,
  selectedAssistants,
  setSelectedAssistants,
  selectedLLM,
  setSelectedLLM
} = useSelection();
```

---

## 📋 Using Constants

### Instead of Magic Strings
```tsx
import { 
  DEFAULT_LLM, 
  DEFAULT_ASSISTANT,
  WORKFLOWS,
  PAGES,
  MAX_ASSISTANT_SELECTION
} from '../constants';

// ❌ Don't do this
const llm = 'claude-3-opus';
const workflow = 'build-as-we-go';

// ✅ Do this
const llm = DEFAULT_LLM;
const workflow = WORKFLOWS.BUILD_AS_WE_GO;

// Type-safe and autocomplete friendly
navigate(PAGES.HOME);
navigate(PAGES.AI_ASSISTANTS);
```

### Available Constant Groups
- **Defaults:** `DEFAULT_LLM`, `DEFAULT_ASSISTANT`, `DEFAULT_WORKFLOW`
- **Workflows:** `WORKFLOWS.BUILD_AS_WE_GO`, `WORKFLOWS.IDEATION`, etc.
- **Pages:** `PAGES.HOME`, `PAGES.CONVERSATION`, etc.
- **Layout:** `HEADER_HEIGHT`, `SIDEBAR_WIDTH`
- **Limits:** `MAX_ASSISTANT_SELECTION`, `FREE_TIER_MESSAGE_LIMIT`
- **Features:** `FEATURES.TEAM_COLLABORATION`, etc.

---

## 📝 Type Definitions

### Using Centralized Types
```tsx
import { User, Conversation, Assistant, Workflow } from '../types';

// Components
interface MyComponentProps {
  user: User;
  conversation: Conversation;
  onSelect: (assistant: Assistant) => void;
}

// State
const [user, setUser] = useState<User | null>(null);
const [conversations, setConversations] = useState<Conversation[]>([]);

// Functions
function processConversation(conv: Conversation): void {
  // Full type safety and IntelliSense
  console.log(conv.title, conv.prompt, conv.assistants);
}
```

### Available Types
- **User:** User account info
- **Conversation:** Chat session
- **Message:** Individual message
- **Assistant:** AI assistant config
- **Workflow:** Workflow definition
- **Project:** Project organization
- **LLMModel:** LLM configuration
- **TeamMember:** Team member info
- **Subscription:** Billing info
- **UserPreferences:** User settings

---

## 🎨 Styling Guidelines

### Tailwind CSS
```tsx
// ❌ Don't use font size/weight classes (we have global styles)
<h1 className="text-2xl font-bold">Title</h1>

// ✅ Use semantic HTML and let globals handle it
<h1>Title</h1>

// ✅ Use Tailwind for layout, spacing, colors
<div className="flex gap-4 p-6 bg-white rounded-lg">
  <Button className="bg-purple-600">Click</Button>
</div>
```

### Color Palette
- **Primary:** `purple-600`, `purple-500`
- **Secondary:** `gray-600`, `gray-500`
- **Success:** `green-600`, `green-500`
- **Warning:** `yellow-600`, `yellow-500`
- **Error:** `red-600`, `red-500`

---

## 🔍 Common Patterns

### Form Handling
```tsx
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

function MyForm() {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="field">Field Label</Label>
        <Input 
          id="field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Loading States
```tsx
import { Suspense, lazy } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
}
```

### Modal Dialogs
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

function MyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <div>Dialog content</div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🧪 Testing (Future)

### Unit Tests
```tsx
import { renderHook } from '@testing-library/react';
import { useNavigate } from '../hooks';

describe('useNavigate', () => {
  it('should navigate to page', () => {
    const { result } = renderHook(() => useNavigate());
    result.current.navigate('home');
    expect(result.current.currentPage).toBe('home');
  });
});
```

---

## 📚 Documentation

### JSDoc Comments
```tsx
/**
 * Component description
 * 
 * @param props - Component props
 * @returns React component
 * 
 * @example
 * ```tsx
 * <MyComponent title="Hello" />
 * ```
 */
export function MyComponent({ title }: { title: string }) {
  return <h1>{title}</h1>;
}
```

---

## 🔗 Related Documents

- **[OPTIMIZATION.md](./OPTIMIZATION.md)** - Optimization roadmap and history
- **[VERSION.md](./VERSION.md)** - Version history and changelog
- **[Architecture.md](./Architecture.md)** - Technical architecture
- **[PRD.md](./PRD.md)** - Product requirements
- **[PHASE4_SUMMARY.md](./PHASE4_SUMMARY.md)** - Phase 4 implementation details

---

## 💡 Tips & Best Practices

### DO ✅
- Use custom hooks for reusable logic
- Import from centralized exports
- Use constants instead of magic strings
- Use types from `/types/index.ts`
- Add JSDoc comments to new components
- Use PageHeader for page headers
- Keep components under 200 lines

### DON'T ❌
- Don't drill props more than 2-3 levels
- Don't create duplicate components
- Don't use magic strings/numbers
- Don't override global typography styles
- Don't create new type definitions inline
- Don't skip documentation

---

## 🆘 Need Help?

### Common Issues

**Q: How do I add a new page?**  
A: Create component in `/components/[category]/`, add to lazy imports in `App.tsx`, add page constant to `/constants/index.ts`

**Q: How do I navigate between pages?**  
A: Use `useNavigate()` hook: `const { navigate } = useNavigate(); navigate('page-name');`

**Q: How do I access user data?**  
A: Use `useAuth()` hook: `const { user, isAuthenticated } = useAuth();`

**Q: How do I manage conversations?**  
A: Use `useConversation()` hook for conversation operations

**Q: Where do I add new constants?**  
A: Add to `/constants/index.ts` in the appropriate section

---

**Last Updated:** October 28, 2025  
**Version:** 1.4  
**Maintained By:** Development Team
