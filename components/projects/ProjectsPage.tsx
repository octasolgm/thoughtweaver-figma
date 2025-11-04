import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { SidebarTrigger } from '../ui/sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Plus, FolderOpen, MessageSquare, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useConversation, useNavigation, useSelection } from '../../contexts';

export interface Project {
  id: string;
  name: string;
  description: string;
  conversationIds: string[];
  createdAt: Date;
}

export function ProjectsPage() {
  const { navigate } = useNavigation();
  const { selectedWorkflow, selectedAssistants } = useSelection();
  const {
    projects,
    conversations,
    createProject,
    deleteProject,
    addConversationToProject,
    removeConversationFromProject,
    createConversationInProject,
    viewConversation,
  } = useConversation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [draggedConversationId, setDraggedConversationId] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName, newProjectDescription);
      setNewProjectName('');
      setNewProjectDescription('');
      setIsCreateDialogOpen(false);
    }
  };

  const toggleProjectExpanded = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Get conversations that are not in any project
  const unassignedConversations = conversations.filter(
    (conv) => !projects.some((proj) => proj.conversationIds.includes(conv.id))
  );

  const handleDragStart = (conversationId: string) => {
    setDraggedConversationId(conversationId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (projectId: string) => {
    if (draggedConversationId) {
      // Remove from any existing project first
      projects.forEach((proj) => {
        if (proj.conversationIds.includes(draggedConversationId)) {
          removeConversationFromProject(draggedConversationId, proj.id);
        }
      });
      // Add to new project
      addConversationToProject(draggedConversationId, projectId);
      setDraggedConversationId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedConversationId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Projects</h2>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Organize your conversations into a project</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="project-name" className="text-sm">
                    Project Name
                  </label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateProject();
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="project-description" className="text-sm">
                    Description (optional)
                  </label>
                  <Input
                    id="project-description"
                    placeholder="Enter project description"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Projects List */}
          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <FolderOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg mb-2">No projects yet</h3>
              <p className="text-gray-500">Create a project to organize your conversations</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => {
                const projectConversations = conversations.filter((conv) =>
                  project.conversationIds.includes(conv.id)
                );
                const isExpanded = expandedProjects.has(project.id);

                return (
                  <Card
                    key={project.id}
                    className="overflow-hidden"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(project.id)}
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleProjectExpanded(project.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FolderOpen className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            <h3 className="truncate">{project.name}</h3>
                            <span className="text-sm text-gray-500 flex-shrink-0">
                              ({projectConversations.length} {projectConversations.length === 1 ? 'conversation' : 'conversations'})
                            </span>
                          </div>
                          {project.description && (
                            <p className="text-sm text-gray-600 ml-7">{project.description}</p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                createConversationInProject(project.id, selectedWorkflow, selectedAssistants);
                                navigate('conversation');
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              New Conversation
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProject(project.id);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Conversations in Project */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4">
                        {projectConversations.length === 0 ? (
                          <div className="text-center py-8">
                            <MessageSquare className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-4">No conversations in this project yet</p>
                            <Button
                              onClick={() => {
                                createConversationInProject(project.id, selectedWorkflow, selectedAssistants);
                                navigate('conversation');
                              }}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Create Conversation
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {projectConversations.map((conv) => (
                              <div
                                key={conv.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow group"
                              >
                                <button
                                  onClick={() => {
                                    viewConversation(conv.id);
                                    navigate('conversation');
                                  }}
                                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                >
                                  <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{conv.title}</span>
                                </button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeConversationFromProject(conv.id, project.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {/* Unassigned Conversations */}
          {unassignedConversations.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4">Unassigned Conversations</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag these conversations into a project to organize them
              </p>
              <div className="space-y-2">
                {unassignedConversations.map((conv) => (
                  <div
                    key={conv.id}
                    draggable
                    onDragStart={() => handleDragStart(conv.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors ${
                      draggedConversationId === conv.id ? 'opacity-50' : ''
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <button
                      onClick={() => {
                        viewConversation(conv.id);
                        navigate('conversation');
                      }}
                      className="truncate text-left flex-1 min-w-0"
                    >
                      {conv.title}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}