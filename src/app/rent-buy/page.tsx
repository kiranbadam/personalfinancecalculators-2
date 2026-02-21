'use client';

import { useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { RentBuyForm } from '@/components/calculators/rent-buy/RentBuyForm';
import { NetWorthChart } from '@/components/calculators/rent-buy/NetWorthChart';
import { CumulativeCostsChart } from '@/components/calculators/rent-buy/CumulativeCostsChart';
import { YearByYearTable } from '@/components/calculators/rent-buy/YearByYearTable';
import { SummaryCard } from '@/components/charts/SummaryCard';
import { useCalculator } from '@/hooks/useCalculator';
import { calculateRentBuy, getDefaultRentBuyInputs } from '@/lib/calculations/rent-buy';
import { formatCurrency, formatCompact } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

export default function RentBuyPage() {
  const calculate = useCallback(calculateRentBuy, []);
  const { inputs, updateInput, result, reset } = useCalculator(
    getDefaultRentBuyInputs(),
    calculate
  );

  const handleShare = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    const url = `${window.location.origin}/rent-buy?${params.toString()}`;
    navigator.clipboard.writeText(url);
  };

  const buyWins = result.winner === 'buy';
  const rentWins = result.winner === 'rent';

  return (
    <div>
      <PageHeader
        title="Rent vs Buy Calculator"
        description="Full cost analysis comparing renting (invest the savings) versus buying over your time horizon"
        onReset={reset}
        onShare={handleShare}
      />

      {/* Verdict Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`mb-6 rounded-xl p-4 border ${
          buyWins
            ? 'bg-green-500/5 border-green-500/20'
            : rentWins
            ? 'bg-blue-500/5 border-blue-500/20'
            : 'bg-zinc-800/30 border-zinc-700/30'
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Verdict</p>
            <p className={`text-lg font-bold ${buyWins ? 'text-green-400' : rentWins ? 'text-blue-400' : 'text-zinc-400'}`}>
              {result.winner === 'equal'
                ? 'Break Even'
                : `${result.winner === 'buy' ? '⌂ Buying' : '◎ Renting'} wins by ${formatCompact(result.winnerAdvantage)}`}
            </p>
          </div>
          {result.breakEvenYear && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Break-Even Year</p>
              <p className="text-lg font-bold text-[#D4A853]">Year {result.breakEvenYear}</p>
            </div>
          )}
          {!result.breakEvenYear && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Break-Even</p>
              <p className="text-sm font-medium text-zinc-500">Beyond time horizon</p>
            </div>
          )}
          <div className="ml-auto text-right">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Buy Net Worth</p>
            <p className="text-sm font-bold text-green-400">{formatCompact(result.finalBuyNetWorth)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Rent Net Worth</p>
            <p className="text-sm font-bold text-blue-400">{formatCompact(result.finalRentNetWorth)}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-xl p-5">
            <RentBuyForm inputs={inputs} onUpdate={updateInput} />
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
              label="Monthly Mortgage"
              value={result.monthlyMortgagePayment}
              format="currency"
              accent
              delay={0}
            />
            <SummaryCard
              label="vs Monthly Rent"
              value={inputs.monthlyRent}
              format="currency"
              delay={0.05}
            />
            <SummaryCard
              label="Initial Cost Diff"
              value={result.initialMonthlyCostDiff}
              format="currency"
              subtitle={result.initialMonthlyCostDiff > 0 ? 'Buy costs more/mo' : 'Rent costs more/mo'}
              delay={0.1}
            />
            <SummaryCard
              label="Time Horizon"
              value={inputs.timeHorizon}
              format="years"
              delay={0.15}
            />
          </motion.div>

          {/* Charts */}
          <NetWorthChart data={result.yearlyData} breakEvenYear={result.breakEvenYear} />
          <CumulativeCostsChart data={result.yearlyData} />

          {/* Year-by-Year Table */}
          <YearByYearTable data={result.yearlyData} />
        </div>
      </div>
    </div>
  );
}
