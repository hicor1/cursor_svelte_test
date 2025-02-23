import { json } from '@sveltejs/kit';
import { searchProducts } from '$lib/server/sheets';
import { MemoryCache } from '$lib/server/cache';

export async function POST({ request }) {
	const { query, searchFields } = await request.json();
	const cacheKey = `search_${query}`;
	
	try {
		// 캐시 확인
		const cachedResult = MemoryCache.get(cacheKey);
		if (cachedResult) {
			return json(cachedResult);
		}

		// 캐시가 없으면 실제 검색 수행
		const results = await searchProducts(query);
		
		// 결과 캐싱
		MemoryCache.set(cacheKey, results);
		
		return json(results);
	} catch (error) {
		console.error('Search error:', error);
		return json({ error: 'Search failed' }, { status: 500 });
	}
} 