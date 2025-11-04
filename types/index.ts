/**
 * Type Definitions
 * 
 * Centralized type definitions for the entire application.
 * This ensures type consistency and prevents type drift across files.
 */

// ============================================================================
// User Types
// ============================================================================

/**
 * User account information
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** Avatar URL or emoji */
  avatar: string;
  /** OAuth provider used for authentication */
  provider?: 'google' | 'apple';
  /** Account creation timestamp */
  createdAt?: Date;
}

// ============================================================================
// Conversation Types
// ============================================================================

/**
 * Conversation/chat session
 */
export interface Conversation {
  /** Unique conversation identifier */
  id: string;
  /** Conversation title */
  title: string;
  /** Initial prompt that started the conversation */
  prompt: string;
  /** Workflow type used */
  workflow: string;
  /** Array of assistant IDs participating */
  assistants: string[];
  /** Creation timestamp */
  timestamp: Date;
  /** Optional LLM model used */
  llm?: string;
  /** Optional project this conversation belongs to */
  projectId?: string;
}

/**
 * Individual message in a conversation
 */
export interface Message {
  /** Unique message identifier */
  id: string;
  /** Message content */
  content: string;
  /** Message sender ('user' or assistant ID) */
  sender: string;
  /** Message timestamp */
  timestamp: Date;
  /** Optional message metadata */
  metadata?: {
    /** LLM model used for this message */
    model?: string;
    /** Token count */
    tokens?: number;
    /** Processing time in milliseconds */
    processingTime?: number;
  };
}

// ============================================================================
// Assistant Types
// ============================================================================

/**
 * AI Assistant personality configuration
 */
export interface PersonalityTraits {
  /** Creativity level (0-100) */
  creativity: number;
  /** Analytical thinking (0-100) */
  analytical: number;
  /** Empathy level (0-100) */
  empathy: number;
  /** Assertiveness (0-100) */
  assertiveness: number;
  /** Detail orientation (0-100) */
  detailOriented: number;
  /** Strategic thinking (0-100) */
  strategic: number;
}

/**
 * AI Assistant configuration
 */
export interface Assistant {
  /** Unique assistant identifier */
  id: string;
  /** Assistant display name */
  name: string;
  /** Short description */
  description: string;
  /** Avatar emoji or image URL */
  avatar: string;
  /** Theme color class */
  color: string;
  /** Personality trait scores */
  personality: PersonalityTraits;
  /** System prompt for this assistant */
  systemPrompt: string;
  /** Whether this is a custom user-created assistant */
  isCustom?: boolean;
  /** Creator user ID (for custom assistants) */
  createdBy?: string;
  /** Creation timestamp */
  createdAt?: Date;
}

// ============================================================================
// Workflow Types
// ============================================================================

/**
 * Workflow configuration
 */
export interface Workflow {
  /** Unique workflow identifier */
  id: string;
  /** Workflow display name */
  name: string;
  /** Workflow description */
  description: string;
  /** Icon component or name */
  icon: string;
  /** Suggested number of assistants */
  suggestedAssistants: number;
  /** Whether this is a custom workflow */
  isCustom?: boolean;
  /** Workflow steps (for structured workflows) */
  steps?: WorkflowStep[];
}

/**
 * Step in a structured workflow
 */
export interface WorkflowStep {
  /** Step identifier */
  id: string;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Recommended assistants for this step */
  recommendedAssistants?: string[];
  /** Expected duration in minutes */
  estimatedDuration?: number;
}

// ============================================================================
// Project Types
// ============================================================================

/**
 * Project for organizing conversations
 */
export interface Project {
  /** Unique project identifier */
  id: string;
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Conversation IDs in this project */
  conversationIds: string[];
  /** Project color/theme */
  color?: string;
  /** Project icon */
  icon?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last updated timestamp */
  updatedAt: Date;
  /** Project owner user ID */
  ownerId?: string;
  /** Shared with user IDs (for team projects) */
  sharedWith?: string[];
}

// ============================================================================
// LLM Types
// ============================================================================

/**
 * LLM model configuration
 */
export interface LLMModel {
  /** Model identifier */
  id: string;
  /** Display name */
  name: string;
  /** Model provider (OpenAI, Anthropic, etc.) */
  provider: string;
  /** Short description */
  description: string;
  /** Whether this model is enabled */
  enabled: boolean;
  /** Configuration parameters */
  config: LLMConfig;
  /** Cost per 1K tokens (input) */
  costPerInputToken?: number;
  /** Cost per 1K tokens (output) */
  costPerOutputToken?: number;
}

/**
 * LLM configuration parameters
 */
export interface LLMConfig {
  /** Temperature (0-2) */
  temperature: number;
  /** Maximum tokens to generate */
  maxTokens: number;
  /** Top P sampling */
  topP?: number;
  /** Frequency penalty */
  frequencyPenalty?: number;
  /** Presence penalty */
  presencePenalty?: number;
}

// ============================================================================
// Team Types
// ============================================================================

/**
 * Team member information
 */
export interface TeamMember {
  /** Member user ID */
  id: string;
  /** Member name */
  name: string;
  /** Member email */
  email: string;
  /** Member avatar */
  avatar: string;
  /** Member role */
  role: 'owner' | 'admin' | 'member';
  /** Join date */
  joinedAt: Date;
  /** Last active timestamp */
  lastActive?: Date;
}

/**
 * Team invitation
 */
export interface TeamInvitation {
  /** Invitation ID */
  id: string;
  /** Invitee email */
  email: string;
  /** Intended role */
  role: 'admin' | 'member';
  /** Invitation status */
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  /** Invitation timestamp */
  sentAt: Date;
  /** Expiration timestamp */
  expiresAt: Date;
}

// ============================================================================
// Billing Types
// ============================================================================

/**
 * User subscription information
 */
export interface Subscription {
  /** Subscription ID */
  id: string;
  /** Plan type */
  plan: 'free' | 'pro' | 'team';
  /** Subscription status */
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  /** Current billing period start */
  currentPeriodStart: Date;
  /** Current billing period end */
  currentPeriodEnd: Date;
  /** Monthly cost in cents */
  monthlyCost: number;
  /** Number of seats (for team plan) */
  seats?: number;
}

/**
 * Usage statistics
 */
export interface UsageStats {
  /** Messages sent this month */
  messagesThisMonth: number;
  /** Message limit for current plan */
  messageLimit: number;
  /** Total tokens used this month */
  tokensUsed: number;
  /** Storage used in bytes */
  storageUsed: number;
  /** Number of conversations */
  conversationCount: number;
  /** Number of custom assistants */
  customAssistantCount: number;
}

// ============================================================================
// Preferences Types
// ============================================================================

/**
 * User preferences and settings
 */
export interface UserPreferences {
  /** Theme preference */
  theme: 'light' | 'dark' | 'auto';
  /** Default workflow */
  defaultWorkflow?: string;
  /** Default assistants */
  defaultAssistants?: string[];
  /** Default LLM */
  defaultLLM?: string;
  /** Email notifications enabled */
  emailNotifications: boolean;
  /** Browser notifications enabled */
  browserNotifications: boolean;
  /** Auto-save conversations */
  autoSave: boolean;
  /** Show keyboard shortcuts */
  showShortcuts: boolean;
  /** Compact mode */
  compactMode: boolean;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Context piece for Context Builder
 */
export interface ContextPiece {
  /** Context piece ID */
  id: string;
  /** Context type */
  type: 'text' | 'file' | 'link' | 'image';
  /** Context content */
  content: string;
  /** Display title */
  title?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * Application page identifiers
 */
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
  | string; // Allow dynamic pages like 'ai-assistant-editor-{id}'
