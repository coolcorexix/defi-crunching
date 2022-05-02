import axios from "axios";
import { getContract } from "contract/getContract";
import { DECIMALS } from "./profit-track/constants";
import { getTokenPriceAtTheTime } from "./profit-track/getTokenPriceAtTheTime";
import {
  DecodedMethodInfo,
  OutputResponse,
  YieldFarmingContractInfo,
} from "./profit-track/types";
import { cakeTokenContractAddress } from "./config/contractAddress";
import { autoCakePool } from "./config/poolInfo";
import { provider } from "./context";
import { BscScanApiTransaction } from "./types";
import { decodeTransactionInputData } from "./utils/decodeInputData";
import { getAmountOfTokenTransferFromLogs } from "./profit-track/getAmountOfTokenTransferFromLogs";
import { calculateTotalCost } from "./profit-track/calculateTotalCost";
import { calculateTotalProceed } from "./profit-track/calculateTotalProceed";

async function getCurrentCakeStakedInCurrentPool(
  inspectingAddress: string,
  currentPool: YieldFarmingContractInfo
): Promise<number> {
  if (currentPool.name === "autoCakePool") {
    const autoCakePoolContract = getContract(
      autoCakePool.address,
      require("constants/abi/AutoCakePool.json"),
      provider
    );
    const pricePerFullShare = await autoCakePoolContract.getPricePerFullShare();
    const userShares = await autoCakePoolContract.userInfo(inspectingAddress);
    return (userShares.shares * pricePerFullShare) / Math.pow(10, DECIMALS * 2);
  }

  return undefined;
}

async function getCakePriceAtTheTime(unixEpochtimeStamp: number) {
  return getTokenPriceAtTheTime({
    unixEpochtimeStamp,
    platformId: "binance-smart-chain",
    tokenContractAddress: cakeTokenContractAddress,
  });
}

export interface CakeProfitStats {
  gainOrLossInUsd: number;
  outputResponses: OutputResponse[];
}

export async function calculateCakeProfitFromPool(
  rawAddress: string,
  currentPool: YieldFarmingContractInfo
): Promise<CakeProfitStats> {
  const bscScanUrl = "https://api.bscscan.com/api";
  const address = rawAddress.toLowerCase();
  const beingStakedCakes = await getCurrentCakeStakedInCurrentPool(
    address,
    currentPool
  );

  const response = await axios.get(bscScanUrl, {
    params: {
      module: "account",
      action: "txlist",
      address,
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "1000",
      sort: "asc",
      apikey: process.env.BSCSCAN_API_KEY,
    },
  });
  if (!response.status || !Number(response.data.status)) {
    throw new Error(response.data.message);
  }
  const poolInteractingContractTransactions = (
    response.data.result as BscScanApiTransaction[]
  ).filter((transaction) => {
    return (
      transaction.to.toLocaleLowerCase() ===
        currentPool.address.toLocaleLowerCase() && !Number(transaction.isError)
    );
  });
  const interestedMethodNames = currentPool.stakingMethods;
  const currentPrice = await getCakePriceAtTheTime(Date.now() / 1000);

  const outputResponses: OutputResponse[] = (
    await Promise.all(
      poolInteractingContractTransactions.map(async (t) => {
        const decodedInputData: DecodedMethodInfo = decodeTransactionInputData(
          t.input,
          currentPool.abi
        );
        if (!interestedMethodNames.includes(decodedInputData.name)) {
          return;
        }

        const transactionReceipt = await provider.getTransactionReceipt(t.hash);
        const priceAtTheTime = await getCakePriceAtTheTime(Number(t.timeStamp));
        const amountOfToken = getAmountOfTokenTransferFromLogs(
          transactionReceipt.logs,
          decodedInputData.name,
          address
        );
        const outputResponse = {
          method: decodedInputData.name,
          txHash: t.hash,
          createdTime: new Date(Number(t.timeStamp) * 1000),
          priceAtTheTime,
          amountOfToken,
          toUSDValue: priceAtTheTime * amountOfToken,
          efficientComparedToCurrentRate: currentPrice / priceAtTheTime,
        };
        return outputResponse;
      })
    )
  ).filter((o) => !!o);
  console.table(outputResponses, Object.keys(outputResponses[0]));
  const totalCost = calculateTotalCost(outputResponses);
  const totalProceed = calculateTotalProceed(outputResponses);
  console.log(
    `${currentPool.name} USD gain / loss: `,
    beingStakedCakes * currentPrice + totalProceed.usdCost - totalCost.usdCost
  );
  console.log(
    `${currentPool.name} deposited CAKE: `,
    totalCost.cakeCost - totalProceed.cakeCost
  );
  console.log(
    `earned cakes from staking: ${
      beingStakedCakes + totalProceed.cakeCost - totalCost.cakeCost
    }`
  );
  console.log(
    `DCA cake price (including rewards): ${
      (totalCost.usdCost - totalProceed.usdCost) / beingStakedCakes
    }`
  );

  return {
    outputResponses,
    gainOrLossInUsd:
      beingStakedCakes * currentPrice +
      totalProceed.usdCost -
      totalCost.usdCost,
  };
}
