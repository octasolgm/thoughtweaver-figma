/**
 * useNavigate Hook
 * 
 * Custom hook for navigation with type safety and analytics tracking.
 * Wraps the NavigationContext to provide a cleaner API.
 */

import { useNavigationContext } from '../contexts';
import { Page } from '../constants';

export interface NavigateOptions {
  /** Replace current history entry instead of pushing new one */
  replace?: boolean;
  /** Additional state to pass with navigation */
  state?: any;
}

/**
 * Hook for navigating between pages in the application
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { navigate, goBack, currentPage } = useNavigate();
 *   
 *   return (
 *     <Button onClick={() => navigate('home')}>Go Home</Button>
 *   );
 * }
 * ```
 */
export function useNavigate() {
  const { currentPage, setCurrentPage } = useNavigationContext();

  /**
   * Navigate to a specific page
   * 
   * @param page - Page identifier to navigate to
   * @param options - Navigation options
   */
  const navigate = (page: string, options?: NavigateOptions) => {
    // Future: Add analytics tracking here
    // trackNavigation(page);
    
    setCurrentPage(page);
  };

  /**
   * Navigate to the previous page
   * Note: In current implementation, this is a placeholder
   * Future: Implement proper history management
   */
  const goBack = () => {
    // Future: Implement proper history stack
    navigate('home');
  };

  /**
   * Navigate to home page
   */
  const goHome = () => {
    navigate('home');
  };

  /**
   * Check if currently on a specific page
   * 
   * @param page - Page identifier to check
   * @returns true if current page matches
   */
  const isCurrentPage = (page: string): boolean => {
    return currentPage === page;
  };

  return {
    /** Current page identifier */
    currentPage,
    /** Navigate to a specific page */
    navigate,
    /** Go back to previous page */
    goBack,
    /** Navigate to home page */
    goHome,
    /** Check if on a specific page */
    isCurrentPage,
  };
}
