import { FireInputs, FireResult, FireYearEntry } from '@/types';

export function calculateFire(inputs: FireInputs): FireResult {
  const annualSpending = inputs.annualSpendingInRetirement;
  const fireNumber = annualSpending * 25; // 4% rule
  const leanFireNumber = (annualSpending * 0.7) * 25;
  const fatFireNumber = (annualSpending * 1.5) * 25;
  
  const annualSavings = inputs.annualIncome * (inputs.savingsRate / 100);
  const yearlyProjection = buildProjection(inputs);
  
  // Find years to FIRE
  const fireEntry = yearlyProjection.find(e => e.savings >= fireNumber && e.phase === 'accumulation');
  const yearsToFire = fireEntry ? fireEntry.age - inputs.currentAge : inputs.retirementAge - inputs.currentAge;
  
  // Coast FIRE: how much you need now so that growth alone reaches FIRE number by retirement age
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const coastFireNumber = fireNumber / Math.pow(1 + inputs.expectedReturnPreRetirement / 100, yearsToRetirement);
  
  // Coast FIRE Age: when your savings can coast to FIRE number
  let coastFireAge: number | null = null;
  for (const entry of yearlyProjection) {
    if (entry.phase === 'accumulation') {
      const yearsLeft = inputs.retirementAge - entry.age;
      const futureValue = entry.savings * Math.pow(1 + inputs.expectedReturnPreRetirement / 100, yearsLeft);
      if (futureValue >= fireNumber) {
        coastFireAge = entry.age;
        break;
      }
    }
  }
  
  // Required savings rate to hit FIRE number by target retirement age
  // Using future value of annuity formula
  const r = inputs.expectedReturnPreRetirement / 100;
  const n = yearsToRetirement;
  const fvFactor = r > 0 ? ((Math.pow(1 + r, n) - 1) / r) : n;
  const fvCurrentSavings = inputs.currentSavings * Math.pow(1 + r, n);
  const neededFromSavings = fireNumber - fvCurrentSavings;
  const requiredAnnualSavings = neededFromSavings > 0 ? neededFromSavings / fvFactor : 0;
  const requiredSavingsRate = inputs.annualIncome > 0 
    ? Math.min((requiredAnnualSavings / inputs.annualIncome) * 100, 100)
    : 0;
  
  // Barista FIRE: FIRE number assuming part-time income covers half of expenses
  const baristaFireNumber = (annualSpending * 0.5) * 25;
  
  return {
    fireNumber,
    yearlyProjection,
    yearsToFire,
    requiredSavingsRate: Math.max(0, requiredSavingsRate),
    coastFireNumber,
    coastFireAge,
    leanFireNumber,
    fatFireNumber,
    baristaFireNumber,
    successRate: null,
    monteCarlo: null,
  };
}

function buildProjection(inputs: FireInputs): FireYearEntry[] {
  const projection: FireYearEntry[] = [];
  let savings = inputs.currentSavings;
  const annualSavings = inputs.annualIncome * (inputs.savingsRate / 100);
  
  for (let age = inputs.currentAge; age <= inputs.lifeExpectancy; age++) {
    const year = age - inputs.currentAge;
    const isRetired = age >= inputs.retirementAge;
    const phase = isRetired ? 'retirement' : 'accumulation';
    
    let contributions = 0;
    let withdrawals = 0;
    let socialSecurity = 0;
    let investmentReturn = 0;
    
    if (!isRetired) {
      // Accumulation phase
      contributions = annualSavings;
      investmentReturn = savings * (inputs.expectedReturnPreRetirement / 100);
      savings += contributions + investmentReturn;
    } else {
      // Retirement phase
      const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, age - inputs.retirementAge);
      const adjustedSpending = inputs.annualSpendingInRetirement * inflationFactor;
      
      // Social Security
      if (age >= inputs.socialSecurityStartAge) {
        socialSecurity = inputs.socialSecurityMonthly * 12;
      }
      
      // Net withdrawal needed
      const grossWithdrawal = adjustedSpending / (1 - inputs.taxRateInRetirement / 100);
      withdrawals = Math.max(0, grossWithdrawal - socialSecurity);
      
      investmentReturn = savings * (inputs.expectedReturnPostRetirement / 100);
      savings += investmentReturn - withdrawals;
    }
    
    projection.push({
      age,
      year,
      savings: Math.max(0, savings),
      contributions,
      investment: investmentReturn,
      withdrawals,
      socialSecurity,
      phase,
    });
    
    if (savings <= 0 && isRetired) {
      // Money ran out — fill remaining years with 0
      for (let a = age + 1; a <= inputs.lifeExpectancy; a++) {
        projection.push({
          age: a,
          year: a - inputs.currentAge,
          savings: 0,
          contributions: 0,
          investment: 0,
          withdrawals: 0,
          socialSecurity: a >= inputs.socialSecurityStartAge ? inputs.socialSecurityMonthly * 12 : 0,
          phase: 'retirement',
        });
      }
      break;
    }
  }
  
  return projection;
}

export function runMonteCarloSimulation(
  inputs: FireInputs,
  numSimulations: number = 1000
): { percentiles: { p10: number[]; p25: number[]; p50: number[]; p75: number[]; p90: number[] }; successRate: number; ages: number[] } {
  const ages: number[] = [];
  for (let age = inputs.currentAge; age <= inputs.lifeExpectancy; age++) {
    ages.push(age);
  }
  
  const allSimulations: number[][] = [];
  let successes = 0;
  
  const annualSavings = inputs.annualIncome * (inputs.savingsRate / 100);
  const meanReturn = inputs.expectedReturnPreRetirement / 100;
  const postRetirementMeanReturn = inputs.expectedReturnPostRetirement / 100;
  const volatility = 0.15; // ~15% standard deviation (typical stock market)
  
  for (let sim = 0; sim < numSimulations; sim++) {
    const path: number[] = [];
    let savings = inputs.currentSavings;
    let ranOut = false;
    
    for (let age = inputs.currentAge; age <= inputs.lifeExpectancy; age++) {
      const isRetired = age >= inputs.retirementAge;
      
      // Random return using Box-Muller transform
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const mean = isRetired ? postRetirementMeanReturn : meanReturn;
      const randomReturn = mean + volatility * z;
      
      if (!isRetired) {
        savings += annualSavings;
        savings *= (1 + randomReturn);
      } else {
        const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, age - inputs.retirementAge);
        const adjustedSpending = inputs.annualSpendingInRetirement * inflationFactor;
        let socialSecurity = 0;
        if (age >= inputs.socialSecurityStartAge) {
          socialSecurity = inputs.socialSecurityMonthly * 12;
        }
        const grossWithdrawal = adjustedSpending / (1 - inputs.taxRateInRetirement / 100);
        const netWithdrawal = Math.max(0, grossWithdrawal - socialSecurity);
        
        savings *= (1 + randomReturn);
        savings -= netWithdrawal;
      }
      
      path.push(Math.max(0, savings));
    }
    
    allSimulations.push(path);
    
    // Success = money lasts until life expectancy
    if (path[path.length - 1] > 0) {
      successes++;
    }
  }
  
  // Calculate percentiles
  const percentiles = {
    p10: [] as number[],
    p25: [] as number[],
    p50: [] as number[],
    p75: [] as number[],
    p90: [] as number[],
  };
  
  for (let i = 0; i < ages.length; i++) {
    const values = allSimulations.map(sim => sim[i]).sort((a, b) => a - b);
    percentiles.p10.push(values[Math.floor(numSimulations * 0.1)]);
    percentiles.p25.push(values[Math.floor(numSimulations * 0.25)]);
    percentiles.p50.push(values[Math.floor(numSimulations * 0.5)]);
    percentiles.p75.push(values[Math.floor(numSimulations * 0.75)]);
    percentiles.p90.push(values[Math.floor(numSimulations * 0.9)]);
  }
  
  return {
    percentiles,
    successRate: (successes / numSimulations) * 100,
    ages,
  };
}

export function getDefaultFireInputs(): FireInputs {
  return {
    currentAge: 30,
    retirementAge: 55,
    lifeExpectancy: 90,
    currentSavings: 50000,
    annualIncome: 100000,
    savingsRate: 30,
    expectedReturnPreRetirement: 8,
    expectedReturnPostRetirement: 5,
    annualSpendingInRetirement: 50000,
    socialSecurityMonthly: 2000,
    socialSecurityStartAge: 67,
    inflationRate: 3,
    taxRateInRetirement: 20,
  };
}
