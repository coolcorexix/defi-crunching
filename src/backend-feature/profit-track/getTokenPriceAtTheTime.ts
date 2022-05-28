import { findCoingeckoByNamedId, saveCoingeckoPrice } from "backend-feature/context/mongoDbClient";
import { CoinGeckoClient } from "coingecko-api-v3";
import { performance } from "perf_hooks";

export async function getTokenPriceAtTheTime(args: {
  unixEpochtimeStamp: number;
  tokenContractAddress: string;
  platformId: "binance-smart-chain";
}) {
  try {
    const startTime = performance.now();
    const mongoDbNamedId = `${args.platformId}-${args.tokenContractAddress}-${args.unixEpochtimeStamp}`;
    const mongodbStoredCoinPrice = await findCoingeckoByNamedId(mongoDbNamedId);
    if (!mongodbStoredCoinPrice) {
      const client = new CoinGeckoClient();
      // 1 hours, probing until we get a valid price up to 5 hours
      const timeGap = 60 * 60;
      for (let i = 0; i < 5; i++) {
        const response = await client.contractMarketChartRange({
          id: args.platformId as any,
          contract_address: args.tokenContractAddress,
          vs_currency: "usd",
          from: args.unixEpochtimeStamp - timeGap * (i + 1),
          to: args.unixEpochtimeStamp,
        });
        if (!response.prices.length) {
          continue;
        }
        saveCoingeckoPrice({
          ...args,
          priceInUsd: response.prices[0][1],
        });
        const endTime = performance.now();
        console.log(`Call took ${endTime - startTime} milliseconds`);
        return response.prices[0][1];
      }
      throw new Error("no data price found");
    }
    const endTime = performance.now();
    console.log(`Call took ${endTime - startTime} milliseconds`);
    return mongodbStoredCoinPrice.priceInUsd;
  } catch (e) {
    console.log("error in get token price: ", e);
    console.log("timestamp with error: ", args.unixEpochtimeStamp);
  }
}
