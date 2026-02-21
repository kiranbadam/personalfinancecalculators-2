'use client';

import { useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MortgageForm } from '@/components/calculators/mortgage/MortgageForm';
import { PaymentBreakdown } from '@/components/calculators/mortgage/PaymentBreakdown';
import { AmortizationChart } from '@/components/calculators/mortgage/AmortizationChart';
import { AmortizationTable } from '@/components/calculators/mortgage/AmortizationTable';
import { SummaryCard } from '@/components/charts/SummaryCard';
import { useCalculator } from '@/hooks/useCalculator';
import { calculateMortgage, getDefaultMortgageInputs } from '@/lib/calculations/mortgage';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

export default function MortgagePage() {
  const calculate = useCallback(calculateMortgage, []);
  const { inputs, updateInput, result, reset } = useCalculator(
    getDefaultMortgageInputs(),
    calculate
  );

  const handleShare = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    const url = `${window.location.origin}/mortgage?${params.toString()}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div>
      <PageHeader
        title="Mortgage Calculator"
        description="Amortization schedule with extra payment analysis"
        onReset={reset}
        onShare={handleShare}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-xl p-5">
            <MortgageForm inputs={inputs} onUpdate={updateInput} />
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
              label="Monthly Payment"
              value={result.monthlyPayment.total}
              format="currency"
              accent
              delay={0}
            />
            <SummaryCard
              label="Total Interest"
              value={result.totalInterest}
              format="currency"
              delay={0.05}
            />
            <SummaryCard
              label="Total Cost"
              value={result.totalCost}
              format="currency"
              delay={0.1}
            />
            <SummaryCard
              label="Payoff Date"
              value={formatDate(result.payoffDate)}
              delay={0.15}
            />
          </motion.div>

          {/* Extra Payment Savings */}
          {result.interestSaved !== null && result.interestSaved > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 border border-green-500/20 bg-green-500/5"
            >
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-zinc-400 text-xs">Interest Saved</span>
                  <p className="text-green-400 font-bold">{formatCurrency(result.interestSaved)}</p>
                </div>
                <div>
                  <span className="text-zinc-400 text-xs">Time Saved</span>
                  <p className="text-green-400 font-bold">{result.monthsSaved} months ({(result.monthsSaved! / 12).toFixed(1)} years)</p>
                </div>
                {result.payoffDateWithExtra && (
                  <div>
                    <span className="text-zinc-400 text-xs">New Payoff Date</span>
                    <p className="text-green-400 font-bold">{formatDate(result.payoffDateWithExtra)}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentBreakdown breakdown={result.monthlyPayment} />
            <AmortizationChart
              schedule={result.amortizationSchedule}
              scheduleWithExtra={result.amortizationWithExtra}
              pmiRemovalMonth={result.pmiRemovalMonth}
              halfEquityMonth={result.halfEquityMonth}
            />
          </div>

          {/* Amortization Table */}
          <AmortizationTable schedule={result.amortizationSchedule} />
        </div>
      </div>
    </div>
  );
}
