"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, DollarSign } from 'lucide-react';
import type { MerchantType, SettlementRecord } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Example: one franchise and one rent merchant periods
const initialData: SettlementRecord[] = [
  { id: 'st-2024-06-f', period: '2024-06', merchantType: 'franchise', shop: 'Central Market', shelf: 'A-01', orders: 123, revenue: 4300, fees: 125.5, royaltyRate: 0.08, rentFee: 0, depositFee: 0, payout: 3421.75, status: 'paid' },
  { id: 'st-2024-07-r', period: '2024-07', merchantType: 'rent', shop: 'Harbor Mall', shelf: 'B-05', orders: 141, revenue: 4980, fees: 149.1, rentAmount: 900, rentFee: 900, depositFee: 0, payout: 3899.2, status: 'pending' },
];

export default function MerchantSettlementsPage() {
  const [rows, setRows] = useState<SettlementRecord[]>(initialData);
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'paid'>('all');

  const filteredRows = useMemo(() =>
    rows.filter(r => statusFilter === 'all' ? true : r.status === statusFilter)
  , [rows, statusFilter]);

  const fmt = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }), []);
  const withdrawForPeriod = (period: string) => {
    const key = 'boxpos:merchantWithdraws';
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(key);
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      if (!list.includes(period)) list.push(period);
      window.localStorage.setItem(key, JSON.stringify(list));
    }
  };
  const totals = useMemo(() => {
    const payout = filteredRows.reduce((s, r) => s + r.payout, 0);
    return { payout };
  }, [filteredRows]);

  const paySettlement = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'paid' } : r)));
    const rec = rows.find((r) => r.id === id);
    toast({
      title: 'Payment initiated',
      description: rec ? `${rec.period} payout marked as paid.` : 'Settlement marked as paid.',
    });
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Settlements</CardTitle>
            <CardDescription>
              Merchants have two types: Franchise (ongoing royalties) and Rent (rent-only). Review period payouts.
            </CardDescription>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex gap-2">
              <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>All</Button>
              <Button variant={statusFilter === 'pending' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('pending')}>Pending</Button>
              <Button variant={statusFilter === 'processing' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('processing')}>Processing</Button>
              <Button variant={statusFilter === 'paid' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('paid')}>Paid</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Export CSV</Button>
              <Button><Download className="mr-2 h-4 w-4" /> Download PDFs</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            You can withdraw here (by period) or via <Link href="/merchant/booths" className="underline">Booths</Link> (by booth).
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Royalty</TableHead>
                <TableHead>Rent Fee</TableHead>
                <TableHead>Deposit Fee</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="capitalize">
                    <Badge variant={s.merchantType === 'franchise' ? 'default' : 'secondary'}>
                      {s.merchantType}
                    </Badge>
                  </TableCell>
                    <TableCell>{s.shop || '-'}</TableCell>
                    <TableCell>{s.period}</TableCell>
                    <TableCell>
                      {typeof s.royaltyRate === 'number'
                        ? `${(s.royaltyRate * 100).toFixed(1)}%`
                        : '-'}
                    </TableCell>
                    <TableCell>{
                      typeof s.rentFee === 'number'
                        ? fmt.format(s.rentFee)
                        : typeof s.rentAmount === 'number'
                        ? fmt.format(s.rentAmount)
                        : '-'
                    }</TableCell>
                    <TableCell>{typeof s.depositFee === 'number' ? fmt.format(s.depositFee) : '-'}</TableCell>
                    <TableCell className="font-medium">{fmt.format(s.payout)}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === 'paid' ? 'default' : s.status === 'processing' ? 'secondary' : 'outline'} className="capitalize">
                        {s.status}
                      </Badge>
                    </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline"><DollarSign className="mr-2 h-4 w-4" /> Details</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" disabled={s.status !== 'pending'}>
                          Pay
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Payout</AlertDialogTitle>
                          <AlertDialogDescription>
                            Pay settlement for {s.period}? This will mark the period as paid.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => paySettlement(s.id)}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">Withdraw</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Withdraw</AlertDialogTitle>
                            <AlertDialogDescription>
                              Record withdrawal intent for {s.period}? Any deposit adjustments will be handled in settlement.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => withdrawForPeriod(s.period)}>Confirm</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
    {filteredRows.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={9} className="py-8 text-center text-sm text-muted-foreground">No settlements for this filter.</td>
                </tr>
              </tbody>
            )}
          </Table>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>Payout: <span className="font-medium text-foreground">{fmt.format(totals.payout)}</span></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
