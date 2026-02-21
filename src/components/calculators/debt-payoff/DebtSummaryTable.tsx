'use client';

import { DebtPayoffSummary } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

interface DebtSummaryTableProps {
  summaries: DebtPayoffSummary[];
}

export function DebtSummaryTable({ summaries }: DebtSummaryTableProps) {
  const sorted = [...summaries].sort((a, b) => a.payoffMonth - b.payoffMonth);

  return (
    <ChartWrapper
      title="Debt Payoff Schedule"
      subtitle="Individual payoff dates and total interest per debt"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 px-2 text-zinc-500 font-medium">Debt</th>
              <th className="text-right py-2 px-2 text-zinc-500 font-medium">Balance</th>
              <th className="text-right py-2 px-2 text-zinc-500 font-medium">Interest Paid</th>
              <th className="text-right py-2 px-2 text-zinc-500 font-medium">Payoff Month</th>
              <th className="text-right py-2 px-2 text-zinc-500 font-medium">Payoff Date</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr
                key={s.debtId}
                className={`border-b border-zinc-800/50 ${i % 2 === 0 ? 'bg-zinc-900/20' : ''}`}
              >
                <td className="py-2 px-2 text-zinc-200 font-medium">{s.name}</td>
                <td className="py-2 px-2 text-right text-zinc-300">{formatCurrency(s.originalBalance)}</td>
                <td className="py-2 px-2 text-right text-red-400">{formatCurrency(s.totalInterestPaid)}</td>
                <td className="py-2 px-2 text-right text-zinc-300">Month {s.payoffMonth}</td>
                <td className="py-2 px-2 text-right text-[#D4A853]">{formatDate(s.payoffDate)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-zinc-700">
              <td className="py-2 px-2 text-zinc-300 font-semibold">Total</td>
              <td className="py-2 px-2 text-right text-zinc-300 font-semibold">
                {formatCurrency(summaries.reduce((s, d) => s + d.originalBalance, 0))}
              </td>
              <td className="py-2 px-2 text-right text-red-400 font-semibold">
                {formatCurrency(summaries.reduce((s, d) => s + d.totalInterestPaid, 0))}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </ChartWrapper>
  );
}
