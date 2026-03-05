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
import { format } from "date-fns";

interface AnalyticsChartsProps {
  growthData: {
    period: string;
    subscribers: number;
  }[];
}

export function AnalyticsCharts({ growthData }: AnalyticsChartsProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={growthData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2} />
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
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#64748B" }}
            interval={Math.ceil(growthData.length / 6)}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#64748B" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{ color: "#C5A059", fontWeight: "bold" }}
          />
          <Area
            type="monotone"
            dataKey="subscribers"
            stroke="#C5A059"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorGrowth)"
            dot={{ r: 4, fill: "#C5A059", strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
