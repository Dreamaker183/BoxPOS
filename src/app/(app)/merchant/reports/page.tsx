"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, LineChart } from 'recharts';

const monthlySales = [
  { month: 'Mar', sales: 3200, orders: 92 },
  { month: 'Apr', sales: 4100, orders: 110 },
  { month: 'May', sales: 3800, orders: 102 },
  { month: 'Jun', sales: 4500, orders: 121 },
  { month: 'Jul', sales: 5200, orders: 140 },
];

const chartConfig: ChartConfig = {
  sales: { label: 'Sales', color: 'hsl(var(--chart-1))' },
  orders: { label: 'Orders', color: 'hsl(var(--chart-2))' },
};

export default function MerchantReportsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
          <CardDescription>Recent performance by month.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={monthlySales} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders Trend</CardTitle>
          <CardDescription>Orders volume across months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <LineChart data={monthlySales} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
