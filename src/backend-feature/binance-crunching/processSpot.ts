import { parse } from "csv-parse";
import { getCoinIdFromTicker } from "backend-feature/utils/getCoinIdFromTicker";
import { getQuantityAndLatestTicker } from "backend-feature/utils/getQuantityAndLatestCoinId";
import { convertDateTimeToEpochTimestamp } from "backend-feature/utils/convertDateTimeToEpochTimestamp";

export interface CSVSpotTransaction {
  "Date(UTC)": string;
  Pair: string;
  Side: "SELL" | "BUY";
  Price: string;
  Executed: string;
  Amount: string;
  Fee: string;
}

export interface OutputSpotTransaction {
  executeDate: Date;
  fromAmount: number;
  fromTicker: string;
  fromCoinId: string;
  toAmount: number;
  toTicker: string;
  toCoinId: string;
  priceAtTheTime: number;
  side: "SELL" | "BUY";
  pair?: string;
}

export function processSpot(inputSpotTransactions: string): Promise<any> {
  let outputP2PTx: OutputSpotTransaction[] = [];

  const parser = parse({
    delimiter: ",",
    columns: true,
  });
  return new Promise((resolve) => {
    parser.on("readable", async function () {
      let record: CSVSpotTransaction;

      while ((record = parser.read())) {
        const { quantity: toAmount, ticker: toTicker } =
          getQuantityAndLatestTicker(
            record.Amount,
            convertDateTimeToEpochTimestamp(new Date(record["Date(UTC)"]))
          );
        const { quantity: fromAmount, ticker: fromTicker } =
          getQuantityAndLatestTicker(
            record.Executed,
            convertDateTimeToEpochTimestamp(new Date(record["Date(UTC)"]))
          );
        outputP2PTx.push({
          executeDate: new Date(record["Date(UTC)"]),
          fromAmount,
          fromTicker,
          fromCoinId: await getCoinIdFromTicker(fromTicker),
          toAmount,
          toTicker,
          toCoinId: await getCoinIdFromTicker(toTicker),
          priceAtTheTime: Number(record.Price.replace(/,/g, "")),
          side: record.Side,
        });
      }

      outputP2PTx.forEach((tx) => {
        tx.pair = `${tx.fromTicker}/${tx.toTicker}`;
      });

      resolve(outputP2PTx);
    });

    parser.write(inputSpotTransactions);
  });
}
