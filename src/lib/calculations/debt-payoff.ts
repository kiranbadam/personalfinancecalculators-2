import {
  Debt,
  DebtPayoffInputs,
  DebtPayoffResult,
  DebtPayoffMonthlySnapshot,
  DebtPayoffSummary,
  PayoffStrategy,
} from '@/types';

function simulatePayoff(
  debts: Debt[],
  extraMonthlyPayment: number,
  strategy: PayoffStrategy
): { snapshots: DebtPayoffMonthlySnapshot[]; summaries: DebtPayoffSummary[]; totalInterest: number; totalMonths: number } {
  const balances = debts.map((d) => ({ ...d, remainingBalance: d.balance, totalInterestPaid: 0, paidOff: false, payoffMonth: 0 }));
  const snapshots: DebtPayoffMonthlySnapshot[] = [];
  let month = 0;
  const MAX_MONTHS = 600;

  while (balances.some((b) => !b.paidOff) && month < MAX_MONTHS) {
    month++;

    for (const debt of balances) {
      if (debt.paidOff) continue;
      const monthlyRate = debt.interestRate / 100 / 12;
      const interest = debt.remainingBalance * monthlyRate;
      debt.totalInterestPaid += interest;
      debt.remainingBalance += interest;
    }

    const activeDebts = balances.filter((b) => !b.paidOff);
    const totalMinimum = activeDebts.reduce((sum, d) => sum + Math.min(d.minimumPayment, d.remainingBalance), 0);
    let extraBudget = extraMonthlyPayment;

    let priorityDebt: typeof balances[0] | null = null;
    if (strategy === 'avalanche') {
      priorityDebt = activeDebts.reduce((best, d) => (d.interestRate > best.interestRate ? d : best), activeDebts[0]);
    } else if (strategy === 'snowball') {
      priorityDebt = activeDebts.reduce((best, d) => (d.remainingBalance < best.remainingBalance ? d : best), activeDebts[0]);
    }

    let totalPayment = 0;
    let totalInterestThisMonth = 0;
    let totalPrincipalThisMonth = 0;

    for (const debt of activeDebts) {
      const minPay = Math.min(debt.minimumPayment, debt.remainingBalance);
      let payment = minPay;

      if (priorityDebt && debt.id === priorityDebt.id && extraBudget > 0) {
        payment += extraBudget;
        extraBudget = 0;
      }

      const actualPayment = Math.min(payment, debt.remainingBalance);
      const monthlyRate = debt.interestRate / 100 / 12;
      const interestPortion = debt.remainingBalance / (1 + monthlyRate) * monthlyRate;
      const principalPortion = actualPayment - Math.min(interestPortion, actualPayment);

      totalPayment += actualPayment;
      totalInterestThisMonth += Math.min(interestPortion, actualPayment);
      totalPrincipalThisMonth += Math.max(0, principalPortion);

      debt.remainingBalance -= actualPayment;

      if (debt.remainingBalance <= 0.01) {
        debt.remainingBalance = 0;
        if (!debt.paidOff) {
          debt.paidOff = true;
          debt.payoffMonth = month;
          extraBudget += debt.minimumPayment;
        }
      }
    }

    const totalBalance = balances.reduce((sum, d) => sum + d.remainingBalance, 0);

    snapshots.push({
      month,
      totalBalance,
      totalPayment,
      totalInterest: totalInterestThisMonth,
      totalPrincipal: totalPrincipalThisMonth,
      debtsRemaining: balances.filter((b) => !b.paidOff).length,
    });
  }

  const summaries: DebtPayoffSummary[] = balances.map((b) => {
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + b.payoffMonth);
    return {
      debtId: b.id,
      name: b.name,
      originalBalance: b.balance,
      totalInterestPaid: b.totalInterestPaid,
      payoffMonth: b.payoffMonth,
      payoffDate,
    };
  });

  const totalInterest = balances.reduce((sum, b) => sum + b.totalInterestPaid, 0);

  return { snapshots, summaries, totalInterest, totalMonths: month };
}

export function calculateDebtPayoff(inputs: DebtPayoffInputs): DebtPayoffResult {
  const { debts, extraMonthlyPayment, strategy } = inputs;

  if (debts.length === 0) {
    const now = new Date();
    return {
      strategy,
      monthlySnapshots: [],
      debtSummaries: [],
      totalMonths: 0,
      totalInterestPaid: 0,
      totalAmountPaid: 0,
      payoffDate: now,
      minimumOnlyMonths: 0,
      minimumOnlyInterest: 0,
      interestSaved: 0,
      monthsSaved: 0,
    };
  }

  const { snapshots, summaries, totalInterest, totalMonths } = simulatePayoff(debts, extraMonthlyPayment, strategy);

  const { totalInterest: minInterest, totalMonths: minMonths } = simulatePayoff(debts, 0, strategy);

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + totalMonths);

  const totalOriginalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalAmountPaid = totalOriginalBalance + totalInterest;

  return {
    strategy,
    monthlySnapshots: snapshots,
    debtSummaries: summaries,
    totalMonths,
    totalInterestPaid: totalInterest,
    totalAmountPaid,
    payoffDate,
    minimumOnlyMonths: minMonths,
    minimumOnlyInterest: minInterest,
    interestSaved: minInterest - totalInterest,
    monthsSaved: minMonths - totalMonths,
  };
}

export function getDefaultDebtPayoffInputs(): DebtPayoffInputs {
  return {
    debts: [
      { id: '1', name: 'Credit Card A', balance: 5000, interestRate: 22.99, minimumPayment: 100 },
      { id: '2', name: 'Car Loan', balance: 12000, interestRate: 6.5, minimumPayment: 250 },
      { id: '3', name: 'Student Loan', balance: 20000, interestRate: 4.5, minimumPayment: 200 },
    ],
    extraMonthlyPayment: 200,
    strategy: 'avalanche',
  };
}
