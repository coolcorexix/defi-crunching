import {
  DEPOSIT_METHOD,
  ENTER_STAKING_METHOD,
  HARVEST_METHOD,
  LEAVE_STAKING_METHOD,
  WITHDRAW_ALL_METHOD,
  WITHDRAW_METHOD,
} from "backend-feature/profit-track/constants";
import { YieldFarmingContractInfo } from "backend-feature/profit-track/types";

export const ifoCakePool: YieldFarmingContractInfo = {
  name: "ifoCakePool",
  address: "0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8",
  abi: require("constants/abi/CakeSyrupPool.json"),
  stakingMethods: [DEPOSIT_METHOD, WITHDRAW_METHOD, WITHDRAW_ALL_METHOD],
};

export const autoCakePool: YieldFarmingContractInfo = {
  name: "autoCakePool",
  address: "0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC",
  abi: require("constants/abi/CakeSyrupPool.json"),
  stakingMethods: [
    DEPOSIT_METHOD,
    WITHDRAW_METHOD,
    WITHDRAW_ALL_METHOD,
    HARVEST_METHOD,
  ],
};
export const manualCakePool: YieldFarmingContractInfo = {
  name: "manualCakePool",
  address: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
  abi: require("constants/abi/ManualCakeSyrupPool.json"),
  stakingMethods: [ENTER_STAKING_METHOD, LEAVE_STAKING_METHOD],
};
