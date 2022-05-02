import { ChainId } from "@pancakeswap/sdk";
import { calculateCakeProfitFromPool } from "backend-feature/calculateCakeProfitFromPool";
import { autoCakePool } from "backend-feature/config/poolInfo";
import { initProvider, setChainId } from "backend-feature/context";
import { NextApiRequest, NextApiResponse } from "next";
import url from "url";

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
  const stats = await calculateCakeProfitFromPool(
    toInspectAddress,
    autoCakePool
  );
  res.json(stats);
}
