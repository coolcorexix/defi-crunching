export interface ContractInfo {
  name: string;
  address: string;
  abi: string;
}
export interface YieldFarmingContractInfo extends ContractInfo {
  stakingMethods: string[];
}

export interface DecodedMethodInfo {
  name: string;
  params: {
    name: string;
    value: string;
    type: string;
  }[];
}

export interface OutputResponse {
  createdTime: Date;
  txHash: string;
  method: string;
  priceAtTheTime: number;
  amountOfToken: number;
  toUSDValue: number;
  efficientComparedToCurrentRate: number;
}