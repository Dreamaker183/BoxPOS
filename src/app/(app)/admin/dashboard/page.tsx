
'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { DollarSign, Building, Users, AlertCircle } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';

const initialIncomeData = [
  { month: 'January', income: 0 },
  { month: 'February', income: 0 },
  { month: 'March', income: 0 },
  { month: 'April', income: 0 },
  { month: 'May', income: 0 },
  { month: 'June', income: 0 },
];

const occupancyData = [
    { name: 'Occupied', value: 82, fill: 'hsl(var(--chart-1))' },
    { name: 'Vacant', value: 18, fill: 'hsl(var(--chart-2))' },
];

const chartConfig: ChartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-1))",
    },
};

const pieChartConfig: ChartConfig = {
  value: {
    label: 'Booths',
  },
  occupied: {
    label: 'Occupied',
    color: 'hsl(var(--chart-1))',
  },
  vacant: {
    label: 'Vacant',
    color: 'hsl(var(--chart-2))',
  },
};


export default function DashboardPage() {
  const [incomeData, setIncomeData] = useState(initialIncomeData);

  useEffect(() => {
    // Generate random data on the client side to avoid hydration mismatch
    setIncomeData(initialIncomeData.map(d => ({ ...d, income: Math.floor(Math.random() * 20000) + 5000 })));
  }, []);
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">150</div>
          <p className="text-xs text-muted-foreground">+10 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Booths</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">82 / 100</div>
          <p className="text-xs text-muted-foreground">82% occupancy</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$25,350.00</div>
          <p className="text-xs text-muted-foreground">+5.2% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">Totaling $4,200.00</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Income Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={incomeData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Booth Occupancy</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
            <PieChart>
              <Tooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie data={occupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}/>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
