import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { SidebarTrigger } from '../ui/sidebar';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { 
  Cpu,
  Zap,
  DollarSign,
  Check,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  speed: 'fast' | 'medium' | 'slow';
  cost: 'low' | 'medium' | 'high';
  capabilities: string[];
  enabled: boolean;
}

import { useAuth, useNavigation, useSelection } from '../../contexts';

export function SelectLLMsPage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { selectedLLM, setSelectedLLM } = useSelection();
  const [models, setModels] = useState<LLMModel[]>([
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'Most capable model for complex reasoning and creative tasks',
      speed: 'medium',
      cost: 'high',
      capabilities: ['Reasoning', 'Creativity', 'Analysis'],
      enabled: true,
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      description: 'Fast and efficient for most general tasks',
      speed: 'fast',
      cost: 'low',
      capabilities: ['Speed', 'Efficiency'],
      enabled: true,
    },
    {
      id: 'claude-3',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: 'Advanced reasoning with strong analytical capabilities',
      speed: 'medium',
      cost: 'high',
      capabilities: ['Analysis', 'Research', 'Writing'],
      enabled: false,
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Balanced performance and cost for everyday tasks',
      speed: 'fast',
      cost: 'medium',
      capabilities: ['Balance', 'Versatility'],
      enabled: true,
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Multimodal understanding with strong performance',
      speed: 'fast',
      cost: 'medium',
      capabilities: ['Multimodal', 'Context'],
      enabled: false,
    },
    {
      id: 'llama-3',
      name: 'Llama 3 70B',
      provider: 'Meta',
      description: 'Open source model with strong general capabilities',
      speed: 'medium',
      cost: 'low',
      capabilities: ['Open Source', 'Customizable'],
      enabled: false,
    },
  ]);

  const [temperature, setTemperature] = useState([0.7]);

  const toggleModel = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId ? { ...model, enabled: !model.enabled } : model
    ));
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'slow': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Select LLMs</h2>
          </div>
          <Button>
            Save Configuration
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Global Settings */}
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h3>Global Settings</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">These settings apply to all selected language models</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Temperature</Label>
                  <span className="text-sm text-gray-500">{temperature[0]}</span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Higher values make output more creative, lower values more focused
                </p>
              </div>
            </div>
          </Card>

          {/* Available Models */}
          <div className="mb-4">
            <h3 className="mb-1">Available Models</h3>
            <p className="text-sm text-gray-600">
              Select which language models to use in your workflows
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {models.map((model) => (
              <Card
                key={model.id}
                className={`p-6 transition-all ${
                  model.enabled 
                    ? 'ring-2 ring-purple-500 bg-purple-50/50' 
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3>{model.name}</h3>
                      {model.enabled && (
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{model.provider}</p>
                  </div>
                  <Switch
                    checked={model.enabled}
                    onCheckedChange={() => toggleModel(model.id)}
                  />
                </div>

                <p className="text-sm text-gray-600 mb-4">{model.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {model.capabilities.map((capability) => (
                    <Badge key={capability} variant="secondary" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <Badge className={getSpeedColor(model.speed)}>
                      {model.speed}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <Badge className={getCostColor(model.cost)}>
                      {model.cost} cost
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className="p-6 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1">Selected Models</h3>
                <p className="text-sm text-gray-600">
                  {models.filter(m => m.enabled).length} models enabled
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {models.filter(m => m.enabled).map((model) => (
                  <Badge key={model.id} className="gap-1">
                    <Cpu className="w-3 h-3" />
                    {model.name}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}