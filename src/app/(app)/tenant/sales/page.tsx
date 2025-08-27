'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FileDown, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockSales = [
  { id: 's-1001', time: '10:02', items: 2, total: 23.5 },
  { id: 's-1002', time: '11:15', items: 1, total: 12.0 },
  { id: 's-1003', time: '12:40', items: 5, total: 78.2 },
];

export default function TenantSalesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tenant/products');
  }, [router]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [shop, setShop] = useState<string | undefined>();
  const [shelf, setShelf] = useState<string | undefined>();
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">Daily sales records.</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Select value={shop} onValueChange={setShop}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="店舖 Shop" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="shop-1">Shop A</SelectItem>
              <SelectItem value="shop-2">Shop B</SelectItem>
            </SelectContent>
          </Select>
          <Select value={shelf} onValueChange={setShelf}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="貨架 Shelf" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="shelf-1">Shelf A</SelectItem>
              <SelectItem value="shelf-2">Shelf B</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="outline"><FileDown className="mr-2" />Export</Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Sales Records</CardTitle>
          <CardDescription>Transactions for the selected day.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSales.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.time}</TableCell>
                  <TableCell>{s.items}</TableCell>
                  <TableCell>${s.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
