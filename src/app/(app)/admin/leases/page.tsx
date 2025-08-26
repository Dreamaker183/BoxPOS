
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, PlusCircle, Calculator } from 'lucide-react';

type LeaseStatus = 'active' | 'expired' | 'pending';

const mockLeases = [
  { id: 'lease-001', tenant: 'Global Foods Inc.', booth: 'A-12', startDate: '2024-01-15', endDate: '2025-01-14', amount: 1200, status: 'active' as LeaseStatus },
  { id: 'lease-002', tenant: 'Crafty Creations', booth: 'B-05', startDate: '2023-06-01', endDate: '2024-05-31', amount: 800, status: 'expired' as LeaseStatus },
  { id: 'lease-003', tenant: 'Tech Gadgets', booth: 'C-01', startDate: '2024-08-01', endDate: '2025-07-31', amount: 1500, status: 'pending' as LeaseStatus },
  { id: 'lease-004', tenant: 'Vintage Apparel', booth: 'A-02', startDate: '2024-03-01', endDate: '2025-02-28', amount: 950, status: 'active' as LeaseStatus },
];

const statusVariant: Record<LeaseStatus, 'default' | 'destructive' | 'secondary'> = {
  active: 'default',
  expired: 'destructive',
  pending: 'secondary',
};

export default function LeaseManagementPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Leases</CardTitle>
              <CardDescription>View, create, and manage all lease contracts.</CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2" />
              New Lease
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Booth</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeases.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell className="font-medium">{lease.tenant}</TableCell>
                    <TableCell>{lease.booth}</TableCell>
                    <TableCell>{lease.endDate}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[lease.status]}>{lease.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Expiration Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Penalty Calculator</CardTitle>
            <CardDescription>Calculate late payment penalties.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Calculator className="mr-2" />
              Open Calculator
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
