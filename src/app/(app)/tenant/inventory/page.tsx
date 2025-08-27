'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MoreHorizontal, Calendar as CalendarIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

const mockInventory = [
  { id: 'inv-1', name: 'Handmade Mug', sku: 'HM-001', qty: 50 },
  { id: 'inv-2', name: 'Woven Scarf', sku: 'WS-034', qty: 30 },
  { id: 'inv-3', name: 'Scented Candle', sku: 'SC-112', qty: 8 },
];

export default function TenantInventoryPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tenant/products');
  }, [router]);
  const [searchTerm, setSearchTerm] = useState('');
  const [shop, setShop] = useState<string | undefined>();
  const [shelf, setShelf] = useState<string | undefined>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const filtered = mockInventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Current stock overview.</p>
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
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search items..." className="pl-8 w-[240px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Stock List</CardTitle>
          <CardDescription>Track your item quantities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.sku}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Adjust</DropdownMenuItem>
                        <DropdownMenuItem>History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
