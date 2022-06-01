export function getCoinIdFromTicker(ticker: string) {
  console.log(
    "🚀 ~ file: getCoinIdFromTicker.ts ~ line 2 ~ getCoinIdFromTicker ~ ticker",
    ticker
  );
  const coinsList = require("./static-reponse/CoinsList.json");
  return coinsList.find(
    (coin: { name: string; symbol: string; id: string }) =>
      coin.symbol === ticker.toLowerCase()
  ).id;
}
