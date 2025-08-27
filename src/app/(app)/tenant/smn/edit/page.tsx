'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const mockSmn = [
  { id: 'smn-001', title: 'Restock mugs', status: 'Open' },
  { id: 'smn-002', title: 'Change price tags', status: 'In Progress' },
];

const shops = [
  { id: 'shop-1', name: 'Shop A' },
  { id: 'shop-2', name: 'Shop B' },
];

const shelves = [
  { id: 'shelf-1', name: 'Shelf A' },
  { id: 'shelf-2', name: 'Shelf B' },
];

export default function TenantEditSmnPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tenant/products?action=newSmn');
  }, [router]);
  const [search, setSearch] = useState('');
  const [shop, setShop] = useState<string | undefined>();
  const [shelf, setShelf] = useState<string | undefined>();
  const [listDate, setListDate] = useState<Date | undefined>(new Date());
  const filtered = mockSmn.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  const rows = useMemo(() => Array.from({ length: 10 }, () => ({})), []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">更改 SMN / Edit SMN</h1>

      <Card>
        <CardHeader>
          <CardTitle>搜尋 / Search</CardTitle>
          <CardDescription>請於“放大鏡”選出你的貨品編號。如留空便當作新登記貨品，庫存便不準確了！</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2"><Input placeholder="Search SMN..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div>
            <Select value={shop} onValueChange={setShop}>
              <SelectTrigger>
                <SelectValue placeholder="店舖 Shop" />
              </SelectTrigger>
              <SelectContent>
                {shops.map(s => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={shelf} onValueChange={setShelf}>
              <SelectTrigger>
                <SelectValue placeholder="貨架 Shelf" />
              </SelectTrigger>
              <SelectContent>
                {shelves.map(s => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex h-10 w-full items-center justify-start rounded-md border bg-background px-3 text-sm ring-offset-background focus:outline-none">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {listDate ? format(listDate, 'yyyy-MM-dd') : '上架日期 List Date'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={listDate} onSelect={setListDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Management Notes</CardTitle>
          <CardDescription>Find and edit existing SMNs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>請輸入</p>
            <ul className="list-disc pl-5">
              <li>貨品名稱（可不變）</li>
              <li>數量（可不變）：可輸入正（增加／上架）或負（減少／下架）數量</li>
              <li>價錢（可不變）</li>
              <li>貨品特別要求（可不變）</li>
            </ul>
            <p className="mt-2">Modify current inventory：please select your Product ID by clicking the 'magnifying glass'，不要留空。</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>編號 Product ID</TableHead>
                <TableHead>貨品名稱 Name</TableHead>
                <TableHead>數量 Qty +/-</TableHead>
                <TableHead>價錢 Price</TableHead>
                <TableHead>貨品特別要求 Special Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="w-[180px]"><Input placeholder={`${idx + 1}.`} /></TableCell>
                  <TableCell><Input placeholder="貨品名稱 / Product name" /></TableCell>
                  <TableCell className="w-[140px]"><Input type="number" placeholder="0" /></TableCell>
                  <TableCell className="w-[160px]"><Input type="number" step="0.01" placeholder="0.00" /></TableCell>
                  <TableCell><Input placeholder="Sales remark" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
