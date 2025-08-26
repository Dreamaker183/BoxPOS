
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, MoreHorizontal, List, LayoutGrid } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';

type BoothStatus = 'active' | 'vacant' | 'maintenance';

const mockBooths = [
  { id: 'booth-a01', name: 'Sunrise Market Stall', tenant: 'Global Foods Inc.', status: 'active' as BoothStatus, location: 'A-01', occupancy: '100%', imageUrl: 'https://picsum.photos/400/300?random=11' },
  { id: 'booth-b05', name: 'Downtown Kiosk', tenant: 'Crafty Creations', status: 'active' as BoothStatus, location: 'B-05', occupancy: '100%', imageUrl: 'https://picsum.photos/400/300?random=12' },
  { id: 'booth-c11', name: 'West End Corner', tenant: 'Tech Gadgets', status: 'vacant' as BoothStatus, location: 'C-11', occupancy: '0%', imageUrl: 'https://picsum.photos/400/300?random=13' },
  { id: 'booth-d02', name: 'Farmers Fair Spot', tenant: 'Vintage Apparel', status: 'maintenance' as BoothStatus, location: 'D-02', occupancy: 'N/A', imageUrl: 'https://picsum.photos/400/300?random=14' },
];

const statusVariant: Record<BoothStatus, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  vacant: 'secondary',
  maintenance: 'outline',
};

export default function BoothManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');

  const filteredBooths = mockBooths.filter(booth =>
    booth.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <Card>
            <CardHeader>
                <CardTitle>Market Map</CardTitle>
                <CardDescription>Interactive map showing your booth locations.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-muted-foreground/50" />
                    <p className="text-muted-foreground ml-4">Interactive map placeholder</p>
                </div>
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
                            <Image src={booth.imageUrl} alt={booth.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg">{booth.name}</CardTitle>
                            <CardDescription>{booth.location}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <Badge variant={statusVariant[booth.status]}>{booth.status}</Badge>
                            <p className="text-sm font-medium">{booth.occupancy} Occupied</p>
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
