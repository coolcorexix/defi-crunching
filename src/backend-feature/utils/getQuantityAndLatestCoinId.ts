import { splitNumberAndAlphabet } from "./splitAtFirtAlphabet";

const theBirthOfTerra2UnixEpochTimestamp = 1653757407;

export function getQuantityAndLatestTicker(
  input: string,
  unixEpochtimeStamp: number
): {
  quantity: number;
  ticker: string;
} {
  const { theNumber: amount, theChar: ticker } = splitNumberAndAlphabet(input);
  // this is because of the LUNA 2.0 launch, previous LUNA got renamed to LUNC
  if (
    ticker === "LUNA" &&
    unixEpochtimeStamp < theBirthOfTerra2UnixEpochTimestamp
  ) {
    return {
      quantity: amount,
      ticker: "LUNC",
    };
  }
  // this is because of the UST incident, UST got renamed to USTC
  if (
    ticker === "UST" &&
    unixEpochtimeStamp < theBirthOfTerra2UnixEpochTimestamp
  ) {
    return {
      quantity: amount,
      ticker: "USTC",
    };
  }
  return {
    quantity: amount,
    ticker: ticker,
  };
}
