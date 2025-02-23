import type { SearchResult, CacheItem } from '$lib/types';

class SearchCache {
    private cache: Map<string, CacheItem>;
    private readonly CACHE_DURATION = 1000 * 60 * 5; // 5분

    constructor() {
        this.cache = new Map();
    }

    get(key: string): SearchResult[] | null {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        // 캐시 만료 체크
        if (Date.now() - item.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    set(key: string, data: SearchResult[]) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // 인기 검색어 캐시는 더 오래 보관
    setPopular(key: string, data: SearchResult[]) {
        this.cache.set(`popular_${key}`, {
            data,
            timestamp: Date.now()
        });
    }

    // 캐시 정리 (만료된 항목 제거)
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > this.CACHE_DURATION) {
                this.cache.delete(key);
            }
        }
    }
}

// 싱글톤 인스턴스 생성
export const searchCache = new SearchCache(); 