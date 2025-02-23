interface Post {
	id: number;
	title: string;
	body: string;
	userId: number;
}

export const load = async () => {
	try {
		const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
		const posts: Post[] = await postsResponse.json();

		return {
			posts: posts.slice(0, 5),
			error: null
		};
	} catch (error) {
		console.error('Error fetching posts:', error);
		return {
			posts: [],
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
};