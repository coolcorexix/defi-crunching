import { getCoinPriceAtTheTime } from "./profit-track/getCoinPriceAtTheTime";

export interface CalculateTotalVolumeInputItem {
  coindId: string;
  amount: number;
  unixEpochtimeStamp: number;
}

export async function calculateTotalVolume(
  input: CalculateTotalVolumeInputItem[]
) {
  let acc = 0;
  for (let i = 0; i < input.length; i++) {
    const el = input[i];
    const amountToStack =
      el.amount *
      (await getCoinPriceAtTheTime({
        coinId: el.coindId,
        unixEpochtimeStamp: el.unixEpochtimeStamp,
      }));
    
    if (typeof amountToStack !== "number" || isNaN(amountToStack)) {
      continue;
    }
    acc = acc + amountToStack;
  }
  return acc;
}
