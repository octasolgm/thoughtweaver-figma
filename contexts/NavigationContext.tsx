import { createContext, useContext, useState, ReactNode } from 'react';

export type Page = 
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
  | 'projects' 
  | string;

interface NavigationContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
  goBack: () => void;
  previousPage: Page | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('signup');
  const [previousPage, setPreviousPage] = useState<Page | null>(null);

  const navigate = (page: Page) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
    }
  };

  const value = {
    currentPage,
    navigate,
    goBack,
    previousPage,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
