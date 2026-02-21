'use client';

import { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { AmortizationEntry } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { chartColors, defaultTooltipStyle } from '@/components/charts/theme';
import { formatCurrency, formatCompact } from '@/lib/utils/formatters';

interface AmortizationChartProps {
  schedule: AmortizationEntry[];
  scheduleWithExtra: AmortizationEntry[] | null;
  pmiRemovalMonth: number | null;
  halfEquityMonth: number | null;
}

export function AmortizationChart({ schedule, scheduleWithExtra, pmiRemovalMonth, halfEquityMonth }: AmortizationChartProps) {
  const [showExtra, setShowExtra] = useState(true);

  const yearlyData = useMemo(() => {
    const years: Record<number, { year: number; principal: number; interest: number; balance: number; extraBalance?: number }> = {};
    
    for (const entry of schedule) {
      if (!years[entry.year]) {
        years[entry.year] = { year: entry.year, principal: 0, interest: 0, balance: entry.balance };
      }
      years[entry.year].principal += entry.principal;
      years[entry.year].interest += entry.interest;
      years[entry.year].balance = entry.balance;
    }

    if (scheduleWithExtra && showExtra) {
      for (const entry of scheduleWithExtra) {
        if (years[entry.year]) {
          years[entry.year].extraBalance = entry.balance;
        }
      }
    }

    return Object.values(years);
  }, [schedule, scheduleWithExtra, showExtra]);

  return (
    <ChartWrapper 
      title="Amortization Schedule" 
      subtitle="Principal vs Interest over time"
    >
      {scheduleWithExtra && (
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setShowExtra(!showExtra)}
            className={`text-[11px] px-3 py-1 rounded-full transition-colors ${
              showExtra ? 'bg-[#D4A853]/20 text-[#D4A853]' : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            {showExtra ? 'Hide' : 'Show'} Extra Payments
          </button>
        </div>
      )}

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.principal} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.principal} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.interest} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.interest} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#71717A', fontSize: 11 }} />
            <YAxis tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v)} />
            <Tooltip
              formatter={(value?: number, name?: string) => [formatCurrency(value ?? 0), name ?? ""]}
              {...defaultTooltipStyle}
            />
            <Area
              type="monotone"
              dataKey="principal"
              name="Principal"
              stackId="1"
              stroke={chartColors.principal}
              fill="url(#principalGrad)"
              strokeWidth={2}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="interest"
              name="Interest"
              stackId="1"
              stroke={chartColors.interest}
              fill="url(#interestGrad)"
              strokeWidth={2}
              animationDuration={800}
            />
            {pmiRemovalMonth && (
              <ReferenceLine
                x={Math.ceil(pmiRemovalMonth / 12)}
                stroke="#F87171"
                strokeDasharray="4 4"
                label={{ value: 'PMI Removed', fill: '#F87171', fontSize: 10, position: 'top' }}
              />
            )}
            {halfEquityMonth && (
              <ReferenceLine
                x={Math.ceil(halfEquityMonth / 12)}
                stroke="#4ADE80"
                strokeDasharray="4 4"
                label={{ value: '50% Equity', fill: '#4ADE80', fontSize: 10, position: 'top' }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
