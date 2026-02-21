'use client';

import { useCallback, useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FireForm } from '@/components/calculators/fire/FireForm';
import { ProjectionChart } from '@/components/calculators/fire/ProjectionChart';
import { MonteCarloChart } from '@/components/calculators/fire/MonteCarloChart';
import { FireDashboard } from '@/components/calculators/fire/FireDashboard';
import { useCalculator } from '@/hooks/useCalculator';
import { calculateFire, getDefaultFireInputs, runMonteCarloSimulation } from '@/lib/calculations/fire';
import { motion } from 'framer-motion';

export default function FirePage() {
  const calculate = useCallback(calculateFire, []);
  const { inputs, updateInput, result, reset } = useCalculator(
    getDefaultFireInputs(),
    calculate
  );

  const [showMonteCarlo, setShowMonteCarlo] = useState(false);
  
  const monteCarloResult = useMemo(() => {
    if (!showMonteCarlo) return null;
    return runMonteCarloSimulation(inputs, 1000);
  }, [showMonteCarlo, inputs]);

  const handleShare = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    const url = `${window.location.origin}/fire?${params.toString()}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div>
      <PageHeader
        title="FIRE Calculator"
        description="Financial Independence, Retire Early planning"
        onReset={reset}
        onShare={handleShare}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="glass-card rounded-xl p-5">
            <FireForm inputs={inputs} onUpdate={updateInput} />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <FireDashboard result={result} />

          <ProjectionChart
            data={result.yearlyProjection}
            fireNumber={result.fireNumber}
            leanFireNumber={result.leanFireNumber}
            fatFireNumber={result.fatFireNumber}
            coastFireNumber={result.coastFireNumber}
            retirementAge={inputs.retirementAge}
          />

          {/* Monte Carlo Toggle */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Monte Carlo Simulation</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Run 1,000 simulations with randomized returns</p>
              </div>
              <button
                onClick={() => setShowMonteCarlo(!showMonteCarlo)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  showMonteCarlo
                    ? 'bg-[#D4A853] text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {showMonteCarlo ? 'Running' : 'Run Simulation'}
              </button>
            </div>
          </div>

          {monteCarloResult && (
            <MonteCarloChart
              percentiles={monteCarloResult.percentiles}
              ages={monteCarloResult.ages}
              successRate={monteCarloResult.successRate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
