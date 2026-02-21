'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', href: '/', icon: '◆' },
  { label: 'Mortgage', href: '/mortgage', icon: '⌂' },
  { label: 'Compound', href: '/compound', icon: '◎' },
  { label: 'FIRE', href: '/fire', icon: '▲' },
  { label: 'Options', href: '/options', icon: '◇' },
  { label: 'Debt', href: '/debt-payoff', icon: '↓' },
  { label: 'Rent/Buy', href: '/rent-vs-buy', icon: '⇌' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#D4A853] rounded-full"
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                />
              )}
              <span className={`text-lg ${isActive ? 'text-[#D4A853]' : 'text-zinc-500'}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] ${isActive ? 'text-[#D4A853]' : 'text-zinc-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
