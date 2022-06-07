import { OutputSpotTransaction } from "backend-feature/binance-crunching/processSpot";
import { roundToThreeDigit } from "./roundNumber";

export function computeROIofTrade(tx: {
  side: "SELL" | "BUY";
  priceAtTheTime: number;
}, currentPrice: number) {
  let growthRateOnThisTrade;
  if (tx.side === "SELL") {
    growthRateOnThisTrade = tx.priceAtTheTime / currentPrice;
  }
  if (tx.side === "BUY") {
    growthRateOnThisTrade = currentPrice / tx.priceAtTheTime;
  }
  growthRateOnThisTrade = `${roundToThreeDigit(
    (growthRateOnThisTrade - 1) * 100
  )}%`;
  return growthRateOnThisTrade;
}
