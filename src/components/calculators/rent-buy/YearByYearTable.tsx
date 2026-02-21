'use client';

import { useState } from 'react';
import { RentBuyYearEntry } from '@/types';
import { formatCurrency, formatCompact } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';

interface YearByYearTableProps {
  data: RentBuyYearEntry[];
}

export function YearByYearTable({ data }: YearByYearTableProps) {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Year-by-Year Breakdown</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Detailed comparison across all years</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800/50">
              <th className="text-left px-3 py-2.5 text-zinc-500 font-medium">Year</th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-medium">Home Value</th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-medium">Equity</th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-medium">Buy Net Worth</th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-medium">Monthly Rent</th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-medium">Investments</th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-medium">Rent Net Worth</th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-medium">Advantage</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, i) => (
              <tr
                key={row.year}
                className={`border-b border-zinc-800/30 transition-colors hover:bg-zinc-800/20 ${
                  i % 2 === 0 ? '' : 'bg-zinc-900/20'
                }`}
              >
                <td className="px-3 py-2 text-zinc-400 font-medium">{row.year}</td>
                <td className="px-3 py-2 text-right text-zinc-300">{formatCompact(row.homeValue)}</td>
                <td className="px-3 py-2 text-right text-zinc-300">{formatCompact(row.equity)}</td>
                <td className="px-3 py-2 text-right font-semibold text-green-400">
                  {formatCompact(row.buyNetWorth)}
                </td>
                <td className="px-3 py-2 text-right text-zinc-300">{formatCurrency(row.monthlyRent)}</td>
                <td className="px-3 py-2 text-right text-zinc-300">{formatCompact(row.investmentPortfolio)}</td>
                <td className="px-3 py-2 text-right font-semibold text-blue-400">
                  {formatCompact(row.rentNetWorth)}
                </td>
                <td className="px-3 py-2 text-right">
                  {row.advantage === 'equal' ? (
                    <span className="text-zinc-500">—</span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        row.advantage === 'buy' ? 'text-green-400' : 'text-blue-400'
                      }`}
                    >
                      {row.advantage === 'buy' ? '⌂' : '◎'} {formatCompact(row.advantageAmount)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 10 && (
        <div className="p-3 text-center border-t border-zinc-800/50">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-[#D4A853] hover:text-[#E8C97A] transition-colors"
          >
            {showAll ? 'Show less ▲' : `Show all ${data.length} years ▾`}
          </button>
        </div>
      )}
    </motion.div>
  );
}
