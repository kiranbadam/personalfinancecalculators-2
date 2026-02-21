'use client';

import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { defaultTooltipStyle } from '@/components/charts/theme';
import { formatCompact, formatCurrency } from '@/lib/utils/formatters';

interface MonteCarloChartProps {
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  ages: number[];
  successRate: number;
}

export function MonteCarloChart({ percentiles, ages, successRate }: MonteCarloChartProps) {
  const data = useMemo(() => {
    return ages.map((age, i) => ({
      age,
      p10: percentiles.p10[i],
      p25: percentiles.p25[i],
      p50: percentiles.p50[i],
      p75: percentiles.p75[i],
      p90: percentiles.p90[i],
    }));
  }, [ages, percentiles]);

  return (
    <ChartWrapper
      title="Monte Carlo Simulation"
      subtitle={`${successRate.toFixed(0)}% success rate across 1,000 simulations`}
    >
      <div className="mb-3">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
          successRate >= 80 ? 'bg-green-500/10 text-green-400' :
          successRate >= 50 ? 'bg-amber-500/10 text-amber-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          {successRate.toFixed(0)}% Success Rate
        </div>
      </div>
      
      <div style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="mc90Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mc75Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="age" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v)} />
            <Tooltip
              formatter={(value: number | undefined, name: string | undefined) => [formatCurrency(value ?? 0), name ?? '']}
              labelFormatter={(label) => `Age ${label}`}
              {...defaultTooltipStyle}
            />
            <Area type="monotone" dataKey="p90" name="90th Percentile" stroke="none" fill="url(#mc90Grad)" animationDuration={600} />
            <Area type="monotone" dataKey="p75" name="75th Percentile" stroke="none" fill="url(#mc75Grad)" animationDuration={600} />
            <Area type="monotone" dataKey="p50" name="Median" stroke="#D4A853" fill="none" strokeWidth={2} animationDuration={800} />
            <Area type="monotone" dataKey="p25" name="25th Percentile" stroke="#F87171" fill="none" strokeWidth={1} strokeDasharray="4 4" animationDuration={600} />
            <Area type="monotone" dataKey="p10" name="10th Percentile" stroke="#F87171" fill="none" strokeWidth={1} strokeDasharray="2 2" animationDuration={600} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        {[
          { label: '90th %ile', color: 'bg-green-400/20 text-green-400' },
          { label: 'Median', color: 'bg-[#D4A853]/20 text-[#D4A853]' },
          { label: '10th %ile', color: 'bg-red-400/20 text-red-400' },
        ].map((item) => (
          <span key={item.label} className={`text-[10px] px-2 py-0.5 rounded-full ${item.color}`}>
            {item.label}
          </span>
        ))}
      </div>
    </ChartWrapper>
  );
}
