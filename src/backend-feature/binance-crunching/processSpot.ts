import { parse } from "csv-parse";
import path from "path";
import fs from "fs";
import uniq from "lodash/uniq";
import { splitNumberAndAlphabet } from "backend-feature/utils/splitAtFirtAlphabet";
import { getCoinIdFromTicker } from "backend-feature/utils/getCoinIdFromTicker";
import { getCoinGeckoCurrentPrice } from "backend-feature/profit-track/getCoinGeckoCurrentPrice";

export interface CSVSpotTransaction {
  "Date(UTC)": string;
  Pair: string;
  Side: 'SELL' | 'BUY';
  Price: string;
  Executed: string;
  Amount: string;
  Fee: string;
}

export interface OutputSpotTransaction {
  buyDate: Date;
  fromAmount: number;
  fromTicker: string;
  fromCoinId: string;
  toAmount: number;
  toTicker: string;
  toCoinId: string;
  priceAtTheTime: number;
  growthRateOnThisTrade?: string;
  side: 'SELL' | 'BUY';
}

export function processSpot(): Promise<any> {
  let outputP2PTx: OutputSpotTransaction[] = [];
  const filePath = path.resolve(
    process.cwd(),
    "src/backend-feature/binance-crunching/testdata/l1y-spot-export.csv"
  );
  const inputSpotTransactions = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });

  const parser = parse({
    delimiter: ",",
    columns: true,
  });
  return new Promise((resolve) => {
    parser.on("readable", async function () {
      let record: CSVSpotTransaction;

      while ((record = parser.read())) {
        const { theNumber: toAmount, theChar: toTicker } =
          splitNumberAndAlphabet(record.Amount);
        const { theNumber: fromAmount, theChar: fromTicker } =
          splitNumberAndAlphabet(record.Executed);
        outputP2PTx.push({
          buyDate: new Date(record["Date(UTC)"]),
          fromAmount,
          fromTicker,
          fromCoinId: getCoinIdFromTicker(fromTicker),
          toAmount,
          toTicker,
          toCoinId: getCoinIdFromTicker(toTicker),
          priceAtTheTime: Number(record.Price.replace(/,/g, "")),
          side: record.Side,
        });
      }
      let coinIds = uniq(
        outputP2PTx.reduce((acc, tx) => {
          acc.push(tx.fromCoinId);
          acc.push(tx.toCoinId);
          return acc;
        }, [])
      );
      const coinGeckoPrices = await getCoinGeckoCurrentPrice(coinIds);
      outputP2PTx.forEach((tx) => {
        const currentPrice =
        coinGeckoPrices[tx.fromCoinId].usd / coinGeckoPrices[tx.toCoinId].usd;
        console.log(`🚀 ~ file: processSpot.ts ~ line 75 ~ outputP2PTx.forEach ~ currentPrice ${tx.fromTicker}/${tx.toTicker}: `, currentPrice)
        let growthRateOnThisTrade;
        if (tx.side === 'SELL') {
          growthRateOnThisTrade = tx.priceAtTheTime / currentPrice;
        }
        if (tx.side === 'BUY') {
          growthRateOnThisTrade = currentPrice / tx.priceAtTheTime;
        }
        tx.growthRateOnThisTrade = `${(growthRateOnThisTrade - 1)* 100}%`;
      });
      console.table(outputP2PTx);
      resolve(outputP2PTx);
    });

    parser.write(inputSpotTransactions);
  });
}
