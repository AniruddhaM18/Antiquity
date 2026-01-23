import Redis from "ioredis";

//create a new redis clinet

export const redis = new Redis.default({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times: any) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: 3
});


//connection events 
redis.on("connect", ()=> {
    console.log("Redis connected")
});

redis.on("error", (err)=> {
    console.log("redis error : ", err)
});

redis.on("close", ()=> {
    console.log("redis connection closed")
})

export default redis;

