'use client';

import { FireResult } from '@/types';
import { SummaryCard } from '@/components/charts/SummaryCard';
import { formatCurrency, formatCompact } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

interface FireDashboardProps {
  result: FireResult;
}

export function FireDashboard({ result }: FireDashboardProps) {
  return (
    <div className="space-y-4">
      {/* FIRE Number - Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-xl p-6 border border-[#D4A853]/20 text-center"
      >
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Your FIRE Number</p>
        <p className="text-3xl font-bold gold-text">{formatCompact(result.fireNumber)}</p>
        <p className="text-xs text-zinc-500 mt-2">
          Based on 4% safe withdrawal rate: {formatCurrency(result.fireNumber / 25)}/year spending × 25
        </p>
      </motion.div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard
          label="Years to FIRE"
          value={result.yearsToFire}
          format="years"
          accent
          delay={0}
        />
        <SummaryCard
          label="Required Savings Rate"
          value={result.requiredSavingsRate}
          format="percent"
          delay={0.05}
        />
        <SummaryCard
          label="Coast FIRE"
          value={result.coastFireNumber}
          format="compact"
          subtitle={result.coastFireAge ? `Age ${result.coastFireAge}` : undefined}
          delay={0.1}
        />
        <SummaryCard
          label="Barista FIRE"
          value={result.baristaFireNumber}
          format="compact"
          delay={0.15}
        />
      </div>

      {/* FIRE Variants */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-3">FIRE Variants</h3>
        <div className="space-y-2">
          {[
            { label: 'Lean FIRE', value: result.leanFireNumber, color: 'bg-blue-400', desc: '70% of regular spending' },
            { label: 'Regular FIRE', value: result.fireNumber, color: 'bg-[#D4A853]', desc: '100% of planned spending' },
            { label: 'Fat FIRE', value: result.fatFireNumber, color: 'bg-purple-400', desc: '150% of regular spending' },
          ].map((variant) => {
            const maxVal = result.fatFireNumber;
            return (
              <div key={variant.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{variant.label}</span>
                  <span className="text-white font-medium">{formatCompact(variant.value)}</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(variant.value / maxVal) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${variant.color}`}
                  />
                </div>
                <p className="text-[10px] text-zinc-600">{variant.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
