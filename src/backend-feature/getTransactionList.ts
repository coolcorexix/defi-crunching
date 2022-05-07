import axios from "axios";
import { BscScanApiTransaction } from "./types";

export async function getTransactionList(
  address: string
): Promise<BscScanApiTransaction[]> {
  const bscScanUrl = "https://api.bscscan.com/api";
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
  return response.data.result;
}
