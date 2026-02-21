import { CompoundInputs, CompoundResult, CompoundYearEntry, CompoundMilestone, CompoundScenario } from '@/types';

export function calculateCompound(inputs: CompoundInputs): CompoundResult {
  const yearlyData = calculateYearlyData(inputs);
  const milestones = findMilestones(yearlyData);
  const scenarios = calculateScenarios(inputs);
  
  const lastYear = yearlyData[yearlyData.length - 1];
  const totalContributed = lastYear?.totalContributions ?? inputs.initialInvestment;
  const finalBalance = lastYear?.balance ?? inputs.initialInvestment;
  const totalEarnings = finalBalance - totalContributed;
  
  return {
    yearlyData,
    totalContributed,
    totalEarnings,
    finalBalance,
    effectiveGrowthMultiple: totalContributed > 0 ? finalBalance / totalContributed : 0,
    milestones,
    scenarios,
    inflationAdjustedFinal: inputs.inflationEnabled ? (lastYear?.inflationAdjustedBalance ?? null) : null,
  };
}

function getPeriodsPerYear(frequency: CompoundInputs['compoundFrequency']): number {
  switch (frequency) {
    case 'daily': return 365;
    case 'monthly': return 12;
    case 'quarterly': return 4;
    case 'annually': return 1;
  }
}

function calculateYearlyData(inputs: CompoundInputs): CompoundYearEntry[] {
  const data: CompoundYearEntry[] = [];
  const periodsPerYear = getPeriodsPerYear(inputs.compoundFrequency);
  const ratePerPeriod = (inputs.annualReturnRate / 100) / periodsPerYear;
  const taxRate = inputs.taxDragEnabled ? inputs.capitalGainsRate / 100 : 0;
  
  let balance = inputs.initialInvestment;
  let taxDragBalance = inputs.initialInvestment;
  let totalContributions = inputs.initialInvestment;
  let monthlyContrib = inputs.monthlyContribution;
  
  for (let year = 1; year <= inputs.timeHorizon; year++) {
    const yearStartBalance = balance;
    const yearStartTaxDrag = taxDragBalance;
    
    // Apply contribution increase at start of each year (after year 1)
    if (year > 1 && inputs.contributionIncreaseRate > 0) {
      monthlyContrib *= (1 + inputs.contributionIncreaseRate / 100);
    }
    
    const yearContributions = monthlyContrib * 12;
    
    // Compound within the year
    for (let period = 0; period < periodsPerYear; period++) {
      // Add proportional contributions for this period
      const periodContribution = yearContributions / periodsPerYear;
      balance += periodContribution;
      taxDragBalance += periodContribution;
      
      // Apply growth
      const growth = balance * ratePerPeriod;
      balance += growth;
      
      const taxDragGrowth = taxDragBalance * ratePerPeriod;
      taxDragBalance += taxDragGrowth * (1 - taxRate);
    }
    
    totalContributions += yearContributions;
    const totalEarnings = balance - totalContributions;
    const yearEarnings = balance - yearStartBalance - yearContributions;
    
    const inflationFactor = inputs.inflationEnabled
      ? Math.pow(1 + inputs.inflationRate / 100, year)
      : null;
    
    data.push({
      year,
      contributions: yearContributions,
      totalContributions,
      earnings: yearEarnings,
      totalEarnings: totalEarnings,
      balance,
      inflationAdjustedBalance: inflationFactor ? balance / inflationFactor : null,
      taxDragBalance: inputs.taxDragEnabled ? taxDragBalance : null,
    });
  }
  
  return data;
}

function findMilestones(data: CompoundYearEntry[]): CompoundMilestone[] {
  const targets = [
    { amount: 100000, label: '$100K' },
    { amount: 250000, label: '$250K' },
    { amount: 500000, label: '$500K' },
    { amount: 1000000, label: '$1M' },
    { amount: 2000000, label: '$2M' },
    { amount: 5000000, label: '$5M' },
  ];
  
  return targets.map(target => {
    const entry = data.find(d => d.balance >= target.amount);
    return {
      amount: target.amount,
      label: target.label,
      year: entry?.year ?? null,
      month: entry ? entry.year * 12 : null, // approximate
    };
  });
}

function calculateScenarios(inputs: CompoundInputs): CompoundScenario[] {
  const rates = [
    { label: 'Conservative (6%)', rate: 6 },
    { label: 'Moderate (8%)', rate: 8 },
    { label: 'Aggressive (10%)', rate: 10 },
  ];
  
  return rates.map(({ label, rate }) => {
    const modified = { ...inputs, annualReturnRate: rate, inflationEnabled: false, taxDragEnabled: false };
    const data = calculateYearlyData(modified);
    const last = data[data.length - 1];
    return {
      label,
      returnRate: rate,
      finalBalance: last?.balance ?? inputs.initialInvestment,
      totalContributions: last?.totalContributions ?? inputs.initialInvestment,
      totalEarnings: (last?.balance ?? 0) - (last?.totalContributions ?? 0),
    };
  });
}

export function getDefaultCompoundInputs(): CompoundInputs {
  return {
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualReturnRate: 8,
    timeHorizon: 30,
    contributionIncreaseRate: 2,
    compoundFrequency: 'monthly',
    taxDragEnabled: false,
    capitalGainsRate: 15,
    inflationEnabled: false,
    inflationRate: 3,
  };
}
