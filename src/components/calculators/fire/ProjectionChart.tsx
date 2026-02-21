'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { FireYearEntry } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { defaultTooltipStyle } from '@/components/charts/theme';
import { formatCompact, formatCurrency } from '@/lib/utils/formatters';

interface ProjectionChartProps {
  data: FireYearEntry[];
  fireNumber: number;
  leanFireNumber: number;
  fatFireNumber: number;
  coastFireNumber: number;
  retirementAge: number;
}

export function ProjectionChart({ data, fireNumber, leanFireNumber, fatFireNumber, coastFireNumber, retirementAge }: ProjectionChartProps) {
  const chartData = data.map(entry => ({
    age: entry.age,
    savings: entry.savings,
    phase: entry.phase,
  }));

  return (
    <ChartWrapper title="Projected Net Worth" subtitle="Accumulation and drawdown phases">
      <div style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="accumulationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="age" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Age', position: 'insideBottom', offset: -5, fill: '#71717A', fontSize: 11 }} />
            <YAxis tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v)} />
            <Tooltip
              formatter={(value: number | undefined) => [formatCurrency(value ?? 0), 'Net Worth']}
              labelFormatter={(label) => `Age ${label}`}
              {...defaultTooltipStyle}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="#4ADE80"
              fill="url(#accumulationGrad)"
              strokeWidth={2}
              animationDuration={1000}
            />
            {/* FIRE lines */}
            <ReferenceLine y={fireNumber} stroke="#D4A853" strokeDasharray="6 3" label={{ value: `FIRE: ${formatCompact(fireNumber)}`, fill: '#D4A853', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={leanFireNumber} stroke="#60A5FA" strokeDasharray="4 4" label={{ value: `Lean: ${formatCompact(leanFireNumber)}`, fill: '#60A5FA', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={coastFireNumber} stroke="#C084FC" strokeDasharray="4 4" label={{ value: `Coast: ${formatCompact(coastFireNumber)}`, fill: '#C084FC', fontSize: 10, position: 'right' }} />
            <ReferenceLine x={retirementAge} stroke="rgba(212,168,83,0.4)" strokeDasharray="6 3" label={{ value: 'Retirement', fill: '#D4A853', fontSize: 10, position: 'top' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
