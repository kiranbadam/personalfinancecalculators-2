'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DebtPayoffMonthlySnapshot } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { formatCompact, formatCurrency } from '@/lib/utils/formatters';

interface InterestChartProps {
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
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-zinc-400 mb-2 font-medium">Month {label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-white font-semibold">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function InterestChart({ snapshots }: InterestChartProps) {
  const step = Math.max(1, Math.floor(snapshots.length / 24));
  const data = snapshots.filter((_, i) => i % step === 0 || i === snapshots.length - 1);

  return (
    <ChartWrapper
      title="Monthly Payment Breakdown"
      subtitle="How much of each payment goes to interest vs. principal"
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={false}
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
          <Bar dataKey="totalPrincipal" name="Principal" stackId="a" fill="#4ADE80" radius={[0, 0, 0, 0]} />
          <Bar dataKey="totalInterest" name="Interest" stackId="a" fill="#EF4444" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
