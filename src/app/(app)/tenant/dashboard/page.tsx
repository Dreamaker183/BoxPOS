
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Building, FileText, DollarSign, CalendarDays } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const salesData = [
  { month: 'Jan', sales: 1200 },
  { month: 'Feb', sales: 1500 },
  { month: 'Mar', sales: 1350 },
  { month: 'Apr', sales: 1800 },
  { month: 'May', sales: 1600 },
  { month: 'Jun', sales: 2100 },
];

const chartConfig: ChartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
};


export default function TenantDashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assigned Booth</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">A-12</div>
          <p className="text-xs text-muted-foreground">Sunrise Market Stall</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lease Status</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Active</div>
          <p className="text-xs text-muted-foreground">Expires: 2025-01-14</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Sales (30d)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$2,100.00</div>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,200.00</div>
          <p className="text-xs text-muted-foreground">On 2024-09-01</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>Your sales performance over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={salesData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </BarChart>
            </ChartContainer>
          </div>
          <div className="md:col-span-1 flex flex-col justify-center gap-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <Button asChild variant="outline"><Link href="/tenant/products">Manage Products</Link></Button>
            <Button asChild variant="outline"><Link href="/tenant/reports">View Reports</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
