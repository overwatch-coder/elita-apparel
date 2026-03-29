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

interface AnalyticsChartsProps {
  growthData: {
    period: string;
    subscribers: number;
  }[];
}

export function AnalyticsCharts({ growthData }: AnalyticsChartsProps) {
  const chartAccent = "var(--chart-1)";
  const chartGrid = "var(--border)";
  const chartTick = "var(--muted-foreground)";
  const chartSurface = "var(--card)";

  return (
    <div className="h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={growthData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartAccent} stopOpacity={0.2} />
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
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: chartTick }}
            interval={Math.ceil(growthData.length / 6)}
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
            itemStyle={{ color: chartAccent, fontWeight: "bold" }}
          />
          <Area
            type="monotone"
            dataKey="subscribers"
            stroke={chartAccent}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorGrowth)"
            dot={{ r: 4, fill: chartAccent, strokeWidth: 2, stroke: chartSurface }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
