import { CLARIFAI_API_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { image1Url, image2Url } = await request.json();

	try {
		// 임시 응답 - 실제 구현은 나중에 추가
		return new Response(JSON.stringify({
			similarity: 0.95,
			isMatch: true
		}));

	} catch (err) {
		console.error('Image comparison error:', err);
		throw error(500, 'Failed to compare images');
	}
}; 