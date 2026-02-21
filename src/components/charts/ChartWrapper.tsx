'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ChartWrapperProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartWrapper({ title, subtitle, children, className = '' }: ChartWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`glass-card rounded-xl p-4 sm:p-6 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
          {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
