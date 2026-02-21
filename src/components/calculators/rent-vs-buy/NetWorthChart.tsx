'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { RentVsBuyYearEntry } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { defaultTooltipStyle } from '@/components/charts/theme';
import { formatCompact, formatCurrency } from '@/lib/utils/formatters';

interface NetWorthChartProps {
  data: RentVsBuyYearEntry[];
  breakEvenYear: number | null;
}

export function NetWorthChart({ data, breakEvenYear }: NetWorthChartProps) {
  return (
    <ChartWrapper
      title="Net Worth Comparison"
      subtitle="Buy (home equity) vs Rent (investments)"
    >
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#71717A', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#71717A', fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: '#71717A', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCompact(v)}
            />
            <Tooltip
              formatter={(value, name) => [formatCurrency(Number(value ?? 0)), String(name)]}
              {...defaultTooltipStyle}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#A1A1AA' }} />
            <Line
              type="monotone"
              dataKey="buyNetWorth"
              name="Buy Net Worth"
              stroke="#D4A853"
              strokeWidth={2.5}
              dot={false}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="rentNetWorth"
              name="Rent Net Worth"
              stroke="#60A5FA"
              strokeWidth={2.5}
              dot={false}
              animationDuration={800}
            />
            {breakEvenYear && (
              <ReferenceLine
                x={breakEvenYear}
                stroke="#4ADE80"
                strokeDasharray="4 4"
                label={{ value: `Break-even Yr ${breakEvenYear}`, fill: '#4ADE80', fontSize: 10, position: 'top' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
