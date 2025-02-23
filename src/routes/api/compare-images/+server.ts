import { CLARIFAI_API_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as clarifai from 'clarifai-nodejs-grpc';

const stub = new clarifai.ClarifaiStub();

export const POST: RequestHandler = async ({ request }) => {
	const { image1Url, image2Url } = await request.json();

	try {
		const metadata = new clarifai.grpc.Metadata();
		metadata.set("authorization", `Key ${CLARIFAI_API_KEY}`);

		// Clarifai API 호출 로직
		// 실제 구현시에는 여기에 Clarifai의 이미지 비교 로직이 들어갑니다

		// 임시 응답
		return new Response(JSON.stringify({
			similarity: 0.95,
			isMatch: true
		}));

	} catch (err) {
		console.error('Image comparison error:', err);
		throw error(500, 'Failed to compare images');
	}
}; 