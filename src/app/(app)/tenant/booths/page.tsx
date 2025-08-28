"use client";

import { useMemo, useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Script from 'next/script';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Tenant: My Booths == My Shelves. Location should be Shop • Shelf
 type BoothStatus = 'active' | 'vacant' | 'maintenance';
 type MyShelf = { id: string; name: string; status: BoothStatus; shop: string; shelf: string };
 type Shop = { id: string; name: string; lat: number; lng: number; boothCount: number };
 const SHOP_COORDS: Record<string, { lat: number; lng: number }> = {
  'Central Market': { lat: 22.2825, lng: 114.1559 },
  'Harbor Mall': { lat: 22.295, lng: 114.169 },
 };

 const mock: MyShelf[] = [
  { id: 'ms-01', name: 'Tech Gadgets Shelf', status: 'active', shop: 'Central Market', shelf: 'T-12' },
  { id: 'ms-02', name: 'Crafts Corner', status: 'active', shop: 'Harbor Mall', shelf: 'T-08' },
 ];

export default function TenantBoothsPage() {
  const ALL = '__ALL__';
  const [rows] = useState<MyShelf[]>(mock);
  const [shopFilter, setShopFilter] = useState<string>(ALL);
  const [shelfFilter, setShelfFilter] = useState<string>(ALL);
  const uniqueShops = useMemo(() => Array.from(new Set(rows.map(r => r.shop))).sort(), [rows]);
  const uniqueShelves = useMemo(() => {
    const source = shopFilter !== ALL ? rows.filter(r => r.shop === shopFilter) : rows;
    return Array.from(new Set(source.map(r => r.shelf))).sort();
  }, [rows, shopFilter]);
  const filtered = useMemo(() => rows.filter(r => (shopFilter === ALL || r.shop === shopFilter) && (shelfFilter === ALL || r.shelf === shelfFilter)), [rows, shopFilter, shelfFilter]);

  useEffect(() => {
    setShelfFilter(ALL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopFilter]);
  const shops: Shop[] = useMemo(() => {
    const m = new Map<string, { name: string; lat: number; lng: number; count: number }>();
    filtered.forEach(r => {
      const c = SHOP_COORDS[r.shop];
      if (!c) return;
      const cur = m.get(r.shop);
      if (cur) cur.count += 1; else m.set(r.shop, { name: r.shop, lat: c.lat, lng: c.lng, count: 1 });
    });
    let i = 0;
    return Array.from(m.values()).map(v => ({ id: `shop-${i++}`, name: v.name, lat: v.lat, lng: v.lng, boothCount: v.count }));
  }, [filtered]);

  const MapView = ({ shops }: { shops: Shop[] }) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapEl = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    const initMap = () => {
      if (!mapEl.current || !(window as any).google) return;
      const center = shops[0] ? { lat: shops[0].lat, lng: shops[0].lng } : { lat: 22.3193, lng: 114.1694 };
      mapRef.current = new (window as any).google.maps.Map(mapEl.current, { center, zoom: 12, mapTypeControl: false, fullscreenControl: false, streetViewControl: false });
      renderMarkers();
    };

    const renderMarkers = () => {
      if (!mapRef.current || !(window as any).google) return;
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      const bounds = new (window as any).google.maps.LatLngBounds();
      shops.forEach(s => {
        const pos = { lat: s.lat, lng: s.lng };
        const marker = new (window as any).google.maps.Marker({ position: pos, map: mapRef.current, title: s.name, label: `${s.boothCount}` });
        const info = new (window as any).google.maps.InfoWindow({ content: `<div style='font-size:12px'><b>${s.name}</b><br/>My Shelves: ${s.boothCount}</div>` });
        marker.addListener('click', () => info.open({ anchor: marker, map: mapRef.current }));
        markersRef.current.push(marker);
        bounds.extend(pos);
      });
      if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
    };

    useEffect(() => {
      if ((window as any).google) { if (!mapRef.current) initMap(); else renderMarkers(); }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shops]);

    return (
      <>
        <Script src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`} strategy="afterInteractive" onLoad={() => initMap()} />
        <div ref={mapEl} className="h-64 w-full rounded-lg" />
      </>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Booths (Shelves) Map</CardTitle>
          <CardDescription>Your shelves grouped by shop in Hong Kong</CardDescription>
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
          <CardTitle>My Shelves</CardTitle>
      <CardDescription>Manage your shelves. Columns show Shop and Shelf.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
        <TableHead>Shop</TableHead>
        <TableHead>Shelf</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell><Badge>{r.status}</Badge></TableCell>
      <TableCell>{r.shop}</TableCell>
      <TableCell>{r.shelf}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
