'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const cameras = [
  { id: 'cam-a', name: 'Shelf A', url: 'https://picsum.photos/800/450?random=41' },
  { id: 'cam-b', name: 'Shelf B', url: 'https://picsum.photos/800/450?random=42' },
  { id: 'cam-c', name: 'Shelf C', url: 'https://picsum.photos/800/450?random=43' },
];

export default function TenantShelfPage() {
  const [shop, setShop] = useState<string | undefined>();
  const [shelf, setShelf] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const images = useMemo(() => {
    // mock: generate images per day between startDate and endDate
    const out: { id: string; date: Date; url: string }[] = [];
    if (!startDate || !endDate) return out;
    const start = new Date(Math.min(startDate.getTime(), endDate.getTime()));
    const end = new Date(Math.max(startDate.getTime(), endDate.getTime()));
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      out.push({ id: `img-${d.toISOString().slice(0,10)}`, date: new Date(d), url: `https://picsum.photos/800/450?random=${Math.floor(Math.random()*1000)}` });
    }
    return out;
  }, [startDate, endDate]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Shelf</h1>
      <Card>
        <CardHeader>
          <CardTitle>Live Shelf View</CardTitle>
          <CardDescription>Preview daily shelf photos. Merchant uploads one photo per day.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center flex-wrap mb-4">
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
                <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Start: {startDate ? format(startDate, 'PPP') : 'Select'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  End: {endDate ? format(endDate, 'PPP') : 'Select'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map(img => (
              <Card key={img.id}>
                <CardHeader>
                  <CardTitle className="text-base">{format(img.date, 'yyyy-MM-dd')}</CardTitle>
                  <CardDescription>{shop ? shop : 'Shop -'} · {shelf ? shelf : 'Shelf -'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black">
                    <Image src={img.url} alt={format(img.date, 'yyyy-MM-dd')} fill className="object-cover" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
