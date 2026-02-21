'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { CompoundYearEntry, CompoundMilestone } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { chartColors, defaultTooltipStyle } from '@/components/charts/theme';
import { formatCompact, formatCurrency } from '@/lib/utils/formatters';

interface GrowthChartProps {
  data: CompoundYearEntry[];
  milestones: CompoundMilestone[];
  showInflation: boolean;
}

export function GrowthChart({ data, milestones, showInflation }: GrowthChartProps) {
  const activeMilestones = milestones.filter(m => m.year !== null);

  return (
    <ChartWrapper title="Growth Over Time" subtitle="Contributions vs Investment Earnings">
      <div style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.contributions} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColors.contributions} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.earnings} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColors.earnings} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#71717A', fontSize: 11 }} />
            <YAxis tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v)} />
            <Tooltip
              formatter={(value, name) => [formatCurrency(Number(value ?? 0)), String(name)]}
              {...defaultTooltipStyle}
            />
            <Area
              type="monotone"
              dataKey="totalContributions"
              name="Contributions"
              stackId="1"
              stroke={chartColors.contributions}
              fill="url(#contribGrad)"
              strokeWidth={2}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="totalEarnings"
              name="Earnings"
              stackId="1"
              stroke={chartColors.earnings}
              fill="url(#earningsGrad)"
              strokeWidth={2}
              animationDuration={800}
            />
            {showInflation && (
              <Area
                type="monotone"
                dataKey="inflationAdjustedBalance"
                name="Inflation Adjusted"
                stroke="#F87171"
                fill="none"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                animationDuration={800}
              />
            )}
            {activeMilestones.map((m) => (
              <ReferenceLine
                key={m.label}
                x={m.year!}
                stroke="rgba(212,168,83,0.3)"
                strokeDasharray="4 4"
                label={{ value: m.label, fill: '#D4A853', fontSize: 10, position: 'top' }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
