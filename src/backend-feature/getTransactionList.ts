import axios from "axios";
import { getRedisClient } from "./context/redisClient";
import { BscScanApiTransaction } from "./types";

export async function getTransactionList(
  address: string
): Promise<BscScanApiTransaction[]> {
  const redisClient = await getRedisClient();
  const bscScanUrl = "https://api.bscscan.com/api";
  const redisKey = `transactions-${address}`;
  const redisCacheData = await redisClient.get(redisKey);
  if (!redisCacheData) {
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
    redisClient.setEx(redisKey, 300, JSON.stringify(response.data.result));
    return response.data.result;
  }
  console.log('trans hit cache!');
  return JSON.parse(redisCacheData);
}
