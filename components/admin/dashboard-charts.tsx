"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/constants";

interface DashboardChartsProps {
  salesData: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export function DashboardCharts({ salesData }: DashboardChartsProps) {
  const chartAccent = "var(--chart-1)";
  const chartGrid = "var(--border)";
  const chartTick = "var(--muted-foreground)";
  const chartSurface = "var(--card)";
  const chartHover = "var(--accent)";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-medium">
            Revenue Growth
          </CardTitle>
          <CardDescription className="text-xs">
            Daily revenue performance for the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartAccent} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={chartAccent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={chartGrid}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: chartTick }}
                  interval={Math.ceil(salesData.length / 7)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: chartTick }}
                  tickFormatter={(value) => `GH₵${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartSurface,
                    borderRadius: "8px",
                    border: `1px solid ${chartGrid}`,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: chartAccent, fontWeight: "bold" }}
                  formatter={(value: any) => [
                    formatPrice(Number(value) || 0),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={chartAccent}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-medium">
            Order Volume
          </CardTitle>
          <CardDescription className="text-xs">
            Number of orders processed daily
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={chartGrid}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: chartTick }}
                  interval={Math.ceil(salesData.length / 7)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: chartTick }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartSurface,
                    borderRadius: "8px",
                    border: `1px solid ${chartGrid}`,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: chartHover }}
                />
                <Bar
                  dataKey="orders"
                  fill={chartAccent}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
