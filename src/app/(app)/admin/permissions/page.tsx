
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ShieldCheck, UserCog, UserPlus } from 'lucide-react';

const roles = {
  Admin: ['view_sales', 'edit_inventory', 'manage_tenants', 'manage_leases', 'view_reports', 'manage_users'],
  Merchant: ['view_sales', 'edit_inventory'],
  Tenant: ['view_sales'],
};

const allPermissions = [
  { id: 'view_sales', label: 'View Sales' },
  { id: 'edit_inventory', label: 'Edit Inventory' },
  { id: 'manage_tenants', label: 'Manage Tenants' },
  { id: 'manage_leases', label: 'Manage Leases' },
  { id: 'view_reports', label: 'View Reports' },
  { id: 'manage_users', label: 'Manage Users & Permissions' },
];

export default function UserPermissionsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">User Permissions</h1>
        <p className="text-muted-foreground">Configure Role-Based Access Control (RBAC) for your system.</p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Define what users can see and do based on their assigned role.</CardDescription>
          </div>
          <Button>
            <UserPlus className="mr-2" />
            Add New Role
          </Button>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(roles).map(([role, permissions]) => (
              <AccordionItem value={role} key={role}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    {role === 'Admin' ? <ShieldCheck className="text-primary"/> : <UserCog />}
                    {role}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {allPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-${permission.id}`}
                          defaultChecked={permissions.includes(permission.id)}
                        />
                        <Label htmlFor={`${role}-${permission.id}`} className="font-normal">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button size="lg">Save All Changes</Button>
      </div>
    </div>
  );
}
