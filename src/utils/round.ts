export function round(value: number, precision = 2) {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}
