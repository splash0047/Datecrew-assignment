import { ENV } from '../../config/env';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

export const aiCache = {
  /**
   * Generates a unique cache key for a client-match pair
   */
  generateKey(clientId: string, matchId: string, suffix: string): string {
    return `tdc_ai_cache_${clientId}_${matchId}_${suffix}`;
  },

  /**
   * Reads from cache, returns null if missing, expired, or version mismatch
   */
  get<T>(key: string, currentVersion: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const entry = JSON.parse(raw) as CacheEntry<T>;
      const isExpired = Date.now() - entry.timestamp > ENV.CACHE_EXPIRY_MS;
      const isVersionMismatch = entry.version !== currentVersion;

      if (isExpired || isVersionMismatch) {
        localStorage.removeItem(key);
        return null;
      }

      return entry.data;
    } catch (e) {
      console.warn('AI Cache read failed:', e);
      return null;
    }
  },

  /**
   * Writes to cache
   */
  set<T>(key: string, data: T, version: string): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      console.warn('AI Cache write failed:', e);
    }
  },

  /**
   * Clears specific cache item
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }
};
