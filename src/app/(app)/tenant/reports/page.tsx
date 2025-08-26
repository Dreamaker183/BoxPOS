
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import React from 'react';
import { Badge } from '@/components/ui/badge';


const salesHistory = [
    { id: 'sale-1', date: '2024-07-28', items: 3, total: 45.50 },
    { id: 'sale-2', date: '2024-07-27', items: 5, total: 82.00 },
    { id: 'sale-3', date: '2024-07-26', items: 2, total: 25.00 },
];

const paymentLogs = [
    { id: 'pay-1', date: '2024-08-01', period: 'July 2024', amount: 11250, status: 'Paid' },
    { id: 'pay-2', date: '2024-07-01', period: 'June 2024', amount: 9900, status: 'Paid' },
];

export default function TenantReportsPage() {
    const [date, setDate] = React.useState<Date | undefined>(
        new Date()
    );

  return (
    <div className="space-y-6">
       <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          <p className="text-muted-foreground">View your sales, payments, and lease details.</p>
        </div>
        <div className="flex gap-2 items-center">
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className="w-[240px] justify-start text-left font-normal"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            <Button variant="outline"><FileDown className="mr-2" /> Export</Button>
        </div>
      </header>

      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="payments">Payment Logs</TabsTrigger>
          <TabsTrigger value="lease">Lease Details</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>A log of your recent sales transactions.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {salesHistory.map(sale => (
                        <TableRow key={sale.id}>
                            <TableCell>{sale.date}</TableCell>
                            <TableCell>{sale.items}</TableCell>
                            <TableCell>${sale.total.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
               </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>A log of your settlement payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paymentLogs.map(log => (
                        <TableRow key={log.id}>
                            <TableCell>{log.date}</TableCell>
                            <TableCell>{log.period}</TableCell>
                            <TableCell>${log.amount.toFixed(2)}</TableCell>
                            <TableCell><Badge>{log.status}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
               </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lease">
          <Card>
            <CardHeader>
              <CardTitle>Lease Agreement</CardTitle>
              <CardDescription>Details of your current lease contract.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium">Start Date</p>
                        <p className="text-muted-foreground">2024-01-15</p>
                    </div>
                     <div>
                        <p className="font-medium">End Date</p>
                        <p className="text-muted-foreground">2025-01-14</p>
                    </div>
                     <div>
                        <p className="font-medium">Monthly Rent</p>
                        <p className="text-muted-foreground">$1200.00</p>
                    </div>
                     <div>
                        <p className="font-medium">Booth ID</p>
                        <p className="text-muted-foreground">A-12</p>
                    </div>
                </div>
                 <Button variant="outline">
                    <FileDown className="mr-2" />
                    Download Lease PDF
                </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
