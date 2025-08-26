
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Building, DollarSign, Package, AlertTriangle, Bell } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';

const salesData = [
  { booth: 'A-01', sales: 4000 },
  { booth: 'A-02', sales: 3000 },
  { booth: 'B-05', sales: 5000 },
  { booth: 'C-11', sales: 2780 },
];

const chartConfig: ChartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
};

const mockNotifications = [
    { id: 1, type: 'alert', message: 'Low stock for "Croissants". Only 5 remaining.'},
    { id: 2, type: 'maintenance', message: 'Booth A-02 scheduled for maintenance tomorrow.'},
    { id: 3, type: 'info', message: 'New sales report available for download.'},
]

export default function MerchantDashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assigned Booths</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4</div>
          <p className="text-xs text-muted-foreground">in 2 different markets</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,250.00</div>
          <p className="text-xs text-muted-foreground">+15% from yesterday</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85</div>
          <p className="text-xs text-muted-foreground">across all booths</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3 items</div>
          <p className="text-xs text-muted-foreground">Needs restocking soon</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales by Booth</CardTitle>
          <CardDescription>Performance of your active booths.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={salesData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="booth" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Updates regarding your booths and products.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {mockNotifications.map(n => (
                    <li key={n.id} className="flex items-start gap-3">
                        <div className="mt-1">
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm">{n.message}</p>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
