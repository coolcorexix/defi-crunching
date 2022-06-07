import { CoinGeckoClient, PLATFORMS } from "coingecko-api-v3";

export async function getTokenContractAddressByCoinId(coinId: string): Promise<{
  platformId: PLATFORMS;
  contractAddress: string;
}> {
  const coinGeckoClient = new CoinGeckoClient();
  const coinInfo = await coinGeckoClient.coinId({
    id: coinId,
  });
  const coinPlatforms = coinInfo.platforms;
  // store the first result
  return {
    platformId: Object.keys(coinPlatforms)[0] as PLATFORMS,
    contractAddress: Object.values(coinPlatforms)[0],
  };
}
