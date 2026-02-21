'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: '◆',
    description: 'Dashboard',
  },
  {
    label: 'Mortgage',
    href: '/mortgage',
    icon: '⌂',
    description: 'Amortization',
  },
  {
    label: 'Compound',
    href: '/compound',
    icon: '◎',
    description: 'Interest Growth',
  },
  {
    label: 'FIRE',
    href: '/fire',
    icon: '▲',
    description: 'Retirement',
  },
  {
    label: 'Options',
    href: '/options',
    icon: '◇',
    description: 'P/L Visualizer',
  },
  {
    label: 'Debt Payoff',
    href: '/debt-payoff',
    icon: '↓',
    description: 'Payoff Strategies',
  },
  {
    label: 'Rent vs Buy',
    href: '/rent-vs-buy',
    icon: '⇌',
    description: 'Home Decision',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-zinc-950 border-r border-zinc-800/50 z-50">
      <div className="p-6 border-b border-zinc-800/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A853] to-[#B8912F] flex items-center justify-center text-zinc-950 font-bold text-sm">
            FC
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">FinCalc</h1>
            <p className="text-[10px] text-zinc-500 tracking-wider uppercase">Finance Suite</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'text-[#D4A853]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-lg"
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                />
              )}
              <span className="relative text-base">{item.icon}</span>
              <div className="relative">
                <span className="font-medium">{item.label}</span>
                <span className="block text-[10px] text-zinc-500">{item.description}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800/50">
        <p className="text-[10px] text-zinc-600 text-center">
          Built with Next.js 15
        </p>
      </div>
    </aside>
  );
}
