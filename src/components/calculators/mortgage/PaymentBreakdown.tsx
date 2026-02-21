'use client';

import { MortgagePaymentBreakdown } from '@/types';
import { DonutChart } from '@/components/charts/DonutChart';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { chartColors } from '@/components/charts/theme';
import { formatCurrency } from '@/lib/utils/formatters';

interface PaymentBreakdownProps {
  breakdown: MortgagePaymentBreakdown;
}

export function PaymentBreakdown({ breakdown }: PaymentBreakdownProps) {
  const data = [
    { name: 'Principal & Interest', value: breakdown.principal + breakdown.interest, color: chartColors.principal },
    { name: 'Property Tax', value: breakdown.propertyTax, color: chartColors.tax },
    { name: 'Insurance', value: breakdown.homeInsurance, color: chartColors.insurance },
    { name: 'PMI', value: breakdown.pmi, color: chartColors.pmi },
    { name: 'HOA', value: breakdown.hoa, color: chartColors.hoa },
  ];

  return (
    <ChartWrapper title="Monthly Payment" subtitle="Breakdown by category">
      <DonutChart
        data={data}
        centerLabel="per month"
        centerValue={formatCurrency(breakdown.total)}
        height={220}
      />
      <div className="mt-3 space-y-1.5">
        {data.filter(d => d.value > 0).map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-zinc-400">{item.name}</span>
            </div>
            <span className="text-white font-medium">{formatCurrency(item.value, true)}</span>
          </div>
        ))}
      </div>
    </ChartWrapper>
  );
}
