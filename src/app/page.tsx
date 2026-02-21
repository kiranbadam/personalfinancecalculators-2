'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const calculators = [
  {
    title: 'Mortgage Calculator',
    description: 'Amortization schedule, payment breakdown, and extra payment analysis',
    href: '/mortgage',
    icon: '\u2302',
    color: '#D4A853',
    features: ['Payment Breakdown', 'Amortization Chart', 'Extra Payment Savings', 'PMI Tracking'],
  },
  {
    title: 'Compound Interest',
    description: 'Visualize investment growth with contribution escalation and inflation',
    href: '/compound',
    icon: '\u25CE',
    color: '#4ADE80',
    features: ['Growth Projections', 'Milestone Tracking', 'Scenario Comparison', 'Tax Drag Analysis'],
  },
  {
    title: 'FIRE Calculator',
    description: 'Financial Independence, Retire Early planning with Monte Carlo simulation',
    href: '/fire',
    icon: '\u25B2',
    color: '#60A5FA',
    features: ['FIRE Number', 'Monte Carlo Sim', 'Coast/Lean/Fat FIRE', 'Social Security'],
  },
  {
    title: 'Options Visualizer',
    description: 'Options strategy P/L diagrams with Black-Scholes Greeks',
    href: '/options',
    icon: '\u25C7',
    color: '#C084FC',
    features: ['11 Strategies', 'Payoff Diagrams', 'Greeks Display', 'Custom Multi-Leg'],
  },
  {
    title: 'Rent vs Buy',
    description: 'Full cost analysis comparing renting (invest the savings) versus buying a home',
    href: '/rent-buy',
    icon: '\u21c4',
    color: '#F97316',
    features: ['Net Worth Chart', 'Break-Even Year', 'Cumulative Costs', 'Year-by-Year Table'],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12 sm:py-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A853]/10 border border-[#D4A853]/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] animate-pulse" />
          <span className="text-xs text-[#D4A853] font-medium">Professional Finance Tools</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          Personal Finance
          <br />
          <span className="gold-text">Calculator Suite</span>
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
          Four powerful calculators for mortgage planning, investment growth,
          retirement planning, and options analysis. All calculations run
          client-side for instant results.
        </p>
      </motion.div>

      {/* Calculator Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto"
      >
        {calculators.map((calc) => (
          <motion.div key={calc.href} variants={item}>
            <Link href={calc.href} className="block group">
              <div className="glass-card rounded-xl p-6 h-full transition-all duration-300 hover:border-[rgba(212,168,83,0.2)] hover:shadow-lg hover:shadow-[#D4A853]/5 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${calc.color}15`, color: calc.color }}
                  >
                    {calc.icon}
                  </div>
                  <svg
                    className="w-4 h-4 text-zinc-600 group-hover:text-[#D4A853] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>

                <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-[#D4A853] transition-colors">
                  {calc.title}
                </h2>
                <p className="text-xs text-zinc-500 mb-4">{calc.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {calc.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center py-12 text-xs text-zinc-600"
      >
        Built with Next.js 15 &middot; Tailwind CSS &middot; Recharts &middot; Framer Motion
      </motion.div>
    </div>
  );
}
