import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { SidebarTrigger } from '../ui/sidebar';
import { 
  CreditCard,
  Zap,
  TrendingUp,
  Calendar
} from 'lucide-react';

import { useAuth, useNavigation } from '../../contexts';

export function BillingPage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const currentPlan = 'Pro';
  const usageData = {
    conversations: { used: 47, limit: 100 },
    messages: { used: 1240, limit: 5000 },
    assistants: { used: 156, limit: 500 }
  };

  const billingHistory = [
    { id: '1', date: 'Oct 1, 2025', amount: '$29.00', status: 'Paid' },
    { id: '2', date: 'Sep 1, 2025', amount: '$29.00', status: 'Paid' },
    { id: '3', date: 'Aug 1, 2025', amount: '$29.00', status: 'Paid' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Usage & Billing</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
        {/* Current Plan */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2>{currentPlan} Plan</h2>
                <Badge className="bg-purple-500">Active</Badge>
              </div>
              <p className="text-gray-600">
                $29/month • Renews on November 1, 2025
              </p>
            </div>
            <Button variant="outline" className="bg-white">
              Manage Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">Conversations</p>
              </div>
              <p className="mb-2">
                {usageData.conversations.used} / {usageData.conversations.limit}
              </p>
              <Progress 
                value={(usageData.conversations.used / usageData.conversations.limit) * 100} 
                className="h-2"
              />
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Messages</p>
              </div>
              <p className="mb-2">
                {usageData.messages.used.toLocaleString()} / {usageData.messages.limit.toLocaleString()}
              </p>
              <Progress 
                value={(usageData.messages.used / usageData.messages.limit) * 100} 
                className="h-2"
              />
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">AI Sessions</p>
              </div>
              <p className="mb-2">
                {usageData.assistants.used} / {usageData.assistants.limit}
              </p>
              <Progress 
                value={(usageData.assistants.used / usageData.assistants.limit) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </Card>

        {/* Available Plans */}
        <div className="mb-6">
          <h3 className="mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="mb-2">Free</h3>
              <p className="mb-4">
                <span className="text-gray-600">$0</span>
                <span className="text-sm text-gray-500">/month</span>
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>• 10 conversations/month</li>
                <li>• 100 messages/month</li>
                <li>• 1 AI assistant</li>
                <li>• Basic workflows</li>
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </Card>

            <Card className="p-6 border-2 border-purple-500 relative">
              <Badge className="absolute top-4 right-4 bg-purple-500">Popular</Badge>
              <h3 className="mb-2">Pro</h3>
              <p className="mb-4">
                <span className="text-gray-600">$29</span>
                <span className="text-sm text-gray-500">/month</span>
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>• 100 conversations/month</li>
                <li>• 5,000 messages/month</li>
                <li>• All 6 AI assistants</li>
                <li>• Custom workflows</li>
                <li>• Priority support</li>
              </ul>
              <Button className="w-full" disabled>
                Current Plan
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="mb-2">Enterprise</h3>
              <p className="mb-4">
                <span className="text-gray-600">Custom</span>
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>• Unlimited conversations</li>
                <li>• Unlimited messages</li>
                <li>• Custom AI assistants</li>
                <li>• Advanced workflows</li>
                <li>• Team collaboration</li>
                <li>• Dedicated support</li>
              </ul>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>

        {/* Payment Method */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Payment Method</h3>
            <Button variant="outline">Update</Button>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm">•••• •••• •••• 4242</p>
              <p className="text-xs text-gray-500">Expires 12/2026</p>
            </div>
          </div>
        </Card>

        {/* Billing History */}
        <Card className="p-6">
          <h3 className="mb-4">Billing History</h3>
          <div className="space-y-3">
            {billingHistory.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">{invoice.date}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p>{invoice.amount}</p>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        </div>
      </main>
    </div>
  );
}