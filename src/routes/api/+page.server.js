export async function load() {
	try {
		const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
		const posts = await postsResponse.json();

		return {
			posts: posts.slice(0, 5),
			error: null
		};
	} catch (error) {
		return {
			posts: [],
			error: error.message
		};
	}
} 