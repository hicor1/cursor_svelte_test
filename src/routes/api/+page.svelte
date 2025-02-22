<script lang="ts">
	import { onMount } from 'svelte';

	interface Post {
		title: string;
		body: string;
	}

	interface CryptoData {
		[key: string]: {
			usd: number;
		};
	}

	let posts: Post[] = [];
	let loading = true;
	let error: string | null = null;

	// 암호화폐 데이터
	let crypto: CryptoData = {};
	let cryptoLoading = true;

	onMount(async () => {
		try {
			// JSON Placeholder API에서 게시물 데이터 가져오기
			const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
			posts = await postsResponse.json();
			posts = posts.slice(0, 5); // 처음 5개만 표시

			// CoinGecko API에서 암호화폐 데이터 가져오기
			const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd');
			crypto = await cryptoResponse.json();

		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred';
			}
		} finally {
			loading = false;
			cryptoLoading = false;
		}
	});
</script>

<div class="container">
	<h2>API 테스트</h2>

	<div class="api-sections">
		<!-- 게시물 섹션 -->
		<section class="api-section">
			<h3>게시물 데이터</h3>
			{#if loading}
				<p>Loading posts...</p>
			{:else if error}
				<p class="error">Error: {error}</p>
			{:else}
				<div class="posts">
					{#each posts as post}
						<div class="post-card">
							<h4>{post.title}</h4>
							<p>{post.body}</p>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- 암호화폐 섹션 -->
		<section class="api-section">
			<h3>암호화폐 시세</h3>
			{#if cryptoLoading}
				<p>Loading crypto data...</p>
			{:else}
				<div class="crypto-cards">
					<div class="crypto-card">
						<h4>Bitcoin</h4>
						<p>${crypto.bitcoin?.usd || 'N/A'}</p>
					</div>
					<div class="crypto-card">
						<h4>Ethereum</h4>
						<p>${crypto.ethereum?.usd || 'N/A'}</p>
					</div>
					<div class="crypto-card">
						<h4>Ripple</h4>
						<p>${crypto.ripple?.usd || 'N/A'}</p>
					</div>
				</div>
			{/if}
		</section>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.api-sections {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
		margin-top: 20px;
	}

	.api-section {
		background: white;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.post-card {
		background: #f8f9fa;
		border-radius: 4px;
		padding: 15px;
		margin-bottom: 15px;
	}

	.post-card h4 {
		margin: 0 0 10px 0;
		color: #333;
		text-transform: capitalize;
	}

	.post-card p {
		margin: 0;
		color: #666;
		font-size: 0.9em;
	}

	.crypto-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 10px;
	}

	.crypto-card {
		background: #f1f8e9;
		border-radius: 4px;
		padding: 15px;
		text-align: center;
	}

	.error {
		color: #dc3545;
		padding: 10px;
		background: #f8d7da;
		border-radius: 4px;
	}

	h2 {
		color: #333;
		margin-bottom: 20px;
	}

	h3 {
		color: #666;
		margin-top: 0;
		margin-bottom: 15px;
	}
</style>

<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
	<path fill="#ff6b6b" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13v10h2v-4h2l2 4h2l-2-4c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-6zm2 2h4v2h-4v-2z"/>
</svg> 