import { calculateTotalVolume } from "backend-feature/calculateTotalVolume";
import { getCoinGeckoCurrentPrice } from "backend-feature/profit-track/getCoinGeckoCurrentPrice";
import { NextApiRequest, NextApiResponse } from "next";
import url from "url";
import nc from "next-connect";

const apiGetCurrentPriceOfCoinsRoute = nc({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
}).get(async (req: NextApiRequest, res: NextApiResponse) => {
  const queryParams = url.parse(req.url ?? "", true).query;
  if (!queryParams || !queryParams.coinIds) {
    res.status(400).send("Missing coinIds query parameter");
    return;
  }
  const coinIds = queryParams.coinIds as string[];
  const coinGeckoPrices = await getCoinGeckoCurrentPrice(coinIds);
  console.log("🚀 ~ file: get-current-price-of-coins.ts ~ line 24 ~ coinGeckoPrices", coinGeckoPrices)
  res.status(200).json({
    coinGeckoPrices,
  });
});

export default apiGetCurrentPriceOfCoinsRoute;
