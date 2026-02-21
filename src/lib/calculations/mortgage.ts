import { MortgageInputs, MortgageResult, MortgagePaymentBreakdown, AmortizationEntry } from '@/types';

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const loanAmount = inputs.homePrice - inputs.downPayment;
  const monthlyRate = inputs.interestRate / 100 / 12;
  const totalMonths = inputs.loanTerm * 12;

  // Monthly P&I payment (standard amortization formula)
  const monthlyPI = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanAmount / totalMonths;

  // Monthly costs
  const monthlyPropertyTax = (inputs.homePrice * inputs.propertyTaxRate / 100) / 12;
  const monthlyInsurance = inputs.homeInsuranceAnnual / 12;
  const ltv = loanAmount / inputs.homePrice;
  const monthlyPMI = ltv > 0.8 ? (loanAmount * inputs.pmiRate / 100) / 12 : 0;

  const monthlyPayment: MortgagePaymentBreakdown = {
    principal: 0, // will be first month's principal
    interest: 0, // will be first month's interest
    propertyTax: monthlyPropertyTax,
    homeInsurance: monthlyInsurance,
    pmi: monthlyPMI,
    hoa: inputs.hoaMonthly,
    total: monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI + inputs.hoaMonthly,
  };

  // Build amortization schedule (without extra payments)
  const schedule = buildAmortizationSchedule(loanAmount, monthlyRate, monthlyPI, totalMonths, 0, inputs.homePrice);
  
  // Set first month's P&I breakdown
  if (schedule.length > 0) {
    monthlyPayment.principal = schedule[0].principal;
    monthlyPayment.interest = schedule[0].interest;
  }

  // Build schedule with extra payments if applicable
  let scheduleWithExtra: AmortizationEntry[] | null = null;
  let totalInterestWithExtra: number | null = null;
  let interestSaved: number | null = null;
  let payoffDateWithExtra: Date | null = null;
  let monthsSaved: number | null = null;

  if (inputs.extraMonthlyPayment > 0) {
    scheduleWithExtra = buildAmortizationSchedule(
      loanAmount, monthlyRate, monthlyPI, totalMonths, inputs.extraMonthlyPayment, inputs.homePrice
    );
    const lastEntryExtra = scheduleWithExtra[scheduleWithExtra.length - 1];
    totalInterestWithExtra = lastEntryExtra.totalInterest;
    interestSaved = schedule[schedule.length - 1].totalInterest - totalInterestWithExtra;
    
    const extraPayoffDate = new Date();
    extraPayoffDate.setMonth(extraPayoffDate.getMonth() + scheduleWithExtra.length);
    payoffDateWithExtra = extraPayoffDate;
    monthsSaved = schedule.length - scheduleWithExtra.length;
  }

  const lastEntry = schedule[schedule.length - 1];
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + totalMonths);

  // Find milestones
  const pmiRemovalMonth = findPMIRemovalMonth(schedule);
  const halfEquityMonth = findHalfEquityMonth(schedule);

  return {
    monthlyPayment,
    amortizationSchedule: schedule,
    totalInterest: lastEntry.totalInterest,
    totalCost: lastEntry.totalInterest + loanAmount + (monthlyPropertyTax + monthlyInsurance + monthlyPMI + inputs.hoaMonthly) * totalMonths,
    payoffDate,
    payoffMonths: totalMonths,
    amortizationWithExtra: scheduleWithExtra,
    totalInterestWithExtra,
    interestSaved,
    payoffDateWithExtra,
    monthsSaved,
    pmiRemovalMonth,
    halfEquityMonth,
  };
}

function buildAmortizationSchedule(
  loanAmount: number,
  monthlyRate: number,
  monthlyPayment: number,
  maxMonths: number,
  extraPayment: number,
  homePrice: number
): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  let balance = loanAmount;
  let totalInterest = 0;
  let totalPrincipal = 0;

  for (let month = 1; month <= maxMonths && balance > 0.01; month++) {
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    let extra = Math.min(extraPayment, balance - principalPayment);
    if (extra < 0) extra = 0;
    
    // Handle final payment
    if (principalPayment + extra > balance) {
      principalPayment = balance;
      extra = 0;
    }

    balance -= (principalPayment + extra);
    if (balance < 0.01) balance = 0;
    
    totalInterest += interestPayment;
    totalPrincipal += principalPayment + extra;

    const equity = homePrice - balance;
    const equityPercent = (equity / homePrice) * 100;

    schedule.push({
      month,
      year: Math.ceil(month / 12),
      payment: monthlyPayment + extra,
      principal: principalPayment,
      interest: interestPayment,
      extraPayment: extra,
      balance,
      totalInterest,
      totalPrincipal,
      equity,
      equityPercent,
    });
  }

  return schedule;
}

function findPMIRemovalMonth(schedule: AmortizationEntry[]): number | null {
  for (const entry of schedule) {
    if (entry.equityPercent >= 20) return entry.month;
  }
  return null;
}

function findHalfEquityMonth(schedule: AmortizationEntry[]): number | null {
  for (const entry of schedule) {
    if (entry.equityPercent >= 50) return entry.month;
  }
  return null;
}

export function getDefaultMortgageInputs(): MortgageInputs {
  return {
    homePrice: 400000,
    downPayment: 80000,
    downPaymentPercent: 20,
    loanTerm: 30,
    interestRate: 6.5,
    propertyTaxRate: 1.2,
    pmiRate: 0.5,
    hoaMonthly: 0,
    homeInsuranceAnnual: 1500,
    extraMonthlyPayment: 0,
  };
}
