'use client';

import { useState, useMemo } from 'react';
import { AmortizationEntry } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

interface AmortizationTableProps {
  schedule: AmortizationEntry[];
}

export function AmortizationTable({ schedule }: AmortizationTableProps) {
  const [expanded, setExpanded] = useState(false);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(schedule.map(e => e.year))];
    return uniqueYears;
  }, [schedule]);

  const filtered = useMemo(() => {
    if (filterYear) return schedule.filter(e => e.year === filterYear);
    return schedule;
  }, [schedule, filterYear]);

  const displayed = expanded ? filtered : filtered.slice(0, 24);

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Amortization Table</h3>
        <div className="flex gap-2 items-center">
          <select
            value={filterYear ?? ''}
            onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : null)}
            className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-md px-2 py-1"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-zinc-500 border-b border-zinc-800">
              <th className="text-left py-2 px-2">#</th>
              <th className="text-right py-2 px-2">Payment</th>
              <th className="text-right py-2 px-2">Principal</th>
              <th className="text-right py-2 px-2">Interest</th>
              <th className="text-right py-2 px-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {displayed.map((entry) => (
                <motion.tr
                  key={entry.month}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
                >
                  <td className="py-1.5 px-2 text-zinc-500">{entry.month}</td>
                  <td className="py-1.5 px-2 text-right text-white">{formatCurrency(entry.payment, true)}</td>
                  <td className="py-1.5 px-2 text-right text-[#D4A853]">{formatCurrency(entry.principal, true)}</td>
                  <td className="py-1.5 px-2 text-right text-blue-400">{formatCurrency(entry.interest, true)}</td>
                  <td className="py-1.5 px-2 text-right text-zinc-300">{formatCurrency(entry.balance, true)}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {filtered.length > 24 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-[#D4A853] hover:text-[#E8C97A] transition-colors w-full text-center"
        >
          {expanded ? 'Show Less' : `Show All ${filtered.length} Months`}
        </button>
      )}
    </div>
  );
}
