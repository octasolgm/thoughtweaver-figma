import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { SidebarTrigger } from '../ui/sidebar';
import { 
  Save,
  Sparkles,
  User,
  MessageSquare,
  Target,
  Sliders
} from 'lucide-react';

import { useAuth, useNavigation } from '../../contexts';

const colorOptions = [
  { name: 'Purple', class: 'bg-purple-500' },
  { name: 'Pink', class: 'bg-pink-500' },
  { name: 'Blue', class: 'bg-blue-500' },
  { name: 'Red', class: 'bg-red-500' },
  { name: 'Green', class: 'bg-green-500' },
  { name: 'Orange', class: 'bg-orange-500' },
  { name: 'Teal', class: 'bg-teal-500' },
  { name: 'Indigo', class: 'bg-indigo-500' },
];

export function AssistantCreator() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [assistantName, setAssistantName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [expertise, setExpertise] = useState('');

  const generateAvatarUrl = () => {
    const seed = assistantName || 'CustomAssistant';
    return `https://thoughtweaver.ai/avatars/custom-assistant.png`;
  };

  const handleSave = () => {
    // Save assistant logic here
    console.log('Saving assistant:', {
      name: assistantName,
      description,
      systemPrompt,
      color: selectedColor,
      expertise,
    });
    // Navigate back to home
    navigate('home');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Create Assistant</h2>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Assistant
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Preview Card */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={generateAvatarUrl()} />
                <AvatarFallback className={selectedColor.class}>
                  {assistantName ? assistantName[0].toUpperCase() : 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="mb-2">
                  {assistantName || 'Your Assistant Name'}
                </h3>
                <p className="text-gray-700">
                  {description || 'Your assistant description will appear here'}
                </p>
                {expertise && (
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">{expertise}</Badge>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Basic Information */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-600" />
              <h3>Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Assistant Name</Label>
                <Input
                  id="name"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="e.g., Strategic Thinker, Tech Expert, Creative Writer"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what this assistant does"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="expertise">Expertise Area (Optional)</Label>
                <Input
                  id="expertise"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  placeholder="e.g., Marketing, Engineering, Design"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Color Selection */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3>Avatar Color</h3>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full ${color.class} transition-all ${
                    selectedColor.name === color.name 
                      ? 'ring-4 ring-purple-300 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  aria-label={color.name}
                />
              ))}
            </div>
          </Card>

          {/* System Prompt */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h3>System Prompt</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Define how this assistant should behave and respond. This is the core instruction that shapes the assistant's personality and capabilities.
            </p>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful assistant that specializes in... Your goal is to... You should approach problems by..."
              className="min-h-[200px] resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              {systemPrompt.length} characters
            </p>
          </Card>

          {/* Advanced Settings (placeholder for future features) */}
          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <h3>💡 Tips for Creating Great Assistants</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2 ml-4">
              <li>• Be specific about the assistant's role and expertise</li>
              <li>• Define the tone and style of responses (formal, casual, technical, etc.)</li>
              <li>• Include any specific methodologies or frameworks to follow</li>
              <li>• Specify how the assistant should structure its responses</li>
              <li>• Consider adding constraints or things to avoid</li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => navigate('home')}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Assistant
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}