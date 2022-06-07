export function splitNumberAndAlphabet(input: string): {
  theNumber: number;
  theChar: string;
} {
  const theNumber = parseFloat(input.replace(/,/g, ""));
  let theChar = String(
    input.replace(/,/g, "").replace(theNumber.toString(), "")
  ).replace(/0|\./g, "");
  return {
    theNumber,
    theChar,
  };
}
