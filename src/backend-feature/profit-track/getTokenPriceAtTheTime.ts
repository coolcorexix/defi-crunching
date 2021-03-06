import {
  findCoingeckoByNamedId,
  saveCoingeckoPrice,
} from "backend-feature/context/mongoDbClient";
import { CoinGeckoClient, PLATFORMS } from "coingecko-api-v3";
import { performance } from "perf_hooks";

interface TokenPriceInput {
  unixEpochtimeStamp: number;
  tokenContractAddress: string;
  platformId: PLATFORMS;
}

export async function getTokenPriceAtTheTime(args: TokenPriceInput) {
  try {
    const startTime = performance.now();
    // cache anywhere in that 1000 seconds
    const acceptedDeviatedCoinPriceInTimeRange = Math.floor(
      args.unixEpochtimeStamp / 1000
    );
    const mongoDbNamedId = `${args.platformId}-${args.tokenContractAddress}-${acceptedDeviatedCoinPriceInTimeRange}`;
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
    console.log("error in get token price: ", e);
    console.log("coin id with error: ", args.tokenContractAddress);
    console.log("timestamp with error: ", args.unixEpochtimeStamp);
    return 0;
  }
}
