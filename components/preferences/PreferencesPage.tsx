import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { SidebarTrigger } from '../ui/sidebar';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { 
  Save,
  AlertCircle
} from 'lucide-react';

import { useAuth, useNavigation } from '../../contexts';

export function PreferencesPage() {
  const { user, login } = useAuth();
  const { navigate } = useNavigation();
  const [hasChanges, setHasChanges] = useState(false);

  // LLM selection state - 3 selected by default
  const [selectedLLMs, setSelectedLLMs] = useState({
    'gpt-4': true,
    'claude-3-opus': true,
    'gemini-pro': true,
    'gpt-3.5-turbo': false,
    'llama-3': false,
  });

  const llmOptions = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'llama-3', name: 'Llama 3 70B', provider: 'Meta' },
  ];

  const handleLLMToggle = (llmId: string) => {
    setSelectedLLMs(prev => ({
      ...prev,
      [llmId]: !prev[llmId as keyof typeof prev]
    }));
    setHasChanges(true);
  };

  const selectedCount = Object.values(selectedLLMs).filter(Boolean).length;

  const handleSave = () => {
    setHasChanges(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Preferences</h2>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* LLM Preferences - Moved to top */}
          <Card className="p-6 mb-6">
            <div className="mb-6">
              <h3 className="mb-2">Language Models</h3>
              <p className="text-sm text-gray-600">
                Select which LLMs to use for your conversations ({selectedCount} selected)
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {llmOptions.map((option) => (
                <div key={option.id} className="flex items-start gap-3">
                  <Checkbox
                    id={option.id}
                    checked={selectedLLMs[option.id as keyof typeof selectedLLMs]}
                    onCheckedChange={() => handleLLMToggle(option.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="cursor-pointer">
                      {option.name}
                    </Label>
                    <p className="text-xs text-gray-500">{option.provider}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-700">
                Selecting more LLMs may improve the quality of results, but consume tokens more quickly.
              </p>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <h3 className="mb-4">Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <div>
                  <p className="text-sm">Email notifications for shared conversations</p>
                  <p className="text-xs text-gray-500">Get notified when someone shares a conversation with you</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <div>
                  <p className="text-sm">Weekly usage summary</p>
                  <p className="text-xs text-gray-500">Receive a weekly digest of your ideation sessions</p>
                </div>
              </label>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
