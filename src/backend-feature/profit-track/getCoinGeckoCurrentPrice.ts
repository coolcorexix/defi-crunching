import { CoinGeckoClient, SimplePriceResponse } from "coingecko-api-v3";

export async function getCoinGeckoCurrentPrice(coinIds: string[]): Promise<SimplePriceResponse> {
    const client = new CoinGeckoClient({
      timeout: 10000,
      autoRetry: true,
    });
    const coinPriceInVnd = await client.simplePrice({
      vs_currencies: "usd",
      ids: coinIds.join(','),
    });
    return coinPriceInVnd;
  }