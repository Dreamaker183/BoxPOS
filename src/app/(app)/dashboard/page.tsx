'use client';

import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { DollarSign, Package, Users, Receipt } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';

const salesData = [
  { month: 'January', sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'February', sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'March', sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'April', sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'May', sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'June', sales: Math.floor(Math.random() * 5000) + 1000 },
];

const topProductsData = [
    { name: 'Espresso', value: 400, fill: 'hsl(var(--chart-1))' },
    { name: 'Latte', value: 300, fill: 'hsl(var(--chart-2))' },
    { name: 'Croissant', value: 200, fill: 'hsl(var(--chart-3))' },
    { name: 'Muffin', value: 278, fill: 'hsl(var(--chart-4))' },
];

const chartConfig: ChartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
};

const pieChartConfig: ChartConfig = {
  value: {
    label: 'Value',
  },
  espresso: {
    label: 'Espresso',
    color: 'hsl(var(--chart-1))',
  },
  latte: {
    label: 'Latte',
    color: 'hsl(var(--chart-2))',
  },
  croissant: {
    label: 'Croissant',
    color: 'hsl(var(--chart-3))',
  },
  muffin: {
    label: 'Muffin',
    color: 'hsl(var(--chart-4))',
  },
};


export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">142</div>
          <p className="text-xs text-muted-foreground">Active</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+20 since last week</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={salesData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
            <PieChart>
              <Tooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie data={topProductsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
