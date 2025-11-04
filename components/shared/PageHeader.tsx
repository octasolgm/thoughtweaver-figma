/**
 * PageHeader Component
 * 
 * Reusable header component for application pages.
 * Provides consistent layout and styling across all pages.
 * 
 * @example
 * ```tsx
 * <PageHeader title="My Page" />
 * <PageHeader title="Settings" action={<Button>Save</Button>} />
 * <PageHeader title="Details" backButton onBack={() => navigate('home')} />
 * ```
 */

import React, { ReactNode } from 'react';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  /** Title displayed in the header */
  title: string | ReactNode;
  /** Optional action button or element displayed on the right */
  action?: ReactNode;
  /** Show back button instead of sidebar trigger */
  backButton?: boolean;
  /** Callback when back button is clicked */
  onBack?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Additional content in the title area */
  titleContent?: ReactNode;
}

/**
 * PageHeader component for consistent page headers across the application
 */
export function PageHeader({
  title,
  action,
  backButton = false,
  onBack,
  className = '',
  titleContent,
}: PageHeaderProps) {
  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-10 ${className}`}>
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {backButton && onBack ? (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          ) : (
            <SidebarTrigger />
          )}
          <div className="flex-1 min-w-0">
            {typeof title === 'string' ? <h2>{title}</h2> : title}
          </div>
          {titleContent}
        </div>
        {action}
      </div>
    </header>
  );
}
