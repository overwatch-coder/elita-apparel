"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/constants";

interface CustomerDashboardChartsProps {
  orderData: {
    date: string;
    spent: number;
  }[];
}

export function CustomerDashboardCharts({
  orderData,
}: CustomerDashboardChartsProps) {
  if (!orderData || orderData.length === 0) {
    return null;
  }

  const chartAccent = "var(--chart-1)";
  const chartGrid = "var(--border)";
  const chartTick = "var(--muted-foreground)";
  const chartSurface = "var(--card)";
  const chartDotStroke = "var(--card)";

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl font-medium sr-only">
          Spending Overview
        </CardTitle>
        <CardDescription className="text-xs sr-only">
          Your order spending over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={orderData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
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
                interval="preserveStartEnd"
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
                  "Spent",
                ]}
              />
              <Area
                type="monotone"
                dataKey="spent"
                stroke={chartAccent}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSpent)"
                dot={{ r: 3, fill: chartAccent, strokeWidth: 2, stroke: chartDotStroke }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
