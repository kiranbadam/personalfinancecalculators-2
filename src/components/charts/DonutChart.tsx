'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { defaultTooltipStyle } from './theme';
import { formatCurrency } from '@/lib/utils/formatters';

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  height?: number;
}

export function DonutChart({ data, centerLabel, centerValue, height = 250 }: DonutChartProps) {
  const filteredData = data.filter(d => d.value > 0);

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            animationBegin={0}
            animationDuration={800}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value ?? 0), true)}
            {...defaultTooltipStyle}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && (
            <span className="text-lg font-bold text-white">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
