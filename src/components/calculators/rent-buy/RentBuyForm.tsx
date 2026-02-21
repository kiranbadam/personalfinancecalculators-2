'use client';

import { RentBuyInputs } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface RentBuyFormProps {
  inputs: RentBuyInputs;
  onUpdate: <K extends keyof RentBuyInputs>(key: K, value: RentBuyInputs[K]) => void;
}

export function RentBuyForm({ inputs, onUpdate }: RentBuyFormProps) {
  const handleNumberInput = (key: keyof RentBuyInputs, value: string) => {
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
          min={50000}
          max={2000000}
          step={5000}
          className="mt-1"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Down Payment</Label>
        <Input
          type="text"
          value={inputs.downPayment ? formatCurrency(inputs.downPayment) : ''}
          onChange={(e) => handleNumberInput('downPayment', e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.downPayment]}
          onValueChange={([v]) => onUpdate('downPayment', v)}
          min={0}
          max={inputs.homePrice}
          step={5000}
          className="mt-1"
        />
        <p className="text-[10px] text-zinc-500">
          {inputs.homePrice > 0
            ? `${((inputs.downPayment / inputs.homePrice) * 100).toFixed(1)}% of home price`
            : ''}
        </p>
      </div>

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
          min={1}
          max={12}
          step={0.125}
        />
      </div>

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

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Time Horizon (Years)</Label>
        <div className="flex gap-2">
          {[5, 10, 15, 20, 30].map((yr) => (
            <button
              key={yr}
              onClick={() => onUpdate('timeHorizon', yr)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                inputs.timeHorizon === yr
                  ? 'bg-[#D4A853] text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
        <Slider
          value={[inputs.timeHorizon]}
          onValueChange={([v]) => onUpdate('timeHorizon', v)}
          min={1}
          max={40}
          step={1}
        />
        <p className="text-[10px] text-zinc-500">{inputs.timeHorizon} years</p>
      </div>

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
              value={inputs.homeAppreciation}
              onChange={(e) => onUpdate('homeAppreciation', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Rent Increase Rate (%/yr)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.rentIncreaseRate}
              onChange={(e) => onUpdate('rentIncreaseRate', parseFloat(e.target.value) || 0)}
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
            <Label className="text-xs text-zinc-500">Property Tax Rate (%/yr)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.propertyTaxRate}
              onChange={(e) => onUpdate('propertyTaxRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Maintenance Rate (%/yr)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.maintenanceRate}
              onChange={(e) => onUpdate('maintenanceRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Buying Closing Costs (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.buyingClosingCostRate}
              onChange={(e) => onUpdate('buyingClosingCostRate', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-zinc-500">Selling Closing Costs (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.sellingClosingCostRate}
              onChange={(e) => onUpdate('sellingClosingCostRate', parseFloat(e.target.value) || 0)}
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
            <Label className="text-xs text-zinc-500">Annual Insurance ($)</Label>
            <Input
              type="number"
              step="100"
              value={inputs.annualInsurance}
              onChange={(e) => onUpdate('annualInsurance', parseFloat(e.target.value) || 0)}
              className="bg-zinc-900 border-zinc-800 text-white text-sm h-8"
            />
          </div>
        </motion.div>
      </details>
    </motion.div>
  );
}
