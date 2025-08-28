"use client";

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Minus, History, Package } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import BarcodeScanner from '@/components/pos/BarcodeScanner';

type Item = { id: string; name: string; stock: number; min: number };

const mockItems: Item[] = [
  { id: 'sku-1001', name: 'Bamboo Toothbrush', stock: 12, min: 10 },
  { id: 'sku-1002', name: 'Reusable Straw Set', stock: 4, min: 10 },
  { id: 'sku-1003', name: 'Eco Notebook', stock: 0, min: 5 },
  { id: 'sku-1004', name: 'Scented Candle', stock: 27, min: 10 },
];

export default function MerchantInventoryPage() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Item[]>(mockItems);

  const visible = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase().trim())),
    [items, q]
  );

  const adjust = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i))
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>Scan and adjust your stock levels in real time.</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-8"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <History className="mr-2 h-4 w-4" /> History
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-md p-4">
            <p className="mb-2 text-sm text-muted-foreground">Barcode Scanner</p>
            <BarcodeScanner onScan={(code: string) => alert(`Scanned: ${code}`)} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="hidden sm:table-cell">Stock</TableHead>
                <TableHead className="hidden sm:table-cell">Min</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Adjust</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((i) => {
                const ratio = i.min === 0 ? 1 : Math.min(1, i.stock / i.min);
                const status = i.stock === 0 ? 'Out of stock' : i.stock < i.min ? 'Low' : 'OK';
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{i.stock}</TableCell>
                    <TableCell className="hidden sm:table-cell">{i.min}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{status}</span>
                      </div>
                      <Progress value={ratio * 100} className="mt-2 h-2" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button size="icon" variant="outline" onClick={() => adjust(i.id, -1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button size="icon" onClick={() => adjust(i.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
