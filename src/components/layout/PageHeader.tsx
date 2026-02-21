'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description: string;
  onReset?: () => void;
  onShare?: () => void;
}

export function PageHeader({ title, description, onReset, onShare }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-sm text-zinc-400 mt-1">{description}</p>
      </div>
      <div className="flex gap-2 no-print">
        {onShare && (
          <Button variant="outline" size="sm" onClick={onShare} className="text-xs border-zinc-700 hover:border-[#D4A853]/50 hover:text-[#D4A853]">
            Share
          </Button>
        )}
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset} className="text-xs border-zinc-700 hover:border-red-500/50 hover:text-red-400">
            Reset
          </Button>
        )}
      </div>
    </motion.div>
  );
}
