import { CoinListResponseItem } from "coingecko-api-v3";
import { coinGeckoClient } from "./context";

let coinList: CoinListResponseItem[] = null;

export async function getCoinList() {
  if (!coinList) {

    const rs = await coinGeckoClient.coinList({
      include_platform: false,
    });
    
    coinList = rs;
  }

  return coinList;
}
