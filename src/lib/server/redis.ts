import { Redis } from 'ioredis';
import { REDIS_URL } from '$env/static/private';

const CACHE_EXPIRY = 60 * 60; // 1시간

export class CacheManager {
    private redis: Redis;
    
    constructor() {
        this.redis = new Redis(REDIS_URL);
    }

    async invalidateCache(pattern: string) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }

    async refreshCache(query: string, data: any) {
        const cacheKey = `search:${query}`;
        await this.redis.setex(cacheKey, CACHE_EXPIRY, JSON.stringify(data));
    }
} 