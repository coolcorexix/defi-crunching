import { InterestedCurrencies } from "backend-feature/types";
import { inflowMethods } from "./constants";
import { OutputResponse } from "./types";

export function calculateTotalCost(outputResponses: OutputResponse[]): InterestedCurrencies {
  return outputResponses
    .filter((response) => inflowMethods.includes(response.method))
    .reduce(
      (acc, curr) => ({
        usd: acc.usd + curr.toUSDValue,
        cake: acc.cake + curr.amountOfToken,
      }),
      {
        usd: 0,
        cake: 0,
      }
    );
}
