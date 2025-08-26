
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, PlusCircle, MoreHorizontal, UploadCloud } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BarcodeScanner from '@/components/pos/BarcodeScanner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

type ProductStatus = 'active' | 'archived';

const mockProducts = [
  { id: 'prod-1', name: 'Handmade Mug', price: 15.00, barcode: '123456789012', stock: 50, status: 'active' as ProductStatus, imageUrl: 'https://picsum.photos/100/100?random=21' },
  { id: 'prod-2', name: 'Woven Scarf', price: 25.50, barcode: '123456789013', stock: 30, status: 'active' as ProductStatus, imageUrl: 'https://picsum.photos/100/100?random=22' },
  { id: 'prod-3', name: 'Scented Candle', price: 12.75, barcode: '123456789014', stock: 0, status: 'archived' as ProductStatus, imageUrl: 'https://picsum.photos/100/100?random=23' },
  { id: 'prod-4', name: 'Leather Wallet', price: 45.00, barcode: '123456789015', stock: 20, status: 'active' as ProductStatus, imageUrl: 'https://picsum.photos/100/100?random=24' },
];

export default function ProductManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode.includes(searchTerm)
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Product Management</CardTitle>
                        <CardDescription>Add, edit, and manage your products.</CardDescription>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                            placeholder="Search products or barcode..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Barcode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium flex items-center gap-3">
                                <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded-md" />
                                {product.name}
                            </TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell className="font-mono">{product.barcode}</TableCell>
                            <TableCell>
                               <Switch id={`status-${product.id}`} defaultChecked={product.status === 'active'} />
                            </TableCell>
                            <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>View History</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
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
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="product-name">Product Name</Label>
                        <Input id="product-name" placeholder="e.g., Handmade Mug" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="product-price">Price</Label>
                        <Input id="product-price" type="number" placeholder="15.00" />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="product-stock">Stock</Label>
                        <Input id="product-stock" type="number" placeholder="50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-image">Product Image</Label>
                        <div className="flex items-center justify-center w-full">
                            <label
                            htmlFor="product-image-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                            >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span>
                                </p>
                            </div>
                            <Input id="product-image-upload" type="file" className="hidden" />
                            </label>
                        </div>
                    </div>
                     <Button className="w-full">
                        <PlusCircle className="mr-2" />
                        Add Product
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Barcode Scanner</CardTitle>
                    <CardDescription>Scan a product's barcode to quickly add it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BarcodeScanner onScan={(code) => setSearchTerm(code)} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
