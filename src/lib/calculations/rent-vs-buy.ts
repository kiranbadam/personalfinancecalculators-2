import { RentVsBuyInputs, RentVsBuyResult, RentVsBuyYearEntry } from '@/types';

export function calculateRentVsBuy(inputs: RentVsBuyInputs): RentVsBuyResult {
  const downPayment = inputs.homePrice * inputs.downPaymentPercent / 100;
  const loanAmount = inputs.homePrice - downPayment;
  const closingCosts = inputs.homePrice * inputs.closingCostPercent / 100;
  const initialBuyingCosts = downPayment + closingCosts;

  // Monthly mortgage payment (P&I)
  const monthlyRate = inputs.mortgageRate / 100 / 12;
  const totalMonths = inputs.loanTerm * 12;
  const monthlyMortgage = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanAmount / totalMonths;

  const yearlyData: RentVsBuyYearEntry[] = [];
  let loanBalance = loanAmount;
  let buyCumulativeCost = initialBuyingCosts;
  let rentCumulativeCost = 0;
  let investmentBalance = 0; // renter invests the down payment + closing costs difference
  let currentRent = inputs.monthlyRent;
  let homeValue = inputs.homePrice;

  // Renter invests what they don't spend on down payment/closing costs
  investmentBalance = initialBuyingCosts;

  const monthlyInvestmentReturn = inputs.investmentReturnRate / 100 / 12;

  for (let year = 1; year <= inputs.timeHorizon; year++) {
    const yearlyPropertyTax = homeValue * inputs.propertyTaxRate / 100;
    const yearlyMaintenance = homeValue * inputs.maintenanceRate / 100;
    const yearlyInsurance = inputs.homeInsuranceAnnual;

    // Calculate mortgage payments for the year and track principal/interest
    let yearMortgagePayments = 0;
    let yearInterestPaid = 0;
    for (let m = 0; m < 12; m++) {
      if (loanBalance > 0.01) {
        const interest = loanBalance * monthlyRate;
        const principal = Math.min(monthlyMortgage - interest, loanBalance);
        loanBalance -= principal;
        if (loanBalance < 0.01) loanBalance = 0;
        yearMortgagePayments += monthlyMortgage;
        yearInterestPaid += interest;
      }
    }

    // Buying monthly cost (averaged over the year)
    const yearlyBuyCost = yearMortgagePayments + yearlyPropertyTax + yearlyInsurance + yearlyMaintenance;
    const buyMonthlyCost = yearlyBuyCost / 12;
    buyCumulativeCost += yearlyBuyCost;

    // Tax benefit from mortgage interest deduction (simplified)
    const taxSavings = yearInterestPaid * inputs.marginalTaxRate / 100;
    buyCumulativeCost -= taxSavings;

    // Home appreciates
    homeValue *= (1 + inputs.homeAppreciationRate / 100);
    const homeEquity = homeValue - loanBalance;

    // Selling costs if sold this year
    const sellingCosts = homeValue * inputs.sellingCostPercent / 100;
    const buyNetWorth = homeEquity - sellingCosts;

    // Renting
    const yearlyRentCost = currentRent * 12;
    rentCumulativeCost += yearlyRentCost;

    // Renter invests the difference each month
    for (let m = 0; m < 12; m++) {
      const monthlyBuyCost = yearlyBuyCost / 12 - taxSavings / 12;
      const monthlySavings = monthlyBuyCost - currentRent;
      investmentBalance *= (1 + monthlyInvestmentReturn);
      if (monthlySavings > 0) {
        // Buying costs more, renter invests the difference
        investmentBalance += monthlySavings;
      } else {
        // Renting costs more, reduce investment balance
        investmentBalance += monthlySavings; // negative, reduces balance
        if (investmentBalance < 0) investmentBalance = 0;
      }
    }

    // Rent increases for next year
    currentRent *= (1 + inputs.annualRentIncrease / 100);

    yearlyData.push({
      year,
      homeValue,
      loanBalance,
      homeEquity,
      buyMonthlyCost,
      buyCumulativeCost,
      buyNetWorth,
      monthlyRent: currentRent / (1 + inputs.annualRentIncrease / 100), // current year's rent
      rentCumulativeCost,
      investmentBalance,
      rentNetWorth: investmentBalance,
    });
  }

  // Find break-even year
  let breakEvenYear: number | null = null;
  for (const entry of yearlyData) {
    if (entry.buyNetWorth >= entry.rentNetWorth) {
      breakEvenYear = entry.year;
      break;
    }
  }

  const lastYear = yearlyData[yearlyData.length - 1];

  return {
    yearlyData,
    breakEvenYear,
    buyTotalCost: lastYear?.buyCumulativeCost ?? 0,
    rentTotalCost: lastYear?.rentCumulativeCost ?? 0,
    buyNetWorthFinal: lastYear?.buyNetWorth ?? 0,
    rentNetWorthFinal: lastYear?.rentNetWorth ?? 0,
    netAdvantage: (lastYear?.buyNetWorth ?? 0) - (lastYear?.rentNetWorth ?? 0),
    monthlyMortgagePayment: monthlyMortgage,
    initialBuyingCosts,
  };
}

export function getDefaultRentVsBuyInputs(): RentVsBuyInputs {
  return {
    homePrice: 400000,
    downPaymentPercent: 20,
    mortgageRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1500,
    maintenanceRate: 1.0,
    homeAppreciationRate: 3.5,
    closingCostPercent: 3.0,
    sellingCostPercent: 6.0,
    monthlyRent: 2000,
    annualRentIncrease: 3.0,
    investmentReturnRate: 7.0,
    timeHorizon: 10,
    marginalTaxRate: 22,
    inflationRate: 2.5,
  };
}
