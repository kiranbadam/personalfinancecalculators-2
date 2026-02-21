'use client';

import { Greeks } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { motion } from 'framer-motion';

interface GreeksDisplayProps {
  greeks: Greeks;
}

const greekConfig = [
  { key: 'delta' as keyof Greeks, label: 'Delta', description: 'Price sensitivity', color: '#D4A853', range: [-1, 1] },
  { key: 'gamma' as keyof Greeks, label: 'Gamma', description: 'Delta sensitivity', color: '#4ADE80', range: [0, 0.1] },
  { key: 'theta' as keyof Greeks, label: 'Theta', description: 'Time decay (daily)', color: '#F87171', range: [-100, 0] },
  { key: 'vega' as keyof Greeks, label: 'Vega', description: 'Volatility sensitivity', color: '#60A5FA', range: [0, 50] },
  { key: 'rho' as keyof Greeks, label: 'Rho', description: 'Rate sensitivity', color: '#C084FC', range: [-10, 10] },
];

export function GreeksDisplay({ greeks }: GreeksDisplayProps) {
  return (
    <ChartWrapper title="Greeks" subtitle="Option sensitivities">
      <div className="space-y-3">
        {greekConfig.map((config, i) => {
          const value = greeks[config.key];
          const [min, max] = config.range;
          const normalizedValue = Math.min(1, Math.max(0, (value - min) / (max - min)));
          
          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-white font-medium">{config.label}</span>
                  <span className="text-zinc-600 ml-1.5">{config.description}</span>
                </div>
                <span className="font-mono text-sm" style={{ color: config.color }}>
                  {value.toFixed(4)}
                </span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${normalizedValue * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: config.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </ChartWrapper>
  );
}
