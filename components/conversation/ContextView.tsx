import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Plus, X } from 'lucide-react';

interface ContextViewProps {
  initialContext: string;
}

interface ContextItem {
  id: string;
  content: string;
  timestamp: Date;
}

export function ContextView({ initialContext }: ContextViewProps) {
  const [contextItems, setContextItems] = useState<ContextItem[]>([
    {
      id: '1',
      content: initialContext,
      timestamp: new Date(),
    }
  ]);
  const [newContext, setNewContext] = useState('');
  const [isAdding, setIsAdding] = useState(false);

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

  const handleAddContext = () => {
    if (!newContext.trim()) return;

    const newItem: ContextItem = {
      id: Date.now().toString(),
      content: newContext,
      timestamp: new Date(),
    };

    setContextItems(prev => [...prev, newItem]);
    setNewContext('');
    setIsAdding(false);
  };

  const handleRemoveContext = (id: string) => {
    // Don't allow removing the initial context
    if (id === '1') return;
    setContextItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl">Context</h2>
          <p className="text-sm text-gray-600 mt-1">
            All context information for this conversation
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Context
          </Button>
        )}
      </div>

      {/* Context Items */}
      <div className="space-y-4">
        {contextItems.map((item, index) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {index === 0 ? 'Initial Context' : `Added Context ${index}`}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDateTime(item.timestamp)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-gray-800">{item.content}</p>
              </div>
              {item.id !== '1' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveContext(item.id)}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Context Form */}
      {isAdding && (
        <Card className="p-4">
          <h3 className="mb-3">Add New Context</h3>
          <Textarea
            placeholder="Enter additional context information..."
            value={newContext}
            onChange={(e) => setNewContext(e.target.value)}
            className="mb-3 min-h-[120px]"
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewContext('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddContext} disabled={!newContext.trim()}>
              Add Context
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
