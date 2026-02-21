'use client';

import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { PayoffPoint } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { defaultTooltipStyle } from '@/components/charts/theme';
import { formatCurrency } from '@/lib/utils/formatters';

interface PayoffChartProps {
  data: PayoffPoint[];
  breakevens: number[];
  currentPrice: number;
  maxProfit: number | null;
  maxLoss: number | null;
}

export function PayoffChart({ data, breakevens, currentPrice, maxProfit, maxLoss }: PayoffChartProps) {
  const { profitData, lossData } = useMemo(() => {
    const profit = data.map(d => ({
      price: d.price,
      value: d.profit >= 0 ? d.profit : 0,
    }));
    const loss = data.map(d => ({
      price: d.price,
      value: d.profit < 0 ? d.profit : 0,
    }));
    return { profitData: profit, lossData: loss };
  }, [data]);

  return (
    <ChartWrapper title="Payoff Diagram" subtitle="Profit/Loss at expiration">
      <div style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="5%" stopColor="#F87171" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis 
              dataKey="price" 
              tick={{ fill: '#71717A', fontSize: 11 }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              label={{ value: 'Stock Price', position: 'insideBottom', offset: -5, fill: '#71717A', fontSize: 11 }}
            />
            <YAxis 
              tick={{ fill: '#71717A', fontSize: 11 }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value ?? 0), true), 'P/L']}
              labelFormatter={(label) => `Stock Price: $${Number(label).toFixed(2)}`}
              {...defaultTooltipStyle}
            />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
            <ReferenceLine
              x={currentPrice}
              stroke="#D4A853"
              strokeDasharray="4 4"
              label={{ value: `Current: $${currentPrice}`, fill: '#D4A853', fontSize: 10, position: 'top' }}
            />
            {breakevens.map((be, i) => (
              <ReferenceLine
                key={i}
                x={be}
                stroke="#60A5FA"
                strokeDasharray="3 3"
                label={{ value: `BE: $${be}`, fill: '#60A5FA', fontSize: 10, position: 'top' }}
              />
            ))}
            <Area
              type="monotone"
              dataKey="profit"
              stroke="none"
              fill="url(#profitGradient)"
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="none"
              fill="url(#lossGradient)"
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#D4A853"
              fill="none"
              strokeWidth={2}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
