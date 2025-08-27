'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

type Row = { id?: string; name?: string; qty?: number | string; price?: number | string; remark?: string };

const shops = [
  { id: 'shop-1', name: 'Shop A' },
  { id: 'shop-2', name: 'Shop B' },
];

const shelves = [
  { id: 'shelf-1', name: 'Shelf A' },
  { id: 'shelf-2', name: 'Shelf B' },
];

export default function TenantNewSmnPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tenant/products?action=newSmn');
  }, [router]);
  const [shop, setShop] = useState<string | undefined>();
  const [shelf, setShelf] = useState<string | undefined>();
  const [listDate, setListDate] = useState<Date | undefined>(new Date());
  const rows = useMemo<Row[]>(() => Array.from({ length: 10 }, () => ({})), []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">新增 SMN</h1>

      <Card>
        <CardHeader>
          <CardTitle>Unique Cube</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1">
              <Label>客戶</Label>
              <div className="text-sm">Leung Ka Tung (36860380)</div>
            </div>
            <div className="grid gap-1">
              <Label>
                店舖 Shop <span className="text-destructive">*</span>
              </Label>
              <Select value={shop} onValueChange={setShop}>
                <SelectTrigger>
                  <SelectValue placeholder="- 請選擇店舖 Please Select -" />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!shop && (
                <div className="text-xs text-destructive">&lt;-- 必須先選擇店舖 / must select shop !</div>
              )}
            </div>
            <div className="grid gap-1">
              <Label>貨架 Shelf</Label>
              <Select value={shelf} onValueChange={setShelf}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shelf" />
                </SelectTrigger>
                <SelectContent>
                  {shelves.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>上架日期 List Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {listDate ? format(listDate, 'yyyy-MM-dd') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={listDate} onSelect={setListDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>登記新產品：不用輸入貨品編號</Label>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>請輸入</p>
              <ul className="list-disc pl-5">
                <li>貨品名稱：給你的產品一個簡單描述</li>
                <li>數量：新上架數量</li>
                <li>價錢：零售價</li>
                <li>貨品特別要求（可留空）：當售出你的產品是，於 POS 系統彈出的特別訊息</li>
              </ul>
              <p className="mt-2">Register New Product : No need input Product ID</p>
              <ul className="list-disc pl-5">
                <li>Product Name：shown as product name</li>
                <li>Qty：new stock in / out quantity (+/-)</li>
                <li>Price：selling price</li>
                <li>Sales Remark（can leave blank）：the pop-up message as we retail check out your product</li>
              </ul>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SMN Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
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

          <div className="flex justify-end gap-2">
            <Button variant="outline">取消</Button>
            <Button disabled={!shop}>提交 Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
