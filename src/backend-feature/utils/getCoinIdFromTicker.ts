import { getCoinList } from "backend-feature/getCoinList";

export async function getCoinIdFromTicker(ticker: string) {
  console.log(
    "🚀 ~ file: getCoinIdFromTicker.ts ~ line 2 ~ getCoinIdFromTicker ~ ticker",
    ticker
  );
  const coinsList = await getCoinList();
  const thatId = coinsList.find(
    (coin) => coin.symbol === ticker.toLowerCase()
  ).id;
  console.log(
    "🚀 ~ file: getCoinIdFromTicker.ts ~ line 13 ~ getCoinIdFromTicker ~ thatId",
    thatId
  );
  return thatId;
}
