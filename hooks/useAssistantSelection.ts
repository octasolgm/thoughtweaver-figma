/**
 * useAssistantSelection Hook
 * 
 * Custom hook for managing assistant selection state.
 * Handles multi-select logic and validation.
 */

import { useSelectionContext } from '../contexts';
import { MAX_ASSISTANT_SELECTION } from '../constants';

/**
 * Hook for managing assistant selection
 * 
 * @example
 * ```tsx
 * function AssistantSelector() {
 *   const { 
 *     selectedAssistants, 
 *     toggleAssistant, 
 *     isSelected,
 *     canSelectMore 
 *   } = useAssistantSelection();
 *   
 *   return (
 *     <Button 
 *       onClick={() => toggleAssistant('all-rounder')}
 *       disabled={!canSelectMore && !isSelected('all-rounder')}
 *     >
 *       {isSelected('all-rounder') ? 'Deselect' : 'Select'}
 *     </Button>
 *   );
 * }
 * ```
 */
export function useAssistantSelection() {
  const { selectedAssistants, setSelectedAssistants } = useSelectionContext();

  /**
   * Check if an assistant is currently selected
   * 
   * @param id - Assistant ID to check
   * @returns true if assistant is selected
   */
  const isSelected = (id: string): boolean => {
    return selectedAssistants.includes(id);
  };

  /**
   * Toggle assistant selection
   * 
   * @param id - Assistant ID to toggle
   * @returns true if operation succeeded
   */
  const toggleAssistant = (id: string): boolean => {
    if (isSelected(id)) {
      // Remove from selection
      setSelectedAssistants(selectedAssistants.filter((a) => a !== id));
      return true;
    } else {
      // Check if we can add more
      if (selectedAssistants.length >= MAX_ASSISTANT_SELECTION) {
        return false;
      }
      // Add to selection
      setSelectedAssistants([...selectedAssistants, id]);
      return true;
    }
  };

  /**
   * Select a specific assistant
   * 
   * @param id - Assistant ID to select
   * @returns true if operation succeeded
   */
  const selectAssistant = (id: string): boolean => {
    if (isSelected(id)) {
      return true; // Already selected
    }

    if (selectedAssistants.length >= MAX_ASSISTANT_SELECTION) {
      return false;
    }

    setSelectedAssistants([...selectedAssistants, id]);
    return true;
  };

  /**
   * Deselect a specific assistant
   * 
   * @param id - Assistant ID to deselect
   */
  const deselectAssistant = (id: string) => {
    setSelectedAssistants(selectedAssistants.filter((a) => a !== id));
  };

  /**
   * Clear all selected assistants
   */
  const clearSelection = () => {
    setSelectedAssistants([]);
  };

  /**
   * Set multiple assistants as selected (replaces current selection)
   * 
   * @param ids - Array of assistant IDs to select
   * @returns true if operation succeeded
   */
  const setMultipleAssistants = (ids: string[]): boolean => {
    if (ids.length > MAX_ASSISTANT_SELECTION) {
      return false;
    }

    setSelectedAssistants(ids);
    return true;
  };

  /**
   * Check if more assistants can be selected
   */
  const canSelectMore = selectedAssistants.length < MAX_ASSISTANT_SELECTION;

  /**
   * Get number of remaining slots
   */
  const remainingSlots = MAX_ASSISTANT_SELECTION - selectedAssistants.length;

  /**
   * Check if at maximum capacity
   */
  const isAtMaxCapacity = selectedAssistants.length >= MAX_ASSISTANT_SELECTION;

  /**
   * Get the count of selected assistants
   */
  const selectionCount = selectedAssistants.length;

  return {
    /** Array of currently selected assistant IDs */
    selectedAssistants,
    /** Check if an assistant is selected */
    isSelected,
    /** Toggle assistant selection */
    toggleAssistant,
    /** Select a specific assistant */
    selectAssistant,
    /** Deselect a specific assistant */
    deselectAssistant,
    /** Clear all selections */
    clearSelection,
    /** Set multiple assistants */
    setMultipleAssistants,
    /** Whether more assistants can be selected */
    canSelectMore,
    /** Number of remaining selection slots */
    remainingSlots,
    /** Whether at maximum selection capacity */
    isAtMaxCapacity,
    /** Count of selected assistants */
    selectionCount,
  };
}
