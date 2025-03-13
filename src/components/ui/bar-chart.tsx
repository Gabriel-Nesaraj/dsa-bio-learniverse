
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";

export interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  className?: string;
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export const BarChart = ({
  data,
  xKey,
  yKey,
  className,
  colors = ["var(--primary)"],
  height = 300,
  showGrid = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
}: BarChartProps) => {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showXAxis && <XAxis dataKey={xKey} />}
          {showYAxis && <YAxis />}
          {showTooltip && <Tooltip />}
          <Bar dataKey={yKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
