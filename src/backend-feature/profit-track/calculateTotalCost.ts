import { inflowMethods } from "./constants";
import { OutputResponse } from "./types";

export function calculateTotalCost(outputResponses: OutputResponse[]): {
  usdCost: number;
  cakeCost: number;
} {
  return outputResponses
    .filter((response) => inflowMethods.includes(response.method))
    .reduce(
      (acc, curr) => ({
        usdCost: acc.usdCost + curr.toUSDValue,
        cakeCost: acc.cakeCost + curr.amountOfToken,
      }),
      {
        usdCost: 0,
        cakeCost: 0,
      }
    );
}
