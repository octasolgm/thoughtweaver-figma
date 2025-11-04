import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SidebarTrigger } from '../ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  User,
  Settings,
  CreditCard,
  Palette,
  Camera,
  Download,
  TrendingUp,
  MessageSquare,
  Cpu,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { useAuth, useNavigation } from '../../contexts';

export function AccountPage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [notificationPreference, setNotificationPreference] = useState('all');
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');

  const generateAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Account Settings</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Settings className="w-4 h-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Usage & Billing
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-6">Profile Information</h3>
                
                <div className="flex items-start gap-6 mb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label>Profile Picture</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Update your avatar to personalize your account
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Camera className="w-4 h-4" />
                        Upload Photo
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={generateAvatar}
                      >
                        <Palette className="w-4 h-4" />
                        Generate Avatar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="w-4 h-4" />
                    Export Your Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700">
                    Delete Account
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-6">General Preferences</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notifications">Notifications</Label>
                    <Select value={notificationPreference} onValueChange={setNotificationPreference}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Notifications</SelectItem>
                        <SelectItem value="important">Important Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-6">Default Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Default Workflow</Label>
                    <Select defaultValue="build-as-we-go">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="build-as-we-go">Free flowing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Default AI Assistant</Label>
                    <Select defaultValue="all-rounder">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-rounder">All Rounder</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="analytical">Analytical</SelectItem>
                        <SelectItem value="devil-advocate">Devil's Advocate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Usage & Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="mb-1">Current Plan</h3>
                    <p className="text-sm text-gray-600">Professional Plan</p>
                  </div>
                  <Badge className="text-sm px-3 py-1">Active</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MessageSquare className="w-4 h-4" />
                      Conversations
                    </div>
                    <div className="text-2xl">847</div>
                    <div className="text-xs text-gray-500 mt-1">of 1,000 this month</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Cpu className="w-4 h-4" />
                      API Calls
                    </div>
                    <div className="text-2xl">12.4k</div>
                    <div className="text-xs text-gray-500 mt-1">of 15,000 this month</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      Total Spend
                    </div>
                    <div className="text-2xl">$47</div>
                    <div className="text-xs text-gray-500 mt-1">this month</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Conversation Usage</span>
                      <span className="text-gray-600">84.7%</span>
                    </div>
                    <Progress value={84.7} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>API Call Usage</span>
                      <span className="text-gray-600">82.7%</span>
                    </div>
                    <Progress value={82.7} className="h-2" />
                  </div>
                </div>

                <div className="pt-6">
                  <Button className="w-full sm:w-auto">Upgrade Plan</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-6">Payment Method</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm">•••• •••• •••• 4242</div>
                      <div className="text-xs text-gray-600">Expires 12/2025</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>

                <Button variant="outline" className="gap-2">
                  <CreditCard className="w-4 h-4" />
                  Add Payment Method
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3>Billing History</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download All
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    { date: 'Oct 1, 2025', amount: '$47.00', status: 'Paid' },
                    { date: 'Sep 1, 2025', amount: '$47.00', status: 'Paid' },
                    { date: 'Aug 1, 2025', amount: '$47.00', status: 'Paid' },
                  ].map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm">{invoice.date}</div>
                          <div className="text-xs text-gray-600">Professional Plan</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">{invoice.amount}</div>
                        <Badge variant="secondary">{invoice.status}</Badge>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}