import {
  DebtPayoffInputs,
  DebtPayoffResult,
  DebtPayoffStrategyResult,
  DebtPayoffMonthEntry,
  DebtItem,
} from '@/types';

function runStrategy(
  debts: DebtItem[],
  extraPayment: number,
  strategy: 'avalanche' | 'snowball'
): DebtPayoffStrategyResult {
  // Sort debts by strategy
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'avalanche') return b.interestRate - a.interestRate; // highest rate first
    return a.balance - b.balance; // lowest balance first
  });

  const balances: Record<string, number> = {};
  for (const d of sortedDebts) {
    balances[d.id] = d.balance;
  }

  const schedule: DebtPayoffMonthEntry[] = [];
  const debtPayoffOrder: { id: string; name: string; payoffMonth: number }[] = [];
  let totalInterestPaid = 0;
  let totalPaid = 0;
  const paidOff = new Set<string>();

  const MAX_MONTHS = 600; // 50 years cap

  for (let month = 1; month <= MAX_MONTHS; month++) {
    const totalBalance = Object.values(balances).reduce((s, b) => s + b, 0);
    if (totalBalance < 0.01) break;

    let monthInterest = 0;
    let monthPayment = 0;
    let remainingExtra = extraPayment;

    // Apply minimum payments and accumulate interest
    for (const debt of sortedDebts) {
      if (paidOff.has(debt.id)) continue;

      const monthlyRate = debt.interestRate / 100 / 12;
      const interest = balances[debt.id] * monthlyRate;
      monthInterest += interest;

      let payment = Math.min(debt.minimumPayment, balances[debt.id] + interest);
      balances[debt.id] = balances[debt.id] + interest - payment;
      monthPayment += payment;

      if (balances[debt.id] < 0.01) {
        // Freed-up minimum payment becomes extra for next debts
        remainingExtra += debt.minimumPayment - payment;
        balances[debt.id] = 0;
        paidOff.add(debt.id);
        debtPayoffOrder.push({ id: debt.id, name: debt.name, payoffMonth: month });
      }
    }

    // Apply extra payment to target debt (first non-paid-off in sorted order)
    for (const debt of sortedDebts) {
      if (paidOff.has(debt.id) || remainingExtra <= 0) continue;

      const extra = Math.min(remainingExtra, balances[debt.id]);
      balances[debt.id] -= extra;
      monthPayment += extra;
      remainingExtra -= extra;

      if (balances[debt.id] < 0.01) {
        remainingExtra += balances[debt.id]; // rounding
        balances[debt.id] = 0;
        paidOff.add(debt.id);
        debtPayoffOrder.push({ id: debt.id, name: debt.name, payoffMonth: month });
      }
    }

    totalInterestPaid += monthInterest;
    totalPaid += monthPayment;

    schedule.push({
      month,
      totalBalance: Object.values(balances).reduce((s, b) => s + b, 0),
      totalPayment: monthPayment,
      totalInterest: totalInterestPaid,
      debtBalances: { ...balances },
    });

    if (Object.values(balances).every((b) => b < 0.01)) break;
  }

  return {
    strategy,
    schedule,
    totalInterestPaid,
    totalPaid,
    payoffMonths: schedule.length,
    debtPayoffOrder,
  };
}

export function calculateDebtPayoff(inputs: DebtPayoffInputs): DebtPayoffResult {
  const validDebts = inputs.debts.filter((d) => d.balance > 0);

  if (validDebts.length === 0) {
    const emptyStrategy: DebtPayoffStrategyResult = {
      strategy: 'avalanche',
      schedule: [],
      totalInterestPaid: 0,
      totalPaid: 0,
      payoffMonths: 0,
      debtPayoffOrder: [],
    };
    return {
      avalanche: emptyStrategy,
      snowball: { ...emptyStrategy, strategy: 'snowball' },
      interestSaved: 0,
      monthsSaved: 0,
      totalDebt: 0,
      totalMinimumPayments: 0,
    };
  }

  const avalanche = runStrategy(validDebts, inputs.extraPayment, 'avalanche');
  const snowball = runStrategy(validDebts, inputs.extraPayment, 'snowball');

  const totalDebt = validDebts.reduce((s, d) => s + d.balance, 0);
  const totalMinimumPayments = validDebts.reduce((s, d) => s + d.minimumPayment, 0);

  return {
    avalanche,
    snowball,
    interestSaved: snowball.totalInterestPaid - avalanche.totalInterestPaid,
    monthsSaved: snowball.payoffMonths - avalanche.payoffMonths,
    totalDebt,
    totalMinimumPayments,
  };
}

export function getDefaultDebtPayoffInputs(): DebtPayoffInputs {
  return {
    debts: [
      { id: '1', name: 'Credit Card', balance: 5000, interestRate: 22.99, minimumPayment: 150 },
      { id: '2', name: 'Car Loan', balance: 15000, interestRate: 6.5, minimumPayment: 350 },
      { id: '3', name: 'Student Loan', balance: 25000, interestRate: 5.0, minimumPayment: 280 },
    ],
    extraPayment: 200,
    strategy: 'avalanche',
  };
}
