import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SidebarTrigger } from '../ui/sidebar';
import { 
  UserPlus,
  Mail,
  MoreVertical,
  Crown,
  Shield,
  User as UserIcon
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  joinedDate: string;
}

import { useAuth, useNavigation } from '../../contexts';

export function TeamPage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: user?.name || 'Current User',
      email: user?.email || 'user@example.com',
      avatar: user?.avatar || '',
      role: 'owner',
      status: 'active',
      joinedDate: 'Jan 15, 2025',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      role: 'admin',
      status: 'active',
      joinedDate: 'Feb 10, 2025',
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      role: 'member',
      status: 'active',
      joinedDate: 'Mar 5, 2025',
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.d@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      role: 'member',
      status: 'pending',
      joinedDate: 'Oct 20, 2025',
    },
  ]);

  const handleInvite = () => {
    if (inviteEmail) {
      // Add invite logic here
      console.log('Inviting:', inviteEmail, 'as', inviteRole);
      setInviteEmail('');
      setInviteDialogOpen(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'admin': return <Shield className="w-4 h-4 text-blue-600" />;
      default: return <UserIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Team</h2>
          </div>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full gap-2" 
                  onClick={handleInvite}
                  disabled={!inviteEmail}
                >
                  <Mail className="w-4 h-4" />
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Team Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="text-sm text-gray-600 mb-1">Total Members</div>
              <div className="text-3xl">{teamMembers.length}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-3xl text-green-600">
                {teamMembers.filter(m => m.status === 'active').length}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-3xl text-yellow-600">
                {teamMembers.filter(m => m.status === 'pending').length}
              </div>
            </Card>
          </div>

          {/* Team Members List */}
          <div className="mb-4">
            <h3>Team Members</h3>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate">{member.name}</h3>
                        {member.id === user.id && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(member.role)}
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role}
                      </Badge>
                    </div>

                    {member.status === 'pending' && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                        Pending
                      </Badge>
                    )}

                    <div className="text-sm text-gray-500 hidden sm:block">
                      Joined {member.joinedDate}
                    </div>

                    {member.id !== user.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {member.role !== 'owner' && (
                            <>
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Remove Member
                              </DropdownMenuItem>
                            </>
                          )}
                          {member.status === 'pending' && (
                            <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Role Descriptions */}
          <Card className="p-6 mt-8">
            <h3 className="mb-4">Role Permissions</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Crown className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">Owner</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Full access to all features, billing, and team management
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">Admin</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Can manage team members, workflows, and settings
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <UserIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">Member</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Can create and participate in conversations and workflows
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
