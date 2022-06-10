import { performance } from "perf_hooks";
import { coinGeckoClient } from "backend-feature/context";
import {
  findCoingeckoByNamedId,
  saveCoingeckoPrice,
} from "backend-feature/context/mongoDbClient";

export interface NativeTokenPriceInput {
  unixEpochtimeStamp: number;
  coinId: string;
}

const theBirthOfTerra2UnixEpochTimestamp = 1653757407;

export async function getNativeCoinPriceAtTheTime(args: NativeTokenPriceInput) {
  try {
    const startTime = performance.now();
    // cache anywhere in that 1000 seconds
    const acceptedDeviatedCoinPriceInTimeRange = Math.floor(
      args.unixEpochtimeStamp / 1000
    );
    const mongoDbNamedId = `native-${args.coinId}-${acceptedDeviatedCoinPriceInTimeRange}`;
    const mongodbStoredCoinPrice = await findCoingeckoByNamedId(mongoDbNamedId);
    console.log(
      "🚀 ~ file: getNativeCoinPriceAtTheTime.ts ~ line 17 ~ getNativeCoinPriceAtTheTime ~ mongodbStoredCoinPrice",
      mongodbStoredCoinPrice
    );
    if (!mongodbStoredCoinPrice) {
      // 1 hours, probing until we get a valid price up to 5 hours
      const timeGap = 60 * 60;
      for (let i = 0; i < 5; i++) {
        const response = await coinGeckoClient.coinIdMarketChartRange({
          id: args.coinId,
          vs_currency: "usd",
          from: args.unixEpochtimeStamp - timeGap * (i + 1),
          to: args.unixEpochtimeStamp,
        });
        if (!response.prices.length) {
          continue;
        }
        saveCoingeckoPrice({
          ...args,
          namedId: mongoDbNamedId,
          priceInUsd: response.prices[0][1],
        });
        const endTime = performance.now();
        console.log(
          `Call took ${endTime - startTime} milliseconds without cache `,
          args.unixEpochtimeStamp
        );
        return response.prices[0][1];
      }
      throw new Error("no data price found");
    }
    const endTime = performance.now();
    console.log(`Call took ${endTime - startTime} milliseconds `);
    return mongodbStoredCoinPrice.priceInUsd;
  } catch (e) {
    console.log("error in get native coin price: ", e);
    console.log("coinId with error: ", args.coinId);
    console.log("timestamp with error: ", args.unixEpochtimeStamp);
    return 0;
  }
}
