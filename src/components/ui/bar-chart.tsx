
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors: string[];
  yAxisWidth?: number;
  valueFormatter?: (value: number) => string;
}

export const BarChart = ({
  data,
  index,
  categories,
  colors,
  yAxisWidth = 40,
  valueFormatter = (value: number) => `${value}`,
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey={index}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          width={yAxisWidth}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          formatter={(value: number) => [valueFormatter(value), ""]}
          labelStyle={{ fontWeight: "bold", fontSize: 14 }}
        />
        <Legend wrapperStyle={{ paddingTop: 10 }} />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
