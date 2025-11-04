import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { SidebarTrigger } from '../ui/sidebar';
import { 
  FileText,
  Upload,
  X,
  Sparkles,
  Save
} from 'lucide-react';
import { useAuth, useNavigation } from '../../contexts';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
}

export function ContextBuilder() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [contextText, setContextText] = useState(
    "I'm developing a mobile application focused on helping fitness enthusiasts build sustainable habits. My target audience is primarily 25-35 year olds who are motivated but struggle with consistency."
  );
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'User Research Summary.pdf', type: 'PDF', size: '2.4 MB' },
    { id: '2', name: 'Market Analysis.docx', type: 'DOCX', size: '1.8 MB' },
  ]);

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const newDoc: Document = {
      id: Date.now().toString(),
      name: 'New Document.pdf',
      type: 'PDF',
      size: '1.2 MB'
    };
    setDocuments([...documents, newDoc]);
  };

  const generateSummary = () => {
    return `Working on a fitness habit-building app for 25-35 year olds. Key focus: sustainability and consistency. ${documents.length} supporting documents attached.`;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Context Builder</h2>
          </div>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Context
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Context Summary */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Context Summary</h3>
                <p className="text-gray-700">
                  {generateSummary()}
                </p>
              </div>
            </div>
          </Card>

          {/* Context Text */}
          <Card className="p-6 mb-6">
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Background Information</label>
              <p className="text-sm text-gray-600 mb-4">
                Provide context about your project, goals, constraints, or any other relevant information
              </p>
            </div>
            <Textarea
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              className="min-h-[200px] resize-none"
              placeholder="Describe your project, goals, challenges, and any other relevant context..."
            />
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                {contextText.length} characters
              </p>
              <Button variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="mb-1">Supporting Documents</h3>
                <p className="text-sm text-gray-600">
                  Upload files to provide additional context
                </p>
              </div>
              <Button onClick={handleFileUpload} className="gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </Button>
            </div>

            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {doc.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No documents uploaded</p>
                <p className="text-sm text-gray-500">
                  Upload PDFs, documents, or other files to enhance context
                </p>
              </div>
            )}
          </Card>

          {/* Dynamic Context Updates Info */}
          <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
            <h3 className="mb-2">💡 Dynamic Context</h3>
            <p className="text-sm text-gray-700">
              Your context is automatically updated during conversations based on:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-700 ml-4">
              <li>• New information shared in discussions</li>
              <li>• Decisions and conclusions reached</li>
              <li>• Files and references added during sessions</li>
              <li>• Feedback and refinements from AI assistants</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}