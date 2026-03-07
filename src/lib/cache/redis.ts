import Redis from "ioredis";
import { logger } from "@/lib/utils/logger";

// Simple in-memory cache to replace Redis for local development without containers.
interface CacheItem {
  value: unknown;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheItem>();

let redisClient: Redis | null = null;

if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL);
    redisClient.on("error", (err) => {
      logger.error("Redis connection error", err);
    });
    logger.info("Redis client connected");
  } catch (err) {
    logger.error("Failed to initialize Redis client", err);
  }
} else {
  logger.info("No REDIS_URL found, falling back to in-memory cache");
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (redisClient) {
    try {
      const data = await redisClient.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      logger.error(`Redis cacheGet error for key ${key}`, err);
      return null;
    }
  }

  // Fallback to in-memory cache
  const item = memoryCache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return item.value as T;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (err) {
      logger.error(`Redis cacheSet error for key ${key}`, err);
    }
    return;
  }

  // Fallback to in-memory cache
  const expiresAt = Date.now() + (ttlSeconds * 1000);
  memoryCache.set(key, { value, expiresAt });
}

export async function cacheDel(key: string): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.del(key);
    } catch (err) {
      logger.error(`Redis cacheDel error for key ${key}`, err);
    }
    return;
  }

  // Fallback to in-memory cache
  memoryCache.delete(key);
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  if (redisClient) {
    try {
      const stream = redisClient.scanStream({
        match: pattern,
        count: 100,
      });

      stream.on("data", async (keys: string[]) => {
        if (keys.length) {
          const pipeline = redisClient!.pipeline();
          keys.forEach((key) => {
            pipeline.del(key);
          });
          await pipeline.exec();
        }
      });

      stream.on("end", () => {
        // completed
      });

      // Wait for stream to end. Using a simple Promise since ioredis stream doesn't await natively for data process in straightforward way without Promise wrapper.
      await new Promise<void>((resolve, reject) => {
          stream.on("end", resolve);
          stream.on("error", reject);
      });

    } catch (err) {
      logger.error(`Redis cacheDelPattern error for pattern ${pattern}`, err);
    }
    return;
  }

  // Fallback to in-memory cache: Basic pattern matching (assuming * is the only wildcard)
  const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
}
