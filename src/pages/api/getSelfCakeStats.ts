import { ChainId } from "@pancakeswap/sdk";
import {
  CakePoolStats,
  calculateCakeProfitFromPool,
} from "backend-feature/calculateCakeProfitFromPool";
import {
  autoCakePool,
  ifoCakePool,
  manualCakePool,
} from "backend-feature/config/poolInfo";
import { initProviderIfNot, setChainIdIfNot } from "backend-feature/context";
import { getTransactionList } from "backend-feature/getTransactionList";
import { InterestedCurrencies } from "backend-feature/types";
import { NextApiRequest, NextApiResponse } from "next";
import url from "url";

export interface CakeStatResponse {
  // totalProceed: InterestedCurrencies;
  // totalCost: InterestedCurrencies;
  usdGainLoss: number;
  earningTableData: CakePoolStats[];
}

export default async function getSelfCakeStats(
  req: NextApiRequest,
  res: NextApiResponse<CakeStatResponse | string>
) {
  setChainIdIfNot(ChainId.MAINNET);
  initProviderIfNot();
  const queryParams = url.parse(req.url ?? "", true).query;
  if (!queryParams || !queryParams.address) {
    res.status(400).send("Missing address query parameter");
    return;
  }
  const toInspectAddress = queryParams.address as string;
  const transactionList = await getTransactionList(toInspectAddress);
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
  res.status(200).json({
    usdGainLoss,
    earningTableData: stats,
  });
}
