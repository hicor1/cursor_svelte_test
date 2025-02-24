import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import type { GroupedResult } from '$lib/types';

export async function POST({ request }) {
	try {
		const { query } = await request.json();
		
		const { data, error } = await supabase
			.from('market_price')
			.select('*')
			.or(`기준_제품명_원문.ilike.%${query}%,기준_품번_1.ilike.%${query}%`);

		if (error) throw error;

		// 데이터를 GroupedResult 형식으로 변환
		const grouped = data?.reduce<Record<string, GroupedResult>>((acc, row) => {
			const productId = row.기준_품번_1;
			
			if (!acc[productId]) {
				acc[productId] = {
					productId,
					productName: row.기준_제품명_원문,
					options: {}
				};
			}

			const size = row.기준_옵션_1;
			if (!acc[productId].options[size]) {
				acc[productId].options[size] = {
					markets: {}
				};
			}

			acc[productId].options[size].markets[row.기준_마켓구분] = {
				siteName: row.기준_마켓구분,
				price: row.비교_즉시구매가격,
				stock: row.비교_재고량,
				url: row.비교_제품_URL,
				imageUrl: row.비교_이미지_URL,
				compareOption1: row.비교_옵션_1,
				compareOption2: row.비교_옵션_2
			};

			return acc;
		}, {});

		return json(Object.values(grouped));

	} catch (error) {
		console.error('Search error:', error);
		return json({ error: 'Search failed' }, { status: 500 });
	}
} 