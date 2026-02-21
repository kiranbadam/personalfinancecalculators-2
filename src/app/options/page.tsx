'use client';

import { useState, useCallback, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StrategySelector } from '@/components/calculators/options/StrategySelector';
import { LegBuilder } from '@/components/calculators/options/LegBuilder';
import { PayoffChart } from '@/components/calculators/options/PayoffChart';
import { GreeksDisplay } from '@/components/calculators/options/GreeksDisplay';
import { SummaryCard } from '@/components/charts/SummaryCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { calculateOptions, getDefaultOptionsInputs, getStrategyLegs } from '@/lib/calculations/options';
import { OptionsInputs, OptionStrategy, OptionLeg } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';

export default function OptionsPage() {
  const [inputs, setInputs] = useState<OptionsInputs>(getDefaultOptionsInputs());
  const debouncedInputs = useDebounce(inputs, 100);

  const result = useMemo(() => calculateOptions(debouncedInputs), [debouncedInputs]);

  const handleStrategyChange = (strategy: OptionStrategy) => {
    const newLegs = getStrategyLegs(strategy, inputs.currentPrice);
    setInputs(prev => ({ ...prev, strategy, legs: newLegs }));
  };

  const handleUpdateLeg = (id: string, updates: Partial<OptionLeg>) => {
    setInputs(prev => ({
      ...prev,
      legs: prev.legs.map(leg => leg.id === id ? { ...leg, ...updates } : leg),
    }));
  };

  const handleAddLeg = () => {
    const newId = String(inputs.legs.length + 1);
    const newLeg: OptionLeg = {
      id: newId,
      type: 'call',
      direction: 'buy',
      strikePrice: Math.round(inputs.currentPrice),
      premium: 5,
      quantity: 1,
      expirationDate: '',
    };
    setInputs(prev => ({ ...prev, legs: [...prev.legs, newLeg] }));
  };

  const handleRemoveLeg = (id: string) => {
    setInputs(prev => ({ ...prev, legs: prev.legs.filter(l => l.id !== id) }));
  };

  const handleReset = () => {
    setInputs(getDefaultOptionsInputs());
  };

  const handleShare = () => {
    const url = `${window.location.origin}/options`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div>
      <PageHeader
        title="Options P/L Visualizer"
        description="Analyze options strategies with payoff diagrams and Greeks"
        onReset={handleReset}
        onShare={handleShare}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Strategy</h3>
            <StrategySelector selected={inputs.strategy} onSelect={handleStrategyChange} />
          </div>

          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Current Stock Price</Label>
              <Input
                type="number"
                value={inputs.currentPrice}
                onChange={(e) => setInputs(prev => ({ ...prev, currentPrice: parseFloat(e.target.value) || 0 }))}
                className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Implied Volatility (%)</Label>
              <Input
                type="number"
                value={inputs.impliedVolatility ?? ''}
                onChange={(e) => setInputs(prev => ({ ...prev, impliedVolatility: e.target.value ? parseFloat(e.target.value) : null }))}
                className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
              />
              {inputs.impliedVolatility !== null && (
                <Slider
                  value={[inputs.impliedVolatility]}
                  onValueChange={([v]) => setInputs(prev => ({ ...prev, impliedVolatility: v }))}
                  min={5}
                  max={150}
                  step={1}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Days to Expiration</Label>
              <Input
                type="number"
                value={inputs.daysToExpiration}
                onChange={(e) => setInputs(prev => ({ ...prev, daysToExpiration: parseInt(e.target.value) || 1 }))}
                className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
              />
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Option Legs</h3>
            <LegBuilder
              legs={inputs.legs}
              onUpdateLeg={handleUpdateLeg}
              onAddLeg={handleAddLeg}
              onRemoveLeg={handleRemoveLeg}
              isCustom={inputs.strategy === 'custom'}
            />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <SummaryCard
              label="Max Profit"
              value={result.maxProfit !== null ? formatCurrency(result.maxProfit) : 'Unlimited'}
              accent
              delay={0}
            />
            <SummaryCard
              label="Max Loss"
              value={result.maxLoss !== null ? formatCurrency(Math.abs(result.maxLoss)) : 'Unlimited'}
              delay={0.05}
            />
            <SummaryCard
              label="Breakeven"
              value={result.breakevens.length > 0 ? `$${result.breakevens[0].toFixed(2)}` : 'N/A'}
              subtitle={result.breakevens.length > 1 ? `$${result.breakevens[1].toFixed(2)}` : undefined}
              delay={0.1}
            />
            <SummaryCard
              label="Capital Required"
              value={result.capitalRequired}
              format="currency"
              delay={0.15}
            />
          </motion.div>

          {result.riskRewardRatio !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-3 flex flex-wrap gap-4 text-xs"
            >
              <div>
                <span className="text-zinc-500">Risk/Reward:</span>
                <span className="ml-1 text-white font-semibold">{result.riskRewardRatio.toFixed(2)}:1</span>
              </div>
              {result.probabilityOfProfit !== null && (
                <div>
                  <span className="text-zinc-500">P(Profit):</span>
                  <span className="ml-1 text-white font-semibold">{result.probabilityOfProfit.toFixed(1)}%</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Payoff Chart */}
          <PayoffChart
            data={result.payoffData}
            breakevens={result.breakevens}
            currentPrice={inputs.currentPrice}
            maxProfit={result.maxProfit}
            maxLoss={result.maxLoss}
          />

          {/* Greeks */}
          {result.greeks && (
            <GreeksDisplay greeks={result.greeks} />
          )}
        </div>
      </div>
    </div>
  );
}
