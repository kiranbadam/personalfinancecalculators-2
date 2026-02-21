'use client';

import { CompoundScenario } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { formatCurrency, formatCompact } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

interface ScenarioComparisonProps {
  scenarios: CompoundScenario[];
}

const colors = ['#60A5FA', '#D4A853', '#4ADE80'];

export function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  const maxBalance = Math.max(...scenarios.map(s => s.finalBalance));

  return (
    <ChartWrapper title="Scenario Comparison" subtitle="Conservative vs Moderate vs Aggressive">
      <div className="space-y-4">
        {scenarios.map((scenario, i) => (
          <motion.div
            key={scenario.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                <span className="text-zinc-400">{scenario.label}</span>
              </div>
              <span className="text-white font-semibold">{formatCompact(scenario.finalBalance)}</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(scenario.finalBalance / maxBalance) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: colors[i] }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>Contributed: {formatCurrency(scenario.totalContributions)}</span>
              <span>Earnings: {formatCurrency(scenario.totalEarnings)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </ChartWrapper>
  );
}
