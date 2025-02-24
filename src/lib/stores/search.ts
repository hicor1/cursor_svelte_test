import { writable } from 'svelte/store';
import type { GroupedResult } from '$lib/types';

// 캐시 저장소
const searchCache = new Map<string, {
    data: GroupedResult[];
    timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5분

// 캐시된 검색 결과를 관리하는 store
function createSearchStore() {
    const { subscribe, set } = writable<GroupedResult[]>([]);

    return {
        subscribe,
        set,
        async search(query: string) {
            // 캐시 확인을 더 빠르게
            const cached = searchCache.get(query);
            const now = Date.now();

            if (cached && (now - cached.timestamp) < CACHE_DURATION) {
                set(cached.data);
                return cached.data;
            }

            try {
                // API 호출 전에 로딩 상태 설정
                set([]); // 또는 loading 상태 추가

                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache' // 브라우저 캐싱 방지
                    },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) throw new Error('검색 실패');

                const results = await response.json();
                
                // 결과 캐싱 및 상태 업데이트
                searchCache.set(query, { data: results, timestamp: now });
                set(results);
                return results;

            } catch (error) {
                console.error('Search error:', error);
                throw error;
            }
        },
        // 캐시 초기화 함수 추가
        clearCache() {
            searchCache.clear();
            set([]);
        }
    };
}

export const searchResults = createSearchStore(); 