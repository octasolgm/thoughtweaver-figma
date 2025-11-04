import { useState, memo } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { SidebarTrigger } from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Plus,
  Edit
} from 'lucide-react';
import { assistants as assistantData, Assistant } from './assistantData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

import { useAuth, useNavigation } from '../../contexts';

// Memoized Assistant Card Component for Performance
const AssistantCard = memo(({ 
  assistant, 
  onEdit 
}: { 
  assistant: Assistant; 
  onEdit: (id: string) => void;
}) => {
  // Transform personality data for radar chart
  const personalityChartData = [
    { trait: 'Openness', value: assistant.personality.openness },
    { trait: 'Conscientiousness', value: assistant.personality.conscientiousness },
    { trait: 'Extraversion', value: assistant.personality.extraversion },
    { trait: 'Agreeableness', value: assistant.personality.agreeableness },
    { trait: 'Emotional Stability', value: 100 - assistant.personality.neuroticism },
  ];

  // Get color from Tailwind class
  const colorMap: Record<string, string> = {
    'bg-purple-500': '#a855f7',
    'bg-blue-600': '#2563eb',
    'bg-indigo-600': '#4f46e5',
    'bg-pink-600': '#db2777',
    'bg-green-600': '#16a34a',
    'bg-amber-700': '#b45309',
    'bg-violet-600': '#7c3aed',
    'bg-slate-600': '#475569',
    'bg-emerald-700': '#047857',
    'bg-fuchsia-600': '#c026d3',
    'bg-blue-700': '#1d4ed8',
    'bg-cyan-600': '#0891b2',
    'bg-gray-700': '#374151',
    'bg-teal-700': '#0f766e',
    'bg-lime-700': '#4d7c0f',
    'bg-rose-600': '#e11d48',
    'bg-orange-700': '#c2410c',
    'bg-red-600': '#dc2626',
    'bg-yellow-600': '#ca8a04',
    'bg-green-700': '#15803d',
    'bg-indigo-700': '#4338ca',
    'bg-stone-700': '#44403c',
    'bg-purple-700': '#7e22ce',
    'bg-sky-700': '#0369a1',
    'bg-neutral-700': '#404040',
    'bg-sky-600': '#0284c7',
    'bg-violet-700': '#6d28d9',
    'bg-emerald-600': '#059669',
    'bg-red-700': '#b91c1c',
    'bg-zinc-700': '#3f3f46',
    'bg-blue-800': '#1e40af',
    'bg-lime-600': '#65a30d',
    'bg-gray-800': '#1f2937',
    'bg-teal-600': '#0d9488',
    'bg-purple-800': '#6b21a8',
    'bg-indigo-800': '#3730a3',
    'bg-green-800': '#166534',
    'bg-orange-600': '#ea580c',
    'bg-amber-600': '#d97706',
    'bg-sky-800': '#075985',
    'bg-rose-700': '#be123c',
  };
  const chartColor = colorMap[assistant.color] || '#a855f7';

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={assistant.avatar} />
            <AvatarFallback className={assistant.color}>
              {assistant.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3>{assistant.name}</h3>
              {assistant.isCustom && (
                <Badge variant="secondary" className="text-xs">Custom</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{assistant.description}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(assistant.id)}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      {/* Personality Radar Chart */}
      <div className="space-y-4">
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={personalityChartData}>
            <PolarGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="trait" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar 
              name="Personality" 
              dataKey="value" 
              stroke="none"
              fill={chartColor} 
              fillOpacity={0.65} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

export function AIAssistantsPage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [assistants] = useState<Assistant[]>(assistantData);

  const handleEdit = (assistantId: string) => {
    navigate(`ai-assistant-editor-${assistantId}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Assistants</h2>
          </div>
          <Button onClick={() => navigate('ai-assistant-editor-new')} className="gap-2">
            <Plus className="w-4 h-4" />
            New Assistant
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Assistant Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assistants.map((assistant) => (
              <AssistantCard 
                key={assistant.id} 
                assistant={assistant} 
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}