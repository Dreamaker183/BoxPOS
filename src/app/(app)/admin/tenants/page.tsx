
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, PlusCircle, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type TenantStatus = 'active' | 'inactive' | 'overdue';

const mockTenants = [
  { id: 'tenant-1', name: 'Global Foods Inc.', contact: 'contact@globalfoods.com', status: 'active' as TenantStatus, leaseEnd: '2025-01-14' },
  { id: 'tenant-2', name: 'Crafty Creations', contact: 'support@crafty.com', status: 'inactive' as TenantStatus, leaseEnd: '2024-05-31' },
  { id: 'tenant-3', name: 'Tech Gadgets', contact: 'sales@techgadgets.io', status: 'overdue' as TenantStatus, leaseEnd: '2025-07-31' },
  { id: 'tenant-4', name: 'Vintage Apparel', contact: 'hello@vintage.com', status: 'active' as TenantStatus, leaseEnd: '2025-02-28' },
  { id: 'tenant-5', name: 'Fresh Bakes', contact: 'orders@freshbakes.com', status: 'active' as TenantStatus, leaseEnd: '2024-12-31' },
];

const statusVariant: Record<TenantStatus, 'default' | 'destructive' | 'secondary'> = {
  active: 'default',
  overdue: 'destructive',
  inactive: 'secondary',
};

export default function TenantManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = mockTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Tenant Management</CardTitle>
            <CardDescription>Add, edit, and manage your tenants.</CardDescription>
          </div>
           <div className="flex gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenants..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <Button>
              <PlusCircle className="mr-2" />
              Add Tenant
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Lease End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>{tenant.contact}</TableCell>
                <TableCell>{tenant.leaseEnd}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[tenant.status]}>{tenant.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
