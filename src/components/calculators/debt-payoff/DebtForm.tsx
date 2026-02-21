'use client';

import { DebtPayoffInputs, DebtItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface DebtFormProps {
  inputs: DebtPayoffInputs;
  onUpdate: <K extends keyof DebtPayoffInputs>(key: K, value: DebtPayoffInputs[K]) => void;
  setInputs: (inputs: DebtPayoffInputs) => void;
}

let nextId = 10;

export function DebtForm({ inputs, onUpdate, setInputs }: DebtFormProps) {
  const handleDebtChange = (id: string, field: keyof DebtItem, value: string | number) => {
    const updated = inputs.debts.map((d) => {
      if (d.id !== id) return d;
      if (field === 'name') return { ...d, [field]: value as string };
      const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
      return { ...d, [field]: isNaN(num) ? 0 : num };
    });
    onUpdate('debts', updated);
  };

  const addDebt = () => {
    const id = String(nextId++);
    onUpdate('debts', [
      ...inputs.debts,
      { id, name: `Debt ${inputs.debts.length + 1}`, balance: 1000, interestRate: 10, minimumPayment: 50 },
    ]);
  };

  const removeDebt = (id: string) => {
    if (inputs.debts.length <= 1) return;
    onUpdate('debts', inputs.debts.filter((d) => d.id !== id));
  };

  const handleNumberInput = (value: string): number => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Strategy Toggle */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Payoff Strategy</Label>
        <div className="flex gap-2">
          {(['avalanche', 'snowball'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onUpdate('strategy', s)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                inputs.strategy === s
                  ? 'bg-[#D4A853] text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {s === 'avalanche' ? 'Avalanche' : 'Snowball'}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-zinc-600">
          {inputs.strategy === 'avalanche'
            ? 'Highest interest rate first — minimizes total interest'
            : 'Smallest balance first — faster psychological wins'}
        </p>
      </div>

      {/* Debts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-zinc-400">Your Debts</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addDebt}
            className="text-[10px] h-6 px-2 border-zinc-700 hover:border-[#D4A853]/50 hover:text-[#D4A853]"
          >
            + Add
          </Button>
        </div>

        {inputs.debts.map((debt, i) => (
          <div
            key={debt.id}
            className="space-y-2 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50"
          >
            <div className="flex items-center justify-between">
              <Input
                type="text"
                value={debt.name}
                onChange={(e) => handleDebtChange(debt.id, 'name', e.target.value)}
                className="bg-transparent border-0 p-0 text-white text-sm font-medium focus:ring-0 h-auto"
              />
              {inputs.debts.length > 1 && (
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="text-zinc-600 hover:text-red-400 text-xs ml-2"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-zinc-600">Balance</Label>
                <Input
                  type="text"
                  value={debt.balance ? formatCurrency(debt.balance) : ''}
                  onChange={(e) => handleDebtChange(debt.id, 'balance', e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white text-xs h-7"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-zinc-600">Rate %</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={debt.interestRate}
                  onChange={(e) => handleDebtChange(debt.id, 'interestRate', e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white text-xs h-7"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-zinc-600">Min Pay</Label>
                <Input
                  type="text"
                  value={debt.minimumPayment ? `$${debt.minimumPayment}` : ''}
                  onChange={(e) => handleDebtChange(debt.id, 'minimumPayment', e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white text-xs h-7"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Monthly Payment */}
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Extra Monthly Payment</Label>
        <Input
          type="text"
          value={inputs.extraPayment ? formatCurrency(inputs.extraPayment) : '$0'}
          onChange={(e) => onUpdate('extraPayment', handleNumberInput(e.target.value))}
          className="bg-zinc-900 border-zinc-800 text-white focus:border-[#D4A853]"
        />
        <Slider
          value={[inputs.extraPayment]}
          onValueChange={([v]) => onUpdate('extraPayment', v)}
          min={0}
          max={2000}
          step={25}
        />
      </div>
    </motion.div>
  );
}
