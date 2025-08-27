
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, PlusCircle, MoreHorizontal, UploadCloud, Calendar as CalendarIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useSearchParams, useRouter } from 'next/navigation';

const mockProducts = [
    { id: 'prod-1', name: 'Handmade Mug', description: 'Ceramic mug with matte glaze', specialRemark: 'Handle with care; fragile', price: 15.00, stock: 50, imageUrl: 'https://picsum.photos/100/100?random=21' },
    { id: 'prod-2', name: 'Woven Scarf', description: 'Soft wool scarf with pattern', specialRemark: 'Gift wrap available', price: 25.50, stock: 30, imageUrl: 'https://picsum.photos/100/100?random=22' },
    { id: 'prod-3', name: 'Scented Candle', description: 'Lavender soy wax candle', specialRemark: 'Avoid heat exposure', price: 12.75, stock: 8, imageUrl: 'https://picsum.photos/100/100?random=23' },
    { id: 'prod-4', name: 'Leather Wallet', description: 'Minimalist genuine leather', specialRemark: 'Limited edition', price: 45.00, stock: 20, imageUrl: 'https://picsum.photos/100/100?random=24' },
];

export default function TenantProductManagementPage() {
        const [searchTerm, setSearchTerm] = useState('');
        const [products, setProducts] = useState(mockProducts);
        const [sortKey, setSortKey] = useState<'name' | 'price' | 'stock'>('name');
        const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
        const [page, setPage] = useState(1);
        const pageSize = 10;
    const [shop, setShop] = useState<string | undefined>();
    const [shelf, setShelf] = useState<string | undefined>();
    const [date, setDate] = useState<Date | undefined>(new Date());
        const [salesMonth, setSalesMonth] = useState<string>(() => format(new Date(), 'yyyy-MM'));
            const selectedSalesDate = useMemo(() => {
                const [y, m] = salesMonth.split('-').map(Number);
                if (!y || !m) return undefined;
                return new Date(y, m - 1, 1);
            }, [salesMonth]);
    const [showNewSmn, setShowNewSmn] = useState(false);
    const [salesProductId, setSalesProductId] = useState<string | null>(null);
    const [adjustProductId, setAdjustProductId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'newSmn') {
            setShowNewSmn(true);
            // 清掉 action 以避免重複開啟
            const sp = new URLSearchParams(Array.from(searchParams.entries()));
            sp.delete('action');
            router.replace(`/tenant/products${sp.size ? `?${sp.toString()}` : ''}`);
        }
    }, [searchParams, router]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts].sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1;
            if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
            if (sortKey === 'price') return (a.price - b.price) * dir;
            return (a.stock - b.stock) * dir;
        });
        return sorted;
    }, [filteredProducts, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
    useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
    const paginatedProducts = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedProducts.slice(start, start + pageSize);
    }, [sortedProducts, page]);

        // Deterministic mock sales count per product per month
        const getSalesCount = (productId: string, ym: string) => {
            const seed = (productId + ym).split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 9973, 7);
            return (seed % 120); // 0..119
        };

        

    const toggleSort = (key: 'name' | 'price' | 'stock') => {
        if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        else { setSortKey(key); setSortDir('asc'); }
    };

    const quickAdjust = (id: string, delta: number) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
    };

  return (
        <div className="grid gap-6 lg:grid-cols-1">
            <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>My Products</CardTitle>
                            <CardDescription>Manage the products for your booth.</CardDescription>
                        </div>
                                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                                                                  <div className="flex gap-2 items-center flex-wrap">
                                                        <Select value={shop} onValueChange={setShop}>
                                                            <SelectTrigger className="w-[140px]"><SelectValue placeholder="店舖 Shop" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="shop-1">Shop A</SelectItem>
                                                                <SelectItem value="shop-2">Shop B</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Select value={shelf} onValueChange={setShelf}>
                                                            <SelectTrigger className="w-[140px]"><SelectValue placeholder="貨架 Shelf" /></SelectTrigger>
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
                                                                                                               
                                                    </div>
                                                    <div className="relative">
                                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="Search products..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                                    </div>
                                                </div>
                    </div>
                </CardHeader>
                                 <CardContent>
                                        <div className="mb-3 flex justify-between items-center">
                                            <div className="text-sm text-muted-foreground">
                                            {shop ? `Shop: ${shop}` : 'Shop: -'} · {shelf ? `Shelf: ${shelf}` : 'Shelf: -'} · Date: {date ? format(date, 'yyyy-MM-dd') : '-'} · Sales Month: {salesMonth}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" onClick={() => setShowNewSmn(true)}>
                                                    <PlusCircle className="mr-2 h-4 w-4" /> New SMN
                                                </Button>
                                            </div>
                                        </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                                                                     <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('name')}>Product {sortKey==='name' ? (sortDir==='asc' ? '▲' : '▼') : ''}</TableHead>
                                                        <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('price')}>Price {sortKey==='price' ? (sortDir==='asc' ? '▲' : '▼') : ''}</TableHead>
                                                                                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('stock')}>Stock {sortKey==='stock' ? (sortDir==='asc' ? '▲' : '▼') : ''}</TableHead>
                                                                                    <TableHead>
                                                                                        <div className="inline-flex items-center gap-1">
                                                                                            <span>Sales ({salesMonth})</span>
                                                                                            <Popover>
                                                                                                <PopoverTrigger asChild>
                                                                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                                                        <CalendarIcon className="h-4 w-4" />
                                                                                                    </Button>
                                                                                                </PopoverTrigger>
                                                                                                <PopoverContent className="w-auto p-0" align="end">
                                                                                                    <Calendar
                                                                                                        mode="single"
                                                                                                        selected={selectedSalesDate}
                                                                                                        onSelect={(d) => d && setSalesMonth(format(d, 'yyyy-MM'))}
                                                                                                        initialFocus
                                                                                                    />
                                                                                                </PopoverContent>
                                                                                            </Popover>
                                                                                        </div>
                                                                                    </TableHead>
                                                                                    <TableHead>Special Remark</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                                                        {paginatedProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium flex items-center gap-3">
                                                                        <Image src={product.imageUrl} alt={product.name} width={36} height={36} className="rounded-md" />
                                                                                                    <div>
                                                                                                        <div>{product.name}</div>
                                                                                                        <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                                                                                                    </div>
                                </TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                                                <TableCell>
                                                                    <div className="inline-flex items-center gap-2">
                                                                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => quickAdjust(product.id, -1)}>-</Button>
                                                                        <span className="min-w-[2ch] text-center">{product.stock}</span>
                                                                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => quickAdjust(product.id, 1)}>+</Button>
                                                                        {product.stock <= 10 && <Badge variant="secondary">Low</Badge>}
                                                                    </div>
                                                                  </TableCell>
                                                                  <TableCell>{getSalesCount(product.id, salesMonth)}</TableCell>
                                                                  <TableCell className="max-w-[220px]"><span className="line-clamp-1 text-xs text-muted-foreground">{product.specialRemark || '-'}</span></TableCell>
                                <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => setAdjustProductId(product.id)}>Adjust Inventory</DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => setSalesProductId(product.id)}>View Sales</DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => quickAdjust(product.id, 10)}>Quick +10</DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => quickAdjust(product.id, -10)}>Quick -10</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                                        <div className="flex justify-between items-center mt-3 text-sm">
                                            <span className="text-muted-foreground">{sortedProducts.length} items · Page {page} / {totalPages}</span>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))}>Prev</Button>
                                                <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</Button>
                                            </div>
                                        </div>
                </CardContent>
            </Card>
        </div>
                {/* Right column removed per request */}

                {/* Adjust Inventory Dialog */}
                <Dialog open={!!adjustProductId} onOpenChange={() => setAdjustProductId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adjust Inventory</DialogTitle>
                            <DialogDescription>Update quantity for the selected product. Use positive for stock-in and negative for stock-out.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <div className="text-sm text-muted-foreground">Date: {date ? format(date, 'yyyy-MM-dd') : '-' } · {shop ? `Shop: ${shop}` : 'Shop: -'} · {shelf ? `Shelf: ${shelf}` : 'Shelf: -'}</div>
                            <div className="grid gap-1">
                                <Label htmlFor="adj-qty">Qty +/-</Label>
                                <Input id="adj-qty" type="number" placeholder="0" />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="adj-remark">Remark</Label>
                                <Input id="adj-remark" placeholder="Optional" />
                            </div>
                            <div className="flex justify-end gap-2 mt-1">
                                <Button variant="outline" onClick={() => setAdjustProductId(null)}>Cancel</Button>
                                <Button onClick={() => setAdjustProductId(null)}>Save</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* View Sales Dialog */}
                <Dialog open={!!salesProductId} onOpenChange={() => setSalesProductId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Sales</DialogTitle>
                            <DialogDescription>Sales records for the selected date and filters.</DialogDescription>
                        </DialogHeader>
                        <div className="text-sm text-muted-foreground mb-2">Date: {date ? format(date, 'yyyy-MM-dd') : '-' } · {shop ? `Shop: ${shop}` : 'Shop: -'} · {shelf ? `Shelf: ${shelf}` : 'Shelf: -'}</div>
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
                                {[{ id: 's-1', time: '10:02', items: 2, total: 23.5 }, { id: 's-2', time: '12:11', items: 1, total: 12.0 }].map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.id}</TableCell>
                                        <TableCell>{s.time}</TableCell>
                                        <TableCell>{s.items}</TableCell>
                                        <TableCell>${s.total.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-end mt-3">
                            <Button onClick={() => setSalesProductId(null)}>Close</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* New SMN Dialog */}
                        <Dialog open={showNewSmn} onOpenChange={setShowNewSmn}>
                            <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>新增 SMN / New SMN</DialogTitle>
                            <DialogDescription>Register new items. Leave Product ID blank for new products.</DialogDescription>
                        </DialogHeader>
                        <div className="text-sm text-muted-foreground">Date: {date ? format(date, 'yyyy-MM-dd') : '-' } · {shop ? `Shop: ${shop}` : 'Shop: -'} · {shelf ? `Shelf: ${shelf}` : 'Shelf: -'}</div>
                                <div className="border rounded-md max-h-64 overflow-auto">
                                    <Table className="text-sm">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>編號(新貨留空) Product ID</TableHead>
                                        <TableHead>貨品名稱 Name</TableHead>
                                        <TableHead>數量 Qty +/-</TableHead>
                                        <TableHead>價錢 Price</TableHead>
                                        <TableHead>貨品特別要求 Special Remark</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {useMemo(() => Array.from({ length: 10 }), []).map((_, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="w-[160px]"><Input placeholder={`${idx + 1}.`} /></TableCell>
                                                    <TableCell className="min-w-[200px]"><Input placeholder="貨品名稱 / Product name" /></TableCell>
                                                    <TableCell className="w-[110px]"><Input type="number" placeholder="0" /></TableCell>
                                                    <TableCell className="w-[120px]"><Input type="number" step="0.01" placeholder="0.00" /></TableCell>
                                            <TableCell><Input placeholder="Sales remark" /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="text-xs text-muted-foreground mt-3 space-y-1">
                            <p>登記新產品：不用輸入貨品編號</p>
                            <p>Register New Product: No need to input Product ID.</p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowNewSmn(false)}>取消</Button>
                            <Button onClick={() => setShowNewSmn(false)}>提交 Submit</Button>
                        </div>
                    </DialogContent>
                </Dialog>
    </div>
  );
}
