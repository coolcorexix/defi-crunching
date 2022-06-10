import { OutputSpotTransaction } from "backend-feature/binance-crunching/processSpot";
import { getCoinGeckoCurrentPrice } from "backend-feature/profit-track/getCoinGeckoCurrentPrice";
import { getCoinIdFromTicker } from "backend-feature/utils/getCoinIdFromTicker";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";


export interface ManualSpotTransactionBody {
    // UTC value
    executeDate: Date,
    fromAmount: number,
    fromTicker: string,
    toAmount: number,
    toTicker: string,
    priceAtTheTime: number,
    side: "BUY" | "SELL",


}

const apiManualSpotTransactionRoute = nc({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
}).post(
  async (req: NextApiRequest, res: NextApiResponse<OutputSpotTransaction>) => {
    const reqBody = req.body as ManualSpotTransactionBody;
    const outputSpotTx: OutputSpotTransaction = {
      executeDate: reqBody.executeDate,
      fromAmount: reqBody.fromAmount,
      fromTicker: reqBody.fromTicker,
      fromCoinId: await getCoinIdFromTicker(reqBody.fromTicker),
      toAmount: reqBody.toAmount,
      toTicker: reqBody.toTicker,
      toCoinId: await getCoinIdFromTicker(reqBody.toTicker),
      priceAtTheTime: Number(reqBody.priceAtTheTime),
      side: reqBody.side,
    };

    outputSpotTx.pair = `${outputSpotTx.fromTicker}/${outputSpotTx.toTicker}`;
    res.status(200).json(outputSpotTx);
  }
);

export default apiManualSpotTransactionRoute;
