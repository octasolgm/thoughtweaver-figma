import { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
} from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { 
  Workflow,
  Settings,
  MessageSquare,
  Users,
  Home,
  Search,
  Bot,
  FolderOpen
} from 'lucide-react';
import { useAuth, useNavigation, useConversation } from '../../contexts';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const { currentPage, navigate } = useNavigation();
  const { conversations, activeConversationId, viewConversation, projects } = useConversation();
  
  // Get all conversation IDs that are assigned to projects
  const assignedConversationIds = new Set(
    projects.flatMap(project => project.conversationIds)
  );
  
  // Filter conversations that are NOT assigned to any project
  const unassignedConversations = conversations.filter(
    conv => !assignedConversationIds.has(conv.id)
  );
  
  // Helper to get conversations for a specific project
  const getProjectConversations = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    return conversations.filter(conv => project.conversationIds.includes(conv.id));
  };
  
  // Format timestamp for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            {/* Search Box */}
            <div className="px-4 py-4 border-b border-sidebar-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9 h-9 bg-sidebar-accent/50 border-sidebar-border"
                />
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate('home')}
                      isActive={currentPage === 'home'}
                      tooltip="Thoughtweaver"
                    >
                      <Home className="w-4 h-4" />
                      <span>Thoughtweaver</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate('preferences')}
                      isActive={currentPage === 'preferences'}
                      tooltip="Preferences"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Preferences</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate('ai-assistants')}
                      isActive={currentPage === 'ai-assistants' || currentPage.startsWith('assistant-editor')}
                      tooltip="Assistants"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Assistants</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate('workflow')}
                      isActive={currentPage === 'workflow'}
                      tooltip="Workflows"
                    >
                      <Workflow className="w-4 h-4" />
                      <span>Workflows</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate('projects')}
                      isActive={currentPage === 'projects'}
                      tooltip="Projects"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Projects</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      {projects.length === 0 ? (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton disabled>
                            <span className="text-xs text-muted-foreground">No projects yet</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ) : (
                        projects.map((project) => {
                          const projectConversations = getProjectConversations(project.id);
                          return (
                            <SidebarMenuSubItem key={project.id}>
                              <SidebarMenuSubButton
                                onClick={() => navigate('projects')}
                              >
                                <FolderOpen className="w-3.5 h-3.5" />
                                <span className="truncate text-sm">{project.name}</span>
                                {projectConversations.length > 0 && (
                                  <span className="ml-auto text-xs text-muted-foreground">
                                    {projectConversations.length}
                                  </span>
                                )}
                              </SidebarMenuSubButton>
                              {/* Nested conversations under this project */}
                              {projectConversations.length > 0 && (
                                <SidebarMenuSub>
                                  {projectConversations.map((conv) => (
                                    <SidebarMenuSubItem key={conv.id}>
                                      <SidebarMenuSubButton
                                        onClick={() => {
                                          viewConversation(conv.id);
                                          navigate('conversation');
                                        }}
                                        isActive={activeConversationId === conv.id}
                                      >
                                        <MessageSquare className="w-3 h-3" />
                                        <span className="truncate text-xs">{conv.title}</span>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              )}
                            </SidebarMenuSubItem>
                          );
                        })
                      )}
                    </SidebarMenuSub>
                  </SidebarMenuItem>

                  {/* Team - Hidden for R2 (Release 2) */}
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate('team')}
                      isActive={currentPage === 'team'}
                      tooltip="Team"
                    >
                      <Users className="w-4 h-4" />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}

                  {/* Conversations - Only unassigned conversations */}
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Conversations">
                      <MessageSquare className="w-4 h-4" />
                      <span>Conversations</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      {unassignedConversations.length === 0 ? (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton disabled>
                            <span className="text-xs text-muted-foreground">
                              {conversations.length === 0 ? 'No conversations yet' : 'All assigned to projects'}
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ) : (
                        unassignedConversations.map((conv) => (
                          <SidebarMenuSubItem key={conv.id}>
                            <SidebarMenuSubButton
                              onClick={() => {
                                viewConversation(conv.id);
                                navigate('conversation');
                              }}
                              isActive={activeConversationId === conv.id}
                            >
                              <span className="truncate text-sm">{conv.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      )}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-4">
            <button 
              onClick={() => navigate('account')}
              className="flex items-center gap-3 w-full hover:bg-sidebar-accent rounded-lg p-2 transition-colors"
            >
              <Avatar className="w-9 h-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}