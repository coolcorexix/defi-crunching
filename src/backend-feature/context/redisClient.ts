import * as redis from "redis";

export async function getRedisClient() {
  const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_IPADDRESS}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASS,
  });
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}
