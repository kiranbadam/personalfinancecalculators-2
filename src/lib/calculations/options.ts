import { OptionsInputs, OptionsResult, PayoffPoint, Greeks, OptionLeg } from '@/types';
import { blackScholes, cumulativeNormalDistribution } from './black-scholes';

export function calculateOptions(inputs: OptionsInputs): OptionsResult {
  const { legs, currentPrice, impliedVolatility: iv, riskFreeRate, daysToExpiration } = inputs;
  
  // Generate payoff data across price range
  const priceRange = getPriceRange(currentPrice, legs);
  const payoffData = priceRange.map(price => calculatePayoffAtPrice(price, legs, currentPrice));
  
  // Find max profit, max loss, breakevens
  const profits = payoffData.map(p => p.profit);
  const maxProfit = findMaxProfit(profits, payoffData);
  const maxLoss = findMaxLoss(profits, payoffData);
  const breakevens = findBreakevens(payoffData);
  
  // Capital required
  const capitalRequired = calculateCapitalRequired(legs, currentPrice);
  
  // Greeks (if IV provided)
  let greeks: Greeks | null = null;
  let probabilityOfProfit: number | null = null;
  let plSurface: { price: number; dte: number; pl: number }[] | null = null;
  
  if (iv !== null && iv > 0) {
    greeks = calculateGreeks(legs, currentPrice, iv / 100, riskFreeRate / 100, daysToExpiration / 365);
    probabilityOfProfit = calculateProbabilityOfProfit(legs, currentPrice, iv / 100, riskFreeRate / 100, daysToExpiration / 365);
    plSurface = calculatePLSurface(legs, currentPrice, iv / 100, riskFreeRate / 100, daysToExpiration);
  }
  
  // Risk/reward ratio
  const riskRewardRatio = maxLoss !== null && maxProfit !== null && maxLoss !== 0
    ? Math.abs(maxProfit / maxLoss)
    : null;
  
  return {
    payoffData,
    maxProfit: maxProfit === Infinity ? null : maxProfit,
    maxLoss: maxLoss === -Infinity ? null : maxLoss,
    breakevens,
    riskRewardRatio,
    capitalRequired,
    greeks,
    probabilityOfProfit,
    plSurface,
  };
}

function getPriceRange(currentPrice: number, legs: OptionLeg[]): number[] {
  const strikes = legs.map(l => l.strikePrice);
  const allPrices = [currentPrice, ...strikes];
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);
  const range = max - min;
  const padding = Math.max(range * 0.5, currentPrice * 0.3);
  
  const low = Math.max(0, min - padding);
  const high = max + padding;
  const step = (high - low) / 200;
  
  const prices: number[] = [];
  for (let p = low; p <= high; p += step) {
    prices.push(Math.round(p * 100) / 100);
  }
  return prices;
}

function calculatePayoffAtPrice(priceAtExpiry: number, legs: OptionLeg[], currentPrice: number): PayoffPoint {
  let totalProfit = 0;
  let totalCost = 0;
  
  for (const leg of legs) {
    const multiplier = leg.direction === 'buy' ? 1 : -1;
    const intrinsicValue = leg.type === 'call'
      ? Math.max(0, priceAtExpiry - leg.strikePrice)
      : Math.max(0, leg.strikePrice - priceAtExpiry);
    
    const legProfit = (intrinsicValue - leg.premium) * multiplier * leg.quantity * 100;
    totalProfit += legProfit;
    totalCost += leg.premium * leg.quantity * 100 * (leg.direction === 'buy' ? 1 : -1);
  }
  
  return {
    price: priceAtExpiry,
    profit: totalProfit,
    profitPercent: totalCost !== 0 ? (totalProfit / Math.abs(totalCost)) * 100 : 0,
  };
}

function findMaxProfit(profits: number[], data: PayoffPoint[]): number {
  const maxIdx = profits.length - 1;
  const max = Math.max(...profits);
  // Check if profit is still increasing at the edges
  if (profits[maxIdx] >= profits[maxIdx - 1] && profits[maxIdx] > profits[Math.floor(maxIdx / 2)]) {
    return Infinity; // unlimited upside
  }
  return max;
}

function findMaxLoss(profits: number[], data: PayoffPoint[]): number {
  const min = Math.min(...profits);
  // Check if loss is still increasing at the edges
  if (profits[0] <= profits[1] && profits[0] < profits[Math.floor(profits.length / 2)]) {
    if (data[0].price <= 0.01) return min; // can't go below 0
    return -Infinity; // unlimited downside
  }
  return min;
}

function findBreakevens(data: PayoffPoint[]): number[] {
  const breakevens: number[] = [];
  for (let i = 1; i < data.length; i++) {
    if ((data[i - 1].profit <= 0 && data[i].profit >= 0) ||
        (data[i - 1].profit >= 0 && data[i].profit <= 0)) {
      // Linear interpolation
      const ratio = Math.abs(data[i - 1].profit) / (Math.abs(data[i - 1].profit) + Math.abs(data[i].profit));
      const breakeven = data[i - 1].price + ratio * (data[i].price - data[i - 1].price);
      breakevens.push(Math.round(breakeven * 100) / 100);
    }
  }
  return breakevens;
}

function calculateCapitalRequired(legs: OptionLeg[], currentPrice: number): number {
  let capital = 0;
  for (const leg of legs) {
    if (leg.direction === 'buy') {
      capital += leg.premium * leg.quantity * 100;
    } else {
      // Selling options requires margin
      if (leg.type === 'call') {
        // Naked call: typically current price * quantity * 100 as collateral estimate
        capital += currentPrice * leg.quantity * 100;
      } else {
        // Cash-secured put: strike price * quantity * 100
        capital += leg.strikePrice * leg.quantity * 100;
      }
    }
  }
  return capital;
}

function calculateGreeks(
  legs: OptionLeg[],
  spotPrice: number,
  iv: number,
  riskFreeRate: number,
  timeToExpiry: number
): Greeks {
  let totalDelta = 0, totalGamma = 0, totalTheta = 0, totalVega = 0, totalRho = 0;
  
  for (const leg of legs) {
    const multiplier = (leg.direction === 'buy' ? 1 : -1) * leg.quantity * 100;
    const result = blackScholes({
      spotPrice,
      strikePrice: leg.strikePrice,
      timeToExpiry,
      riskFreeRate,
      volatility: iv,
      optionType: leg.type,
    });
    
    totalDelta += result.delta * multiplier;
    totalGamma += result.gamma * multiplier;
    totalTheta += result.theta * multiplier;
    totalVega += result.vega * multiplier;
    totalRho += result.rho * multiplier;
  }
  
  return {
    delta: totalDelta,
    gamma: totalGamma,
    theta: totalTheta,
    vega: totalVega,
    rho: totalRho,
  };
}

function calculateProbabilityOfProfit(
  legs: OptionLeg[],
  spotPrice: number,
  iv: number,
  riskFreeRate: number,
  timeToExpiry: number
): number {
  // Use Monte Carlo-like approach: check what fraction of price range is profitable
  const prices = getPriceRange(spotPrice, legs);
  const payoffs = prices.map(p => calculatePayoffAtPrice(p, legs, spotPrice));
  
  // Use log-normal distribution to weight probabilities
  let profitProbability = 0;
  const sqrtT = Math.sqrt(timeToExpiry);
  
  for (let i = 1; i < prices.length; i++) {
    const price = prices[i];
    if (price <= 0) continue;
    
    const logReturn = Math.log(price / spotPrice);
    const d = (logReturn - (riskFreeRate - 0.5 * iv * iv) * timeToExpiry) / (iv * sqrtT);
    const probability = (cumulativeNormalDistribution(d) - cumulativeNormalDistribution(
      (Math.log(prices[i - 1] / spotPrice) - (riskFreeRate - 0.5 * iv * iv) * timeToExpiry) / (iv * sqrtT)
    ));
    
    if (payoffs[i].profit > 0) {
      profitProbability += Math.abs(probability);
    }
  }
  
  return Math.min(100, Math.max(0, profitProbability * 100));
}

function calculatePLSurface(
  legs: OptionLeg[],
  spotPrice: number,
  iv: number,
  riskFreeRate: number,
  daysToExpiration: number
): { price: number; dte: number; pl: number }[] {
  const surface: { price: number; dte: number; pl: number }[] = [];
  const priceRange = getPriceRange(spotPrice, legs);
  const priceStep = Math.max(1, Math.floor(priceRange.length / 30));
  const dteSteps = [0, 1, 3, 7, 14, 21, Math.floor(daysToExpiration / 2), daysToExpiration].filter(d => d <= daysToExpiration);
  
  for (const dte of dteSteps) {
    const T = dte / 365;
    for (let i = 0; i < priceRange.length; i += priceStep) {
      const price = priceRange[i];
      let pl = 0;
      
      for (const leg of legs) {
        const multiplier = (leg.direction === 'buy' ? 1 : -1) * leg.quantity * 100;
        if (T <= 0) {
          const intrinsic = leg.type === 'call'
            ? Math.max(0, price - leg.strikePrice)
            : Math.max(0, leg.strikePrice - price);
          pl += (intrinsic - leg.premium) * multiplier;
        } else {
          const bsResult = blackScholes({
            spotPrice: price,
            strikePrice: leg.strikePrice,
            timeToExpiry: T,
            riskFreeRate,
            volatility: iv,
            optionType: leg.type,
          });
          pl += (bsResult.price - leg.premium) * multiplier;
        }
      }
      
      surface.push({ price, dte, pl });
    }
  }
  
  return surface;
}

export function getStrategyLegs(strategy: string, currentPrice: number): OptionLeg[] {
  const round = (n: number) => Math.round(n);
  
  switch (strategy) {
    case 'long-call':
      return [{ id: '1', type: 'call', direction: 'buy', strikePrice: round(currentPrice), premium: 5, quantity: 1, expirationDate: '' }];
    case 'long-put':
      return [{ id: '1', type: 'put', direction: 'buy', strikePrice: round(currentPrice), premium: 5, quantity: 1, expirationDate: '' }];
    case 'covered-call':
      return [{ id: '1', type: 'call', direction: 'sell', strikePrice: round(currentPrice * 1.05), premium: 3, quantity: 1, expirationDate: '' }];
    case 'cash-secured-put':
      return [{ id: '1', type: 'put', direction: 'sell', strikePrice: round(currentPrice * 0.95), premium: 3, quantity: 1, expirationDate: '' }];
    case 'bull-call-spread':
      return [
        { id: '1', type: 'call', direction: 'buy', strikePrice: round(currentPrice), premium: 5, quantity: 1, expirationDate: '' },
        { id: '2', type: 'call', direction: 'sell', strikePrice: round(currentPrice * 1.1), premium: 2, quantity: 1, expirationDate: '' },
      ];
    case 'bear-put-spread':
      return [
        { id: '1', type: 'put', direction: 'buy', strikePrice: round(currentPrice), premium: 5, quantity: 1, expirationDate: '' },
        { id: '2', type: 'put', direction: 'sell', strikePrice: round(currentPrice * 0.9), premium: 2, quantity: 1, expirationDate: '' },
      ];
    case 'iron-condor':
      return [
        { id: '1', type: 'put', direction: 'buy', strikePrice: round(currentPrice * 0.9), premium: 1.5, quantity: 1, expirationDate: '' },
        { id: '2', type: 'put', direction: 'sell', strikePrice: round(currentPrice * 0.95), premium: 3, quantity: 1, expirationDate: '' },
        { id: '3', type: 'call', direction: 'sell', strikePrice: round(currentPrice * 1.05), premium: 3, quantity: 1, expirationDate: '' },
        { id: '4', type: 'call', direction: 'buy', strikePrice: round(currentPrice * 1.1), premium: 1.5, quantity: 1, expirationDate: '' },
      ];
    case 'straddle':
      return [
        { id: '1', type: 'call', direction: 'buy', strikePrice: round(currentPrice), premium: 5, quantity: 1, expirationDate: '' },
        { id: '2', type: 'put', direction: 'buy', strikePrice: round(currentPrice), premium: 5, quantity: 1, expirationDate: '' },
      ];
    case 'strangle':
      return [
        { id: '1', type: 'call', direction: 'buy', strikePrice: round(currentPrice * 1.05), premium: 3, quantity: 1, expirationDate: '' },
        { id: '2', type: 'put', direction: 'buy', strikePrice: round(currentPrice * 0.95), premium: 3, quantity: 1, expirationDate: '' },
      ];
    case 'butterfly':
      return [
        { id: '1', type: 'call', direction: 'buy', strikePrice: round(currentPrice * 0.95), premium: 7, quantity: 1, expirationDate: '' },
        { id: '2', type: 'call', direction: 'sell', strikePrice: round(currentPrice), premium: 4, quantity: 2, expirationDate: '' },
        { id: '3', type: 'call', direction: 'buy', strikePrice: round(currentPrice * 1.05), premium: 2, quantity: 1, expirationDate: '' },
      ];
    default:
      return [{ id: '1', type: 'call', direction: 'buy', strikePrice: round(currentPrice), premium: 5, quantity: 1, expirationDate: '' }];
  }
}

export function getDefaultOptionsInputs(): OptionsInputs {
  return {
    strategy: 'long-call',
    legs: getStrategyLegs('long-call', 100),
    currentPrice: 100,
    impliedVolatility: 30,
    riskFreeRate: 5,
    daysToExpiration: 30,
  };
}
