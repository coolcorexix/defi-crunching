import * as redis from "redis";

export async function getRedisClient() {
  const redisUrl = `redis://${process.env.REDIS_IPADDRESS}:${process.env.REDIS_PORT}`;
  console.log(
    "🚀 ~ file: redisClient.ts ~ line 5 ~ getRedisClient ~ redisUrl",
    redisUrl
  );
  const redisClient = redis.createClient({
    url: redisUrl,
    password: process.env.REDIS_PASS,
  });
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}
