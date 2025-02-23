interface CacheItem<T> {
    data: T;
    timestamp: number;
}

export class MemoryCache {
    private static cache = new Map<string, CacheItem<any>>();
    private static CACHE_DURATION = 3600 * 1000; // 1시간 (밀리초)

    static set(key: string, data: any) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    static get(key: string): any | null {
        const item = this.cache.get(key);
        if (!item) return null;

        // 캐시 만료 체크
        if (Date.now() - item.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    static clear() {
        this.cache.clear();
    }

    // 만료된 캐시 정리
    static cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > this.CACHE_DURATION) {
                this.cache.delete(key);
            }
        }
    }
}

// 싱글톤 인스턴스 생성
export const searchCache = new MemoryCache(); 