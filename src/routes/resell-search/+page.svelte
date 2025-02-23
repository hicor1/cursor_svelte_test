<script lang="ts">
	import type { GroupedResult, MarketData } from '$lib/types';
	let searchQuery = '';
	let searching = false;
	let results: GroupedResult[] = [];

	interface SearchResult {
		site: string;
		siteName: string;
		productName: string;
		price: number;
		imageUrl: string;
		options: ProductOption[];
		url: string;
	}

	interface ProductOption {
		size: string;
		price: number;
		stock: number;
	}

	async function searchProducts() {
		if (searchQuery.length < 2) {
			alert('검색어는 2글자 이상 입력해야 합니다.');
			return;
		}
		searching = true;
		try {
			const response = await fetch('/api/search', {
				method: 'POST',
				body: JSON.stringify({ query: searchQuery })
			});
			results = await response.json();
			if (results.length === 0) {
				alert(`검색어 "${searchQuery}"에 일치하는 검색결과가 없습니다.`);
			}
		} finally {
			searching = false;
		}
	}
</script>

<div class="search-container">
	<h1>리셀서치</h1>
	<div class="search-box">
		<input 
			type="text" 
			bind:value={searchQuery}
			placeholder="상품번호 또는 상품명을 입력하세요 (예: Nike HR4402-2)"
			on:keydown={(e) => e.key === 'Enter' && searchProducts()}
		/>
		<button on:click={searchProducts} disabled={searching}>
			{searching ? '검색중...' : '검색'}
		</button>
	</div>

	{#if searching}
		<div class="loading">
			<span>여러 사이트에서 검색중입니다...</span>
		</div>
	{:else if results.length > 0}
		<div class="results">
			{#each results as product}
				<div class="product-group">
					<div class="product-info">
						<div class="product-header">
							<h2 class="product-title">{product.productName}</h2>
							<span class="product-id">{product.productId}</span>
						</div>
						
						<div class="size-options">
							{#each Object.entries(product.options) as [size, sizeData]}
								<div class="size-group">
									<div class="size-info-container">
										<div class="size-header">
											<h3 class="size-title">{size}</h3>
											<div class="price-range">
												<div class="price-item">
													<span class="label">최저가</span>
													<span class="price min">{Math.min(...Object.values(sizeData.markets).map(m => m.price)).toLocaleString()}원</span>
												</div>
												<div class="divider">~</div>
												<div class="price-item">
													<span class="label">최고가</span>
													<span class="price max">{Math.max(...Object.values(sizeData.markets).map(m => m.price)).toLocaleString()}원</span>
												</div>
												<div class="market-count">
													<span class="label">판매처</span>
													<span class="count">{Object.keys(sizeData.markets).length}개</span>
												</div>
											</div>
										</div>
									</div>
									<div class="market-row">
										{#each Object.entries(sizeData.markets)
											.sort(([, a], [, b]) => a.price - b.price) as [marketType, marketData]}
											<a 
												href={marketData.url} 
												target="_blank" 
												rel="noopener noreferrer" 
												class="market-card"
											>
												<div class="market-image">
													<img 
														src={marketData.imageUrl || '/images/no-image.svg'} 
														alt={`${product.productName} - ${size}`}
														class={!marketData.imageUrl.includes('http') ? 'no-image' : ''}
													/>
												</div>
												<div class="market-info">
													<span class="market-name">{marketType}</span>
													<div class="option-info">
														{#if marketData.compareOption1}
															<span class="option-tag">{marketData.compareOption1}</span>
														{/if}
														{#if marketData.compareOption2 && marketData.compareOption2 !== marketData.compareOption1}
															<span class="option-tag">{marketData.compareOption2}</span>
														{/if}
													</div>
													<span class="market-price">{marketData.price.toLocaleString()}원</span>
													<span class="stock-info">재고: {marketData.stock}개</span>
												</div>
											</a>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="no-results">
			<span>검색어 "{searchQuery}"에 일치하는 검색결과가 없습니다.</span>
		</div>
	{/if}
</div>

<style>
	.search-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.search-box {
		display: flex;
		gap: 10px;
		margin-bottom: 30px;
	}

	input {
		flex: 1;
		padding: 15px;
		border: 2px solid #ddd;
		border-radius: 8px;
		font-size: 16px;
	}

	button {
		padding: 0 30px;
		background: #ff6b6b;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
	}

	.result-card {
		display: flex;
		gap: 20px;
		padding: 20px;
		background: white;
		border-radius: 12px;
		margin-bottom: 20px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}

	.result-card img {
		width: 200px;
		height: 200px;
		object-fit: contain;
	}

	.options {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 10px;
		margin-top: 10px;
	}

	.option {
		padding: 8px;
		background: #f8f9fa;
		border-radius: 4px;
		text-align: center;
	}

	.product-group {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}

	.product-header {
		border-bottom: 2px solid #eee;
		padding-bottom: 1rem;
		margin-bottom: 1.5rem;
	}

	.product-title {
		font-size: 1.3rem;
		margin: 0;
	}

	.product-id {
		display: block;
		color: #666;
		font-size: 1rem;
		margin-top: 0.3rem;
	}

	.size-group {
		margin-bottom: 2rem;
		border-bottom: 1px solid #eee;
		padding-bottom: 1rem;
	}

	.size-info-container {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.size-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.size-title {
		font-size: 1.2rem;
		color: #333;
		margin: 0;
		font-weight: bold;
		min-width: 120px;
	}

	.price-range {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex: 1;
	}

	.price-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.label {
		font-size: 0.8rem;
		color: #666;
		margin-bottom: 0.2rem;
	}

	.price {
		font-weight: bold;
		font-size: 1.1rem;
	}

	.price.min {
		color: #2b8a3e;
	}

	.price.max {
		color: #e03131;
	}

	.divider {
		color: #adb5bd;
		font-weight: bold;
	}

	.market-count {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-left: 1.5rem;
		border-left: 1px solid #dee2e6;
	}

	.count {
		font-weight: bold;
		font-size: 1.1rem;
		color: #1971c2;
	}

	.market-row {
		display: flex;
		overflow-x: auto;
		gap: 1rem;
		padding: 0.5rem 0;
		-webkit-overflow-scrolling: touch;
	}

	.market-card {
		flex: 0 0 auto;
		min-width: 200px;
		max-width: 280px;
		width: fit-content;
		display: flex;
		gap: 0.5rem;
		padding: 0.6rem;
		border: 1px solid #eee;
		border-radius: 6px;
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s;
	}

	.market-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}

	.market-image {
		width: 50px;
		height: 50px;
		flex-shrink: 0;
	}

	.market-image img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.market-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		justify-content: start;
		min-width: 0;
		width: fit-content;
	}

	.market-name {
		font-size: 0.85rem;
		font-weight: bold;
		margin-bottom: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.market-price {
		color: #ff6b6b;
		font-weight: bold;
		font-size: 0.95rem;
		line-height: 1;
	}

	.stock-info {
		color: #28a745;
		font-size: 0.75rem;
		margin: 0;
		line-height: 1;
	}

	.market-image img.no-image {
		padding: 8px;
		background: #f8f9fa;
	}

	/* 스크롤바 스타일링 */
	.market-row::-webkit-scrollbar {
		height: 8px;
		margin-top: 5px;
	}

	.market-row::-webkit-scrollbar-track {
		background: #e9ecef;
		border-radius: 4px;
		margin: 0 5px;
	}

	.market-row::-webkit-scrollbar-thumb {
		background: #adb5bd;
		border-radius: 4px;
		border: 2px solid #e9ecef;
	}

	.market-row::-webkit-scrollbar-thumb:hover {
		background: #868e96;
	}

	.option-info {
		display: flex;
		gap: 0.3rem;
		flex-wrap: wrap;
		margin: 0.2rem 0;
		width: fit-content;
	}

	.option-tag {
		font-size: 0.75rem;
		padding: 0.1rem 0.3rem;
		background: #f1f3f5;
		border-radius: 3px;
		color: #495057;
		white-space: nowrap;
	}

	.market-info-table {
		margin-top: 0;
		width: auto;
		border-collapse: collapse;
	}

	.market-info-table th, .market-info-table td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: center;
	}

	.market-info-table th {
		background-color: #f2f2f2;
	}

	.no-results {
		margin-top: 20px;
		font-size: 1.2rem;
		color: #ff6b6b;
		text-align: center;
	}
</style> 