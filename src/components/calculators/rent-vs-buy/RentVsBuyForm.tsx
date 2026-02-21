'use client';

import { RentVsBuyInputs } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface RentVsBuyFormProps {
  inputs: RentVsBuyInputs;
  onUpdate: <K extends keyof RentVsBuyInputs>(key: K, value: RentVsBuyInputs[K]) => void;
}

export function RentVsBuyForm({ inputs, onUpdate }: RentVsBuyFormProps) {
  const handleNumberInput = (key: keyof RentVsBuyInputs, value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) onUpdate(key, num);
    if (value === '') onUpdate(key, 0);
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
          onValueChange={([v]) => onUpdate('homePrice', v)}
          min={100000}
          max={2000000}
          step={10000}
        />
      </div>

      {/* Down Payment */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Down Payment (%)</Label>
        <Input
          type="number"
          step="1"
          value={inputs.downPaymentPercent}
          onChange={(e) => onUpdate('downPaymentPercent', parseFloat(e.target.value) || 0)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.downPaymentPercent]}
          onValueChange={([v]) => onUpdate('downPaymentPercent', v)}
          min={0}
          max={50}
          step={1}
        />
      </div>

      {/* Mortgage Rate */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Mortgage Rate (%)</Label>
        <Input
          type="number"
          step="0.125"
          value={inputs.mortgageRate}
          onChange={(e) => onUpdate('mortgageRate', parseFloat(e.target.value) || 0)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.mortgageRate]}
          onValueChange={([v]) => onUpdate('mortgageRate', parseFloat(v.toFixed(3)))}
          min={2}
          max={10}
          step={0.125}
        />
      </div>

      {/* Monthly Rent */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Monthly Rent</Label>
        <Input
          type="text"
          value={inputs.monthlyRent ? formatCurrency(inputs.monthlyRent) : ''}
          onChange={(e) => handleNumberInput('monthlyRent', e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.monthlyRent]}
          onValueChange={([v]) => onUpdate('monthlyRent', v)}
          min={500}
          max={10000}
          step={50}
        />
      </div>

      {/* Time Horizon */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Time Horizon (years)</Label>
        <div className="flex gap-2">
          {[5, 10, 15, 20].map((yr) => (
            <button
              key={yr}
              onClick={() => onUpdate('timeHorizon', yr)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                inputs.timeHorizon === yr
                  ? 'bg-[#D4A853] text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {yr} yr
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <details className="group">
        <summary className="text-xs text-[#D4A853] cursor-pointer hover:text-[#E8C97A] select-none">
          Advanced Options ▾
        </summary>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 space-y-3 pl-2 border-l-2 border-zinc-800"
        >
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Home Appreciation (%/yr)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.homeAppreciationRate}
              onChange={(e) => onUpdate('homeAppreciationRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Annual Rent Increase (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.annualRentIncrease}
              onChange={(e) => onUpdate('annualRentIncrease', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Investment Return (%/yr)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.investmentReturnRate}
              onChange={(e) => onUpdate('investmentReturnRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
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
            <Label className="text-xs text-zinc-500">Maintenance (%/yr of home value)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.maintenanceRate}
              onChange={(e) => onUpdate('maintenanceRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Closing Costs - Buy (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.closingCostPercent}
              onChange={(e) => onUpdate('closingCostPercent', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Closing Costs - Sell (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.sellingCostPercent}
              onChange={(e) => onUpdate('sellingCostPercent', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Marginal Tax Rate (%)</Label>
            <Input
              type="number"
              step="1"
              value={inputs.marginalTaxRate}
              onChange={(e) => onUpdate('marginalTaxRate', parseFloat(e.target.value) || 0)}
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
    </motion.div>
  );
}
