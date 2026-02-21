'use client';

import { RentVsBuyYearEntry } from '@/types';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { formatCurrency } from '@/lib/utils/formatters';

interface YearlyTableProps {
  data: RentVsBuyYearEntry[];
}

export function YearlyTable({ data }: YearlyTableProps) {
  return (
    <ChartWrapper title="Year-by-Year Breakdown" subtitle="Detailed comparison over time">
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm z-10">
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 px-2 text-zinc-500 font-normal">Year</th>
              <th className="text-right py-2 px-2 text-[#D4A853] font-medium">Home Value</th>
              <th className="text-right py-2 px-2 text-[#D4A853] font-medium">Home Equity</th>
              <th className="text-right py-2 px-2 text-[#D4A853] font-medium">Buy Net Worth</th>
              <th className="text-right py-2 px-2 text-[#60A5FA] font-medium">Monthly Rent</th>
              <th className="text-right py-2 px-2 text-[#60A5FA] font-medium">Investments</th>
              <th className="text-right py-2 px-2 text-[#60A5FA] font-medium">Rent Net Worth</th>
              <th className="text-right py-2 px-2 text-zinc-500 font-medium">Advantage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const advantage = row.buyNetWorth - row.rentNetWorth;
              return (
                <tr key={row.year} className="border-b border-zinc-800/30 hover:bg-zinc-800/20">
                  <td className="py-2 px-2 text-zinc-400">{row.year}</td>
                  <td className="py-2 px-2 text-right text-zinc-300">{formatCurrency(row.homeValue)}</td>
                  <td className="py-2 px-2 text-right text-zinc-300">{formatCurrency(row.homeEquity)}</td>
                  <td className="py-2 px-2 text-right text-white font-medium">{formatCurrency(row.buyNetWorth)}</td>
                  <td className="py-2 px-2 text-right text-zinc-300">{formatCurrency(row.monthlyRent)}</td>
                  <td className="py-2 px-2 text-right text-zinc-300">{formatCurrency(row.investmentBalance)}</td>
                  <td className="py-2 px-2 text-right text-white font-medium">{formatCurrency(row.rentNetWorth)}</td>
                  <td className={`py-2 px-2 text-right font-medium ${advantage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {advantage >= 0 ? '+' : ''}{formatCurrency(advantage)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ChartWrapper>
  );
}
