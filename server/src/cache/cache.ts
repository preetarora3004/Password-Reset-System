export class Cache {
    public cache: Map<string, { token: string; ttl: number }>;
    public freq: Map<string, number>;

    constructor() {
        this.cache = new Map();
        this.freq = new Map();
    }

    public cacheItem(userId: string, token: string, ttl: number) {
        this.cache.set(userId, { token: token, ttl: ttl + 15 * 60 * 1000 });
        return true;
    }

    public removeCache(userId: string) {
        return this.cache.delete(userId);
    }
}
