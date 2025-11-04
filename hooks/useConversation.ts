/**
 * useConversation Hook
 * 
 * Custom hook for managing conversation state and operations.
 * Provides a clean API for working with conversations.
 */

import { useConversationContext } from '../contexts';

/**
 * Hook for managing conversation state and operations
 * 
 * @param conversationId - Optional conversation ID to work with
 * 
 * @example
 * ```tsx
 * function ConversationComponent() {
 *   const { conversation, updateTitle, addMessage } = useConversation('conv-123');
 *   
 *   return (
 *     <div>
 *       <h1>{conversation?.title}</h1>
 *       <Button onClick={() => updateTitle('New Title')}>
 *         Rename
 *       </Button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useConversation(conversationId?: string | null) {
  const {
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
  } = useConversationContext();

  // Get the specific conversation (use active if no ID provided)
  const targetId = conversationId ?? activeConversationId;
  const conversation = targetId
    ? conversations.find((c) => c.id === targetId)
    : null;

  /**
   * Update the title of a conversation
   * 
   * @param newTitle - New title for the conversation
   * @param id - Optional conversation ID (defaults to current)
   */
  const updateTitle = (newTitle: string, id?: string) => {
    const updateId = id ?? targetId;
    if (!updateId) return;

    setConversations(
      conversations.map((conv) =>
        conv.id === updateId ? { ...conv, title: newTitle } : conv
      )
    );
  };

  /**
   * Update the prompt of a conversation
   * 
   * @param newPrompt - New prompt text
   * @param id - Optional conversation ID (defaults to current)
   */
  const updatePrompt = (newPrompt: string, id?: string) => {
    const updateId = id ?? targetId;
    if (!updateId) return;

    setConversations(
      conversations.map((conv) =>
        conv.id === updateId ? { ...conv, prompt: newPrompt } : conv
      )
    );
  };

  /**
   * Delete a conversation
   * 
   * @param id - Optional conversation ID (defaults to current)
   */
  const deleteConversation = (id?: string) => {
    const deleteId = id ?? targetId;
    if (!deleteId) return;

    setConversations(conversations.filter((conv) => conv.id !== deleteId));

    // Clear active conversation if it was deleted
    if (activeConversationId === deleteId) {
      setActiveConversationId(null);
    }
  };

  /**
   * Set a conversation as active
   * 
   * @param id - Conversation ID to set as active
   */
  const setActive = (id: string) => {
    setActiveConversationId(id);
  };

  /**
   * Create a new conversation
   * 
   * @param conversationData - Initial conversation data
   * @returns The created conversation
   */
  const createConversation = (conversationData: {
    title: string;
    prompt: string;
    workflow: string;
    assistants: string[];
    llm?: string;
  }) => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      timestamp: new Date(),
      ...conversationData,
    };

    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);

    return newConversation;
  };

  /**
   * Get conversations sorted by timestamp
   * 
   * @param limit - Optional limit on number of conversations
   * @returns Sorted array of conversations
   */
  const getRecentConversations = (limit?: number) => {
    const sorted = [...conversations].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    return limit ? sorted.slice(0, limit) : sorted;
  };

  /**
   * Search conversations by title or prompt
   * 
   * @param query - Search query string
   * @returns Filtered array of conversations
   */
  const searchConversations = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(lowerQuery) ||
        conv.prompt.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    /** Current conversation (null if not found) */
    conversation,
    /** All conversations */
    conversations,
    /** Currently active conversation ID */
    activeConversationId,
    /** Update conversation title */
    updateTitle,
    /** Update conversation prompt */
    updatePrompt,
    /** Delete a conversation */
    deleteConversation,
    /** Set a conversation as active */
    setActive,
    /** Create a new conversation */
    createConversation,
    /** Get recent conversations */
    getRecentConversations,
    /** Search conversations */
    searchConversations,
  };
}
