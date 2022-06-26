export function parseFloatButTreatCommaAsDot(text: string) {
  return parseFloat(text.replace(",", "."));
}
