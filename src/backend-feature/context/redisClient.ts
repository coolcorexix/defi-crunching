import * as redis from "redis";

const redisClient = redis.createClient();

export async function getRedisClient() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    return redisClient;
}
