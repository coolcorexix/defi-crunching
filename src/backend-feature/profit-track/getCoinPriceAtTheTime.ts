import { getNativeCoinPriceAtTheTime } from "./getNativeCoinPriceAtTheTime";
import { getTokenContractAddressByCoinId } from "./getTokenContractAddressByCoinId";
import { getTokenPriceAtTheTime } from "./getTokenPriceAtTheTime";

export async function getCoinPriceAtTheTime(args: {
  coinId: string;
  unixEpochtimeStamp: number;
}) {
  const tokenContractAddress = await getTokenContractAddressByCoinId(
    args.coinId
  );
  const isNativeChainToken =
    !tokenContractAddress.contractAddress && !tokenContractAddress.platformId;
  // handle for ERC20
  if (!isNativeChainToken) {
    const priceInUsd = await getTokenPriceAtTheTime({
      platformId: tokenContractAddress.platformId,
      tokenContractAddress: tokenContractAddress.contractAddress,
      unixEpochtimeStamp: args.unixEpochtimeStamp,
    });
    return priceInUsd;
  }
  // handle for native chain
  const priceInUsd = await getNativeCoinPriceAtTheTime({
    coinId: args.coinId,
    unixEpochtimeStamp: args.unixEpochtimeStamp,
  });
  return priceInUsd;
}
