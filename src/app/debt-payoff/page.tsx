'use client';

import { useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DebtPayoffForm } from '@/components/calculators/debt-payoff/DebtPayoffForm';
import { PayoffChart } from '@/components/calculators/debt-payoff/PayoffChart';
import { InterestChart } from '@/components/calculators/debt-payoff/InterestChart';
import { DebtSummaryTable } from '@/components/calculators/debt-payoff/DebtSummaryTable';
import { SummaryCard } from '@/components/charts/SummaryCard';
import { useCalculator } from '@/hooks/useCalculator';
import { calculateDebtPayoff, getDefaultDebtPayoffInputs } from '@/lib/calculations/debt-payoff';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

export default function DebtPayoffPage() {
  const calculate = useCallback(calculateDebtPayoff, []);
  const { inputs, updateInput, result, reset } = useCalculator(
    getDefaultDebtPayoffInputs(),
    calculate
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const strategyLabel =
    inputs.strategy === 'avalanche'
      ? 'Avalanche (highest rate first)'
      : inputs.strategy === 'snowball'
      ? 'Snowball (lowest balance first)'
      : 'Custom order';

  const payoffYears = Math.floor(result.totalMonths / 12);
  const payoffMonths = result.totalMonths % 12;
  const timeLabel =
    payoffYears > 0
      ? `${payoffYears}y ${payoffMonths}m`
      : `${payoffMonths} months`;

  const savedYears = Math.floor(result.monthsSaved / 12);
  const savedMonths = result.monthsSaved % 12;
  const savedLabel =
    result.monthsSaved > 0
      ? savedYears > 0
        ? `${savedYears}y ${savedMonths}m faster`
        : `${savedMonths}mo faster`
      : 'No extra payment';

  return (
    <div>
      <PageHeader
        title="Debt Payoff Calculator"
        description="Compare avalanche vs snowball strategies and see how extra payments accelerate payoff"
        onReset={reset}
        onShare={handleShare}
      />

      {result.totalMonths > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 rounded-xl p-4 border bg-[#D4A853]/5 border-[#D4A853]/20"
        >
          <p className="text-sm text-[#D4A853] font-medium">
            Debt-free by{' '}
            <span className="font-bold">{formatDate(result.payoffDate)}</span>
            {' '}using the <span className="font-bold">{strategyLabel}</span> strategy
          </p>
          {result.monthsSaved > 0 && (
            <p className="text-xs text-zinc-400 mt-1">
              Extra payment of {formatCurrency(inputs.extraMonthlyPayment)}/mo saves {savedLabel} and {formatCurrency(result.interestSaved)} in interest
            </p>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <DebtPayoffForm inputs={inputs} onUpdate={updateInput} />

        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard
              label="Debt-Free In"
              value={timeLabel}
              format="text"
              accent
            />
            <SummaryCard
              label="Total Interest"
              value={result.totalInterestPaid}
              format="currency"
              subtitle={`vs ${formatCurrency(result.minimumOnlyInterest)} minimum only`}
            />
            <SummaryCard
              label="Interest Saved"
              value={result.interestSaved}
              format="currency"
              subtitle={savedLabel}
              accent={result.interestSaved > 0}
            />
            <SummaryCard
              label="Total Paid"
              value={result.totalAmountPaid}
              format="currency"
              subtitle={`${inputs.debts.length} debt${inputs.debts.length !== 1 ? 's' : ''}`}
            />
          </div>

          {result.monthlySnapshots.length > 0 && (
            <>
              <PayoffChart snapshots={result.monthlySnapshots} />
              <InterestChart snapshots={result.monthlySnapshots} />
              <DebtSummaryTable summaries={result.debtSummaries} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
