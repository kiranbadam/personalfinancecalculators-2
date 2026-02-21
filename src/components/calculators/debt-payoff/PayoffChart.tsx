'use client';

import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { DebtPayoffStrategyResult } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { defaultTooltipStyle } from '@/components/charts/theme';
import { formatCompact, formatCurrency } from '@/lib/utils/formatters';

interface PayoffChartProps {
  avalanche: DebtPayoffStrategyResult;
  snowball: DebtPayoffStrategyResult;
  activeStrategy: 'avalanche' | 'snowball';
}

export function PayoffChart({ avalanche, snowball, activeStrategy }: PayoffChartProps) {
  const data = useMemo(() => {
    const maxLen = Math.max(avalanche.schedule.length, snowball.schedule.length);
    const points: { month: number; avalanche: number; snowball: number }[] = [];

    for (let i = 0; i < maxLen; i++) {
      points.push({
        month: i + 1,
        avalanche: avalanche.schedule[i]?.totalBalance ?? 0,
        snowball: snowball.schedule[i]?.totalBalance ?? 0,
      });
    }
    return points;
  }, [avalanche, snowball]);

  return (
    <ChartWrapper
      title="Balance Over Time"
      subtitle="Avalanche vs Snowball comparison"
    >
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="avalancheGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="snowballGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#71717A', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: '#71717A', fontSize: 11 }}
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
            <Legend
              wrapperStyle={{ fontSize: '11px', color: '#A1A1AA' }}
            />
            <Area
              type="monotone"
              dataKey="avalanche"
              name="Avalanche"
              stroke="#D4A853"
              fill="url(#avalancheGrad)"
              strokeWidth={activeStrategy === 'avalanche' ? 2.5 : 1.5}
              strokeOpacity={activeStrategy === 'avalanche' ? 1 : 0.5}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="snowball"
              name="Snowball"
              stroke="#60A5FA"
              fill="url(#snowballGrad)"
              strokeWidth={activeStrategy === 'snowball' ? 2.5 : 1.5}
              strokeOpacity={activeStrategy === 'snowball' ? 1 : 0.5}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
