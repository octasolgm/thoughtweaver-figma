import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft,
  Plus,
  GripVertical,
  X,
  Save,
  ArrowRight
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: string;
  isCustom: boolean;
  usageCount: number;
  steps: WorkflowStep[];
}

import { useAuth, useNavigation, useSelection } from '../../contexts';

export function WorkflowEditor() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { selectedWorkflow, setSelectedWorkflow } = useSelection();
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow>({
    id: `custom-${Date.now()}`,
    name: 'New Workflow',
    description: 'Custom workflow',
    icon: 'Lightbulb',
    isCustom: true,
    usageCount: 0,
    steps: [
      {
        id: '1',
        title: 'Step 1',
        description: 'First step description',
        prompt: 'Enter prompt for this step'
      }
    ]
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      title: `Step ${editingWorkflow.steps.length + 1}`,
      description: 'Describe what this step accomplishes',
      prompt: 'Enter the AI prompt for this step'
    };
    setEditingWorkflow({
      ...editingWorkflow,
      steps: [...editingWorkflow.steps, newStep]
    });
  };

  const removeStep = (stepId: string) => {
    if (editingWorkflow.steps.length > 1) {
      setEditingWorkflow({
        ...editingWorkflow,
        steps: editingWorkflow.steps.filter(s => s.id !== stepId)
      });
    }
  };

  const updateStep = (stepId: string, field: keyof WorkflowStep, value: string) => {
    setEditingWorkflow({
      ...editingWorkflow,
      steps: editingWorkflow.steps.map(s =>
        s.id === stepId ? { ...s, [field]: value } : s
      )
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSteps = [...editingWorkflow.steps];
    const draggedStep = newSteps[draggedIndex];
    
    // Remove from old position
    newSteps.splice(draggedIndex, 1);
    // Insert at new position
    newSteps.splice(index, 0, draggedStep);

    setEditingWorkflow({
      ...editingWorkflow,
      steps: newSteps
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    // In a real app, you would save to a backend or state management
    // For now, we just navigate back
    navigate('workflow');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('workflow')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2>Create Workflow</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('workflow')}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Workflow
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Workflow Details */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Workflow Name</label>
                <Input
                  value={editingWorkflow.name}
                  onChange={(e) => setEditingWorkflow({ ...editingWorkflow, name: e.target.value })}
                  placeholder="e.g., Strategic Decision Making"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Description</label>
                <Input
                  value={editingWorkflow.description}
                  onChange={(e) => setEditingWorkflow({ ...editingWorkflow, description: e.target.value })}
                  placeholder="Brief description of what this workflow helps with"
                />
              </div>
            </div>
          </Card>

          {/* Steps Section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Workflow Steps</h3>
              <p className="text-sm text-gray-600 mt-1">Drag steps to reorder them</p>
            </div>
            <Button onClick={addStep} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Step
            </Button>
          </div>

          <div className="space-y-4">
            {editingWorkflow.steps.map((step, index) => (
              <div key={step.id}>
                <Card
                  className={`p-6 transition-all ${draggedIndex === index ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-start gap-4">
                    <div className="cursor-grab active:cursor-grabbing pt-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Step {index + 1}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(step.id)}
                          disabled={editingWorkflow.steps.length === 1}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm text-gray-700">Step Title</label>
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                          placeholder="e.g., Problem Analysis"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm text-gray-700">Description</label>
                        <Input
                          value={step.description}
                          onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                          placeholder="What does this step accomplish?"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm text-gray-700">AI Prompt</label>
                        <Textarea
                          value={step.prompt}
                          onChange={(e) => updateStep(step.id, 'prompt', e.target.value)}
                          rows={3}
                          placeholder="Enter the prompt that the AI will use for this step"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Arrow between steps */}
                {index < editingWorkflow.steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tips */}
          <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
            <h4 className="mb-2">💡 Tips for creating effective workflows</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Start with problem definition or context gathering</li>
              <li>Include divergent thinking (exploration) before convergent thinking (decision)</li>
              <li>Use clear, specific prompts that guide the AI's response</li>
              <li>End with actionable next steps or summaries</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}