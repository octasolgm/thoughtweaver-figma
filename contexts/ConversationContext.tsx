import { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '../components/projects/ProjectsPage';

export interface Conversation {
  id: string;
  title: string;
  prompt: string;
  workflow: string;
  assistants: string[];
  timestamp: Date;
}

interface ConversationContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentPrompt: string;
  projects: Project[];
  
  // Conversation actions
  createConversation: (prompt: string, workflow: string, assistants: string[]) => Conversation;
  viewConversation: (conversationId: string) => void;
  updateConversationTitle: (conversationId: string, newTitle: string) => void;
  setCurrentPrompt: (prompt: string) => void;
  getActiveConversation: () => Conversation | undefined;
  
  // Project actions
  createProject: (name: string, description: string) => void;
  deleteProject: (projectId: string) => void;
  addConversationToProject: (conversationId: string, projectId: string) => void;
  removeConversationFromProject: (conversationId: string, projectId: string) => void;
  createConversationInProject: (projectId: string, workflow: string, assistants: string[]) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// Helper function to generate a title from the prompt
const generateTitle = (prompt: string): string => {
  const cleanedPrompt = prompt.replace(/CONTEXT:\s*/gi, '').replace(/CHALLENGE:\s*/gi, '');
  const firstLine = cleanedPrompt.split('\n').find(line => line.trim().length > 0) || cleanedPrompt;
  const title = firstLine.substring(0, 60).trim();
  return title.length < firstLine.length ? title + '...' : title;
};

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

  const createConversation = (prompt: string, workflow: string, assistants: string[]): Conversation => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: generateTitle(prompt),
      prompt,
      workflow: workflow || 'ideation',
      assistants: [...assistants],
      timestamp: new Date(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setCurrentPrompt(prompt);
    
    return newConversation;
  };

  const viewConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      setCurrentPrompt(conversation.prompt);
      // Note: Workflow and assistants selection should also be updated
      // but we don't have access to SelectionContext here
      // This will be handled by the component that calls viewConversation
    }
  };

  const updateConversationTitle = (conversationId: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, title: newTitle }
          : conv
      )
    );
  };

  const getActiveConversation = () => {
    return conversations.find(c => c.id === activeConversationId);
  };

  // Project management
  const createProject = (name: string, description: string) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      conversationIds: [],
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const addConversationToProject = (conversationId: string, projectId: string) => {
    setProjects(prev =>
      prev.map(proj =>
        proj.id === projectId
          ? { ...proj, conversationIds: [...proj.conversationIds, conversationId] }
          : proj
      )
    );
  };

  const removeConversationFromProject = (conversationId: string, projectId: string) => {
    setProjects(prev =>
      prev.map(proj =>
        proj.id === projectId
          ? { ...proj, conversationIds: proj.conversationIds.filter(id => id !== conversationId) }
          : proj
      )
    );
  };

  const createConversationInProject = (projectId: string, workflow: string, assistants: string[]) => {
    const prompt = `New conversation in project`;
    const newConversation = createConversation(prompt, workflow, assistants);
    addConversationToProject(newConversation.id, projectId);
  };

  const value = {
    conversations,
    activeConversationId,
    currentPrompt,
    projects,
    createConversation,
    viewConversation,
    updateConversationTitle,
    setCurrentPrompt,
    getActiveConversation,
    createProject,
    deleteProject,
    addConversationToProject,
    removeConversationFromProject,
    createConversationInProject,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}
