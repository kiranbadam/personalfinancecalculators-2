// Cumulative normal distribution - rational approximation (Abramowitz and Stegun)
export function cumulativeNormalDistribution(x: number): number {
  if (x < -10) return 0;
  if (x > 10) return 1;
  
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2);

  return 0.5 * (1.0 + sign * y);
}

// Standard normal PDF
export function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export interface BlackScholesParams {
  spotPrice: number; // S
  strikePrice: number; // K
  timeToExpiry: number; // T in years
  riskFreeRate: number; // r as decimal
  volatility: number; // sigma as decimal
  optionType: 'call' | 'put';
}

export interface BlackScholesResult {
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  d1: number;
  d2: number;
}

export function blackScholes(params: BlackScholesParams): BlackScholesResult {
  const { spotPrice: S, strikePrice: K, timeToExpiry: T, riskFreeRate: r, volatility: sigma, optionType } = params;
  
  if (T <= 0) {
    // At expiration
    const intrinsicValue = optionType === 'call'
      ? Math.max(S - K, 0)
      : Math.max(K - S, 0);
    return {
      price: intrinsicValue,
      delta: optionType === 'call' ? (S > K ? 1 : 0) : (S < K ? -1 : 0),
      gamma: 0,
      theta: 0,
      vega: 0,
      rho: 0,
      d1: 0,
      d2: 0,
    };
  }
  
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;
  
  const Nd1 = cumulativeNormalDistribution(d1);
  const Nd2 = cumulativeNormalDistribution(d2);
  const Nnd1 = cumulativeNormalDistribution(-d1);
  const Nnd2 = cumulativeNormalDistribution(-d2);
  const nd1 = normalPDF(d1);
  
  let price: number;
  let delta: number;
  let rho_val: number;
  
  if (optionType === 'call') {
    price = S * Nd1 - K * Math.exp(-r * T) * Nd2;
    delta = Nd1;
    rho_val = K * T * Math.exp(-r * T) * Nd2 / 100;
  } else {
    price = K * Math.exp(-r * T) * Nnd2 - S * Nnd1;
    delta = Nd1 - 1;
    rho_val = -K * T * Math.exp(-r * T) * Nnd2 / 100;
  }
  
  const gamma = nd1 / (S * sigma * sqrtT);
  const theta = (-(S * nd1 * sigma) / (2 * sqrtT) - r * K * Math.exp(-r * T) * (optionType === 'call' ? Nd2 : -Nnd2)) / 365;
  const vega = S * nd1 * sqrtT / 100;
  
  return { price, delta, gamma, theta, vega, rho: rho_val, d1, d2 };
}

// Implied volatility solver using Newton-Raphson
export function impliedVolatility(
  marketPrice: number,
  spotPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  optionType: 'call' | 'put',
  maxIterations: number = 100,
  tolerance: number = 0.0001
): number | null {
  let sigma = 0.3; // initial guess
  
  for (let i = 0; i < maxIterations; i++) {
    const result = blackScholes({
      spotPrice,
      strikePrice,
      timeToExpiry,
      riskFreeRate,
      volatility: sigma,
      optionType,
    });
    
    const diff = result.price - marketPrice;
    if (Math.abs(diff) < tolerance) return sigma;
    
    // Vega (unscaled for Newton-Raphson)
    const sqrtT = Math.sqrt(timeToExpiry);
    const vegaUnscaled = spotPrice * normalPDF(result.d1) * sqrtT;
    
    if (vegaUnscaled < 0.00001) return null; // vega too small
    
    sigma -= diff / vegaUnscaled;
    
    if (sigma <= 0.001) sigma = 0.001;
    if (sigma > 5) sigma = 5;
  }
  
  return null; // didn't converge
}
