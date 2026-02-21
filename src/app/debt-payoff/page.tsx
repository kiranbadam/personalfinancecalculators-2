'use client';

import { useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DebtForm } from '@/components/calculators/debt-payoff/DebtForm';
import { PayoffChart } from '@/components/calculators/debt-payoff/PayoffChart';
import { PayoffTimeline } from '@/components/calculators/debt-payoff/PayoffTimeline';
import { StrategyComparison } from '@/components/calculators/debt-payoff/StrategyComparison';
import { SummaryCard } from '@/components/charts/SummaryCard';
import { useCalculator } from '@/hooks/useCalculator';
import { calculateDebtPayoff, getDefaultDebtPayoffInputs } from '@/lib/calculations/debt-payoff';
import { formatCurrency } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

export default function DebtPayoffPage() {
  const calculate = useCallback(calculateDebtPayoff, []);
  const { inputs, updateInput, setInputs, result, reset } = useCalculator(
    getDefaultDebtPayoffInputs(),
    calculate
  );

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('debts', JSON.stringify(inputs.debts));
    params.set('extraPayment', String(inputs.extraPayment));
    params.set('strategy', inputs.strategy);
    const url = `${window.location.origin}/debt-payoff?${params.toString()}`;
    navigator.clipboard.writeText(url);
  };

  const activeResult = inputs.strategy === 'avalanche' ? result.avalanche : result.snowball;

  return (
    <div>
      <PageHeader
        title="Debt Payoff Calculator"
        description="Compare Avalanche vs Snowball strategies"
        onReset={reset}
        onShare={handleShare}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-xl p-5">
            <DebtForm inputs={inputs} onUpdate={updateInput} setInputs={setInputs} />
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-8 space-y-6">
          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <SummaryCard
              label="Total Debt"
              value={result.totalDebt}
              format="currency"
              accent
              delay={0}
            />
            <SummaryCard
              label="Payoff Time"
              value={`${Math.floor(activeResult.payoffMonths / 12)}y ${activeResult.payoffMonths % 12}m`}
              delay={0.05}
            />
            <SummaryCard
              label="Total Interest"
              value={activeResult.totalInterestPaid}
              format="currency"
              delay={0.1}
            />
            <SummaryCard
              label="Monthly Payment"
              value={result.totalMinimumPayments + inputs.extraPayment}
              format="currency"
              delay={0.15}
            />
          </motion.div>

          {/* Interest Saved Banner */}
          {result.interestSaved > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 border border-green-500/20 bg-green-500/5"
            >
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-zinc-400 text-xs">Avalanche Saves</span>
                  <p className="text-green-400 font-bold">{formatCurrency(result.interestSaved)} in interest</p>
                </div>
                {result.monthsSaved > 0 && (
                  <div>
                    <span className="text-zinc-400 text-xs">Time Saved</span>
                    <p className="text-green-400 font-bold">{result.monthsSaved} months</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PayoffChart
              avalanche={result.avalanche}
              snowball={result.snowball}
              activeStrategy={inputs.strategy}
            />
            <PayoffTimeline result={activeResult} />
          </div>

          {/* Comparison Table */}
          <StrategyComparison result={result} />
        </div>
      </div>
    </div>
  );
}
