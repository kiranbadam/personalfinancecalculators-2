'use client';

import { DebtPayoffResult } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { formatCurrency } from '@/lib/utils/formatters';

interface StrategyComparisonProps {
  result: DebtPayoffResult;
}

export function StrategyComparison({ result }: StrategyComparisonProps) {
  const rows = [
    {
      label: 'Total Interest Paid',
      avalanche: formatCurrency(result.avalanche.totalInterestPaid),
      snowball: formatCurrency(result.snowball.totalInterestPaid),
    },
    {
      label: 'Total Amount Paid',
      avalanche: formatCurrency(result.avalanche.totalPaid),
      snowball: formatCurrency(result.snowball.totalPaid),
    },
    {
      label: 'Payoff Time',
      avalanche: `${result.avalanche.payoffMonths} months (${(result.avalanche.payoffMonths / 12).toFixed(1)} yrs)`,
      snowball: `${result.snowball.payoffMonths} months (${(result.snowball.payoffMonths / 12).toFixed(1)} yrs)`,
    },
  ];

  return (
    <ChartWrapper title="Strategy Comparison" subtitle="Avalanche vs Snowball side by side">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 text-xs text-zinc-500 font-normal"></th>
              <th className="text-right py-2 text-xs font-medium text-[#D4A853]">Avalanche</th>
              <th className="text-right py-2 text-xs font-medium text-[#60A5FA]">Snowball</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-zinc-800/50">
                <td className="py-2.5 text-xs text-zinc-400">{row.label}</td>
                <td className="py-2.5 text-xs text-right text-white">{row.avalanche}</td>
                <td className="py-2.5 text-xs text-right text-white">{row.snowball}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.interestSaved > 0 && (
        <div className="mt-3 p-2.5 rounded-lg bg-green-500/5 border border-green-500/20">
          <p className="text-xs text-green-400">
            Avalanche saves <span className="font-bold">{formatCurrency(result.interestSaved)}</span> in interest
            {result.monthsSaved > 0 && (
              <> and <span className="font-bold">{result.monthsSaved} months</span></>
            )}
          </p>
        </div>
      )}
    </ChartWrapper>
  );
}
