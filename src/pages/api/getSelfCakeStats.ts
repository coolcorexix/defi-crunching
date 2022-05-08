import { ChainId } from "@pancakeswap/sdk";
import { calculateCakeProfitFromPool } from "backend-feature/calculateCakeProfitFromPool";
import {
  autoCakePool,
  ifoCakePool,
  manualCakePool,
} from "backend-feature/config/poolInfo";
import { initProvider, setChainId } from "backend-feature/context";
import { getTransactionList } from "backend-feature/getTransactionList";
import { InterestedCurrencies } from "backend-feature/types";
import { NextApiRequest, NextApiResponse } from "next";
import url from "url";

export interface CakeStatResponse {
  totalProceed: InterestedCurrencies;
  totalCost: InterestedCurrencies;
}

export default async function getSelfCakeStats(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setChainId(ChainId.MAINNET);
  initProvider();
  const queryParams = url.parse(req.url ?? "", true).query;
  if (!queryParams || !queryParams.address) {
    res.status(400).send("Missing address query parameter");
    return;
  }
  const toInspectAddress = queryParams.address as string;
  const transactionList = require("./mockTransactionList.json");
  const stats = await Promise.all(
    [autoCakePool, ifoCakePool, manualCakePool].map((pool) =>
      calculateCakeProfitFromPool.call(
        null,
        toInspectAddress,
        transactionList,
        pool
      )
    )
  );
  const usdGainLoss = stats.reduce((acc, el) => {
    return acc + el.totalProceed.usd - el.totalCost.usd;
  }, 0);
  console.log(
    "🚀 ~ file: getSelfCakeStats.ts ~ line 45 ~ usdGainLoss ~ usdGainLoss",
    usdGainLoss
  );
  res.status(200).json(stats);
}
