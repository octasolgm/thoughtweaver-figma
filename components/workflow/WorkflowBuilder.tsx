import { useState, memo, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { SidebarTrigger } from '../ui/sidebar';
import { 
  Lightbulb,
  Sparkles,
  FileText,
  Plus,
  Settings,
  Target,
  Zap,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  GripVertical,
  Trash2,
  Save,
  X as XIcon,
} from 'lucide-react';
import { assistants } from '../assistant/assistantData';
import { useAuth, useNavigation, useSelection } from '../../contexts';

interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  roleType: 'ai' | 'human';
  description: string;
  assistants: string[];
  promptTemplate?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isPreset: boolean;
  usageCount: number;
  estimatedTime: string;
  steps: WorkflowStep[];
}

const iconMap = {
  Lightbulb,
  Sparkles,
  FileText,
  Target,
  Zap,
  Search,
};

// Create assistant lookup map for quick access
const assistantMap = new Map(assistants.map(a => [a.id, a]));

// Role type badge component
const RoleBadge = ({ roleType }: { roleType: 'ai' | 'human' }) => {
  if (roleType === 'ai') {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-700 gap-1">
        <Sparkles className="w-3 h-3" />
        AI Role
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-green-100 text-green-700 gap-1">
      <User className="w-3 h-3" />
      Human Role
    </Badge>
  );
};

// Assistant avatars component
const AssistantAvatars = memo(({ assistantIds }: { assistantIds: string[] }) => {
  if (assistantIds.length === 0) return null;
  
  const visibleAssistants = assistantIds.slice(0, 3);
  const remaining = assistantIds.length - 3;
  
  return (
    <div className="flex items-center gap-1">
      {visibleAssistants.map((id) => {
        const assistant = assistantMap.get(id);
        if (!assistant) return null;
        
        return (
          <Avatar key={id} className="w-6 h-6 border-2 border-white">
            <AvatarImage src={assistant.avatar} alt={assistant.name} />
            <AvatarFallback className={assistant.color}>
              {assistant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        );
      })}
      {remaining > 0 && (
        <span className="text-xs text-gray-600 ml-1">+{remaining} more</span>
      )}
    </div>
  );
});

// Assistant selector component for editing
const AssistantSelector = memo(({ 
  selectedIds, 
  onChange 
}: { 
  selectedIds: string[]; 
  onChange: (ids: string[]) => void;
}) => {
  const toggleAssistant = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(aid => aid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white">
      {assistants.map((assistant) => (
        <label
          key={assistant.id}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(assistant.id)}
            onChange={() => toggleAssistant(assistant.id)}
            className="w-4 h-4 text-purple-600 rounded"
          />
          <Avatar className="w-6 h-6">
            <AvatarImage src={assistant.avatar} alt={assistant.name} />
            <AvatarFallback className={assistant.color}>
              {assistant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{assistant.name}</span>
        </label>
      ))}
    </div>
  );
});

// Workflow step component (view mode)
const WorkflowStepItem = memo(({ step }: { step: WorkflowStep }) => {
  const borderColor = step.roleType === 'ai' ? 'border-blue-500' : 'border-green-500';
  
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50 border-l-4 ${borderColor}`}>
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-sm">
        {step.order}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-gray-900">{step.name}</span>
          <RoleBadge roleType={step.roleType} />
        </div>
        <p className="text-xs text-gray-600 mb-2">{step.description}</p>
        {step.assistants.length > 0 && (
          <AssistantAvatars assistantIds={step.assistants} />
        )}
      </div>
    </div>
  );
});

// Draggable workflow step component (edit mode)
const DraggableStepItem = memo(({ 
  step, 
  index,
  onUpdate,
  onRemove,
  moveStep,
}: { 
  step: WorkflowStep;
  index: number;
  onUpdate: (updates: Partial<WorkflowStep>) => void;
  onRemove: () => void;
  moveStep: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const [showAssistantSelector, setShowAssistantSelector] = useState(false);
  
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'step',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'step',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveStep(item.index, index);
        item.index = index;
      }
    },
  });

  const borderColor = step.roleType === 'ai' ? 'border-blue-500' : 'border-green-500';

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className={`flex items-start gap-3 p-3 rounded-lg bg-white border-l-4 ${borderColor} border border-gray-200`}>
        <div
          ref={drag}
          className="flex-shrink-0 cursor-move hover:bg-gray-100 rounded p-1"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-3">
          {/* Step Name and Role Type */}
          <div className="flex items-center gap-2">
            <Input
              value={step.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Step name"
              className="flex-1"
            />
            <select
              value={step.roleType}
              onChange={(e) => onUpdate({ roleType: e.target.value as 'ai' | 'human', assistants: e.target.value === 'human' ? [] : step.assistants })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="human">Human Role</option>
              <option value="ai">AI Role</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs text-gray-600">Description</Label>
            <Textarea
              value={step.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Step description"
              rows={2}
              className="mt-1"
            />
          </div>

          {/* AI Assistants Selection */}
          {step.roleType === 'ai' && (
            <div>
              <Label className="text-xs text-gray-600">Assigned Assistants</Label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-2">
                  {step.assistants.length > 0 ? (
                    <AssistantAvatars assistantIds={step.assistants} />
                  ) : (
                    <span className="text-xs text-gray-500">No assistants selected</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAssistantSelector(!showAssistantSelector)}
                    className="ml-auto"
                  >
                    {showAssistantSelector ? 'Done' : 'Select'}
                  </Button>
                </div>
                {showAssistantSelector && (
                  <AssistantSelector
                    selectedIds={step.assistants}
                    onChange={(ids) => onUpdate({ assistants: ids })}
                  />
                )}
              </div>
            </div>
          )}

          {/* Prompt Template (for AI roles) */}
          {step.roleType === 'ai' && (
            <div>
              <Label className="text-xs text-gray-600">Prompt Template (optional)</Label>
              <Textarea
                value={step.promptTemplate || ''}
                onChange={(e) => onUpdate({ promptTemplate: e.target.value })}
                placeholder="Enter prompt template..."
                rows={2}
                className="mt-1"
              />
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="flex-shrink-0 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

// Expandable Workflow Card Component
const WorkflowCard = memo(({
  workflow: initialWorkflow,
  isExpanded,
  onToggleExpand,
  onUseWorkflow,
  onEditWorkflow,
  onSaveWorkflow,
  getIcon
}: {
  workflow: Workflow;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUseWorkflow: () => void;
  onEditWorkflow: () => void;
  onSaveWorkflow: (workflow: Workflow) => void;
  getIcon: (iconName: string) => any;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkflow, setEditedWorkflow] = useState(initialWorkflow);
  
  const Icon = getIcon(editedWorkflow.icon);
  const colorMap: Record<string, string> = {
    'Purple': 'bg-purple-500',
    'Blue': 'bg-blue-500',
    'Amber': 'bg-amber-500',
    'Emerald': 'bg-emerald-500',
    'Cyan': 'bg-cyan-500',
  };
  
  const avatarBg = colorMap[editedWorkflow.color] || 'bg-purple-500';

  const handleEdit = () => {
    setIsEditing(true);
    setEditedWorkflow(initialWorkflow);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedWorkflow(initialWorkflow);
  };

  const handleSave = () => {
    onSaveWorkflow(editedWorkflow);
    setIsEditing(false);
  };

  const updateStep = (index: number, updates: Partial<WorkflowStep>) => {
    const newSteps = [...editedWorkflow.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setEditedWorkflow({ ...editedWorkflow, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = editedWorkflow.steps.filter((_, i) => i !== index);
    // Reorder the remaining steps
    const reorderedSteps = newSteps.map((step, idx) => ({ ...step, order: idx + 1 }));
    setEditedWorkflow({ ...editedWorkflow, steps: reorderedSteps });
  };

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      order: editedWorkflow.steps.length + 1,
      name: 'New Step',
      roleType: 'human',
      description: 'Describe this step...',
      assistants: [],
    };
    setEditedWorkflow({ ...editedWorkflow, steps: [...editedWorkflow.steps, newStep] });
  };

  const moveStep = useCallback((dragIndex: number, hoverIndex: number) => {
    setEditedWorkflow((prev) => {
      const newSteps = [...prev.steps];
      const draggedStep = newSteps[dragIndex];
      newSteps.splice(dragIndex, 1);
      newSteps.splice(hoverIndex, 0, draggedStep);
      // Reorder all steps
      return {
        ...prev,
        steps: newSteps.map((step, idx) => ({ ...step, order: idx + 1 }))
      };
    });
  }, []);
  
  return (
    <Card
      className={`transition-all duration-300 ${
        isExpanded 
          ? 'shadow-xl ring-2 ring-purple-500 z-10' 
          : 'hover:shadow-md cursor-pointer'
      }`}
      style={{
        height: isExpanded ? 'auto' : '200px',
      }}
    >
      <div
        className="p-4"
        onClick={!isExpanded && !isEditing ? onToggleExpand : undefined}
      >
        {/* Header Section */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className={avatarBg}>
              <Icon className="w-6 h-6 text-white" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1">{editedWorkflow.name}</h3>
            <p className="text-sm text-gray-600">{editedWorkflow.description}</p>
          </div>
        </div>

        {/* Collapsed State - Metadata */}
        {!isExpanded && (
          <div className="flex items-center gap-3 mt-4">
            <Badge variant="secondary" className="text-xs">
              Used {editedWorkflow.usageCount} times
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {editedWorkflow.estimatedTime}
            </Badge>
          </div>
        )}

        {/* Collapsed State - Expand Indicator */}
        {!isExpanded && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-purple-600">
            <span>View details</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        )}

        {/* Expanded State - Full Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            {/* Metadata */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                Used {editedWorkflow.usageCount} times
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {editedWorkflow.estimatedTime}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {editedWorkflow.steps.length} steps
              </Badge>
            </div>

            {/* Workflow Steps */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4>Workflow Steps</h4>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addStep}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Step
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {isEditing ? (
                  <DndProvider backend={HTML5Backend}>
                    {editedWorkflow.steps.map((step, index) => (
                      <DraggableStepItem
                        key={step.id}
                        step={step}
                        index={index}
                        onUpdate={(updates) => updateStep(index, updates)}
                        onRemove={() => removeStep(index)}
                        moveStep={moveStep}
                      />
                    ))}
                  </DndProvider>
                ) : (
                  editedWorkflow.steps.map((step) => (
                    <WorkflowStepItem key={step.id} step={step} />
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 gap-2"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleCancelEdit}
                >
                  <XIcon className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 gap-2"
                  onClick={onUseWorkflow}
                >
                  <Sparkles className="w-4 h-4" />
                  Use this workflow
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleEdit}
                >
                  <Settings className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            )}

            {/* Hide Details Link */}
            {!isEditing && (
              <div className="w-full flex justify-center pt-2">
                <button
                  onClick={onToggleExpand}
                  className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  <span>Hide details</span>
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
});

const defaultWorkflows: Workflow[] = [
  {
    id: 'strategic-ideation',
    name: 'Strategic Ideation',
    description: 'Generate and refine innovative solutions through structured creative thinking',
    icon: 'Lightbulb',
    color: 'Purple',
    isPreset: true,
    usageCount: 127,
    estimatedTime: '20-25 minutes',
    steps: [
      {
        id: 'si-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define problem, objectives, constraints',
        assistants: [],
      },
      {
        id: 'si-2',
        order: 2,
        name: 'Ideate',
        roleType: 'ai',
        description: 'Generate creative and innovative solutions',
        assistants: ['creative-innovator', 'visionary-strategist', 'all-rounder'],
        promptTemplate: 'Generate innovative ideas for [problem]. Consider multiple approaches and unconventional solutions.',
      },
      {
        id: 'si-3',
        order: 3,
        name: 'Assess',
        roleType: 'human',
        description: 'Evaluate feasibility and alignment',
        assistants: [],
      },
      {
        id: 'si-4',
        order: 4,
        name: 'Refine',
        roleType: 'ai',
        description: 'Polish and improve selected concepts',
        assistants: ['writing-coach', 'product-manager'],
        promptTemplate: 'Refine the selected ideas. Improve clarity, strengthen value proposition, and address potential concerns.',
      },
      {
        id: 'si-5',
        order: 5,
        name: 'Synthesise',
        roleType: 'human',
        description: 'Select and integrate best concepts',
        assistants: [],
      },
    ],
  },
  {
    id: 'critical-decision-making',
    name: 'Critical Decision Making',
    description: 'Evaluate options and make informed decisions with comprehensive analysis',
    icon: 'Target',
    color: 'Blue',
    isPreset: true,
    usageCount: 203,
    estimatedTime: '25-30 minutes',
    steps: [
      {
        id: 'cdm-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define decision criteria',
        assistants: [],
      },
      {
        id: 'cdm-2',
        order: 2,
        name: 'Generate',
        roleType: 'ai',
        description: 'Identify all possible options',
        assistants: ['all-rounder', 'product-manager'],
        promptTemplate: 'Generate comprehensive list of options for [decision]. Include conventional and alternative approaches.',
      },
      {
        id: 'cdm-3',
        order: 3,
        name: 'Analyse',
        roleType: 'ai',
        description: 'Evaluate each option systematically',
        assistants: ['data-analyst', 'finance-guru', 'tech-troubleshooter'],
        promptTemplate: 'Analyze each option considering: feasibility, costs, risks, benefits, and long-term implications.',
      },
      {
        id: 'cdm-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Question assumptions and identify risks',
        assistants: ['devils-advocate', 'legal-analyst'],
        promptTemplate: 'Challenge the analysis. What assumptions might be wrong? What risks are overlooked?',
      },
      {
        id: 'cdm-5',
        order: 5,
        name: 'Assess',
        roleType: 'human',
        description: 'Make final decision',
        assistants: [],
      },
      {
        id: 'cdm-6',
        order: 6,
        name: 'Present',
        roleType: 'ai',
        description: 'Document decision rationale',
        assistants: ['writing-coach'],
        promptTemplate: 'Present the decision and rationale in a clear, compelling format for stakeholders.',
      },
    ],
  },
  {
    id: 'rapid-problem-solving',
    name: 'Rapid Problem Solving',
    description: 'Quickly diagnose and solve problems with tactical precision',
    icon: 'Zap',
    color: 'Amber',
    isPreset: true,
    usageCount: 156,
    estimatedTime: '15-20 minutes',
    steps: [
      {
        id: 'rps-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Describe problem and impact',
        assistants: [],
      },
      {
        id: 'rps-2',
        order: 2,
        name: 'Analyse',
        roleType: 'ai',
        description: 'Diagnose root causes',
        assistants: ['methodical-proofreader', 'data-analyst'],
        promptTemplate: 'Analyze the problem systematically. Identify root causes, contributing factors, and patterns.',
      },
      {
        id: 'rps-3',
        order: 3,
        name: 'Generate',
        roleType: 'ai',
        description: 'Propose tactical solutions',
        assistants: ['tech-troubleshooter', 'product-manager'],
        promptTemplate: 'Generate practical solutions that address the root causes. Focus on quick wins and sustainable fixes.',
      },
      {
        id: 'rps-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Stress-test proposed solutions',
        assistants: ['devils-advocate'],
        promptTemplate: 'Challenge the proposed solutions. What could go wrong? What are we missing?',
      },
      {
        id: 'rps-5',
        order: 5,
        name: 'Curate',
        roleType: 'human',
        description: 'Select best solution',
        assistants: [],
      },
      {
        id: 'rps-6',
        order: 6,
        name: 'Refine',
        roleType: 'ai',
        description: 'Detail implementation plan',
        assistants: ['all-rounder'],
        promptTemplate: 'Refine the selected solution into a detailed action plan with steps, timeline, and resources needed.',
      },
    ],
  },
  {
    id: 'content-creation-refinement',
    name: 'Content Creation & Refinement',
    description: 'Develop polished written content from concept to final draft',
    icon: 'FileText',
    color: 'Emerald',
    isPreset: true,
    usageCount: 184,
    estimatedTime: '20-25 minutes',
    steps: [
      {
        id: 'ccr-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define audience, purpose, tone',
        assistants: [],
      },
      {
        id: 'ccr-2',
        order: 2,
        name: 'Generate',
        roleType: 'ai',
        description: 'Create initial draft',
        assistants: ['writing-coach', 'marketing-expert'],
        promptTemplate: 'Generate [content type] for [audience] about [topic]. Tone: [tone]. Key points: [points].',
      },
      {
        id: 'ccr-3',
        order: 3,
        name: 'Check',
        roleType: 'ai',
        description: 'Verify accuracy and clarity',
        assistants: ['science-communicator', 'legal-analyst'],
        promptTemplate: 'Review the content for accuracy, clarity, and potential issues. Check facts and claims.',
      },
      {
        id: 'ccr-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Critique messaging and effectiveness',
        assistants: ['devils-advocate', 'marketing-expert'],
        promptTemplate: 'Critique the content. Is the message clear? Will it resonate with the audience? What could be improved?',
      },
      {
        id: 'ccr-5',
        order: 5,
        name: 'Refine',
        roleType: 'ai',
        description: 'Polish and perfect the content',
        assistants: ['writing-coach', 'methodical-proofreader'],
        promptTemplate: 'Refine the content based on feedback. Improve flow, strengthen arguments, polish language.',
      },
      {
        id: 'ccr-6',
        order: 6,
        name: 'Assess',
        roleType: 'human',
        description: 'Final approval',
        assistants: [],
      },
    ],
  },
  {
    id: 'research-synthesis',
    name: 'Research & Synthesis',
    description: 'Deep dive into topics and synthesize insights into actionable understanding',
    icon: 'Search',
    color: 'Cyan',
    isPreset: true,
    usageCount: 91,
    estimatedTime: '25-30 minutes',
    steps: [
      {
        id: 'rs-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Research questions and goals',
        assistants: [],
      },
      {
        id: 'rs-2',
        order: 2,
        name: 'Find',
        roleType: 'ai',
        description: 'Gather relevant information',
        assistants: ['all-rounder', 'science-communicator'],
        promptTemplate: 'Research [topic]. Find key information, sources, data, and perspectives. Be comprehensive.',
      },
      {
        id: 'rs-3',
        order: 3,
        name: 'Analyse',
        roleType: 'ai',
        description: 'Evaluate and categorize findings',
        assistants: ['data-analyst', 'methodical-proofreader'],
        promptTemplate: 'Analyze the research findings. Identify patterns, themes, contradictions, and key insights.',
      },
      {
        id: 'rs-4',
        order: 4,
        name: 'Adapt',
        roleType: 'ai',
        description: 'Contextualize for your needs',
        assistants: ['science-communicator', 'writing-coach'],
        promptTemplate: 'Adapt the research insights for [context]. Make it accessible, relevant, and actionable.',
      },
      {
        id: 'rs-5',
        order: 5,
        name: 'Synthesise',
        roleType: 'human',
        description: 'Connect insights',
        assistants: [],
      },
      {
        id: 'rs-6',
        order: 6,
        name: 'Present',
        roleType: 'ai',
        description: 'Create comprehensive summary',
        assistants: ['writing-coach'],
        promptTemplate: 'Present the research synthesis in a clear, structured format with key findings and recommendations.',
      },
    ],
  },
];

export function WorkflowBuilder() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { selectedWorkflow, setSelectedWorkflow } = useSelection();
  const [workflows, setWorkflows] = useState<Workflow[]>(defaultWorkflows);
  const [expandedWorkflowId, setExpandedWorkflowId] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || Lightbulb;
    return Icon;
  };

  const handleToggleExpand = (workflowId: string) => {
    setExpandedWorkflowId(expandedWorkflowId === workflowId ? null : workflowId);
  };

  const handleUseWorkflow = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
    navigate('home');
  };

  const handleEditWorkflow = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
    navigate('workflow-editor');
  };

  const handleSaveWorkflow = (updatedWorkflow: Workflow) => {
    setWorkflows(workflows.map(w => 
      w.id === updatedWorkflow.id ? updatedWorkflow : w
    ));
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Workflows</h2>
          </div>
          <Button onClick={() => navigate('workflow-editor')} className="gap-2">
            <Plus className="w-4 h-4" />
            New Workflow
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-4">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                style={{
                  opacity: expandedWorkflowId && expandedWorkflowId !== workflow.id ? 0.6 : 1,
                  transition: 'opacity 300ms ease-in-out',
                }}
              >
                <WorkflowCard
                  workflow={workflow}
                  isExpanded={expandedWorkflowId === workflow.id}
                  onToggleExpand={() => handleToggleExpand(workflow.id)}
                  onUseWorkflow={() => handleUseWorkflow(workflow.id)}
                  onEditWorkflow={() => handleEditWorkflow(workflow.id)}
                  onSaveWorkflow={handleSaveWorkflow}
                  getIcon={getIcon}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
