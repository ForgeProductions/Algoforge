// Simple in-memory cache to replace Redis for local development without containers.

interface CacheItem {
  value: unknown;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheItem>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  const item = memoryCache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return item.value as T;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const expiresAt = Date.now() + (ttlSeconds * 1000);
  memoryCache.set(key, { value, expiresAt });
}

export async function cacheDel(key: string): Promise<void> {
  memoryCache.delete(key);
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  // Basic pattern matching (assuming * is the only wildcard)
  const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
}
