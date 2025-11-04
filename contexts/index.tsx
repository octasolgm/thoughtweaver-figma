/**
 * Context Providers - v1.2 Architecture Refactoring
 * 
 * Centralized state management using React Context API
 * Eliminates prop drilling and improves component testability
 */

import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { NavigationProvider } from './NavigationContext';
import { ConversationProvider } from './ConversationContext';
import { SelectionProvider } from './SelectionContext';

// Export all contexts and hooks
export { useAuth } from './AuthContext';
export { useNavigation } from './NavigationContext';
export { useConversation } from './ConversationContext';
export { useSelection } from './SelectionContext';

// Export types
export type { User } from './AuthContext';
export type { Page } from './NavigationContext';
export type { Conversation } from './ConversationContext';

/**
 * Combined provider that wraps all context providers
 * Usage: Wrap your app with <AppProviders> in App.tsx
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NavigationProvider>
        <SelectionProvider>
          <ConversationProvider>
            {children}
          </ConversationProvider>
        </SelectionProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}
