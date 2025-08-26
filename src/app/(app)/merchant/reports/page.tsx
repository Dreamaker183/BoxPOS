
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, Calendar as CalendarIcon } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import React from 'react';

const salesData = [
  { date: '2024-07-01', sales: 220 }, { date: '2024-07-02', sales: 350 }, { date: '2024-07-03', sales: 410 },
  { date: '2024-07-04', sales: 380 }, { date: '2024-07-05', sales: 520 }, { date: '2024-07-06', sales: 450 },
];
const salesChartConfig: ChartConfig = { sales: { label: "Sales", color: "hsl(var(--chart-1))" }};

const inventoryData = [
    { product: 'Mug', stock: 50 }, { product: 'Scarf', stock: 30 }, { product: 'Candle', stock: 8 },
    { product: 'Wallet', stock: 20 }, { product: 'Bowl', stock: 12 },
];
const inventoryChartConfig: ChartConfig = { stock: { label: "Stock", color: "hsl(var(--chart-2))" }};

const financialsData = [
    { month: 'Jan', income: 4000, expenses: 2400 }, { month: 'Feb', income: 3000, expenses: 1398 },
    { month: 'Mar', income: 5000, expenses: 6800 }, { month: 'Apr', income: 2780, expenses: 3908 },
    { month: 'May', income: 1890, expenses: 4800 }, { month: 'Jun', income: 2390, expenses: 3800 },
];
const financialsChartConfig: ChartConfig = { income: { label: "Income", color: "hsl(var(--chart-1))" }, expenses: { label: "Expenses", color: "hsl(var(--chart-2))" } };

export default function MerchantReportsPage() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2024, 6, 1),
        to: new Date(2024, 6, 31),
    });

  return (
    <div className="space-y-6">
       <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merchant Reports</h1>
          <p className="text-muted-foreground">Detailed reports for your booths and sales.</p>
        </div>
        <div className="flex gap-2 items-center">
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className="w-[280px] justify-start text-left font-normal"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
            <Button variant="outline"><FileDown className="mr-2" /> Export</Button>
        </div>
      </header>

      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales</CardTitle>
              <CardDescription>Total sales overview for the selected period.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
                <BarChart data={salesData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(val) => format(new Date(val), 'MMM d')} tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Current Stock Levels</CardTitle>
              <CardDescription>Overview of stock for top products.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={inventoryChartConfig} className="h-[300px] w-full">
                <BarChart data={inventoryData} layout="vertical">
                    <CartesianGrid horizontal={false} />
                    <YAxis dataKey="product" type="category" tickLine={false} axisLine={false} width={80} />
                    <XAxis type="number" hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="stock" fill="var(--color-stock)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Income vs. Expenses</CardTitle>
              <CardDescription>Monthly financial performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={financialsChartConfig} className="h-[300px] w-full">
                <LineChart data={financialsData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
