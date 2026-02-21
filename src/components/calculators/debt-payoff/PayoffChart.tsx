'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DebtPayoffMonthlySnapshot } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { formatCompact, formatCurrency } from '@/lib/utils/formatters';

interface PayoffChartProps {
  snapshots: DebtPayoffMonthlySnapshot[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}) => {
  if (!active || !payload) return null;
  const monthsLeft = label ?? 0;
  const years = Math.floor(monthsLeft / 12);
  const months = monthsLeft % 12;
  const timeLabel = years > 0 ? `${years}y ${months}m` : `${months}m`;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-zinc-400 mb-2 font-medium">Month {label} ({timeLabel})</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-white font-semibold">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

const tickFormatter = (v: number) => {
  if (v === 0) return '0';
  const years = Math.floor(v / 12);
  const months = v % 12;
  if (years > 0 && months === 0) return `Y${years}`;
  if (years > 0) return `Y${years}M${months}`;
  return `M${v}`;
};

export function PayoffChart({ snapshots }: PayoffChartProps) {
  return (
    <ChartWrapper
      title="Debt Balance Over Time"
      subtitle="Total remaining debt balance as you pay it down"
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={snapshots} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={false}
            tickFormatter={tickFormatter}
            interval="preserveStartEnd"
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
            dataKey="totalBalance"
            name="Remaining Balance"
            stroke="#EF4444"
            fill="url(#balanceGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
