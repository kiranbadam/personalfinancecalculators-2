'use client';

import { motion } from 'framer-motion';
import { formatCurrency, formatCompact } from '@/lib/utils/formatters';

interface SummaryCardProps {
  label: string;
  value: string | number;
  format?: 'currency' | 'compact' | 'percent' | 'text' | 'years';
  subtitle?: string;
  accent?: boolean;
  delay?: number;
}

export function SummaryCard({ label, value, format = 'text', subtitle, accent = false, delay = 0 }: SummaryCardProps) {
  const formattedValue = (() => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'currency': return formatCurrency(value);
      case 'compact': return formatCompact(value);
      case 'percent': return `${value.toFixed(1)}%`;
      case 'years': return `${value.toFixed(1)} yrs`;
      default: return String(value);
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`glass-card rounded-xl p-4 ${accent ? 'border-[#D4A853]/30' : ''}`}
    >
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent ? 'text-[#D4A853]' : 'text-white'}`}>
        {formattedValue}
      </p>
      {subtitle && (
        <p className="text-[11px] text-zinc-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}
