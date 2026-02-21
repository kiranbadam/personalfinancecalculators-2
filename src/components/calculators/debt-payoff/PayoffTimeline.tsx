'use client';

import { DebtPayoffStrategyResult } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { formatCurrency } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

interface PayoffTimelineProps {
  result: DebtPayoffStrategyResult;
}

export function PayoffTimeline({ result }: PayoffTimelineProps) {
  const maxMonth = result.payoffMonths;

  return (
    <ChartWrapper
      title="Payoff Order"
      subtitle={`${result.strategy === 'avalanche' ? 'Highest rate' : 'Lowest balance'} first`}
    >
      <div className="space-y-3">
        {result.debtPayoffOrder.map((debt, i) => {
          const progress = maxMonth > 0 ? (debt.payoffMonth / maxMonth) * 100 : 100;
          const years = Math.floor(debt.payoffMonth / 12);
          const months = debt.payoffMonth % 12;
          const timeLabel = years > 0
            ? `${years}y ${months}m`
            : `${months}m`;

          return (
            <motion.div
              key={debt.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-1"
            >
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">{debt.name}</span>
                <span className="text-zinc-500">Month {debt.payoffMonth} ({timeLabel})</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #D4A853, ${
                      result.strategy === 'avalanche' ? '#F87171' : '#60A5FA'
                    })`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/50 flex justify-between text-xs">
        <span className="text-zinc-500">Total Interest</span>
        <span className="text-white font-medium">{formatCurrency(result.totalInterestPaid)}</span>
      </div>
    </ChartWrapper>
  );
}
