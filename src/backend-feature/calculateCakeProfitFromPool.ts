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
import { autoCakePool, ifoCakePool, manualCakePool } from "./config/poolInfo";
import { provider } from "./context";
import { BscScanApiTransaction } from "./types";
import { decodeTransactionInputData } from "./utils/decodeInputData";
import { getAmountOfTokenTransferFromLogs } from "./profit-track/getAmountOfTokenTransferFromLogs";
import { calculateTotalCost } from "./profit-track/calculateTotalCost";
import { calculateTotalProceed } from "./profit-track/calculateTotalProceed";
import { getTransactionList } from "./getTransactionList";
import {
  AutoCakePool,
  CakeSyrupPool,
  ManualCakeSyrupPool,
} from "constants/abi/types";

async function getCurrentCakeStakedInCurrentPool(
  inspectingAddress: string,
  currentPool: YieldFarmingContractInfo
): Promise<number> {
  switch (currentPool.name) {
    case "manualCakePool": {
      const manualCakePoolContract = getContract(
        manualCakePool.address,
        manualCakePool.abi,
        provider
      ) as ManualCakeSyrupPool;
      // ref: https://github-coolcorexix/coolcorexix/pancakeswap-cli/blob/main/defi-journaling.md#L177
      const userInfo = await manualCakePoolContract.userInfo(
        0,
        inspectingAddress
      );
      return Number(userInfo.amount.toString());
    }
    case "ifoCakePool":
    case "autoCakePool": {
      const autoCakePoolContract = getContract(
        ifoCakePool.address,
        ifoCakePool.abi,
        provider
      ) as CakeSyrupPool;
      const pricePerFullShare =
        await autoCakePoolContract.getPricePerFullShare();
      const userShares = await autoCakePoolContract.userInfo(inspectingAddress);
      return (
        (Number(userShares.shares.toString()) *
          Number(pricePerFullShare.toString())) /
        Math.pow(10, DECIMALS * 2)
      );
    }
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

export interface CakePoolStats {
  poolName: string;
  gainOrLossInUsd: number;
  outputResponses: OutputResponse[];
  totalCost: {
    usd: number;
    cake: number;
  };
  totalProceed: {
    usd: number;
    cake: number;
  };
}

export async function calculateCakeProfitFromPool(
  rawAddress: string,
  transactionList: BscScanApiTransaction[],
  currentPool: YieldFarmingContractInfo
): Promise<CakePoolStats> {
  const address = rawAddress.toLowerCase();
  const beingStakedCakes = await getCurrentCakeStakedInCurrentPool(
    address,
    currentPool
  );

  const poolInteractingContractTransactions = (
    transactionList as BscScanApiTransaction[]
  ).filter((transaction) => {
    return (
      transaction.to.toLocaleLowerCase() ===
        currentPool.address.toLocaleLowerCase() && !Number(transaction.isError)
    );
  });
  const interestedMethodNames = currentPool.stakingMethods;
  const currentPrice = await getCakePriceAtTheTime(
    Math.floor(Date.now() / 1000)
  );

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
  const totalCost = calculateTotalCost(outputResponses);
  console.log(
    "🚀 ~ file: calculateCakeProfitFromPool.ts ~ line 106 ~ totalCost",
    totalCost
  );
  const totalProceed = calculateTotalProceed(outputResponses);
  console.log(
    "🚀 ~ file: calculateCakeProfitFromPool.ts ~ line 108 ~ totalProceed",
    totalProceed
  );
  console.log(
    "🚀 ~ file: calculateCakeProfitFromPool.ts ~ line 112 ~ currentPrice",
    currentPrice
  );
  console.log(
    "🚀 ~ file: calculateCakeProfitFromPool.ts ~ line 113 ~ beingStakedCakes",
    beingStakedCakes
  );
  console.log(
    `${currentPool.name} USD gain / loss: `,
    beingStakedCakes * currentPrice + totalProceed.usd - totalCost.usd
  );
  console.log(
    `${currentPool.name} deposited CAKE: `,
    totalCost.cake - totalProceed.cake
  );
  console.log(
    `earned cakes from staking: ${
      beingStakedCakes + totalProceed.cake - totalCost.cake
    }`
  );
  console.log(
    `DCA cake price (including rewards): ${
      totalCost.usd / (totalCost.cake + beingStakedCakes)
    }`
  );

  return {
    poolName: currentPool.name,
    outputResponses,
    totalCost,
    totalProceed,
    gainOrLossInUsd:
      beingStakedCakes * currentPrice + totalProceed.usd - totalCost.usd,
  };
}
