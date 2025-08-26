
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  Box,
  User,
  Bell,
  LogOut,
  Users,
  FileText,
  Shield,
  FileBarChart,
  DatabaseZap,
} from 'lucide-react';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

const mainNavItems = [
  { href: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
];

const adminNavItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/tenants', icon: Users, label: 'Tenants' },
    { href: '/admin/leases', icon: FileText, label: 'Leases' },
    { href: '/admin/permissions', icon: Shield, label: 'Permissions' },
    { href: '/admin/reports', icon: FileBarChart, label: 'Reports' },
    { href: '/admin/backup', icon: DatabaseZap, label: 'Backup' },
];

const settingsNavItem = { href: '/settings', icon: Settings, label: 'Settings' };

export default function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    router.push('/login');
  };

  const checkActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Box className="w-8 h-8 text-primary" />
          <span className="text-lg font-semibold whitespace-nowrap group-data-[collapsible=icon]:hidden">
            BoxPOS
          </span>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={checkActive(item.href)}
                  tooltip={{
                    children: item.label,
                    hidden: state === 'expanded',
                  }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenu>
                {adminNavItems.map((item) => (
                     <SidebarMenuItem key={item.href}>
                        <Link href={item.href} legacyBehavior passHref>
                            <SidebarMenuButton
                            asChild
                            isActive={checkActive(item.href)}
                            tooltip={{
                                children: item.label,
                                hidden: state === 'expanded',
                            }}
                            >
                            <a>
                                <item.icon />
                                <span>{item.label}</span>
                            </a>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href={settingsNavItem.href} legacyBehavior passHref>
                    <SidebarMenuButton
                        asChild
                        isActive={checkActive(settingsNavItem.href)}
                        tooltip={{
                            children: settingsNavItem.label,
                            hidden: state === 'expanded',
                        }}
                    >
                    <a>
                        <settingsNavItem.icon />
                        <span>{settingsNavItem.label}</span>
                    </a>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
           <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setIsLogoutModalOpen(true)}
                  tooltip={{
                    children: 'Logout',
                    hidden: state === 'expanded',
                  }}
                >
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <AlertDialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login screen. Any unsaved changes may be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, stay logged in</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Yes, log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
