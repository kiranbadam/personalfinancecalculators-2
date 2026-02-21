import { RentBuyInputs, RentBuyResult, RentBuyYearEntry } from '@/types';

export function calculateRentBuy(inputs: RentBuyInputs): RentBuyResult {
  const {
    homePrice,
    downPayment,
    mortgageRate,
    loanTerm,
    monthlyRent,
    timeHorizon,
    homeAppreciation,
    rentIncreaseRate,
    investmentReturnRate,
    propertyTaxRate,
    maintenanceRate,
    buyingClosingCostRate,
    sellingClosingCostRate,
    marginalTaxRate,
    annualInsurance,
  } = inputs;

  const loanAmount = homePrice - downPayment;
  const monthlyMortgageRate = mortgageRate / 100 / 12;
  const totalMortgageMonths = loanTerm * 12;

  const monthlyMortgagePayment =
    monthlyMortgageRate > 0
      ? (loanAmount * monthlyMortgageRate * Math.pow(1 + monthlyMortgageRate, totalMortgageMonths)) /
        (Math.pow(1 + monthlyMortgageRate, totalMortgageMonths) - 1)
      : loanAmount / totalMortgageMonths;

  const buyingClosingCosts = homePrice * (buyingClosingCostRate / 100);

  // Monthly investment return rate
  const monthlyInvestReturnRate = investmentReturnRate / 100 / 12;

  // Renter starts with down payment + closing costs invested
  let rentInvestmentPortfolio = downPayment + buyingClosingCosts;
  let currentMonthlyRent = monthlyRent;

  // Buyer starts with home + closing costs paid
  let mortgageBalance = loanAmount;
  let homeValue = homePrice;
  let cumulativeBuyCosts = downPayment + buyingClosingCosts;
  let cumulativeRentCosts = 0;

  const monthlyAppreciationRate = homeAppreciation / 100 / 12;
  const monthlyRentIncreaseRate = rentIncreaseRate / 100 / 12;
  const monthlyMaintenanceRate = maintenanceRate / 100 / 12;
  const monthlyPropertyTaxRate = propertyTaxRate / 100 / 12;
  const monthlyInsurance = annualInsurance / 12;

  const yearlyData: RentBuyYearEntry[] = [];

  let breakEvenYear: number | null = null;
  let prevBuyAhead = false;

  for (let year = 1; year <= timeHorizon; year++) {
    for (let month = 1; month <= 12; month++) {
      // Appreciate home
      homeValue *= 1 + monthlyAppreciationRate;

      // Mortgage payment
      const interestPayment = mortgageBalance * monthlyMortgageRate;
      let principalPayment = monthlyMortgagePayment - interestPayment;
      if (mortgageBalance > 0) {
        if (principalPayment > mortgageBalance) {
          principalPayment = mortgageBalance;
        }
        mortgageBalance -= principalPayment;
        if (mortgageBalance < 0.01) mortgageBalance = 0;
      } else {
        principalPayment = 0;
      }

      // Mortgage interest deduction (if applicable — tax benefit)
      const monthlyMortgageDeduction = interestPayment * (marginalTaxRate / 100);

      const monthlyPropertyTax = homeValue * monthlyPropertyTaxRate;
      const monthlyMaintenance = homeValue * monthlyMaintenanceRate;

      // Total monthly buy cost (cash out of pocket, excluding principal which builds equity)
      const actualMonthlyBuyCost =
        (mortgageBalance > 0 ? monthlyMortgagePayment : 0) +
        monthlyPropertyTax +
        monthlyMaintenance +
        monthlyInsurance -
        monthlyMortgageDeduction;

      cumulativeBuyCosts += actualMonthlyBuyCost;

      // Rent cost
      cumulativeRentCosts += currentMonthlyRent;

      // Renter: invest the difference between buying cost and renting cost
      // plus the monthly savings (rent is usually cheaper initially)
      const monthlySavingsForRenter = actualMonthlyBuyCost - currentMonthlyRent;

      if (monthlySavingsForRenter > 0) {
        rentInvestmentPortfolio += monthlySavingsForRenter;
      }
      // If renting is more expensive, renter "withdraws" from portfolio
      else if (monthlySavingsForRenter < 0) {
        rentInvestmentPortfolio += monthlySavingsForRenter; // adds negative (reduces)
        if (rentInvestmentPortfolio < 0) rentInvestmentPortfolio = 0;
      }

      // Grow renter's investment portfolio
      rentInvestmentPortfolio *= 1 + monthlyInvestReturnRate;

      // Increase rent
      currentMonthlyRent *= 1 + monthlyRentIncreaseRate;
    }

    // End of year calculations
    const sellingCosts = homeValue * (sellingClosingCostRate / 100);
    const equity = homeValue - mortgageBalance;
    const buyNetWorth = equity - sellingCosts;
    const rentNetWorth = rentInvestmentPortfolio;

    const advantage: 'buy' | 'rent' | 'equal' =
      buyNetWorth > rentNetWorth ? 'buy' : buyNetWorth < rentNetWorth ? 'rent' : 'equal';
    const advantageAmount = Math.abs(buyNetWorth - rentNetWorth);

    // Detect break-even
    const buyAhead = buyNetWorth > rentNetWorth;
    if (year === 1) {
      prevBuyAhead = buyAhead;
    } else if (buyAhead !== prevBuyAhead && breakEvenYear === null) {
      breakEvenYear = year;
    }
    prevBuyAhead = buyAhead;

    yearlyData.push({
      year,
      homeValue,
      mortgageBalance,
      equity,
      buyNetWorth,
      cumulativeBuyCosts,
      monthlyRent: currentMonthlyRent,
      investmentPortfolio: rentInvestmentPortfolio,
      rentNetWorth,
      cumulativeRentCosts,
      advantage,
      advantageAmount,
    });
  }

  const lastYear = yearlyData[yearlyData.length - 1];
  const finalBuyNetWorth = lastYear.buyNetWorth;
  const finalRentNetWorth = lastYear.rentNetWorth;

  const winner: 'buy' | 'rent' | 'equal' =
    finalBuyNetWorth > finalRentNetWorth
      ? 'buy'
      : finalBuyNetWorth < finalRentNetWorth
      ? 'rent'
      : 'equal';

  const winnerAdvantage = Math.abs(finalBuyNetWorth - finalRentNetWorth);

  // Initial monthly cost difference (buy minus rent, positive means buying costs more)
  const initialMonthlyPropertyTax = homePrice * (propertyTaxRate / 100) / 12;
  const initialMonthlyMaintenance = homePrice * (maintenanceRate / 100) / 12;
  const initialMortgageDeduction = (loanAmount * (mortgageRate / 100) / 12) * (marginalTaxRate / 100);
  const initialMonthlyBuyCost =
    monthlyMortgagePayment +
    initialMonthlyPropertyTax +
    initialMonthlyMaintenance +
    monthlyInsurance -
    initialMortgageDeduction;
  const initialMonthlyCostDiff = initialMonthlyBuyCost - monthlyRent;

  return {
    yearlyData,
    breakEvenYear,
    finalBuyNetWorth,
    finalRentNetWorth,
    winner,
    winnerAdvantage,
    monthlyMortgagePayment,
    initialMonthlyCostDiff,
  };
}

export function getDefaultRentBuyInputs(): RentBuyInputs {
  return {
    homePrice: 500000,
    downPayment: 100000,
    mortgageRate: 6.5,
    loanTerm: 30,
    monthlyRent: 2500,
    timeHorizon: 10,
    homeAppreciation: 3.0,
    rentIncreaseRate: 3.0,
    investmentReturnRate: 7.0,
    propertyTaxRate: 1.2,
    maintenanceRate: 1.0,
    buyingClosingCostRate: 3.0,
    sellingClosingCostRate: 6.0,
    marginalTaxRate: 24,
    annualInsurance: 1500,
  };
}
