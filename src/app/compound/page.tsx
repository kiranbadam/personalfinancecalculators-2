'use client';

import { useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CompoundForm } from '@/components/calculators/compound/CompoundForm';
import { GrowthChart } from '@/components/calculators/compound/GrowthChart';
import { ScenarioComparison } from '@/components/calculators/compound/ScenarioComparison';
import { SummaryCard } from '@/components/charts/SummaryCard';
import { useCalculator } from '@/hooks/useCalculator';
import { calculateCompound, getDefaultCompoundInputs } from '@/lib/calculations/compound';
import { formatCurrency, formatCompact } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

export default function CompoundPage() {
  const calculate = useCallback(calculateCompound, []);
  const { inputs, updateInput, result, reset } = useCalculator(
    getDefaultCompoundInputs(),
    calculate
  );

  const handleShare = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    const url = `${window.location.origin}/compound?${params.toString()}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div>
      <PageHeader
        title="Compound Interest Calculator"
        description="Visualize your investment growth over time"
        onReset={reset}
        onShare={handleShare}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="glass-card rounded-xl p-5">
            <CompoundForm inputs={inputs} onUpdate={updateInput} />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <SummaryCard
              label="Final Balance"
              value={result.finalBalance}
              format="compact"
              accent
              delay={0}
            />
            <SummaryCard
              label="Total Contributed"
              value={result.totalContributed}
              format="compact"
              delay={0.05}
            />
            <SummaryCard
              label="Total Earnings"
              value={result.totalEarnings}
              format="compact"
              delay={0.1}
            />
            <SummaryCard
              label="Growth Multiple"
              value={`${result.effectiveGrowthMultiple.toFixed(1)}x`}
              delay={0.15}
            />
          </motion.div>

          {/* Inflation adjusted note */}
          {result.inflationAdjustedFinal !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-3 border border-amber-500/20 bg-amber-500/5"
            >
              <p className="text-xs text-amber-400">
                Inflation-adjusted value: <span className="font-bold">{formatCompact(result.inflationAdjustedFinal)}</span>
                {' '}(today&apos;s purchasing power)
              </p>
            </motion.div>
          )}

          {/* Growth Chart */}
          <GrowthChart
            data={result.yearlyData}
            milestones={result.milestones}
            showInflation={inputs.inflationEnabled}
          />

          {/* Milestones */}
          {result.milestones.some(m => m.year !== null) && (
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Milestones</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {result.milestones.filter(m => m.year !== null).map((m) => (
                  <div key={m.label} className="text-center p-2 bg-zinc-800/50 rounded-lg">
                    <p className="text-[#D4A853] font-bold">{m.label}</p>
                    <p className="text-xs text-zinc-400">Year {m.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scenario Comparison */}
          <ScenarioComparison scenarios={result.scenarios} />

          {/* Year-by-Year Table */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Year-by-Year Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left py-2 px-2">Year</th>
                    <th className="text-right py-2 px-2">Contributions</th>
                    <th className="text-right py-2 px-2">Earnings</th>
                    <th className="text-right py-2 px-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyData.map((entry) => (
                    <tr key={entry.year} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="py-1.5 px-2 text-zinc-400">{entry.year}</td>
                      <td className="py-1.5 px-2 text-right text-blue-400">{formatCurrency(entry.totalContributions)}</td>
                      <td className="py-1.5 px-2 text-right text-[#D4A853]">{formatCurrency(entry.totalEarnings)}</td>
                      <td className="py-1.5 px-2 text-right text-white font-medium">{formatCurrency(entry.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
