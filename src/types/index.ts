// Mortgage types
export interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTerm: number; // years: 15, 20, 30
  interestRate: number; // annual percentage
  propertyTaxRate: number;
  pmiRate: number;
  hoaMonthly: number;
  homeInsuranceAnnual: number;
  extraMonthlyPayment: number;
}

export interface MortgagePaymentBreakdown {
  principal: number;
  interest: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoa: number;
  total: number;
}

export interface AmortizationEntry {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  balance: number;
  totalInterest: number;
  totalPrincipal: number;
  equity: number;
  equityPercent: number;
}

export interface MortgageResult {
  monthlyPayment: MortgagePaymentBreakdown;
  amortizationSchedule: AmortizationEntry[];
  totalInterest: number;
  totalCost: number;
  payoffDate: Date;
  payoffMonths: number;
  // With extra payments
  amortizationWithExtra: AmortizationEntry[] | null;
  totalInterestWithExtra: number | null;
  interestSaved: number | null;
  payoffDateWithExtra: Date | null;
  monthsSaved: number | null;
  // Milestones
  pmiRemovalMonth: number | null; // when LTV reaches 80%
  halfEquityMonth: number | null; // when equity reaches 50%
}

// Compound interest types
export interface CompoundInputs {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturnRate: number;
  timeHorizon: number; // years
  contributionIncreaseRate: number; // annual %
  compoundFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  taxDragEnabled: boolean;
  capitalGainsRate: number;
  inflationEnabled: boolean;
  inflationRate: number;
}

export interface CompoundYearEntry {
  year: number;
  contributions: number;
  totalContributions: number;
  earnings: number;
  totalEarnings: number;
  balance: number;
  inflationAdjustedBalance: number | null;
  taxDragBalance: number | null;
}

export interface CompoundMilestone {
  amount: number;
  label: string;
  year: number | null;
  month: number | null;
}

export interface CompoundScenario {
  label: string;
  returnRate: number;
  finalBalance: number;
  totalContributions: number;
  totalEarnings: number;
}

export interface CompoundResult {
  yearlyData: CompoundYearEntry[];
  totalContributed: number;
  totalEarnings: number;
  finalBalance: number;
  effectiveGrowthMultiple: number;
  milestones: CompoundMilestone[];
  scenarios: CompoundScenario[];
  inflationAdjustedFinal: number | null;
}

// FIRE types
export interface FireInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  annualIncome: number;
  savingsRate: number; // percentage
  expectedReturnPreRetirement: number;
  expectedReturnPostRetirement: number;
  annualSpendingInRetirement: number;
  socialSecurityMonthly: number;
  socialSecurityStartAge: number;
  inflationRate: number;
  taxRateInRetirement: number;
}

export interface FireYearEntry {
  age: number;
  year: number;
  savings: number;
  contributions: number;
  investment: number;
  withdrawals: number;
  socialSecurity: number;
  phase: 'accumulation' | 'retirement';
}

export interface MonteCarloResult {
  simulations: number[][];
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  successRate: number;
  ages: number[];
}

export interface FireResult {
  fireNumber: number;
  yearlyProjection: FireYearEntry[];
  yearsToFire: number;
  requiredSavingsRate: number;
  coastFireNumber: number;
  coastFireAge: number | null;
  leanFireNumber: number;
  fatFireNumber: number;
  baristaFireNumber: number;
  successRate: number | null;
  monteCarlo: MonteCarloResult | null;
}

// Options types
export type OptionType = 'call' | 'put';
export type OptionDirection = 'buy' | 'sell';

export interface OptionLeg {
  id: string;
  type: OptionType;
  direction: OptionDirection;
  strikePrice: number;
  premium: number;
  quantity: number;
  expirationDate: string;
}

export type OptionStrategy =
  | 'long-call'
  | 'long-put'
  | 'covered-call'
  | 'cash-secured-put'
  | 'bull-call-spread'
  | 'bear-put-spread'
  | 'iron-condor'
  | 'straddle'
  | 'strangle'
  | 'butterfly'
  | 'custom';

export interface OptionsInputs {
  strategy: OptionStrategy;
  legs: OptionLeg[];
  currentPrice: number;
  impliedVolatility: number | null;
  riskFreeRate: number;
  daysToExpiration: number;
}

export interface PayoffPoint {
  price: number;
  profit: number;
  profitPercent: number;
}

export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface OptionsResult {
  payoffData: PayoffPoint[];
  maxProfit: number | null; // null means unlimited
  maxLoss: number | null; // null means unlimited
  breakevens: number[];
  riskRewardRatio: number | null;
  capitalRequired: number;
  greeks: Greeks | null;
  probabilityOfProfit: number | null;
  plSurface: { price: number; dte: number; pl: number }[] | null;
}

// Rent vs Buy types
export interface RentBuyInputs {
  homePrice: number;
  downPayment: number;
  mortgageRate: number;
  loanTerm: number;
  monthlyRent: number;
  timeHorizon: number;
  // Advanced options
  homeAppreciation: number;
  rentIncreaseRate: number;
  investmentReturnRate: number;
  propertyTaxRate: number;
  maintenanceRate: number;
  buyingClosingCostRate: number;
  sellingClosingCostRate: number;
  marginalTaxRate: number;
  annualInsurance: number;
}

export interface RentBuyYearEntry {
  year: number;
  // Buy scenario
  homeValue: number;
  mortgageBalance: number;
  equity: number;
  buyNetWorth: number;
  cumulativeBuyCosts: number;
  // Rent scenario
  monthlyRent: number;
  investmentPortfolio: number;
  rentNetWorth: number;
  cumulativeRentCosts: number;
  // Comparison
  advantage: 'buy' | 'rent' | 'equal';
  advantageAmount: number;
}

export interface RentBuyResult {
  yearlyData: RentBuyYearEntry[];
  breakEvenYear: number | null;
  finalBuyNetWorth: number;
  finalRentNetWorth: number;
  winner: 'buy' | 'rent' | 'equal';
  winnerAdvantage: number;
  monthlyMortgagePayment: number;
  initialMonthlyCostDiff: number;
}

// Chart types
export interface ChartTheme {
  gold: string;
  green: string;
  red: string;
  blue: string;
  purple: string;
  muted: string;
  grid: string;
  text: string;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description: string;
}

// Debt Payoff types
export type PayoffStrategy = 'avalanche' | 'snowball' | 'custom';

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export interface DebtPayoffInputs {
  debts: Debt[];
  extraMonthlyPayment: number;
  strategy: PayoffStrategy;
}

export interface DebtMonthEntry {
  month: number;
  debtId: string;
  balance: number;
  payment: number;
  interest: number;
  principal: number;
}

export interface DebtPayoffSummary {
  debtId: string;
  name: string;
  originalBalance: number;
  totalInterestPaid: number;
  payoffMonth: number;
  payoffDate: Date;
}

export interface DebtPayoffMonthlySnapshot {
  month: number;
  totalBalance: number;
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  debtsRemaining: number;
}

export interface DebtPayoffResult {
  strategy: PayoffStrategy;
  monthlySnapshots: DebtPayoffMonthlySnapshot[];
  debtSummaries: DebtPayoffSummary[];
  totalMonths: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  payoffDate: Date;
  minimumOnlyMonths: number;
  minimumOnlyInterest: number;
  interestSaved: number;
  monthsSaved: number;
}
