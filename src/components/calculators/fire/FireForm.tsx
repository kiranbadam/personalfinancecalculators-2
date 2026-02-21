'use client';

import { FireInputs } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface FireFormProps {
  inputs: FireInputs;
  onUpdate: <K extends keyof FireInputs>(key: K, value: FireInputs[K]) => void;
}

export function FireForm({ inputs, onUpdate }: FireFormProps) {
  const handleNumberInput = (key: keyof FireInputs, value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) onUpdate(key, num as FireInputs[typeof key]);
    if (value === '' || value === '$') onUpdate(key, 0 as FireInputs[typeof key]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Ages */}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-zinc-400">Current Age</Label>
          <Input
            type="number"
            value={inputs.currentAge}
            onChange={(e) => onUpdate('currentAge', parseInt(e.target.value) || 0)}
            className="bg-zinc-900 border-zinc-800 text-white text-sm h-9 focus:border-[#D4A853]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-zinc-400">Retire Age</Label>
          <Input
            type="number"
            value={inputs.retirementAge}
            onChange={(e) => onUpdate('retirementAge', parseInt(e.target.value) || 0)}
            className="bg-zinc-900 border-zinc-800 text-white text-sm h-9 focus:border-[#D4A853]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-zinc-400">Life Exp.</Label>
          <Input
            type="number"
            value={inputs.lifeExpectancy}
            onChange={(e) => onUpdate('lifeExpectancy', parseInt(e.target.value) || 0)}
            className="bg-zinc-900 border-zinc-800 text-white text-sm h-9 focus:border-[#D4A853]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Current Savings</Label>
        <Input
          type="text"
          value={inputs.currentSavings ? formatCurrency(inputs.currentSavings) : ''}
          onChange={(e) => handleNumberInput('currentSavings', e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Annual Income</Label>
        <Input
          type="text"
          value={inputs.annualIncome ? formatCurrency(inputs.annualIncome) : ''}
          onChange={(e) => handleNumberInput('annualIncome', e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-zinc-400">Savings Rate</Label>
          <span className="text-xs text-[#D4A853] font-semibold">{inputs.savingsRate}%</span>
        </div>
        <Slider
          value={[inputs.savingsRate]}
          onValueChange={([v]) => onUpdate('savingsRate', v)}
          min={1}
          max={80}
          step={1}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-zinc-400">Return (Pre-Ret.)</Label>
          <Input
            type="number"
            step="0.5"
            value={inputs.expectedReturnPreRetirement}
            onChange={(e) => onUpdate('expectedReturnPreRetirement', parseFloat(e.target.value) || 0)}
            className="bg-zinc-900 border-zinc-800 text-white text-sm h-9 focus:border-[#D4A853]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-zinc-400">Return (Post-Ret.)</Label>
          <Input
            type="number"
            step="0.5"
            value={inputs.expectedReturnPostRetirement}
            onChange={(e) => onUpdate('expectedReturnPostRetirement', parseFloat(e.target.value) || 0)}
            className="bg-zinc-900 border-zinc-800 text-white text-sm h-9 focus:border-[#D4A853]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Annual Spending in Retirement</Label>
        <Input
          type="text"
          value={inputs.annualSpendingInRetirement ? formatCurrency(inputs.annualSpendingInRetirement) : ''}
          onChange={(e) => handleNumberInput('annualSpendingInRetirement', e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
      </div>

      {/* Social Security */}
      <details className="group">
        <summary className="text-xs text-[#D4A853] cursor-pointer hover:text-[#E8C97A] select-none">
          Social Security & Taxes ▾
        </summary>
        <div className="mt-3 space-y-3 pl-2 border-l-2 border-zinc-800">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">SS Monthly</Label>
              <Input
                type="number"
                value={inputs.socialSecurityMonthly}
                onChange={(e) => onUpdate('socialSecurityMonthly', parseFloat(e.target.value) || 0)}
                className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">SS Start Age</Label>
              <Input
                type="number"
                value={inputs.socialSecurityStartAge}
                onChange={(e) => onUpdate('socialSecurityStartAge', parseInt(e.target.value) || 0)}
                className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Inflation Rate (%)</Label>
              <Input
                type="number"
                step="0.5"
                value={inputs.inflationRate}
                onChange={(e) => onUpdate('inflationRate', parseFloat(e.target.value) || 0)}
                className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Tax Rate (%)</Label>
              <Input
                type="number"
                step="1"
                value={inputs.taxRateInRetirement}
                onChange={(e) => onUpdate('taxRateInRetirement', parseFloat(e.target.value) || 0)}
                className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
              />
            </div>
          </div>
        </div>
      </details>
    </motion.div>
  );
}
