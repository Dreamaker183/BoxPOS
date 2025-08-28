"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Merchant leases are by shelf; paying rent is by shop (monthly)

type LeaseStatus = 'active' | 'ended' | 'overdue' | 'paid';

type Lease = {
  id: string;
  shop: string;
  shelf: string;
  tenant: string;
  rentAmount: number; // monthly rent per shelf
  period: string; // yyyy-MM
  status: LeaseStatus;
};

const mock: Lease[] = [
  { id: 'l-2024-07-a01', shop: 'Central Market', shelf: 'A-01', tenant: 'Global Foods Inc.', rentAmount: 600, period: '2024-07', status: 'paid' },
  { id: 'l-2024-08-a01', shop: 'Central Market', shelf: 'A-01', tenant: 'Global Foods Inc.', rentAmount: 600, period: '2024-08', status: 'overdue' },
  { id: 'l-2024-08-b05', shop: 'Harbor Mall', shelf: 'B-05', tenant: 'Crafty Creations', rentAmount: 900, period: '2024-08', status: 'active' },
];

export default function MerchantLeasesPage() {
  const ALL = '__ALL__';
  const [rows, setRows] = useState<Lease[]>(mock);
  const [shopFilter, setShopFilter] = useState<string>(ALL);
  const [shelfFilter, setShelfFilter] = useState<string>(ALL);
  const { toast } = useToast();

  const uniqueShops = useMemo(() => Array.from(new Set(rows.map(r => r.shop))).sort(), [rows]);
  const uniqueShelves = useMemo(() => {
    const src = shopFilter !== ALL ? rows.filter(r => r.shop === shopFilter) : rows;
    return Array.from(new Set(src.map(r => r.shelf))).sort();
  }, [rows, shopFilter]);
  const filtered = useMemo(() => rows.filter(r => (shopFilter === ALL || r.shop === shopFilter) && (shelfFilter === ALL || r.shelf === shelfFilter)), [rows, shopFilter, shelfFilter]);

  const handlePayRent = (shop: string, period: string) => {
    // Store an intent in localStorage for demo; in real app call API
    const key = 'boxpos:merchantRentPayments';
    const existing = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    const data = existing ? (JSON.parse(existing) as any[]) : [];
    data.push({ id: `${shop}-${period}`, shop, period, ts: Date.now() });
    if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(data));

    // Update status of that shop-period rows to paid
    setRows(prev => prev.map(r => (r.shop === shop && r.period === period ? { ...r, status: 'paid' } : r)));

    toast({ title: 'Rent payment submitted', description: `${shop} • ${period} rent recorded.` });
  };

  // Aggregate by shop+period to pay rent per shop (sum of shelves)
  const payables = useMemo(() => {
    const m = new Map<string, { shop: string; period: string; total: number; count: number }>();
    filtered.forEach(r => {
      const k = `${r.shop}|${r.period}`;
      const cur = m.get(k);
      if (cur) { cur.total += r.rentAmount; cur.count += 1; } else { m.set(k, { shop: r.shop, period: r.period, total: r.rentAmount, count: 1 }); }
    });
    return Array.from(m.values()).sort((a, b) => a.period.localeCompare(b.period) || a.shop.localeCompare(b.shop));
  }, [filtered]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Leases</CardTitle>
          <CardDescription>Manage shelf leases; pay rent by shop and month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <Select value={shopFilter} onValueChange={setShopFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Shop" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Shops</SelectItem>
                {uniqueShops.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={shelfFilter} onValueChange={setShelfFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Shelf" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Shelves</SelectItem>
                {uniqueShelves.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop</TableHead>
                <TableHead>Shelf</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.shop}</TableCell>
                  <TableCell>{r.shelf}</TableCell>
                  <TableCell>{r.tenant}</TableCell>
                  <TableCell>{r.period}</TableCell>
                  <TableCell>${r.rentAmount.toFixed(2)}</TableCell>
                  <TableCell><Badge>{r.status}</Badge></TableCell>
                  <TableCell className="text-right"><Button size="sm" onClick={() => handlePayRent(r.shop, r.period)} disabled={r.status === 'paid'}>Pay Rent (Shop)</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payables by Shop</CardTitle>
          <CardDescription>Sum of shelf rents per shop and month</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Booths/Shelves</TableHead>
                <TableHead>Total Rent</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payables.map(p => (
                <TableRow key={`${p.shop}-${p.period}`}>
                  <TableCell>{p.shop}</TableCell>
                  <TableCell>{p.period}</TableCell>
                  <TableCell>{p.count}</TableCell>
                  <TableCell>${p.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right"><Button size="sm" onClick={() => handlePayRent(p.shop, p.period)}>Pay Rent</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
