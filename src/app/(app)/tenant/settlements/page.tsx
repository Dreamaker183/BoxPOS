"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SettlementRecord } from '@/lib/types';

// Tenant side demo data with shop/shelf and fee fields
const initialData: SettlementRecord[] = [
  { id: 't-2024-07', period: '2024-07', merchantType: 'rent', shop: 'Central Market', shelf: 'T-12', orders: 88, revenue: 2100, fees: 79.2, rentAmount: 600, rentFee: 600, depositFee: 0, payout: 1420.8, status: 'pending' },
  { id: 't-2024-06', period: '2024-06', merchantType: 'rent', shop: 'Central Market', shelf: 'T-12', orders: 76, revenue: 1850, fees: 69.9, rentAmount: 600, rentFee: 600, depositFee: 0, payout: 1180.1, status: 'paid' },
];

export default function TenantSettlementsPage() {
  const [rows, setRows] = useState<SettlementRecord[]>(initialData);
  const { toast } = useToast();

  const fmt = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }), []);

  const paySettlement = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'paid' } : r)));
    const rec = rows.find((r) => r.id === id);
    toast({ title: 'Payment initiated', description: rec ? `${rec.period} payout marked as paid.` : 'Settlement marked as paid.' });
  };

  const withdrawForPeriod = (period: string) => {
    const key = 'boxpos:tenantWithdraws';
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(key);
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      if (!list.includes(period)) list.push(period);
      window.localStorage.setItem(key, JSON.stringify(list));
    }
    toast({ title: 'Withdraw submitted', description: `Recorded withdrawal intent for ${period}. Deposit refund will be handled in settlement.` });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Settlements</CardTitle>
            <CardDescription>Review your monthly payouts and trigger payment or withdrawal.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Download PDFs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop</TableHead>
                <TableHead>Shelf</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Rent Fee</TableHead>
                <TableHead>Deposit Fee</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.shop || '-'}</TableCell>
                  <TableCell>{row.shelf || '-'}</TableCell>
                  <TableCell>{row.period}</TableCell>
                  <TableCell>{typeof row.rentFee === 'number' ? fmt.format(row.rentFee) : '-'}</TableCell>
                  <TableCell>{typeof row.depositFee === 'number' ? fmt.format(row.depositFee) : '-'}</TableCell>
                  <TableCell className="font-medium">{fmt.format(row.payout)}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'paid' ? 'default' : row.status === 'processing' ? 'secondary' : 'outline'} className="capitalize">
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline">
                      <DollarSign className="mr-2 h-4 w-4" /> Details
                    </Button>
                    <Button size="sm" disabled={row.status !== 'pending'} onClick={() => paySettlement(row.id)}>
                      Pay
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => withdrawForPeriod(row.period)}>
                      Withdraw
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
