
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Minus, History, Package } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import BarcodeScanner from '@/components/pos/BarcodeScanner';

const mockInventory = [
  { id: 'prod-1', name: 'Handmade Mug', stock: 50, threshold: 10, sku: 'HM-001' },
  { id: 'prod-2', name: 'Woven Scarf', stock: 30, threshold: 15, sku: 'WS-001' },
  { id: 'prod-3', name: 'Scented Candle', stock: 8, threshold: 10, sku: 'SC-001' },
  { id: 'prod-4', name: 'Leather Wallet', stock: 20, threshold: 5, sku: 'LW-001' },
  { id: 'prod-5', name: 'Ceramic Bowl', stock: 12, threshold: 10, sku: 'CB-001' },
];

export default function InventoryTrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(mockInventory);

  const filteredInventory = inventory.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStock = (productId: string, amount: number) => {
    setInventory(prev => prev.map(item => 
        item.id === productId ? { ...item, stock: Math.max(0, item.stock + amount) } : item
    ));
  };
  
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>Monitor and manage your product stock levels.</CardDescription>
              </div>
              <div className="relative flex-1 sm:flex-initial w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or SKU..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Stock Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockPercentage = (item.stock / (item.threshold * 3)) * 100;
                  const isLowStock = item.stock <= item.threshold;
                  return (
                    <TableRow key={item.id} className={isLowStock ? 'bg-destructive/10' : ''}>
                      <TableCell className="font-medium">
                        <div>{item.name}</div>
                        <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
                      </TableCell>
                      <TableCell className="text-center w-48">
                        <div className="flex items-center gap-2">
                           <span className={`font-bold w-8 ${isLowStock ? 'text-destructive' : ''}`}>{item.stock}</span>
                           <Progress value={stockPercentage} className="h-2 flex-1" />
                        </div>
                         <p className="text-xs text-muted-foreground mt-1">Threshold: {item.threshold}</p>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex gap-2 justify-end">
                            <Button size="icon" variant="outline" onClick={() => updateStock(item.id, -1)}><Minus /></Button>
                            <Button size="icon" variant="outline" onClick={() => updateStock(item.id, 1)}><Plus /></Button>
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
      <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Scan Stock</CardTitle>
                <CardDescription>Use the camera to scan a barcode and update stock.</CardDescription>
            </CardHeader>
            <CardContent>
                <BarcodeScanner onScan={(code) => setSearchTerm(code)} />
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Log of recent inventory changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><Package className="text-green-500" /> <div><span className="font-medium">Handmade Mug</span> stock updated to 50.</div></li>
                <li className="flex items-center gap-3"><Package className="text-red-500" /> <div><span className="font-medium">Woven Scarf</span> stock reduced to 30.</div></li>
                <li className="flex items-center gap-3"><History className="text-muted-foreground" /> <div>Manual count for <span className="font-medium">Leather Wallet</span> confirmed.</div></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
