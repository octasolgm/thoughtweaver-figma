import { createContext, useContext, useState, ReactNode } from 'react';

interface SelectionContextType {
  selectedWorkflow: string;
  selectedAssistants: string[];
  selectedLLM: string;
  
  setSelectedWorkflow: (workflow: string) => void;
  setSelectedAssistants: (assistants: string[]) => void;
  toggleAssistant: (assistantId: string) => void;
  setSelectedLLM: (llm: string) => void;
  isAssistantSelected: (assistantId: string) => boolean;
  resetSelections: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

const DEFAULT_WORKFLOW = 'build-as-we-go';
const DEFAULT_ASSISTANTS = ['all-rounder'];
const DEFAULT_LLM = 'claude-3-opus';

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedWorkflow, setSelectedWorkflow] = useState(DEFAULT_WORKFLOW);
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>(DEFAULT_ASSISTANTS);
  const [selectedLLM, setSelectedLLM] = useState(DEFAULT_LLM);

  const toggleAssistant = (assistantId: string) => {
    setSelectedAssistants(prev => {
      if (prev.includes(assistantId)) {
        // Don't allow removing the last assistant
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== assistantId);
      } else {
        return [...prev, assistantId];
      }
    });
  };

  const isAssistantSelected = (assistantId: string) => {
    return selectedAssistants.includes(assistantId);
  };

  const resetSelections = () => {
    setSelectedWorkflow(DEFAULT_WORKFLOW);
    setSelectedAssistants(DEFAULT_ASSISTANTS);
    setSelectedLLM(DEFAULT_LLM);
  };

  const value = {
    selectedWorkflow,
    selectedAssistants,
    selectedLLM,
    setSelectedWorkflow,
    setSelectedAssistants,
    toggleAssistant,
    setSelectedLLM,
    isAssistantSelected,
    resetSelections,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}
