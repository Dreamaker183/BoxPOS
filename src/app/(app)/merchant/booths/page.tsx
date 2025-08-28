
"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, MoreHorizontal, List, LayoutGrid } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Script from 'next/script';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BoothStatus = 'active' | 'vacant' | 'maintenance';

type Booth = {
  id: string;
  name: string;
  tenant: string;
  status: BoothStatus;
  location: string;
  shop: string; // 店舖名稱（香港）
  occupancy: string;
  imageUrl: string;
  deposit?: number; // 按金
  lat?: number;
  lng?: number;
};

type Shop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  boothCount: number;
};

// 已知香港店舖對應座標（示例）
const SHOP_COORDS: Record<string, { lat: number; lng: number }> = {
  'Central Market': { lat: 22.2825, lng: 114.1559 }, // 中環街市
  'Harbor Mall': { lat: 22.295, lng: 114.169 }, // 範例：近尖沙咀海港城一帶
};

const mockBooths: Booth[] = [
  { id: 'booth-a01', name: 'Sunrise Market Stall', tenant: 'Global Foods Inc.', status: 'active', location: 'A-01', shop: 'Central Market', occupancy: '100%', imageUrl: 'https://picsum.photos/400/300?random=11', deposit: 800, lat: 22.2819, lng: 114.1589 },
  { id: 'booth-b05', name: 'Downtown Kiosk', tenant: 'Crafty Creations', status: 'active', location: 'B-05', shop: 'Harbor Mall', occupancy: '100%', imageUrl: 'https://picsum.photos/400/300?random=12', deposit: 1000, lat: 22.296, lng: 114.1722 },
  { id: 'booth-c11', name: 'West End Corner', tenant: 'Tech Gadgets', status: 'vacant', location: 'C-11', shop: 'Central Market', occupancy: '0%', imageUrl: 'https://picsum.photos/400/300?random=13', deposit: 1000, lat: 22.3193, lng: 114.1694 },
  { id: 'booth-d02', name: 'Farmers Fair Spot', tenant: 'Vintage Apparel', status: 'maintenance', location: 'D-02', shop: 'Harbor Mall', occupancy: 'N/A', imageUrl: 'https://picsum.photos/400/300?random=14', deposit: 600, lat: 22.2796, lng: 114.171 },
];

const statusVariant: Record<BoothStatus, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  vacant: 'secondary',
  maintenance: 'outline',
};

export default function BoothManagementPage() {
  const ALL = '__ALL__';
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [booths, setBooths] = useState<Booth[]>(mockBooths);
  const [shopFilter, setShopFilter] = useState<string>(ALL);
  const [shelfFilter, setShelfFilter] = useState<string>(ALL);
  const { toast } = useToast();

  const uniqueShops = useMemo(() => Array.from(new Set(booths.map(b => b.shop))).sort(), [booths]);
  const uniqueShelves = useMemo(() => {
    const source = shopFilter !== ALL ? booths.filter(b => b.shop === shopFilter) : booths;
    return Array.from(new Set(source.map(b => b.location))).sort();
  }, [booths, shopFilter]);

  const filteredBooths = useMemo(() => {
    return booths.filter((booth) => {
      if (searchTerm && !booth.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (shopFilter !== ALL && booth.shop !== shopFilter) return false;
      if (shelfFilter !== ALL && booth.location !== shelfFilter) return false;
      return true;
    });
  }, [booths, searchTerm, shopFilter, shelfFilter]);

  // Reset shelf filter when shop changes
  useEffect(() => {
    setShelfFilter(ALL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopFilter]);

  // 依據攤位資料彙總出店舖（含各店擁有的攤位數），並掛上香港座標
  const shops: Shop[] = useMemo(() => {
    const map = new Map<string, { name: string; lat: number; lng: number; count: number }>();
    filteredBooths.forEach((b) => {
      const name = b.shop;
      const coord = SHOP_COORDS[name];
      if (!coord) return; // 未知座標則略過
      const current = map.get(name);
      if (current) {
        current.count += 1;
      } else {
        map.set(name, { name, lat: coord.lat, lng: coord.lng, count: 1 });
      }
    });
    let i = 0;
    return Array.from(map.values()).map((v) => ({ id: `shop-${i++}`, name: v.name, lat: v.lat, lng: v.lng, boothCount: v.count }));
  }, [filteredBooths]);

  const handleWithdraw = (booth: Booth) => {
    // 更新攤位狀態為 vacant
    setBooths((prev) => prev.map((b) => (b.id === booth.id ? { ...b, status: 'vacant', occupancy: '0%' } : b)));

    // 記錄按金退款到 localStorage，於結算頁整合
    const key = 'boxpos:depositRefunds';
    const period = format(new Date(), 'yyyy-MM');
    const existing = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    const data = existing ? (JSON.parse(existing) as any[]) : [];
    const amount = booth.deposit ?? 0;
    data.push({ id: `${booth.id}-${period}`, boothId: booth.id, boothName: booth.name, amount, period });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(data));
    }

    toast({
      title: 'Withdraw submitted',
      description: `Booth ${booth.location} will be vacated. Deposit $${amount.toFixed(2)} will be refunded in settlement (${period}).`,
    });
  };

  // Google Map component（以店舖為單位放置標記）
  const MapView = ({ shops }: { shops: Shop[] }) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapEl = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    const initMap = () => {
      if (!mapEl.current || !(window as any).google) return;
      const center = shops.length > 0 ?
        { lat: shops[0].lat, lng: shops[0].lng } :
        { lat: 22.3193, lng: 114.1694 };
      mapRef.current = new (window as any).google.maps.Map(mapEl.current, {
        center,
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });
      renderMarkers();
    };

    const renderMarkers = () => {
      if (!mapRef.current || !(window as any).google) return;
      // clear
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      const bounds = new (window as any).google.maps.LatLngBounds();
      let hasBounds = false;
      shops.forEach((s) => {
        const pos = { lat: s.lat, lng: s.lng };
        const marker = new (window as any).google.maps.Marker({
          position: pos,
          map: mapRef.current,
          title: `${s.name}`,
          label: `${s.boothCount}`,
        });
        const content = `<div style="font-size:12px"><strong>${s.name}</strong><br/>Booths: ${s.boothCount}</div>`;
        const info = new (window as any).google.maps.InfoWindow({ content });
        marker.addListener('click', () => info.open({ anchor: marker, map: mapRef.current }));
        markersRef.current.push(marker);
        bounds.extend(pos);
        hasBounds = true;
      });
      if (hasBounds) mapRef.current.fitBounds(bounds);
    };

    useEffect(() => {
      if ((window as any).google) {
        // Script already loaded
        if (!mapRef.current) initMap(); else renderMarkers();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shops]);

    return (
      <>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
          strategy="afterInteractive"
          onLoad={() => initMap()}
        />
        <div ref={mapEl} className="h-64 w-full rounded-lg" />
      </>
    );
  };

  return (
    <div className="space-y-6">
    <Card>
        <CardHeader>
          <CardTitle>Shop Map (Hong Kong)</CardTitle>
          <CardDescription>Interactive map with your owned shops in Hong Kong. Marker label shows number of booths.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
      <Select value={shopFilter} onValueChange={setShopFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Shop" /></SelectTrigger>
              <SelectContent>
        <SelectItem value={ALL}>All Shops</SelectItem>
                {uniqueShops.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
      <Select value={shelfFilter} onValueChange={setShelfFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Shelf" /></SelectTrigger>
              <SelectContent>
        <SelectItem value={ALL}>All Shelves</SelectItem>
                {uniqueShelves.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
      <MapView shops={shops} />
          <p className="text-xs text-muted-foreground mt-2">Powered by Google Maps</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>My Booths</CardTitle>
              <CardDescription>Manage your assigned booths and their status.</CardDescription>
            </div>
             <div className="flex gap-2 w-full sm:w-auto">
               <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search booths..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
               <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}><List /><span className="sr-only">List View</span></Button>
               <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}><LayoutGrid /><span className="sr-only">Grid View</span></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {view === 'list' ? (
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredBooths.map((booth) => (
                    <TableRow key={booth.id}>
                        <TableCell className="font-medium">{booth.name}</TableCell>
                        <TableCell>{booth.location}</TableCell>
                        <TableCell>
                        <Badge variant={statusVariant[booth.status]}>{booth.status}</Badge>
                        </TableCell>
                        <TableCell>{booth.occupancy}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  disabled={booth.status !== 'active'}
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:text-destructive"
                                >
                                  Withdraw (Refund Deposit)
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Withdraw</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    You are withdrawing from booth {booth.location}. Deposit will be refunded in the next settlement. Continue?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleWithdraw(booth)}>Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooths.map(booth => (
                    <Card key={booth.id}>
                        <div className="relative aspect-video">
                            <Image src={booth.imageUrl} alt={booth.name} fill className="object-cover rounded-t-lg" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg">{booth.name}</CardTitle>
                            <CardDescription>{booth.location}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center gap-2">
                            <Badge variant={statusVariant[booth.status]}>{booth.status}</Badge>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{booth.occupancy} Occupied</p>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" disabled={booth.status !== 'active'}>Withdraw</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Withdraw</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      You are withdrawing from booth {booth.location}. Deposit will be refunded in the next settlement. Continue?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleWithdraw(booth)}>Confirm</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
