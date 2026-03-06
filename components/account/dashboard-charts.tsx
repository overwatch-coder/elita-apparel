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

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="font-serif text-xl font-medium">
          Spending Overview
        </CardTitle>
        <CardDescription className="text-xs">
          Your order spending over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={orderData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A059" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748B" }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748B" }}
                tickFormatter={(value) => `GH₵${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ color: "#C5A059", fontWeight: "bold" }}
                formatter={(value: any) => [
                  formatPrice(Number(value) || 0),
                  "Spent",
                ]}
              />
              <Area
                type="monotone"
                dataKey="spent"
                stroke="#C5A059"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSpent)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
