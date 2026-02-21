'use client';

import { useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { RentVsBuyForm } from '@/components/calculators/rent-vs-buy/RentVsBuyForm';
import { NetWorthChart } from '@/components/calculators/rent-vs-buy/NetWorthChart';
import { CostBreakdown } from '@/components/calculators/rent-vs-buy/CostBreakdown';
import { YearlyTable } from '@/components/calculators/rent-vs-buy/YearlyTable';
import { SummaryCard } from '@/components/charts/SummaryCard';
import { useCalculator } from '@/hooks/useCalculator';
import { calculateRentVsBuy, getDefaultRentVsBuyInputs } from '@/lib/calculations/rent-vs-buy';
import { formatCurrency } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

export default function RentVsBuyPage() {
  const calculate = useCallback(calculateRentVsBuy, []);
  const { inputs, updateInput, result, reset } = useCalculator(
    getDefaultRentVsBuyInputs(),
    calculate
  );

  const handleShare = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    const url = `${window.location.origin}/rent-vs-buy?${params.toString()}`;
    navigator.clipboard.writeText(url);
  };

  const buyingBetter = result.netAdvantage >= 0;

  return (
    <div>
      <PageHeader
        title="Rent vs Buy Calculator"
        description="Compare the true cost of renting versus buying a home"
        onReset={reset}
        onShare={handleShare}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-xl p-5">
            <RentVsBuyForm inputs={inputs} onUpdate={updateInput} />
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
              label="Mortgage Payment"
              value={result.monthlyMortgagePayment}
              format="currency"
              accent
              delay={0}
            />
            <SummaryCard
              label="Upfront Costs"
              value={result.initialBuyingCosts}
              format="currency"
              delay={0.05}
            />
            <SummaryCard
              label={`Buy Net Worth (Yr ${inputs.timeHorizon})`}
              value={result.buyNetWorthFinal}
              format="currency"
              delay={0.1}
            />
            <SummaryCard
              label={`Rent Net Worth (Yr ${inputs.timeHorizon})`}
              value={result.rentNetWorthFinal}
              format="currency"
              delay={0.15}
            />
          </motion.div>

          {/* Verdict Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card rounded-xl p-4 border ${
              buyingBetter
                ? 'border-green-500/20 bg-green-500/5'
                : 'border-blue-500/20 bg-blue-500/5'
            }`}
          >
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-zinc-400 text-xs">
                  {buyingBetter ? 'Buying advantage' : 'Renting advantage'} over {inputs.timeHorizon} years
                </span>
                <p className={`font-bold ${buyingBetter ? 'text-green-400' : 'text-blue-400'}`}>
                  {formatCurrency(Math.abs(result.netAdvantage))}
                </p>
              </div>
              {result.breakEvenYear && (
                <div>
                  <span className="text-zinc-400 text-xs">Break-even Year</span>
                  <p className="text-green-400 font-bold">Year {result.breakEvenYear}</p>
                </div>
              )}
              {!result.breakEvenYear && (
                <div>
                  <span className="text-zinc-400 text-xs">Break-even</span>
                  <p className="text-zinc-400 font-bold">Not within {inputs.timeHorizon} years</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NetWorthChart data={result.yearlyData} breakEvenYear={result.breakEvenYear} />
            <CostBreakdown data={result.yearlyData} />
          </div>

          {/* Yearly Table */}
          <YearlyTable data={result.yearlyData} />
        </div>
      </div>
    </div>
  );
}
