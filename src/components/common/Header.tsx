'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const getTitleFromPathname = (pathname: string): string => {
  if (pathname.startsWith('/pos')) return 'Point of Sale';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'BoxPOS';
};

export default function Header() {
  const pathname = usePathname();
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
      <div className="ml-auto">
        <Badge variant={isOnline ? 'default' : 'destructive'} className="bg-opacity-20 border-opacity-30 text-foreground">
          {isOnline ? (
            <Wifi className="mr-2 h-4 w-4" />
          ) : (
            <WifiOff className="mr-2 h-4 w-4" />
          )}
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>
    </header>
  );
}
