import { JsonRpcProvider } from "@ethersproject/providers";
import { getChainId } from "backend-feature/context";
import getRpcUrl from "backend-feature/utils/getRpcUrl";

export function initRpcProvider() {
  const RPC_URL = getRpcUrl(getChainId());
  return new JsonRpcProvider(RPC_URL);
}
