
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  Building2,
  Package,
  HandCoins,
  Receipt,
  Camera,
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
  { href: '/admin/booths', icon: Building2, label: 'Booths' },
];

const merchantNavItems = [
  { href: '/merchant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/merchant/booths', icon: Building2, label: 'Booths' },
  { href: '/merchant/leases', icon: FileText, label: 'Leases' },
  { href: '/merchant/products', icon: Package, label: 'Products' },
  { href: '/merchant/settlements', icon: HandCoins, label: 'Settlements' },
  { href: '/merchant/reports', icon: FileBarChart, label: 'Reports' },
];

const tenantNavItems = [
  { href: '/tenant/products', icon: Package, label: 'My Products' },
  { href: '/tenant/booths', icon: Building2, label: 'My Booths' },
  { href: '/tenant/shelf', icon: Camera, label: 'Shelf' },
  { href: '/tenant/settlements', icon: HandCoins, label: 'Settlements' },
  { href: '/tenant/reports', icon: Receipt, label: 'My Reports' },
];

const settingsNavItem = { href: '/settings', icon: Settings, label: 'Settings' };

export default function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Track and persist the last known role so role menus stay visible
  // when navigating to non-role routes like /pos, /profile, /notifications.
  type Role = 'admin' | 'merchant' | 'tenant' | 'cashier' | null;
  const getRoleFromPath = (path: string): Role => {
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/merchant')) return 'merchant';
    if (path.startsWith('/tenant')) return 'tenant';
    return null;
  };

  const [role, setRole] = useState<Role>(() => {
    // Initialize from localStorage (if any) or from current path
    if (typeof window !== 'undefined') {
  const stored = window.localStorage.getItem('boxpos:lastRole') as any;
  if (stored === 'admin' || stored === 'merchant' || stored === 'tenant' || stored === 'cashier') return stored as Role;
    }
    return getRoleFromPath(pathname);
  });

  // Update role only when visiting a role-scoped route; otherwise keep previous.
  useEffect(() => {
    const inferred = getRoleFromPath(pathname);
    if (inferred) {
      setRole(inferred);
    }
  }, [pathname]);

  // Persist role for future navigations.
  useEffect(() => {
    if (typeof window !== 'undefined' && role) {
      window.localStorage.setItem('boxpos:lastRole', role);
    }
  }, [role]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('boxpos:lastRole');
    }
    router.push('/login');
  };

  const checkActive = (href: string) => pathname.startsWith(href);

  // Show or hide POS entry based on role
  const visibleMainNavItems = (() => {
    if (role === 'admin' || role === 'merchant' || role === 'tenant') {
      return mainNavItems.filter((i) => i.href !== '/pos');
    }
    return mainNavItems;
  })();

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
          {visibleMainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={checkActive(item.href)}
                tooltip={{
                  children: item.label,
                  hidden: state === 'expanded',
                }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
  {role === 'admin' && (
            <SidebarGroup>
                <SidebarGroupLabel>Admin</SidebarGroupLabel>
                <SidebarMenu>
                    {adminNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                              asChild
                              isActive={checkActive(item.href)}
                              tooltip={{
                                  children: item.label,
                                  hidden: state === 'expanded',
                              }}
                            >
                              <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        )}

  {role === 'merchant' && (
      <SidebarGroup>
        <SidebarGroupLabel>Merchant</SidebarGroupLabel>
        <SidebarMenu>
          {merchantNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={checkActive(item.href)}
                tooltip={{
                  children: item.label,
                  hidden: state === 'expanded',
                }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )}

  {role === 'tenant' && (
            <SidebarGroup>
                <SidebarGroupLabel>Tenant</SidebarGroupLabel>
                <SidebarMenu>
                    {tenantNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                              asChild
                              isActive={checkActive(item.href)}
                              tooltip={{
                                  children: item.label,
                                  hidden: state === 'expanded',
                              }}
                            >
                              <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        )}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={checkActive(settingsNavItem.href)}
                tooltip={{
                    children: settingsNavItem.label,
                    hidden: state === 'expanded',
                }}
              >
                <Link href={settingsNavItem.href}>
                  <settingsNavItem.icon />
                  <span>{settingsNavItem.label}</span>
                </Link>
              </SidebarMenuButton>
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
