import { InterestedCurrencies } from "backend-feature/types";
import { outflowMethods } from "./constants";
import { OutputResponse } from "./types";

export function calculateTotalProceed(outputResponses: OutputResponse[]): InterestedCurrencies {
  return outputResponses
    .filter((response) => outflowMethods.includes(response.method))
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
