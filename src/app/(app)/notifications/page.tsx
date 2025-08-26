
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bell, Search, Filter, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

type NotificationType = 'info' | 'warning' | 'error';
interface Notification {
  id: number;
  message: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: 1, message: 'Payment of $45.50 from order #1024 was successful.', timestamp: '2024-07-30T10:00:00Z', type: 'info', read: false },
  { id: 2, message: 'Stock for "Croissant" is low. Only 5 remaining.', timestamp: '2024-07-30T09:30:00Z', type: 'warning', read: false },
  { id: 3, message: 'Failed to process payment for order #1023.', timestamp: '2024-07-30T09:15:00Z', type: 'error', read: true },
  { id: 4, message: 'New user "Jane Doe" has been registered.', timestamp: '2024-07-29T18:00:00Z', type: 'info', read: true },
  { id: 5, message: 'Daily sales report is ready for download.', timestamp: '2024-07-29T17:00:00Z', type: 'info', read: true },
  { id: 6, message: 'Connection to receipt printer was lost.', timestamp: '2024-07-29T16:45:00Z', type: 'warning', read: true },
];

const typeMap: Record<NotificationType, { icon: React.ElementType; color: string; variant: 'default' | 'destructive' | 'secondary' }> = {
  info: { icon: CheckCircle, color: 'text-green-500', variant: 'default' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', variant: 'secondary' },
  error: { icon: XCircle, color: 'text-red-500', variant: 'destructive' },
};


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<NotificationType | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const dismissNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };
    
    const filteredNotifications = useMemo(() => {
        return notifications
            .filter(n => filter === 'all' || n.type === filter)
            .filter(n => n.message.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [notifications, filter, searchTerm]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
       <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">View and manage all your system alerts.</p>
      </header>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
             <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search notifications..." 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('info')}>Info</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('warning')}>Warning</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('error')}>Error</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full">
            {filteredNotifications.length > 0 ? (
                <ul className="divide-y">
                    {filteredNotifications.map((notification) => {
                        const Icon = typeMap[notification.type].icon;
                        return (
                             <li key={notification.id} className={`flex items-start gap-4 p-4 ${!notification.read ? 'bg-accent/50' : ''}`}>
                                <Icon className={`mt-1 h-5 w-5 ${typeMap[notification.type].color}`} />
                                <div className="flex-1">
                                    <p className="font-medium">{notification.message}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!notification.read && (
                                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>Mark as read</Button>
                                    )}
                                    <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => dismissNotification(notification.id)}>Dismiss</Button>
                                </div>
                             </li>
                        );
                    })}
                </ul>
            ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Bell className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold">All caught up!</h3>
                    <p className="text-muted-foreground">You have no new notifications.</p>
                </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
