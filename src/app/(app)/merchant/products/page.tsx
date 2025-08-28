"use client";

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Plus, Pencil, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  shopId: string;
  shelfId: string;
  lastUpdated: Date;
};

const mockProducts: Product[] = [
  { id: 'p-001', name: 'Handmade Tote Bag', price: 199, stock: 23, active: true, shopId: 'shop-1', shelfId: 'shelf-1', lastUpdated: new Date() },
  { id: 'p-002', name: 'Organic Honey 500g', price: 149, stock: 8, active: true, shopId: 'shop-1', shelfId: 'shelf-2', lastUpdated: new Date() },
  { id: 'p-003', name: 'Ceramic Mug', price: 89, stock: 0, active: false, shopId: 'shop-2', shelfId: 'shelf-1', lastUpdated: new Date() },
  { id: 'p-004', name: 'Wireless Earbuds', price: 399, stock: 51, active: true, shopId: 'shop-2', shelfId: 'shelf-2', lastUpdated: new Date() },
];

export default function MerchantProductsPage() {
  const [q, setQ] = useState('');
  const [shop, setShop] = useState<string | undefined>();
  const [shelf, setShelf] = useState<string | undefined>();
  const [items, setItems] = useState<Product[]>(mockProducts);

  // Derived list respects search, shop, shelf, and time range
  const products = useMemo(() => {
    const term = q.toLowerCase().trim();
    return items.filter((p) => {
      const matchesQ = p.name.toLowerCase().includes(term);
      const matchesShop = !shop || p.shopId === shop;
      const matchesShelf = !shelf || p.shelfId === shelf;
      return matchesQ && matchesShop && matchesShelf;
    });
  }, [items, q, shop, shelf]);

  // Auto-watch: when shop & shelf are selected, simulate live updates on that shelf
  useEffect(() => {
    if (!shop || !shelf) return;
    const id = setInterval(() => {
      setItems((prev) => {
        const onShelf = prev.filter((p) => p.shopId === shop && p.shelfId === shelf);
        if (onShelf.length === 0) return prev;
        const pick = onShelf[Math.floor(Math.random() * onShelf.length)];
        return prev.map((p) =>
          p.id === pick.id
            ? { ...p, stock: Math.max(0, p.stock + (Math.random() > 0.5 ? 1 : -1)), lastUpdated: new Date() }
            : p
        );
      });
    }, 3000);
    return () => clearInterval(id);
  }, [shop, shelf]);

  const shops = [
    { id: 'shop-1', name: 'Shop A' },
    { id: 'shop-2', name: 'Shop B' },
  ];
  const shelves = [
    { id: 'shelf-1', name: 'Shelf A', shopId: 'shop-1' },
    { id: 'shelf-2', name: 'Shelf B', shopId: 'shop-1' },
    { id: 'shelf-1', name: 'Shelf A', shopId: 'shop-2' },
    { id: 'shelf-2', name: 'Shelf B', shopId: 'shop-2' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Specify Shop and Shelf to watch products on that shelf.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex gap-2">
              <Select value={shop} onValueChange={setShop}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Shop" /></SelectTrigger>
                <SelectContent>
                  {shops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={shelf} onValueChange={setShelf} disabled={!shop}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Shelf" /></SelectTrigger>
                <SelectContent>
                  {shelves.filter((sh) => sh.shopId === shop).map((sh) => (
                    <SelectItem key={`${sh.shopId}-${sh.id}`} value={sh.id}>{sh.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 self-end sm:self-auto">
              {shop && shelf && (
                <Badge variant="secondary">Watching {shops.find(s=>s.id===shop)?.name} / {shelf.toUpperCase()}</Badge>
              )}
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead className="hidden sm:table-cell">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {p.shopId.replace('shop-','Shop ')} / {p.shelfId.replace('shelf-','Shelf ')}
                    <div className="text-xs text-muted-foreground">{format(p.lastUpdated, 'yyyy-MM-dd HH:mm')}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">${p.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {p.stock}
                      {p.stock === 0 ? (
                        <Badge variant="destructive" className="ml-2">Out</Badge>
                      ) : p.stock < 10 ? (
                        <Badge variant="secondary" className="ml-2">Low</Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Deactivate</DropdownMenuItem>
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
