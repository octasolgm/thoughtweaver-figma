import { useState, useRef, useEffect, memo } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { SidebarTrigger } from '../ui/sidebar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  Lightbulb,
  Target,
  Zap,
  TrendingUp,
  Pencil,
  UserPlus,
  Share2,
  Paperclip,
  Mic,
  Send,
  Check,
  Cpu,
  Users,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Save,
  Sparkles,
  Search,
  AlertCircle,
  RefreshCw,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
} from 'lucide-react';
import { ContextView } from './ContextView';
import allRounderAvatar from 'figma:asset/66df02ed14e51fbca9624ccbf86d6c66471695a9.png';
import creativeAvatar from 'figma:asset/554fa3f225599e9d74085e980bec2674888447d2.png';
import analyticalAvatar from 'figma:asset/dd66067f40eb374e0f675639f890289fb607d8f0.png';
import devilAdvocateAvatar from 'figma:asset/2e1615857ca91e0983178c6d9454a9bc816ba468.png';
import optimistAvatar from 'figma:asset/b20d2ead8618218f3f745bbfe7fbfca414f24e8e.png';
import { assistants as allAssistants } from '../assistant/assistantData';
import { useAuth, useNavigation, useConversation, useSelection } from '../../contexts';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  assistantId?: string;
  timestamp: Date;
  llmModel?: string;
}

interface MessageGroup {
  timestamp: Date;
  messages: Message[];
}

// Workflow Types
interface WorkflowRole {
  id: string;
  name: string;
  type: 'ai' | 'human';
  icon: any;
  description: string;
  suggestedAssistants: string[];
}

interface WorkflowStep {
  id: string;
  roleId: string;
  status: 'completed' | 'active' | 'suggested' | 'pending';
  assistantIds: string[];
  timestamp?: Date;
}

interface WorkflowSuggestion {
  id: string;
  roleId: string;
  message: string;
  recommendedAssistants: string[];
  trigger: string;
}

// Define Workflow Roles
const WORKFLOW_ROLES: WorkflowRole[] = [
  {
    id: 'frame',
    name: 'Frame',
    type: 'human',
    icon: Target,
    description: 'Define the problem and context clearly',
    suggestedAssistants: ['problem-statement-guide', 'all-rounder', 'visionary-strategist']
  },
  {
    id: 'ideate',
    name: 'Ideate',
    type: 'ai',
    icon: Lightbulb,
    description: 'Generate creative ideas and possibilities',
    suggestedAssistants: ['all-rounder', 'creative-innovator', 'visionary-strategist']
  },
  {
    id: 'challenge',
    name: 'Challenge',
    type: 'ai',
    icon: AlertCircle,
    description: 'Stress-test ideas and find potential issues',
    suggestedAssistants: ['devils-advocate', 'incisive-analyst', 'legal-analyst']
  },
  {
    id: 'analyze',
    name: 'Analyze',
    type: 'ai',
    icon: BarChart3,
    description: 'Deep dive into data and patterns',
    suggestedAssistants: ['data-analyst', 'incisive-analyst', 'diligent-researcher']
  },
  {
    id: 'refine',
    name: 'Refine',
    type: 'ai',
    icon: RefreshCw,
    description: 'Polish and improve the solution',
    suggestedAssistants: ['incisive-idea-improver', 'methodical-proofreader', 'writing-coach']
  },
  {
    id: 'present',
    name: 'Present',
    type: 'ai',
    icon: FileText,
    description: 'Package findings for communication',
    suggestedAssistants: ['speech-writer', 'persuasive-copywriter', 'public-relations-expert']
  },
  {
    id: 'find',
    name: 'Find',
    type: 'ai',
    icon: Search,
    description: 'Research and gather information',
    suggestedAssistants: ['diligent-researcher', 'science-communicator', 'seo-expert']
  },
  {
    id: 'check',
    name: 'Check',
    type: 'ai',
    icon: Shield,
    description: 'Verify accuracy and quality',
    suggestedAssistants: ['methodical-proofreader', 'legal-analyst', 'research-article-reviewer']
  },
];

// Use assistants from assistantData
const assistants = allAssistants.map(a => ({
  id: a.id,
  name: a.name,
  color: a.color,
  avatar: a.avatar
}));

// Memoized Message Component for Performance
const ConversationMessage = memo(({ 
  message, 
  getAssistant,
  userAvatar,
  userName 
}: { 
  message: Message;
  getAssistant: (id: string) => any;
  userAvatar?: string;
  userName?: string;
}) => {
  // System messages (workflow activation notifications)
  if (message.role === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 max-w-md">
          <p className="text-sm text-purple-900 text-center">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-4 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="flex flex-col items-center gap-1">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={getAssistant(message.assistantId!).avatar} />
            <AvatarFallback className={getAssistant(message.assistantId!).color}>
              {getAssistant(message.assistantId!).name[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500 text-center max-w-[80px] truncate">
            {getAssistant(message.assistantId!).name}
          </span>
        </div>
      )}

      <div
        className={`rounded-2xl px-4 py-3 max-w-[70%] ${
          message.role === 'user'
            ? 'bg-purple-500 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {message.role === 'user' && (
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{userName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});

// Adaptive Workflow Panel Component
const AdaptiveWorkflowPanel = memo(({
  workflowSteps,
  currentSuggestion,
  onActivateSuggestion,
  onSkipSuggestion,
  onSaveWorkflow,
  getAssistant,
  selectedAssistantId,
  onSelectAssistant
}: {
  workflowSteps: WorkflowStep[];
  currentSuggestion: WorkflowSuggestion | null;
  onActivateSuggestion: (suggestion: WorkflowSuggestion, selectedAssistantId: string) => void;
  onSkipSuggestion: () => void;
  onSaveWorkflow: () => void;
  getAssistant: (id: string) => any;
  selectedAssistantId: string | null;
  onSelectAssistant: (assistantId: string) => void;
}) => {
  const [showHistory, setShowHistory] = useState(true);

  const completedSteps = workflowSteps.filter(s => s.status === 'completed');
  const activeStep = workflowSteps.find(s => s.status === 'active');

  const getRole = (roleId: string) => WORKFLOW_ROLES.find(r => r.id === roleId);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-purple-900">Workflow Assistant</h3>
      </div>

      {/* Empty State */}
      {workflowSteps.length === 0 && !currentSuggestion && (
        <Card className="p-4 border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            I'll suggest helpful workflow steps as our conversation develops...
          </p>
        </Card>
      )}

      {/* Active Step */}
      {activeStep && (
        <Card className="p-4 border-purple-300 bg-purple-50/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
              {(() => {
                const role = getRole(activeStep.roleId);
                const Icon = role?.icon || Zap;
                return <Icon className="w-4 h-4 text-white" />;
              })()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-purple-900">
                  {getRole(activeStep.roleId)?.name}
                </span>
                <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-purple-700 mb-2">
                {getRole(activeStep.roleId)?.description}
              </p>
              {activeStep.assistantIds.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {activeStep.assistantIds.map(id => {
                    const assistant = getAssistant(id);
                    return (
                      <div key={id} className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={assistant.avatar} />
                          <AvatarFallback className={assistant.color}>
                            {assistant.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-gray-700">{assistant.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Current Suggestion */}
      {currentSuggestion && (
        <Card className="p-4 border-purple-200 bg-gradient-to-br from-purple-50 to-white animate-in slide-in-from-right duration-300">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              {(() => {
                const role = getRole(currentSuggestion.roleId);
                const Icon = role?.icon || Lightbulb;
                return <Icon className="w-5 h-5 text-purple-600" />;
              })()}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-purple-900 mb-1">
                {getRole(currentSuggestion.roleId)?.name}
              </h4>
              <p className="text-sm text-gray-700">
                {currentSuggestion.message}
              </p>
            </div>
          </div>

          {currentSuggestion.recommendedAssistants.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-2">Select Assistant:</p>
              <div className="space-y-2">
                {currentSuggestion.recommendedAssistants.map(id => {
                  const assistant = getAssistant(id);
                  const isSelected = selectedAssistantId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => onSelectAssistant(id)}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-white shadow-sm' 
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <Avatar className="w-6 h-6 flex-shrink-0">
                        <AvatarImage src={assistant.avatar} />
                        <AvatarFallback className={assistant.color}>
                          {assistant.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`text-sm flex-1 text-left ${
                        isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}>
                        {assistant.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => onActivateSuggestion(currentSuggestion, selectedAssistantId || currentSuggestion.recommendedAssistants[0])}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={!selectedAssistantId}
            >
              Activate
            </Button>
            <Button
              onClick={onSkipSuggestion}
              variant="ghost"
              className="text-gray-600"
            >
              Not now
            </Button>
          </div>
        </Card>
      )}

      {/* Completed Steps History */}
      {completedSteps.length > 0 && (
        <Collapsible open={showHistory} onOpenChange={setShowHistory}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-sm font-medium text-gray-700">
                Completed Steps ({completedSteps.length})
              </span>
              {showHistory ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {completedSteps.map(step => {
              const role = getRole(step.roleId);
              return (
                <div key={step.id} className="flex items-start gap-2 p-2 bg-green-50/50 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">{role?.name}</p>
                    {step.assistantIds.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {step.assistantIds.map(id => {
                          const assistant = getAssistant(id);
                          return (
                            <span key={id} className="text-xs text-gray-600">
                              {assistant.name}
                            </span>
                          );
                        }).reduce((prev: any, curr) => [prev, ', ', curr])}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Save Workflow Button */}
      {workflowSteps.length > 0 && (
        <Button
          variant="outline"
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
          onClick={onSaveWorkflow}
        >
          <Save className="w-4 h-4 mr-2" />
          Save this workflow
        </Button>
      )}
    </div>
  );
});

export function ConversationView() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { currentPrompt, getActiveConversation, updateConversationTitle } = useConversation();
  const { selectedAssistants, selectedWorkflow } = useSelection();
  
  const activeConversation = getActiveConversation();
  const initialTitle = activeConversation?.title;
  const workflow = activeConversation?.workflow || selectedWorkflow;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState<string>(selectedAssistants[0] || 'all-rounder');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [conversationTitle, setConversationTitle] = useState(initialTitle || `${workflow.charAt(0).toUpperCase() + workflow.slice(1)} Session`);
  const [tempTitle, setTempTitle] = useState(conversationTitle);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [assistantDialogOpen, setAssistantDialogOpen] = useState(false);
  const [llmDialogOpen, setLlmDialogOpen] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState('claude-3-sonnet');
  
  // Workflow state
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState<WorkflowSuggestion | null>(null);
  const [saveWorkflowDialogOpen, setSaveWorkflowDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [selectedWorkflowAssistant, setSelectedWorkflowAssistant] = useState<string | null>(null);

  const llmModels = [
    { 
      id: 'claude-3-opus', 
      name: 'Claude 3 Opus', 
      provider: 'Anthropic',
      description: 'Most capable model with superior reasoning and analysis, but slower and more expensive.'
    },
    { 
      id: 'gpt-4', 
      name: 'GPT-4', 
      provider: 'OpenAI',
      description: 'Excellent general-purpose model with strong creative writing, but can be verbose.'
    },
    { 
      id: 'claude-3-sonnet', 
      name: 'Claude 3 Sonnet', 
      provider: 'Anthropic',
      description: 'Balanced speed and capability with good reasoning, ideal for most tasks.'
    },
    { 
      id: 'gemini-pro', 
      name: 'Gemini Pro', 
      provider: 'Google',
      description: 'Strong at multimodal tasks and coding, but less nuanced for creative work.'
    },
    { 
      id: 'gpt-3.5-turbo', 
      name: 'GPT-3.5 Turbo', 
      provider: 'OpenAI',
      description: 'Fast and cost-effective for simple tasks, but lacks depth for complex reasoning.'
    },
    { 
      id: 'llama-3', 
      name: 'Llama 3 70B', 
      provider: 'Meta',
      description: 'Open-source with good performance, but may struggle with nuanced instructions.'
    },
  ];

  const selectAssistant = (assistantId: string) => {
    setActiveAssistant(assistantId);
  };

  // Detect workflow opportunities based on conversation
  const detectWorkflowOpportunity = (userMsgCount: number, lastUserMessage: string): WorkflowSuggestion | null => {
    const lowerMessage = lastUserMessage.toLowerCase();
    
    // After 2 user messages, suggest Ideate as the first step
    if (userMsgCount === 2 && !workflowSteps.some(s => s.roleId === 'ideate')) {
      return {
        id: `suggestion-${Date.now()}`,
        roleId: 'ideate',
        message: "Let's generate creative ideas and explore possibilities for your challenge.",
        recommendedAssistants: ['creative-innovator', 'visionary-strategist', 'all-rounder'],
        trigger: 'message-count'
      };
    }
    
    // After Ideate, suggest Frame (after 3 user messages)
    if (userMsgCount === 3 && workflowSteps.some(s => s.roleId === 'ideate' && s.status === 'completed')) {
      return {
        id: `suggestion-${Date.now()}`,
        roleId: 'frame',
        message: "Now let's frame and define the problem more clearly with structure.",
        recommendedAssistants: ['problem-statement-guide', 'all-rounder'],
        trigger: 'after-ideate'
      };
    }
    
    // After Frame, suggest Challenge (after 4 user messages)
    if (userMsgCount === 4 && workflowSteps.some(s => s.roleId === 'frame' && s.status === 'completed')) {
      return {
        id: `suggestion-${Date.now()}`,
        roleId: 'challenge',
        message: "Ready to stress-test these ideas? I can bring in critical perspectives.",
        recommendedAssistants: ['devils-advocate', 'incisive-analyst'],
        trigger: 'after-frame'
      };
    }
    
    // After challenge, suggest analyze (after 5 user messages)
    if (userMsgCount === 5 && workflowSteps.some(s => s.roleId === 'challenge' && s.status === 'completed')) {
      return {
        id: `suggestion-${Date.now()}`,
        roleId: 'analyze',
        message: "Let's dig deeper with data-driven analysis.",
        recommendedAssistants: ['data-analyst', 'incisive-analyst'],
        trigger: 'after-challenge'
      };
    }
    
    // After analysis, suggest refine (after 6 user messages)
    if (userMsgCount === 6 && workflowSteps.some(s => s.roleId === 'analyze' && s.status === 'completed')) {
      return {
        id: `suggestion-${Date.now()}`,
        roleId: 'refine',
        message: "Time to polish and refine the solution.",
        recommendedAssistants: ['incisive-idea-improver', 'methodical-proofreader'],
        trigger: 'after-analyze'
      };
    }

    // Keyword-based triggers
    if (lowerMessage.includes('frame') || lowerMessage.includes('define') || lowerMessage.includes('clarify')) {
      if (!workflowSteps.some(s => s.roleId === 'frame')) {
        return {
          id: `suggestion-${Date.now()}`,
          roleId: 'frame',
          message: "Let's ensure we have a clear problem definition and context.",
          recommendedAssistants: ['problem-statement-guide', 'all-rounder'],
          trigger: 'keyword-frame'
        };
      }
    }
    
    if (lowerMessage.includes('idea') || lowerMessage.includes('brainstorm')) {
      if (!workflowSteps.some(s => s.roleId === 'ideate')) {
        return {
          id: `suggestion-${Date.now()}`,
          roleId: 'ideate',
          message: "Let's generate creative ideas together!",
          recommendedAssistants: ['creative-innovator', 'visionary-strategist'],
          trigger: 'keyword-ideate'
        };
      }
    }
    
    if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('challenge')) {
      if (!workflowSteps.some(s => s.roleId === 'analyze')) {
        return {
          id: `suggestion-${Date.now()}`,
          roleId: 'analyze',
          message: "I can help analyze this problem systematically.",
          recommendedAssistants: ['data-analyst', 'incisive-analyst'],
          trigger: 'keyword-analyze'
        };
      }
    }
    
    if (lowerMessage.includes('decision') || lowerMessage.includes('choose')) {
      if (!workflowSteps.some(s => s.roleId === 'challenge')) {
        return {
          id: `suggestion-${Date.now()}`,
          roleId: 'challenge',
          message: "Before deciding, let's challenge assumptions and explore alternatives.",
          recommendedAssistants: ['devils-advocate', 'incisive-analyst'],
          trigger: 'keyword-decision'
        };
      }
    }
    
    if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('refine')) {
      if (!workflowSteps.some(s => s.roleId === 'refine')) {
        return {
          id: `suggestion-${Date.now()}`,
          roleId: 'refine',
          message: "I can help refine and improve this work.",
          recommendedAssistants: ['incisive-idea-improver', 'writing-coach'],
          trigger: 'keyword-refine'
        };
      }
    }
    
    return null;
  };

  const handleActivateSuggestion = (suggestion: WorkflowSuggestion, selectedAssistantId: string) => {
    // Add the selected assistant to conversation
    const newAssistant = selectedAssistantId;
    
    // Update the active assistant
    setActiveAssistant(newAssistant);
    
    // Create system message about activation
    const systemMsg: Message = {
      id: `system-${Date.now()}`,
      role: 'system',
      content: `I've activated ${getAssistant(newAssistant).name} to ${WORKFLOW_ROLES.find(r => r.id === suggestion.roleId)?.description.toLowerCase()}.`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMsg]);
    
    // Mark suggestion as active step
    setWorkflowSteps(prev => [...prev, {
      id: `step-${Date.now()}`,
      roleId: suggestion.roleId,
      status: 'active',
      assistantIds: [newAssistant],
      timestamp: new Date()
    }]);
    
    // Clear current suggestion and selected assistant
    setCurrentSuggestion(null);
    setSelectedWorkflowAssistant(null);
    
    // Generate response from the new assistant
    setIsTyping(true);
    setTimeout(() => {
      let content = '';
      const role = WORKFLOW_ROLES.find(r => r.id === suggestion.roleId);
      
      if (suggestion.roleId === 'frame') {
        content = "Let's start by clearly defining the problem and understanding the context. What specific challenge are we trying to address, and what constraints or considerations should we keep in mind?";
      } else if (suggestion.roleId === 'ideate') {
        content = "Now that we have clarity on the problem, let's explore creative possibilities. I'll help generate diverse ideas and approaches we can consider.";
      } else if (suggestion.roleId === 'challenge') {
        content = "Let me play devil's advocate here. What are the potential downsides and risks we haven't considered? Let's stress-test these ideas thoroughly.";
      } else if (suggestion.roleId === 'analyze') {
        content = "Looking at this from a data perspective, I notice some interesting patterns we should explore further. Let me break down the key factors systematically.";
      } else if (suggestion.roleId === 'refine') {
        content = "I can see several opportunities to strengthen and polish this work. Let's focus on clarity and impact to make this even better.";
      } else {
        content = `Great! I'm here to help with ${role?.description.toLowerCase()}.`;
      }
      
      const response: Message = {
        id: `${Date.now()}`,
        role: 'assistant' as const,
        content,
        assistantId: newAssistant,
        timestamp: new Date(),
        llmModel: selectedLLM
      };
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      
      // Mark step as completed after response
      setTimeout(() => {
        setWorkflowSteps(prev => prev.map(step => 
          step.roleId === suggestion.roleId && step.status === 'active'
            ? { ...step, status: 'completed' }
            : step
        ));
      }, 2000);
    }, 1500);
  };

  const handleSkipSuggestion = () => {
    setCurrentSuggestion(null);
    setSelectedWorkflowAssistant(null);
  };

  const handleSelectWorkflowAssistant = (assistantId: string) => {
    setSelectedWorkflowAssistant(assistantId);
  };

  const handleSaveWorkflow = () => {
    setSaveWorkflowDialogOpen(true);
  };

  const saveWorkflow = () => {
    // In a real app, this would save to backend
    console.log('Saving workflow:', workflowName, workflowSteps);
    setSaveWorkflowDialogOpen(false);
    setWorkflowName('');
    // Show success message (could use toast)
  };

  useEffect(() => {
    // Only run this effect once when conversation starts (currentPrompt changes)
    // Add initial user message
    const initialMessage: Message = {
      id: '1',
      role: 'user',
      content: currentPrompt,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
    setUserMessageCount(1); // First user message

    // Immediately generate AI response from active assistant
    setIsTyping(true);
    setTimeout(() => {
      let responseContent = '';
      
      if (activeAssistant === 'creative') {
        responseContent = "What if we approached this from a completely different angle? Instead of traditional methods, consider drawing inspiration from nature, art, or even science fiction. Sometimes the most innovative ideas come from unexpected places.";
      } else if (activeAssistant === 'analytical') {
        responseContent = "Let's break this down systematically. Based on your context, I see three key factors to consider: feasibility, impact, and resources. We should prioritize ideas that score high across all three dimensions.";
      } else if (activeAssistant === 'devil-advocate') {
        responseContent = "I have to challenge this - what are the potential downsides? Have you considered what could go wrong? It's important to stress-test your assumptions before moving forward.";
      } else if (activeAssistant === 'optimist') {
        responseContent = "This is exciting! I can see so much potential here. With the right approach and enthusiasm, this could lead to something truly remarkable. Let's focus on what's possible!";
      } else if (activeAssistant === 'pragmatist') {
        responseContent = "Here's what we can actually implement: Start with a minimal viable approach, test it quickly, and iterate based on feedback. Keep it simple and actionable.";
      } else {
        responseContent = "Thanks for sharing! I can help you explore this from multiple angles. Let's start by identifying your core objectives and then work through different approaches to achieve them.";
      }

      const response: Message = {
        id: `${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        assistantId: activeAssistant,
        timestamp: new Date(),
        llmModel: selectedLLM
      };

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrompt]); // Only re-run when conversation starts with new prompt

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAssistant = (assistantId: string) => {
    return assistants.find(a => a.id === assistantId) || assistants[0];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    
    // Increment user message count
    const newUserMessageCount = userMessageCount + 1;
    setUserMessageCount(newUserMessageCount);
    
    // Check for workflow opportunities
    const suggestion = detectWorkflowOpportunity(newUserMessageCount, input);
    if (suggestion && !currentSuggestion) {
      setTimeout(() => {
        setCurrentSuggestion(suggestion);
        // Select the first assistant by default
        setSelectedWorkflowAssistant(suggestion.recommendedAssistants[0]);
      }, 2000);
    }
    
    setInput('');

    // Simulate AI response from the active assistant
    setIsTyping(true);
    setTimeout(() => {
      const response: Message = {
        id: `${Date.now()}`,
        role: 'assistant',
        content: `This is a thoughtful point. Let me add to the discussion...`,
        assistantId: activeAssistant,
        timestamp: new Date(),
        llmModel: selectedLLM
      };

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const groupMessagesByTime = (messages: Message[]): MessageGroup[] => {
    const groups: MessageGroup[] = [];
    let currentGroup: Message[] = [];
    let currentTime: Date | null = null;

    messages.forEach((message, index) => {
      const messageTime = new Date(message.timestamp);
      
      if (currentTime === null) {
        currentTime = messageTime;
        currentGroup = [message];
      } else {
        // Group messages within 1 minute of each other
        const timeDiff = Math.abs(messageTime.getTime() - currentTime.getTime());
        if (timeDiff < 60000) { // 60000ms = 1 minute
          currentGroup.push(message);
        } else {
          groups.push({ timestamp: currentTime, messages: currentGroup });
          currentTime = messageTime;
          currentGroup = [message];
        }
      }

      // If this is the last message, add the current group
      if (index === messages.length - 1) {
        groups.push({ timestamp: currentTime, messages: currentGroup });
      }
    });

    return groups;
  };

  const handleSaveTitle = () => {
    setConversationTitle(tempTitle);
    setIsEditingTitle(false);
    if (activeConversation) {
      updateConversationTitle(activeConversation.id, tempTitle);
    }
  };

  const handleCancelEditTitle = () => {
    setTempTitle(conversationTitle);
    setIsEditingTitle(false);
  };

  // Show all messages (no filtering needed since we show the conversation history)
  const messageGroups = groupMessagesByTime(messages);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <SidebarTrigger />
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="h-8 max-w-md"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') handleCancelEditTitle();
                    }}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveTitle}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEditTitle}>Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="truncate">{conversationTitle}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => {
                      setIsEditingTitle(true);
                      setTempTitle(conversationTitle);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserPlus className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Collaborators</DialogTitle>
                  <DialogDescription>
                    Share this conversation with others
                  </DialogDescription>
                </DialogHeader>
                <Input placeholder="Enter email address" />
                <Button className="w-full">Send Invitation</Button>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Conversation</DialogTitle>
                  <DialogDescription>
                    Generate a shareable link to this conversation
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2">
                  <Input value="https://thoughtweaver.app/share/abc123" readOnly />
                  <Button>Copy</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Tabs for Conversation and Context */}
      <Tabs defaultValue="conversation" className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4">
          <TabsList className="h-12">
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="conversation" className="flex-1 flex flex-col mt-0">
          <div className="flex-1 flex overflow-hidden">
            {/* Main conversation area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-4">
                      {/* Messages in this time group */}
                      {group.messages.map((message) => (
                        <ConversationMessage
                          key={message.id}
                          message={message}
                          getAssistant={getAssistant}
                          userAvatar={user?.avatar}
                          userName={user?.name}
                        />
                      ))}
                      
                      {/* Timestamp for the group */}
                      <div className="text-center">
                        <span className="text-xs text-gray-500">
                          {formatDateTime(group.timestamp)}
                          {group.messages.some(m => m.role === 'assistant' && m.llmModel) && (
                            <span className="ml-2">
                              • {llmModels.find(llm => llm.id === group.messages.find(m => m.role === 'assistant')?.llmModel)?.name}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto">
                  {/* Buttons for Assistant and LLM Selection */}
                  <div className="flex gap-2 mb-3">
                    {/* Change Assistant Button */}
                    <Dialog open={assistantDialogOpen} onOpenChange={setAssistantDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={getAssistant(activeAssistant).avatar} />
                            <AvatarFallback className={getAssistant(activeAssistant).color}>
                              {getAssistant(activeAssistant).name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {getAssistant(activeAssistant).name}
                          <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 text-xs">Active</Badge>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Change Assistant</DialogTitle>
                          <DialogDescription>
                            Select a different AI assistant. They will respond to your next message.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                          {assistants.map((assistant) => (
                            <button
                              key={assistant.id}
                              onClick={() => {
                                selectAssistant(assistant.id);
                                setAssistantDialogOpen(false);
                              }}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                                activeAssistant === assistant.id
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                              }`}
                            >
                              <Avatar className="w-10 h-10 flex-shrink-0">
                                <AvatarImage src={assistant.avatar} />
                                <AvatarFallback className={assistant.color}>
                                  {assistant.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">{assistant.name}</div>
                                  {activeAssistant === assistant.id && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">Active</Badge>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Change LLM Model Button */}
                    <Dialog open={llmDialogOpen} onOpenChange={setLlmDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Cpu className="w-4 h-4" />
                          {llmModels.find(m => m.id === selectedLLM)?.name || 'Select model'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Change LLM Model</DialogTitle>
                          <DialogDescription>
                            Choose the AI model that best fits your needs.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                          {llmModels.map((llm) => (
                            <button
                              key={llm.id}
                              onClick={() => {
                                setSelectedLLM(llm.id);
                                setLlmDialogOpen(false);
                              }}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                                selectedLLM === llm.id
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <Cpu className="w-5 h-5 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{llm.name}</div>
                                <p className="text-sm text-gray-500 mt-1">{llm.provider}</p>
                                <p className="text-sm text-gray-600 mt-1">{llm.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="relative">
                    <Textarea
                      placeholder="Ask a question, or add more context"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="pr-24 resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mic className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleSendMessage}
                        disabled={!input.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar - Adaptive Workflow Assistant */}
            <div className="hidden lg:block w-80 border-l border-gray-200 bg-white overflow-y-auto">
              <div className="sticky top-0">
                <AdaptiveWorkflowPanel
                  workflowSteps={workflowSteps}
                  currentSuggestion={currentSuggestion}
                  onActivateSuggestion={handleActivateSuggestion}
                  onSkipSuggestion={handleSkipSuggestion}
                  onSaveWorkflow={handleSaveWorkflow}
                  getAssistant={getAssistant}
                  selectedAssistantId={selectedWorkflowAssistant}
                  onSelectAssistant={handleSelectWorkflowAssistant}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="context" className="flex-1 overflow-y-auto mt-0">
          <ContextView initialContext={currentPrompt} />
        </TabsContent>
      </Tabs>

      {/* Save Workflow Dialog */}
      <Dialog open={saveWorkflowDialogOpen} onOpenChange={setSaveWorkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Workflow Pattern</DialogTitle>
            <DialogDescription>
              Save this workflow pattern to your library for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Workflow Name</label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="e.g., Idea Challenge & Analysis"
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Steps in this workflow:</p>
              <div className="space-y-2">
                {workflowSteps.map(step => {
                  const role = WORKFLOW_ROLES.find(r => r.id === step.roleId);
                  return (
                    <div key={step.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>{role?.name}</span>
                      {step.assistantIds.length > 0 && (
                        <span className="text-gray-500">
                          ({step.assistantIds.map(id => getAssistant(id).name).join(', ')})
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveWorkflowDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveWorkflow}
              disabled={!workflowName.trim()}
            >
              Save Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
