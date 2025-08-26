
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Wifi, WifiOff, User, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const getTitleFromPathname = (pathname: string): string => {
  if (pathname.startsWith('/pos')) return 'Point of Sale';
  if (pathname.startsWith('/admin/dashboard')) return 'Admin Dashboard';
  if (pathname.startsWith('/admin/tenants')) return 'Tenant Management';
  if (pathname.startsWith('/admin/leases')) return 'Lease Management';
  if (pathname.startsWith('/admin/permissions')) return 'User Permissions';
  if (pathname.startsWith('/admin/reports')) return 'System Reports';
  if (pathname.startsWith('/admin/backup')) return 'Backup & Restore';
  if (pathname.startsWith('/settings')) return 'Settings';
  if (pathname.startsWith('/profile')) return 'Profile';
  if (pathname.startsWith('/notifications')) return 'Notifications';
  return 'BoxPOS';
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'onLine' in navigator) {
      setIsOnline(navigator.onLine);
    }
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  const pageTitle = getTitleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
      <div className="ml-auto flex items-center gap-4">
        <Badge variant={isOnline ? 'default' : 'destructive'} className="bg-opacity-20 border-opacity-30 text-foreground">
          {isOnline ? (
            <Wifi className="mr-2 h-4 w-4" />
          ) : (
            <WifiOff className="mr-2 h-4 w-4" />
          )}
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
        </Link>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://picsum.photos/200" alt="User" data-ai-hint="person portrait"/>
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            john.doe@example.com
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                    Settings
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/login')}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
