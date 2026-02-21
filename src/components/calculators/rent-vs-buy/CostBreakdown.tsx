'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { RentVsBuyYearEntry } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { defaultTooltipStyle } from '@/components/charts/theme';
import { formatCompact, formatCurrency } from '@/lib/utils/formatters';

interface CostBreakdownProps {
  data: RentVsBuyYearEntry[];
}

export function CostBreakdown({ data }: CostBreakdownProps) {
  return (
    <ChartWrapper
      title="Cumulative Costs"
      subtitle="Total money spent over time"
    >
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="buyCostGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rentCostGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="buyCumulativeCost"
              name="Buy Costs"
              stroke="#D4A853"
              fill="url(#buyCostGrad)"
              strokeWidth={2}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="rentCumulativeCost"
              name="Rent Costs"
              stroke="#60A5FA"
              fill="url(#rentCostGrad)"
              strokeWidth={2}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
