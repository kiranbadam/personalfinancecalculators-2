export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function isPositive(value: number): boolean {
  return value > 0;
}

export function isValidRate(value: number): boolean {
  return value >= 0 && value <= 100;
}

export function isValidAge(value: number): boolean {
  return value >= 0 && value <= 120;
}

export function isValidYear(value: number): boolean {
  return value >= 1 && value <= 100;
}
