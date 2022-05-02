import { Log } from "@ethersproject/abstract-provider";
import { ERC20_INTERFACE } from "contract/interface/erc20";
import {
  DECIMALS,
  inflowMethods,
  outflowMethods,
  TRANSFER_TOPIC,
} from "./constants";

function convertInputDataToAddressFormat(hexData: string) {
  return hexData.replace("000000000000000000000000", "");
}

const transferTopic = ERC20_INTERFACE.getEventTopic("Transfer");

export function getAmountOfTokenTransferFromLogs(
  logs: Log[],
  methodName: string,
  inspectingAddress: string
) {
  const transferToAccountLogs = logs.filter((log) => {
    if (inflowMethods.includes(methodName)) {
      return (
        log.topics[0] === transferTopic &&
        convertInputDataToAddressFormat(log.topics[1]) === inspectingAddress
      );
    }
    if (outflowMethods.includes(methodName)) {
      return (
        log.topics[0] === transferTopic &&
        convertInputDataToAddressFormat(log.topics[2]) === inspectingAddress
      );
    }
  });
  return transferToAccountLogs.reduce((acc, transferLog) => {
    return acc + parseInt(transferLog?.data, 16) / Math.pow(10, DECIMALS);
  }, 0);
}
