export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export const TTL = {
  WARNINGS: 30 * 60 * 1000,    // 30 minutes
  FORECASTS: 3 * 60 * 60 * 1000 // 3 hours
};

class WeatherCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private inFlight: Map<string, Promise<any>> = new Map();

  get<T>(key: string): { data: T; timestamp: number } | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return { data: entry.data, timestamp: entry.timestamp };
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs
    });
  }

  // In-flight request de-duplication + cache lookup + retry
  async getOrFetch<T>(
    key: string,
    ttlMs: number,
    fetcher: () => Promise<T>
  ): Promise<{ data: T; last_updated: string; from_cache: boolean }> {
    const cached = this.get<T>(key);
    if (cached) {
      return {
        data: cached.data,
        last_updated: new Date(cached.timestamp).toISOString(),
        from_cache: true
      };
    }

    // Check if identical request is already in-flight
    if (this.inFlight.has(key)) {
      const data = await this.inFlight.get(key);
      return {
        data,
        last_updated: new Date().toISOString(),
        from_cache: true
      };
    }

    // Initiate new fetch with de-duplication
    const fetchPromise = this.retryWithBackoff(fetcher, 3, 400)
      .then(result => {
        this.set(key, result, ttlMs);
        this.inFlight.delete(key);
        return result;
      })
      .catch(err => {
        this.inFlight.delete(key);
        throw err;
      });

    this.inFlight.set(key, fetchPromise);
    const data = await fetchPromise;

    return {
      data,
      last_updated: new Date().toISOString(),
      from_cache: false
    };
  }

  // Exponential backoff with jitter
  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delayMs = 400
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (attempt === maxRetries) break;
        const jitter = Math.random() * 100;
        const wait = delayMs * Math.pow(2, attempt - 1) + jitter;
        await new Promise(r => setTimeout(r, wait));
      }
    }
    throw lastError;
  }

  clear(): void {
    this.cache.clear();
    this.inFlight.clear();
  }
}

export const weatherCache = new WeatherCache();
