import { searchProducts } from '$lib/server/sheets';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { query } = await request.json();
	
	try {
		const results = await searchProducts(query);
		return new Response(JSON.stringify(results));
	} catch (err) {
		console.error('Search error:', err);
		return new Response(JSON.stringify({ error: 'Failed to search products' }), {
			status: 500
		});
	}
}; 