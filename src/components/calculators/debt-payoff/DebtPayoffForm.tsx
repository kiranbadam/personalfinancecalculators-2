'use client';

import { useState } from 'react';
import { Debt, DebtPayoffInputs, PayoffStrategy } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface DebtPayoffFormProps {
  inputs: DebtPayoffInputs;
  onUpdate: <K extends keyof DebtPayoffInputs>(key: K, value: DebtPayoffInputs[K]) => void;
}

const strategyOptions: { value: PayoffStrategy; label: string; description: string }[] = [
  { value: 'avalanche', label: 'Avalanche', description: 'Pay highest interest first (saves the most money)' },
  { value: 'snowball', label: 'Snowball', description: 'Pay smallest balance first (most motivating)' },
  { value: 'custom', label: 'Custom', description: 'Pay in the order listed above' },
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function DebtPayoffForm({ inputs, onUpdate }: DebtPayoffFormProps) {
  const [expandedDebtId, setExpandedDebtId] = useState<string | null>(null);

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    const updated = inputs.debts.map((d) =>
      d.id === id ? { ...d, [field]: typeof value === 'string' ? value : Number(value) } : d
    );
    onUpdate('debts', updated);
  };

  const addDebt = () => {
    const newDebt: Debt = {
      id: generateId(),
      name: `Debt ${inputs.debts.length + 1}`,
      balance: 5000,
      interestRate: 10,
      minimumPayment: 100,
    };
    const updated = [...inputs.debts, newDebt];
    onUpdate('debts', updated);
    setExpandedDebtId(newDebt.id);
  };

  const removeDebt = (id: string) => {
    onUpdate('debts', inputs.debts.filter((d) => d.id !== id));
    if (expandedDebtId === id) setExpandedDebtId(null);
  };

  const totalMinimum = inputs.debts.reduce((sum, d) => sum + d.minimumPayment, 0);
  const totalMonthlyPayment = totalMinimum + inputs.extraMonthlyPayment;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-xs text-zinc-400 uppercase tracking-wider">Your Debts</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addDebt}
            className="text-xs h-7 border-zinc-700 hover:border-[#D4A853]/50 hover:text-[#D4A853]"
          >
            + Add Debt
          </Button>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {inputs.debts.map((debt, index) => (
              <motion.div
                key={debt.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="glass-card rounded-lg border border-zinc-800">
                  <button
                    className="w-full flex items-center justify-between p-3 text-left"
                    onClick={() => setExpandedDebtId(expandedDebtId === debt.id ? null : debt.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 w-4">{index + 1}</span>
                      <span className="text-sm text-white font-medium">{debt.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">{formatCurrency(debt.balance)}</span>
                      <span className="text-xs text-red-400">{debt.interestRate}%</span>
                      <span className="text-zinc-600 text-xs">{expandedDebtId === debt.id ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedDebtId === debt.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-3 pb-3 space-y-3 border-t border-zinc-800 pt-3"
                      >
                        <div className="space-y-1">
                          <Label className="text-[10px] text-zinc-500">Name</Label>
                          <Input
                            value={debt.name}
                            onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                            className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white focus:border-[#D4A853]"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] text-zinc-500">Balance ($)</Label>
                            <Input
                              type="number"
                              value={debt.balance}
                              onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white focus:border-[#D4A853]"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-zinc-500">Rate (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={debt.interestRate}
                              onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white focus:border-[#D4A853]"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-zinc-500">Min. ($)</Label>
                            <Input
                              type="number"
                              value={debt.minimumPayment}
                              onChange={(e) => updateDebt(debt.id, 'minimumPayment', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs bg-zinc-900 border-zinc-700 text-white focus:border-[#D4A853]"
                            />
                          </div>
                        </div>
                        {inputs.debts.length > 1 && (
                          <button
                            onClick={() => removeDebt(debt.id)}
                            className="text-[10px] text-red-500 hover:text-red-400 transition-colors"
                          >
                            Remove this debt
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-xs text-zinc-400">Extra Monthly Payment</Label>
          <span className="text-xs text-[#D4A853]">{formatCurrency(inputs.extraMonthlyPayment)}/mo</span>
        </div>
        <Input
          type="number"
          value={inputs.extraMonthlyPayment}
          onChange={(e) => onUpdate('extraMonthlyPayment', parseFloat(e.target.value) || 0)}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.extraMonthlyPayment]}
          onValueChange={([v]) => onUpdate('extraMonthlyPayment', v)}
          min={0}
          max={2000}
          step={25}
          className="mt-1"
        />
        <p className="text-[10px] text-zinc-500">
          Total monthly payment: {formatCurrency(totalMonthlyPayment)} (minimums: {formatCurrency(totalMinimum)} + extra: {formatCurrency(inputs.extraMonthlyPayment)})
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400 uppercase tracking-wider">Payoff Strategy</Label>
        <div className="space-y-2">
          {strategyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate('strategy', opt.value)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                inputs.strategy === opt.value
                  ? 'border-[#D4A853]/40 bg-[#D4A853]/5'
                  : 'border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${inputs.strategy === opt.value ? 'border-[#D4A853] bg-[#D4A853]' : 'border-zinc-600'}`} />
                <div>
                  <p className={`text-xs font-medium ${inputs.strategy === opt.value ? 'text-[#D4A853]' : 'text-zinc-300'}`}>{opt.label}</p>
                  <p className="text-[10px] text-zinc-500">{opt.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
