'use client';

import { OptionStrategy } from '@/types';
import { motion } from 'framer-motion';

interface StrategySelectorProps {
  selected: OptionStrategy;
  onSelect: (strategy: OptionStrategy) => void;
}

const strategies: { value: OptionStrategy; label: string; category: string }[] = [
  { value: 'long-call', label: 'Long Call', category: 'Basic' },
  { value: 'long-put', label: 'Long Put', category: 'Basic' },
  { value: 'covered-call', label: 'Covered Call', category: 'Income' },
  { value: 'cash-secured-put', label: 'Cash-Secured Put', category: 'Income' },
  { value: 'bull-call-spread', label: 'Bull Call Spread', category: 'Spreads' },
  { value: 'bear-put-spread', label: 'Bear Put Spread', category: 'Spreads' },
  { value: 'iron-condor', label: 'Iron Condor', category: 'Advanced' },
  { value: 'straddle', label: 'Straddle', category: 'Volatility' },
  { value: 'strangle', label: 'Strangle', category: 'Volatility' },
  { value: 'butterfly', label: 'Butterfly', category: 'Advanced' },
  { value: 'custom', label: 'Custom', category: 'Custom' },
];

export function StrategySelector({ selected, onSelect }: StrategySelectorProps) {
  const categories = [...new Set(strategies.map(s => s.category))];

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div key={category}>
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1.5">{category}</p>
          <div className="flex flex-wrap gap-1.5">
            {strategies.filter(s => s.category === category).map((strategy) => (
              <button
                key={strategy.value}
                onClick={() => onSelect(strategy.value)}
                className={`relative px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                  selected === strategy.value
                    ? 'text-zinc-950'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {selected === strategy.value && (
                  <motion.div
                    layoutId="strategy-active"
                    className="absolute inset-0 bg-[#D4A853] rounded-md"
                    transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                  />
                )}
                <span className="relative">{strategy.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
