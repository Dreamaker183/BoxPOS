
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileDown, Calculator, HandCoins } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SettlementStatus = 'paid' | 'due' | 'overdue';

const mockSettlements = [
  { id: 'set-001', period: 'July 2024', totalSales: 12500, commission: 1250, amountDue: 11250, status: 'paid' as SettlementStatus },
  { id: 'set-002', period: 'August 2024', totalSales: 14200, commission: 1420, amountDue: 12780, status: 'due' as SettlementStatus },
  { id: 'set-003', period: 'June 2024', totalSales: 11000, commission: 1100, amountDue: 9900, status: 'overdue' as SettlementStatus },
];

const statusVariant: Record<SettlementStatus, 'default' | 'secondary' | 'destructive'> = {
  paid: 'default',
  due: 'secondary',
  overdue: 'destructive',
};

export default function SettlementsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Settlements</CardTitle>
              <CardDescription>Review your sales settlements and commissions.</CardDescription>
            </div>
            <Button variant="outline">
              <FileDown className="mr-2" />
              Export All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSettlements.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.period}</TableCell>
                    <TableCell>${s.totalSales.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">${s.amountDue.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
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
            <CardTitle>Commission Calculator</CardTitle>
            <CardDescription>Estimate your earnings after fees.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-1">
                <Label htmlFor="total-sales">Total Sales</Label>
                <Input id="total-sales" type="number" placeholder="1000.00" />
            </div>
             <div className="space-y-1">
                <Label htmlFor="fee-percent">Fee (%)</Label>
                <Input id="fee-percent" type="number" defaultValue="10" />
            </div>
             <Button className="w-full">
              <Calculator className="mr-2" />
              Calculate Earnings
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Expense Tracker</CardTitle>
            <CardDescription>Log your business-related expenses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-1">
                <Label htmlFor="expense-desc">Description</Label>
                <Input id="expense-desc" placeholder="e.g., Booth decoration" />
            </div>
             <div className="space-y-1">
                <Label htmlFor="expense-amount">Amount</Label>
                <Input id="expense-amount" type="number" placeholder="50.00" />
            </div>
            <Button className="w-full">
              <HandCoins className="mr-2" />
              Log Expense
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
