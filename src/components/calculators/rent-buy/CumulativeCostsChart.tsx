'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { RentBuyYearEntry } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { formatCompact } from '@/lib/utils/formatters';

interface CumulativeCostsChartProps {
  data: RentBuyYearEntry[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; fill: string }>; label?: number }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-zinc-400 mb-2 font-medium">Year {label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span style={{ color: entry.fill }}>{entry.name}</span>
          <span className="text-white font-semibold">{formatCompact(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function CumulativeCostsChart({ data }: CumulativeCostsChartProps) {
  return (
    <ChartWrapper
      title="Cumulative Costs"
      subtitle="Total money spent over time (buy includes down payment & closing costs)"
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="buyCostGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.03} />
            </linearGradient>
            <linearGradient id="rentCostGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={false}
            label={{ value: 'Year', position: 'insideBottomRight', offset: -5, fill: '#71717a', fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatCompact(v)}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
            formatter={(value) => <span style={{ color: '#a1a1aa' }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="cumulativeBuyCosts"
            name="Buy Costs"
            stroke="#4ADE80"
            strokeWidth={2}
            fill="url(#buyCostGrad)"
          />
          <Area
            type="monotone"
            dataKey="cumulativeRentCosts"
            name="Rent Costs"
            stroke="#60A5FA"
            strokeWidth={2}
            fill="url(#rentCostGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
