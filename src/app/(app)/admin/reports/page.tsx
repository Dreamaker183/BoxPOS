
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';

const incomeData = [
  { month: 'Jan', income: 18600 }, { month: 'Feb', income: 30500 }, { month: 'Mar', income: 23700 },
  { month: 'Apr', income: 27300 }, { month: 'May', income: 20900 }, { month: 'Jun', income: 21400 },
];
const chartConfig: ChartConfig = { income: { label: "Income", color: "hsl(var(--chart-1))" }};

const paymentsData = [
    { month: 'Jan', paid: 200, overdue: 12 }, { month: 'Feb', paid: 250, overdue: 8 },
    { month: 'Mar', paid: 240, overdue: 15 }, { month: 'Apr', paid: 260, overdue: 5 },
    { month: 'May', paid: 255, overdue: 10 }, { month: 'Jun', paid: 265, overdue: 7 },
];
const paymentsChartConfig: ChartConfig = { paid: { label: "Paid", color: "hsl(var(--chart-1))" }, overdue: { label: "Overdue", color: "hsl(var(--chart-2))" } };

const usageData = [
    { booth: 'A-01', hours: 200 }, { booth: 'A-02', hours: 150 }, { booth: 'B-01', hours: 220 },
    { booth: 'B-02', hours: 180 }, { booth: 'C-01', hours: 250 }, { booth: 'C-02', hours: 190 },
];
const usageChartConfig: ChartConfig = { hours: { label: "Hours", color: "hsl(var(--chart-3))" }};


export default function SystemReportsPage() {
  return (
    <div className="space-y-6">
       <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
          <p className="text-muted-foreground">Generate and view detailed reports for your operations.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><FileDown className="mr-2" /> Export PDF</Button>
            <Button variant="outline"><FileDown className="mr-2" /> Export CSV</Button>
        </div>
      </header>

      <Tabs defaultValue="income">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income">Income Report</TabsTrigger>
          <TabsTrigger value="payments">Payments Report</TabsTrigger>
          <TabsTrigger value="booth-usage">Booth Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income</CardTitle>
              <CardDescription>Total income generated per month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={incomeData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Overview of paid vs. overdue payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={paymentsChartConfig} className="h-[300px] w-full">
                <BarChart data={paymentsData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="paid" stackId="a" fill="var(--color-paid)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overdue" stackId="a" fill="var(--color-overdue)" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="booth-usage">
          <Card>
            <CardHeader>
              <CardTitle>Booth Usage by Hours</CardTitle>
              <CardDescription>Total operational hours per booth.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={usageChartConfig} className="h-[300px] w-full">
                <BarChart data={usageData} layout="vertical">
                    <CartesianGrid horizontal={false} />
                    <YAxis dataKey="booth" type="category" tickLine={false} axisLine={false} />
                    <XAxis type="number" hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
