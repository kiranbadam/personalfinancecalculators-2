'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { RentBuyYearEntry } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { formatCompact } from '@/lib/utils/formatters';

interface NetWorthChartProps {
  data: RentBuyYearEntry[];
  breakEvenYear: number | null;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: number }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-zinc-400 mb-2 font-medium">Year {label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-white font-semibold">{formatCompact(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function NetWorthChart({ data, breakEvenYear }: NetWorthChartProps) {
  return (
    <ChartWrapper
      title="Net Worth Comparison"
      subtitle="Buy equity (minus selling costs) vs Rent investment portfolio"
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
          {breakEvenYear && (
            <ReferenceLine
              x={breakEvenYear}
              stroke="#D4A853"
              strokeDasharray="4 2"
              label={{ value: `Break-even Yr ${breakEvenYear}`, fill: '#D4A853', fontSize: 10, position: 'insideTopRight' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="buyNetWorth"
            name="Buy Net Worth"
            stroke="#4ADE80"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="rentNetWorth"
            name="Rent Net Worth"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
