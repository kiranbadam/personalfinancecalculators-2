'use client';

import { CompoundInputs } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface CompoundFormProps {
  inputs: CompoundInputs;
  onUpdate: <K extends keyof CompoundInputs>(key: K, value: CompoundInputs[K]) => void;
}

export function CompoundForm({ inputs, onUpdate }: CompoundFormProps) {
  const handleNumberInput = (key: keyof CompoundInputs, value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) onUpdate(key, num as CompoundInputs[typeof key]);
    if (value === '' || value === '$') onUpdate(key, 0 as CompoundInputs[typeof key]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Initial Investment</Label>
        <Input
          type="text"
          value={inputs.initialInvestment ? formatCurrency(inputs.initialInvestment) : ''}
          onChange={(e) => handleNumberInput('initialInvestment', e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.initialInvestment]}
          onValueChange={([v]) => onUpdate('initialInvestment', v)}
          min={0}
          max={500000}
          step={1000}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Monthly Contribution</Label>
        <Input
          type="text"
          value={inputs.monthlyContribution ? formatCurrency(inputs.monthlyContribution) : ''}
          onChange={(e) => handleNumberInput('monthlyContribution', e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.monthlyContribution]}
          onValueChange={([v]) => onUpdate('monthlyContribution', v)}
          min={0}
          max={5000}
          step={50}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Annual Return Rate (%)</Label>
        <Input
          type="number"
          step="0.5"
          value={inputs.annualReturnRate}
          onChange={(e) => onUpdate('annualReturnRate', parseFloat(e.target.value) || 0)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.annualReturnRate]}
          onValueChange={([v]) => onUpdate('annualReturnRate', parseFloat(v.toFixed(1)))}
          min={0}
          max={15}
          step={0.5}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Time Horizon (Years)</Label>
        <Input
          type="number"
          value={inputs.timeHorizon}
          onChange={(e) => onUpdate('timeHorizon', parseInt(e.target.value) || 1)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.timeHorizon]}
          onValueChange={([v]) => onUpdate('timeHorizon', v)}
          min={1}
          max={50}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Annual Contribution Increase (%)</Label>
        <Input
          type="number"
          step="0.5"
          value={inputs.contributionIncreaseRate}
          onChange={(e) => onUpdate('contributionIncreaseRate', parseFloat(e.target.value) || 0)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Compound Frequency</Label>
        <div className="grid grid-cols-2 gap-2">
          {(['daily', 'monthly', 'quarterly', 'annually'] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => onUpdate('compoundFrequency', freq)}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                inputs.compoundFrequency === freq
                  ? 'bg-[#D4A853] text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-zinc-400">Inflation Adjustment</Label>
          <button
            onClick={() => onUpdate('inflationEnabled', !inputs.inflationEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              inputs.inflationEnabled ? 'bg-[#D4A853]' : 'bg-zinc-700'
            }`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              inputs.inflationEnabled ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
        {inputs.inflationEnabled && (
          <div className="space-y-1 pl-2 border-l-2 border-zinc-800">
            <Label className="text-xs text-zinc-500">Inflation Rate (%)</Label>
            <Input
              type="number"
              step="0.5"
              value={inputs.inflationRate}
              onChange={(e) => onUpdate('inflationRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label className="text-xs text-zinc-400">Tax Drag</Label>
          <button
            onClick={() => onUpdate('taxDragEnabled', !inputs.taxDragEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              inputs.taxDragEnabled ? 'bg-[#D4A853]' : 'bg-zinc-700'
            }`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              inputs.taxDragEnabled ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
        {inputs.taxDragEnabled && (
          <div className="space-y-1 pl-2 border-l-2 border-zinc-800">
            <Label className="text-xs text-zinc-500">Capital Gains Rate (%)</Label>
            <Input
              type="number"
              step="1"
              value={inputs.capitalGainsRate}
              onChange={(e) => onUpdate('capitalGainsRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
