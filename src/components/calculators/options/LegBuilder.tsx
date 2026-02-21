'use client';

import { OptionLeg } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

interface LegBuilderProps {
  legs: OptionLeg[];
  onUpdateLeg: (id: string, updates: Partial<OptionLeg>) => void;
  onAddLeg: () => void;
  onRemoveLeg: (id: string) => void;
  isCustom: boolean;
}

export function LegBuilder({ legs, onUpdateLeg, onAddLeg, onRemoveLeg, isCustom }: LegBuilderProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {legs.map((leg, i) => (
          <motion.div
            key={leg.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card rounded-lg p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Leg {i + 1}</span>
              {isCustom && legs.length > 1 && (
                <button
                  onClick={() => onRemoveLeg(leg.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex gap-1">
                <button
                  onClick={() => onUpdateLeg(leg.id, { type: 'call' })}
                  className={`flex-1 py-1 rounded text-[11px] font-medium ${
                    leg.type === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  Call
                </button>
                <button
                  onClick={() => onUpdateLeg(leg.id, { type: 'put' })}
                  className={`flex-1 py-1 rounded text-[11px] font-medium ${
                    leg.type === 'put' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  Put
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onUpdateLeg(leg.id, { direction: 'buy' })}
                  className={`flex-1 py-1 rounded text-[11px] font-medium ${
                    leg.direction === 'buy' ? 'bg-[#D4A853]/20 text-[#D4A853]' : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => onUpdateLeg(leg.id, { direction: 'sell' })}
                  className={`flex-1 py-1 rounded text-[11px] font-medium ${
                    leg.direction === 'sell' ? 'bg-[#D4A853]/20 text-[#D4A853]' : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-0.5">
                <Label className="text-[10px] text-zinc-500">Strike</Label>
                <Input
                  type="number"
                  value={leg.strikePrice}
                  onChange={(e) => onUpdateLeg(leg.id, { strikePrice: parseFloat(e.target.value) || 0 })}
                  className="bg-zinc-900 border-zinc-800 text-white text-xs h-7"
                />
              </div>
              <div className="space-y-0.5">
                <Label className="text-[10px] text-zinc-500">Premium</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={leg.premium}
                  onChange={(e) => onUpdateLeg(leg.id, { premium: parseFloat(e.target.value) || 0 })}
                  className="bg-zinc-900 border-zinc-800 text-white text-xs h-7"
                />
              </div>
              <div className="space-y-0.5">
                <Label className="text-[10px] text-zinc-500">Qty</Label>
                <Input
                  type="number"
                  value={leg.quantity}
                  onChange={(e) => onUpdateLeg(leg.id, { quantity: parseInt(e.target.value) || 1 })}
                  className="bg-zinc-900 border-zinc-800 text-white text-xs h-7"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isCustom && (
        <button
          onClick={onAddLeg}
          className="w-full py-2 rounded-lg border border-dashed border-zinc-700 text-xs text-zinc-500 hover:text-[#D4A853] hover:border-[#D4A853]/50 transition-colors"
        >
          + Add Leg
        </button>
      )}
    </div>
  );
}
