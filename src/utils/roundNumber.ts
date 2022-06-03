export function roundNumber(rawNumber: number, decimals: number) {
  return rawNumber.toFixed(decimals);
}

export function roundToThreeDigit(rawNumber: number) {
  return rawNumber.toFixed(3);
}
