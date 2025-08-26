
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Box } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd have authentication logic here.
    // For this prototype, we'll just redirect based on the selected role.
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'merchant') {
      router.push('/merchant/dashboard');
    } else if (role === 'tenant') {
      router.push('/tenant/dashboard');
    } else if (role === 'cashier') {
      router.push('/pos');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
             <Box className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={setRole} defaultValue={role}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="merchant">Merchant</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="cashier">Cashier (POS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mfa" className="flex flex-col gap-0.5">
                <span>Enable MFA</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Secure your account
                </span>
              </Label>
              <Switch id="mfa" />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 text-sm">
           <p className="text-muted-foreground">
                Don&apos;t have an account?
                <Link href="/register" className="font-medium text-primary hover:underline ml-1">
                    Register
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
