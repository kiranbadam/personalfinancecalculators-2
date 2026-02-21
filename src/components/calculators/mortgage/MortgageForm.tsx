'use client';

import { MortgageInputs } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface MortgageFormProps {
  inputs: MortgageInputs;
  onUpdate: <K extends keyof MortgageInputs>(key: K, value: MortgageInputs[K]) => void;
}

export function MortgageForm({ inputs, onUpdate }: MortgageFormProps) {
  const handleNumberInput = (key: keyof MortgageInputs, value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) onUpdate(key, num);
    if (value === '') onUpdate(key, 0);
  };

  const handleDownPaymentChange = (value: number, isPercent: boolean) => {
    if (isPercent) {
      onUpdate('downPaymentPercent', value);
      onUpdate('downPayment', Math.round(inputs.homePrice * value / 100));
    } else {
      onUpdate('downPayment', value);
      onUpdate('downPaymentPercent', inputs.homePrice > 0 ? parseFloat(((value / inputs.homePrice) * 100).toFixed(1)) : 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Home Price */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Home Price</Label>
        <Input
          type="text"
          value={inputs.homePrice ? formatCurrency(inputs.homePrice) : ''}
          onChange={(e) => handleNumberInput('homePrice', e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853] focus:ring-[#D4A853]/20"
        />
        <Slider
          value={[inputs.homePrice]}
          onValueChange={([v]) => {
            onUpdate('homePrice', v);
            handleDownPaymentChange(inputs.downPaymentPercent, true);
          }}
          min={50000}
          max={2000000}
          step={5000}
          className="mt-1"
        />
      </div>

      {/* Down Payment */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Down Payment</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputs.downPayment ? formatCurrency(inputs.downPayment) : ''}
            onChange={(e) => {
              const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
              if (!isNaN(num)) handleDownPaymentChange(num, false);
            }}
            className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853] flex-1"
          />
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 min-w-[80px]">
            <Input
              type="number"
              value={inputs.downPaymentPercent}
              onChange={(e) => handleDownPaymentChange(parseFloat(e.target.value) || 0, true)}
              className="bg-transparent border-0 p-0 text-white text-right w-12 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-zinc-500 text-sm">%</span>
          </div>
        </div>
      </div>

      {/* Loan Term */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Loan Term</Label>
        <div className="flex gap-2">
          {[15, 20, 30].map((term) => (
            <button
              key={term}
              onClick={() => onUpdate('loanTerm', term)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                inputs.loanTerm === term
                  ? 'bg-[#D4A853] text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {term} yr
            </button>
          ))}
        </div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Interest Rate (%)</Label>
        <Input
          type="number"
          step="0.125"
          value={inputs.interestRate}
          onChange={(e) => onUpdate('interestRate', parseFloat(e.target.value) || 0)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.interestRate]}
          onValueChange={([v]) => onUpdate('interestRate', parseFloat(v.toFixed(3)))}
          min={1}
          max={12}
          step={0.125}
        />
      </div>

      {/* Optional fields */}
      <details className="group">
        <summary className="text-xs text-[#D4A853] cursor-pointer hover:text-[#E8C97A] select-none">
          Additional Costs ▾
        </summary>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 space-y-3 pl-2 border-l-2 border-zinc-800"
        >
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Property Tax Rate (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.propertyTaxRate}
              onChange={(e) => onUpdate('propertyTaxRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">PMI Rate (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.pmiRate}
              onChange={(e) => onUpdate('pmiRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">HOA (Monthly)</Label>
            <Input
              type="number"
              value={inputs.hoaMonthly}
              onChange={(e) => onUpdate('hoaMonthly', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Home Insurance (Annual)</Label>
            <Input
              type="number"
              value={inputs.homeInsuranceAnnual}
              onChange={(e) => onUpdate('homeInsuranceAnnual', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
        </motion.div>
      </details>

      {/* Extra Monthly Payment */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Extra Monthly Payment</Label>
        <Input
          type="text"
          value={inputs.extraMonthlyPayment ? formatCurrency(inputs.extraMonthlyPayment) : '$0'}
          onChange={(e) => handleNumberInput('extraMonthlyPayment', e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.extraMonthlyPayment]}
          onValueChange={([v]) => onUpdate('extraMonthlyPayment', v)}
          min={0}
          max={2000}
          step={25}
        />
      </div>
    </motion.div>
  );
}
