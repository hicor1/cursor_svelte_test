<script lang="ts">
	import { onMount } from 'svelte';

	let productUrl = '';
	let loading = false;
	let error = '';

	interface PriceHistory {
		date: string;
		price: number;
		platform: string;
	}

	// 샘플 데이터
	let trackedProducts = [
		{
			id: 1,
			name: 'Nike Dunk Low Retro White Black',
			image: 'https://kream-phinf.pstatic.net/MjAyMjAxMTFfMjIw/MDAxNjQxODY4NjE5MjM3.eFu3uqJGfDMfVy9LEuQwwdZhUBvD52VqOA7GJQNxPQsg.Dr_VWxc8wXE6pv6hVwgGz_rQXHGj_QypsXYcUgxzZekg.PNG/a_baa1ccea3726495badba419dfede63f9.png',
			currentPrice: 139000,
			lowestPrice: 129000,
			highestPrice: 159000,
			platform: 'KREAM',
			priceHistory: [
				{ date: '2024-03-01', price: 149000, platform: 'KREAM' },
				{ date: '2024-03-02', price: 145000, platform: 'KREAM' },
				{ date: '2024-03-03', price: 139000, platform: 'KREAM' }
			] as PriceHistory[]
		},
		{
			id: 2,
			name: 'Jordan 1 Low Golf Travis Scott Neutral Olive',
			image: 'https://kream-phinf.pstatic.net/MjAyMzExMDFfMjE5/MDAxNjk4ODIxNDU4ODY4.V8e5rZz0Yl6GXQM_RZHxGn8lZmaPNKQPLKO5wz5i0Ykg.5Hs6QBZF_Gg5OOKpGLPYP8PPPjZJL9kxAYKLkO_Itukg.PNG/a_7ee415b505d24f0c8ef86e4b2d457da6.png',
			currentPrice: 289000,
			lowestPrice: 279000,
			highestPrice: 309000,
			platform: 'KREAM',
			priceHistory: [
				{ date: '2024-03-01', price: 299000, platform: 'KREAM' },
				{ date: '2024-03-02', price: 295000, platform: 'KREAM' },
				{ date: '2024-03-03', price: 289000, platform: 'KREAM' }
			] as PriceHistory[]
		}
	];

	const addProduct = () => {
		if (!productUrl) {
			error = 'URL을 입력해주세요';
			return;
		}
		loading = true;
		// 실제로는 여기서 API 호출을 통해 상품 정보를 가져옵니다
		setTimeout(() => {
			loading = false;
			productUrl = '';
			error = '';
		}, 1500);
	};
</script>

<div class="container">
	<h2>가격 추적</h2>
	<div class="add-product">
		<input
			type="text"
			bind:value={productUrl}
			placeholder="상품 URL을 입력하세요"
			class:error={error}
		/>
		<button on:click={addProduct} disabled={loading}>
			{#if loading}
				추가 중...
			{:else}
				추가하기
			{/if}
		</button>
		{#if error}
			<p class="error-message">{error}</p>
		{/if}
	</div>

	<div class="products">
		{#each trackedProducts as product}
			<div class="product-card">
				<img src={product.image} alt={product.name} />
				<div class="product-info">
					<h3>{product.name}</h3>
					<div class="price-info">
						<p class="current-price">현재가: {product.currentPrice.toLocaleString()}원</p>
						<p class="price-range">
							최저 {product.lowestPrice.toLocaleString()}원 ~ 최고 {product.highestPrice.toLocaleString()}원
						</p>
					</div>
					<div class="platform">{product.platform}</div>
					<div class="price-history">
						<h4>가격 변동</h4>
						<div class="history-list">
							{#each product.priceHistory as { date, price }}
								<div class="history-item">
									<span>{date}</span>
									<span>{price.toLocaleString()}원</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 40px auto;
		padding: 0 20px;
	}

	h2 {
		color: #333;
		margin-bottom: 30px;
	}

	.add-product {
		margin-bottom: 40px;
		display: flex;
		gap: 10px;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	input {
		flex: 1;
		min-width: 300px;
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-size: 16px;
	}

	input.error {
		border-color: #ff6b6b;
	}

	button {
		padding: 12px 24px;
		background: #ff6b6b;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		transition: background 0.2s;
	}

	button:hover {
		background: #ff5252;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.error-message {
		width: 100%;
		color: #ff6b6b;
		margin: 5px 0 0;
		font-size: 14px;
	}

	.products {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
	}

	.product-card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		overflow: hidden;
		border: 1px solid #eee;
	}

	.product-card img {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.product-info {
		padding: 20px;
	}

	.product-info h3 {
		margin: 0 0 15px;
		font-size: 18px;
		color: #333;
	}

	.price-info {
		margin-bottom: 15px;
	}

	.current-price {
		font-size: 20px;
		font-weight: bold;
		color: #ff6b6b;
		margin: 0 0 5px;
	}

	.price-range {
		font-size: 14px;
		color: #666;
		margin: 0;
	}

	.platform {
		display: inline-block;
		padding: 4px 8px;
		background: #f8f9fa;
		border-radius: 4px;
		font-size: 14px;
		color: #666;
		margin-bottom: 15px;
	}

	.price-history {
		border-top: 1px solid #eee;
		padding-top: 15px;
	}

	.price-history h4 {
		margin: 0 0 10px;
		font-size: 16px;
		color: #333;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.history-item {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		color: #666;
	}
</style> 