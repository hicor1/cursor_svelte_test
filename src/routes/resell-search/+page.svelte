<script lang="ts">
	import type { GroupedResult, MarketData, SearchResult, ProductOption, TagInfo } from '$lib/types';
	import { onMount } from 'svelte';
	let searchQuery = '';
	let searching = false;
	let results: GroupedResult[] = [];
	let verticalLayout = true;
	let selectedSize: string = '';
	let animatingSize = false;
	let tagContainerWidth = 0;
	let recentSearches: string[] = [];
	let selectedProductId = '';
	let showAllSizes = false;
	const MAX_VISIBLE_SIZES = 12;  // 2줄에 표시할 사이즈 개수 (6개씩 2줄)
	let showSearchHistory = false;
	let searchInputFocused = false;
	const MAX_RECENT_SEARCHES = 10;  // 최대 10개까지 저장

	// 페이지 로드시 최근 검색어 불러오기
	onMount(() => {
		const saved = localStorage.getItem('recentSearches');
		if (saved) {
			recentSearches = JSON.parse(saved);
		}
	});

	// 최근 검색어 저장
	function addRecentSearch(query: string) {
		const newSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
		recentSearches = newSearches;
		localStorage.setItem('recentSearches', JSON.stringify(newSearches));
	}

	// 최근 검색어 삭제
	function removeRecentSearch(query: string) {
		recentSearches = recentSearches.filter(s => s !== query);
		localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
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
				body: JSON.stringify({ 
					query: searchQuery,
					searchFields: [
						{ field: 'productId', boost: 2 },
						{ 
							field: 'productName', 
							boost: 1,
							partial: true,  // 부분 문자열 매칭 허용
							ignoreCase: true  // 대소문자 구분 없음
						},
						{ 
							field: 'originalName', 
							boost: 1,
							partial: true,  // 부분 문자열 매칭 허용
							ignoreCase: true  // 대소문자 구분 없음
						}
					]
				})
			});
			results = await response.json();
			addRecentSearch(searchQuery);
		} finally {
			searching = false;
		}
	}

	function getAllSizes(product: GroupedResult) {
		return Object.keys(product.options).sort((a, b) => {
			const numA = parseFloat(a.match(/\d+\.?\d*/)?.[0] || '0');
			const numB = parseFloat(b.match(/\d+\.?\d*/)?.[0] || '0');
			return numA - numB;
		});
	}

	function handleSizeChange(newSize: string) {
		if (animatingSize) return;
		animatingSize = true;
		selectedSize = newSize;
		setTimeout(() => {
			animatingSize = false;
		}, 300);
	}

	function handleProductChange(productId: string) {
		selectedProductId = productId;
		selectedSize = '';  // 품번이 바뀌면 사이즈 선택 초기화
	}

	function getFilteredProducts() {
		if (!selectedProductId) return results;
		return results.filter(p => p.productId === selectedProductId);
	}

	function getAllSizesFromProducts(products: GroupedResult[]) {
		const allSizes = new Set<string>();
		products.forEach(product => {
			Object.keys(product.options).forEach(size => {
				allSizes.add(size);
			});
		});
		return Array.from(allSizes).sort((a, b) => {
			const numA = parseFloat(a.match(/\d+\.?\d*/)?.[0] || '0');
			const numB = parseFloat(b.match(/\d+\.?\d*/)?.[0] || '0');
			return numA - numB;
		});
	}

	function handleSearchFocus() {
		searchInputFocused = true;
		if (recentSearches.length > 0) {
			showSearchHistory = true;
		}
	}

	function handleSearchBlur() {
		// setTimeout을 사용하여 검색어 클릭이 가능하도록 지연
		setTimeout(() => {
			searchInputFocused = false;
			showSearchHistory = false;
		}, 200);
	}
</script>

<div class="search-container">
	<h1>리셀서치</h1>
	<div class="search-box">
		<div class="search-input-wrapper">
			<svg class="search-icon" width="20" height="20" viewBox="0 0 20 20">
				<path d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z" fill="currentColor"/>
			</svg>
			<input 
				type="text" 
				bind:value={searchQuery}
				placeholder="품번 또는 제품명을 입력하세요 (예: B75806, Samba OG)"
				on:keydown={(e) => e.key === 'Enter' && searchProducts()}
				on:focus={handleSearchFocus}
				on:blur={handleSearchBlur}
			/>
			{#if showSearchHistory && recentSearches.length > 0}
				<div class="search-history-dropdown" 
					class:show={searchInputFocused}
				>
					{#each recentSearches as search}
						<div class="history-item">
							<div 
								class="history-item"
								on:mousedown={() => {
									searchQuery = search;
									searchProducts();
								}}
							>
								<svg class="history-icon" width="14" height="14" viewBox="0 0 24 24">
									<path d="M12.25 2c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.5 17.135 2.5 11.75 6.865 2 12.25 2zM12.25 4.5c-4.005 0-7.25 3.245-7.25 7.25s3.245 7.25 7.25 7.25 7.25-3.245 7.25-7.25-3.245-7.25-7.25-7.25zm.75 3.25v4.5l3.5 2-0.75 1.25L11.5 13V7.75h1.5z" fill="currentColor"/>
								</svg>
								<span class="history-text">{search}</span>
								<button 
									class="remove-history"
									on:mousedown|stopPropagation={() => removeRecentSearch(search)}
								>
									×
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<button on:click={searchProducts} disabled={searching}>
			{searching ? '검색중...' : '검색'}
		</button>
		<button 
			class="layout-toggle" 
			class:active={!verticalLayout} 
			on:click={() => {
				verticalLayout = !verticalLayout;
				selectedSize = '';
			}}
		>
			<span class="layout-icon">
				{#if !verticalLayout}
					<svg width="16" height="16" viewBox="0 0 16 16">
						<rect x="2" y="4" width="4" height="8" fill="currentColor"/>
						<rect x="10" y="4" width="4" height="8" fill="currentColor"/>
					</svg>
					세로 보기
				{:else}
					<svg width="16" height="16" viewBox="0 0 16 16">
						<rect x="2" y="4" width="12" height="3" fill="currentColor"/>
						<rect x="2" y="9" width="12" height="3" fill="currentColor"/>
					</svg>
					가로 보기
				{/if}
			</span>
		</button>
	</div>

	{#if recentSearches.length > 0 && !results.length}
		<div class="recent-search-list">
			<div class="recent-search-header">
				<span>최근 검색어</span>
				<button 
					class="clear-all-button"
					on:click={() => {
						recentSearches = [];
						localStorage.setItem('recentSearches', '[]');
					}}
				>
					전체 삭제
				</button>
			</div>
			{#each recentSearches as search}
				<div class="recent-search-item">
					<button 
						class="recent-search-tag"
						on:click={() => {
							searchQuery = search;
							searchProducts();
						}}
					>
						{search}
						<span 
							class="delete-button"
							on:click|stopPropagation={() => removeRecentSearch(search)}
						>
							×
						</span>
					</button>
				</div>
			{/each}
		</div>
	{/if}

	{#if searching}
		<div class="loading">
			<div class="loading-content">
				<div class="loading-spinner"></div>
				<p>마켓 정보를 수집하고 있어요</p>
				<small>잠시만 기다려주세요</small>
			</div>
		</div>
	{:else if results.length > 0}
		<div class="results" class:vertical={verticalLayout}>
			{#if !verticalLayout}
				<div class="compact-filters">
					<div class="filter-chips">
						<div class="filter-group">
							<span class="filter-label">품번:</span>
							<div class="chip-container">
								<button 
									class="filter-chip"
									class:active={selectedProductId === ''}
									on:click={() => handleProductChange('')}
								>
									전체
								</button>
								{#each results as product}
									<button 
										class="filter-chip"
										class:active={selectedProductId === product.productId}
										on:click={() => handleProductChange(product.productId)}
										title={product.productName}
									>
										{product.productId}
									</button>
								{/each}
							</div>
						</div>
						<div class="filter-group">
							<span class="filter-label">사이즈:</span>
							<div class="chip-container">
								<button 
									class="filter-chip"
									class:active={selectedSize === ''}
									on:click={() => handleSizeChange('')}
								>
									전체
								</button>
								<div class="size-chips" class:expanded={showAllSizes}>
									{#each getAllSizesFromProducts(getFilteredProducts()) as size, i}
										{#if showAllSizes || i < MAX_VISIBLE_SIZES}
											<button 
												class="filter-chip"
												class:active={selectedSize === size}
												on:click={() => handleSizeChange(size)}
											>
												{size}
											</button>
										{/if}
									{/each}
								</div>
								{#if getAllSizesFromProducts(getFilteredProducts()).length > MAX_VISIBLE_SIZES}
									<button 
										class="show-more-btn"
										on:click={() => showAllSizes = !showAllSizes}
									>
										<span>{showAllSizes ? '접기' : '더보기'}</span>
										<svg 
											width="12" 
											height="12" 
											viewBox="0 0 12 12"
											class:rotated={showAllSizes}
										>
											<path 
												d="M2 4 L6 8 L10 4" 
												stroke="currentColor" 
												fill="none" 
												stroke-width="2" 
												stroke-linecap="round"
											/>
										</svg>
									</button>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}
			<div class="product-group">
				<div class="filters-container" class:show={verticalLayout}>
					<div class="filter-section">
						<h4>품번</h4>
						<div class="filter-options">
							<button 
								class="filter-option"
								class:active={selectedProductId === ''}
								on:click={() => handleProductChange('')}
							>
								전체 품번
							</button>
							{#each results as product}
								<button 
									class="filter-option"
									class:active={selectedProductId === product.productId}
									on:click={() => handleProductChange(product.productId)}
								>
									{product.productId}
									<span class="product-name">{product.productName}</span>
								</button>
							{/each}
						</div>
					</div>
					<div class="filter-section">
						<h4>사이즈</h4>
						<div class="filter-options">
							<button 
								class="filter-option"
								class:active={selectedSize === ''}
								on:click={() => handleSizeChange('')}
							>
								전체 사이즈
							</button>
							{#each getAllSizesFromProducts(getFilteredProducts()) as size}
								<button 
									class="filter-option"
									class:active={selectedSize === size}
									on:click={() => handleSizeChange(size)}
								>
									{size}
								</button>
							{/each}
						</div>
					</div>
				</div>
				<div class="product-info">
					{#each getFilteredProducts() as product}
						{#each Object.entries(product.options)
							.filter(([size]) => selectedSize === '' || size === selectedSize)
							as [size, sizeData]}
							<div class="size-group"
								class:filtered-out={selectedSize !== '' && selectedSize !== size}
							>
								<div class="size-info-container">
									<div class="size-header">
										<h3 class="size-title">{size}</h3>
										<div class="price-range">
											<div class="market-count">
												<span class="label">판매처</span>
												<span class="count">{Object.keys(sizeData.markets).length}개</span>
											</div>
											<div class="price-info">
												<div class="price-item">
													<span class="label">최저가</span>
													<span class="price min">{Math.min(...Object.values(sizeData.markets).map(m => m.price)).toLocaleString()}원</span>
												</div>
												<div class="divider">~</div>
												<div class="price-item">
													<span class="label">최고가</span>
													<span class="price max">{Math.max(...Object.values(sizeData.markets).map(m => m.price)).toLocaleString()}원</span>
												</div>
											</div>
										</div>
										<div class="option-tags" bind:clientWidth={tagContainerWidth}>
											{#each Object.values(sizeData.markets)
												.flatMap(m => [m.compareOption1, m.compareOption2])
												.filter(Boolean)
												.reduce((acc, curr) => {
													const existing = acc.find(item => item.tag === curr);
													if (existing) {
														existing.count++;
													} else {
														acc.push({ tag: curr, count: 1 });
													}
													return acc;
												}, [] as TagInfo[])
												.sort((a, b) => b.count - a.count) as tagInfo}
												<span class="hash-tag">{tagInfo.tag}</span>
											{/each}
										</div>
									</div>
								</div>
								<div class="market-row" class:vertical={verticalLayout}>
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
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="no-results">
			<div class="no-results-content">
				<span class="emoji">🔍</span>
				<p>"{searchQuery}"에 대한 검색 결과를 찾지 못했어요</p>
				<small>다른 검색어로 다시 시도해보세요</small>
			</div>
		</div>
	{/if}
</div>

<style>
	.search-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 12px;
	}

	h1 {
		font-size: 1.2rem;
		margin: 0 0 12px 0;
	}

	.search-box {
		display: flex;
		gap: 10px;
		margin-bottom: 16px;
	}

	.search-input-wrapper {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		color: #adb5bd;
	}

	input {
		flex: 1;
		padding: 10px 12px 10px 40px;
		border: 2px solid #ddd;
		border-radius: 8px;
		font-size: 14px;
		transition: all 0.2s ease;
	}

	input:focus {
		border-color: #339af0;
		box-shadow: 0 0 0 3px rgba(51, 154, 240, 0.1);
		outline: none;
	}

	button {
		padding: 0 20px;
		font-size: 14px;
		background: #ff6b6b;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	button:hover:not(:disabled) {
		background: #fa5252;
		transform: translateY(-1px);
	}

	button:disabled {
		background: #ced4da;
		cursor: not-allowed;
	}

	.product-group {
		margin-bottom: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.05);
		border: 1px solid #e9ecef;
	}

	.product-header {
		border-bottom: 1px solid #e9ecef;
		padding-bottom: 0.8rem;
		margin-bottom: 1rem;
	}

	.product-title {
		font-size: 1.1rem;
		margin: 0;
		color: #333;
		font-weight: 600;
	}

	.product-id {
		display: block;
		color: #666;
		font-size: 0.9rem;
		margin-top: 0.3rem;
		font-family: monospace;
		letter-spacing: 0.5px;
	}

	.size-group {
		margin-bottom: 1rem;
		border-bottom: 1px solid #eee;
		padding-bottom: 0.8rem;
		transition: all 0.3s ease-in-out;
		opacity: 1;
		transform: translateY(0);
		height: auto;
		overflow: hidden;
		max-height: 1000px;
		will-change: opacity, transform, max-height;
	}

	.size-info-container {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 0.8rem;
		margin-bottom: 0.8rem;
		border: 1px solid #dee2e6;
	}

	.size-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-width: 0;
	}

	.size-title {
		font-size: 1rem;
		color: #333;
		margin: 0;
		font-weight: bold;
		width: 120px;
		flex-shrink: 0;
	}

	.price-range {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex: 1;
		min-width: 0;
		background: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		border: 1px solid #dee2e6;
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
		padding-right: 1rem;
		border-right: 1px solid #dee2e6;
		flex-shrink: 0;
	}

	.count {
		font-weight: bold;
		font-size: 1.1rem;
		color: #1971c2;
	}

	.market-row {
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		gap: 0.8rem;
		padding: 0.4rem 0;
		-webkit-overflow-scrolling: touch;
		align-items: stretch;
		transition: all 0.3s ease-in-out;
		opacity: 1;
		transform: translateY(0);
	}

	.market-card {
		flex: 0 0 auto;
		min-width: 250px;
		max-width: 280px;
		width: fit-content;
		display: flex;
		gap: 0.8rem;
		padding: 0.8rem;
		border: 1px solid #eee;
		border-radius: 6px;
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease-in-out;
		align-items: center;
		opacity: 0;
		transform: translateY(10px);
		animation: fadeIn 0.3s ease-in-out forwards;
		background: white;
		transform-origin: center;
		will-change: transform, box-shadow;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.market-card:hover {
		transform: translateY(-2px) scale(1.01);
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		border-color: #ced4da;
		background: #f8f9fa;
	}

	.market-card:nth-child(1) { animation-delay: 0.1s; }
	.market-card:nth-child(2) { animation-delay: 0.2s; }
	.market-card:nth-child(3) { animation-delay: 0.3s; }
	.market-card:nth-child(4) { animation-delay: 0.4s; }
	.market-card:nth-child(5) { animation-delay: 0.5s; }

	.market-image {
		width: 80px;
		height: 80px;
		flex-shrink: 0;
	}

	.market-image img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.market-image img.no-image {
		padding: 8px;
		background: #f8f9fa;
	}

	/* 스크롤바 스타일링 */
	.market-row::-webkit-scrollbar {
		height: 6px;
		margin-top: 5px;
	}

	.market-row::-webkit-scrollbar-track {
		background: #e9ecef;
		border-radius: 4px;
		margin: 0 8px;
	}

	.market-row::-webkit-scrollbar-thumb {
		background: #adb5bd;
		border-radius: 4px;
		border: 1px solid #e9ecef;
		transition: all 0.2s ease;
	}

	.market-row::-webkit-scrollbar-thumb:hover {
		background: #868e96;
		border-color: #dee2e6;
	}

	.option-info {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
		margin: 0.4rem 0;
		width: fit-content;
	}

	.option-tag {
		font-size: 0.75rem;
		padding: 0.3rem 0.5rem;
		background: #f8f9fa;
		border-radius: 3px;
		color: #495057;
		white-space: nowrap;
		border: 1px solid #dee2e6;
		font-weight: normal;
	}

	.option-tag:nth-child(2) {
		background: #f8f9fa;
		color: #495057;
		border-color: #dee2e6;
	}

	.market-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		justify-content: start;
		min-width: 0;
	}

	.market-name {
		font-size: 0.95rem;
		font-weight: 600;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #1864ab;
		position: relative;
		width: fit-content;
		max-width: 100%;
	}

	.market-name::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 4px;
		background: rgba(24, 100, 171, 0.15);
		z-index: -1;
		transition: opacity 0.2s ease;
		opacity: 0;
	}

	.market-name:hover::after {
		opacity: 1;
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

	.layout-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #f8f9fa;
		color: #495057;
		border: 1px solid #dee2e6;
		padding: 0 20px;
	}

	.layout-toggle.active {
		background: #495057;
		color: white;
		border-color: #495057;
	}

	.layout-icon {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.layout-icon svg {
		width: 16px;
		height: 16px;
	}

	.filters-container {
		display: none;
		padding: 0.8rem;
		background: white;
		border-radius: 8px;
		margin-bottom: 0.8rem;
		border: 1px solid #e9ecef;
		position: sticky;
		top: 1rem;
		height: fit-content;
		max-height: calc(100vh - 2rem);
		overflow-y: auto;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		transform: translateX(-10px);
	}

	.filters-container.show {
		display: block;
		opacity: 1;
		transform: translateX(0);
	}

	.filter-section {
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e9ecef;
	}

	.filter-section:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.filter-section h4 {
		margin: 0 0 0.5rem 0;
		color: #495057;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.filter-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-height: 400px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: #adb5bd #e9ecef;
	}

	.filter-option {
		padding: 0.5rem 0.8rem;
		border: 1px solid #dee2e6;
		border-radius: 4px;
		background: #fff;
		cursor: pointer;
		text-align: left;
		color: #495057;
		font-weight: normal;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.filter-option:hover {
		background: #f1f3f5;
		border-color: #ced4da;
	}

	.filter-option.active {
		background: #e7f5ff;
		border-color: #339af0;
		color: #1971c2;
		font-weight: 600;
	}

	.filter-option:first-child {
		border-bottom: 1px solid #dee2e6;
		margin-bottom: 0.5rem;
		background: #f8f9fa;
	}

	.filter-option:first-child.active {
		background: #e7f5ff;
		border-color: #339af0;
	}

	.market-row.vertical {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
		width: 100%;
		overflow: visible;
		padding: 0;
		transform: translateZ(0);
	}

	.market-row.vertical .market-card {
		width: 100%;
		min-width: 0;
		max-width: none;
		margin: 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: flex-start;
	}

	.market-row.vertical .market-image {
		flex: 0 0 80px;
		width: 80px;
		height: 80px;
	}

	.market-row.vertical .market-info {
		flex: 1;
		min-width: 0;
	}

	.size-group {
		margin-bottom: 1rem;
		border-bottom: 1px solid #eee;
		padding-bottom: 0.8rem;
		transition: all 0.3s ease-in-out;
		opacity: 1;
		transform: translateY(0);
		height: auto;
		overflow: hidden;
		max-height: 1000px;
		will-change: opacity, transform, max-height;
	}

	.size-info-container {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 0.8rem;
		margin-bottom: 0.8rem;
		border: 1px solid #dee2e6;
	}

	.price-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
	}

	.results.vertical .product-group {
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 1rem;
	}

	.product-info {
		min-width: 0;
		overflow: hidden;
	}

	/* 필터링 애니메이션 */
	.size-group.filtered-out {
		opacity: 0;
		transform: translateY(-20px);
		max-height: 0;
		margin: 0;
		padding: 0;
		pointer-events: none;
		border-bottom: none;
		will-change: opacity, transform, max-height;
	}

	/* 필터링된 아이템 애니메이션 */
	.size-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: all 0.3s ease-in-out;
	}

	.size-options > div {
		transition: all 0.3s ease-in-out;
		transform: translateZ(0);
		backface-visibility: hidden;
		perspective: 1000px;
	}

	/* 마켓 카드 컨테이너 애니메이션 */
	.market-row {
		transition: all 0.3s ease-in-out;
		opacity: 1;
		transform: translateY(0);
	}

	.filtered-out .market-row {
		opacity: 0;
		transform: translateY(10px);
	}

	.option-tags {
		display: flex;
		gap: 0.4rem;
		margin-left: 1.5rem;
		padding-left: 1.5rem;
		border-left: 1px solid #dee2e6;
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		justify-content: flex-start;
	}

	.hash-tag {
		font-size: 0.75rem;
		color: #1864ab;
		background: #e7f5ff;
		padding: 0.2rem 0.5rem;
		border-radius: 12px;
		white-space: nowrap;
		font-weight: 500;
		display: inline-block;
		margin-right: 0.3rem;
	}

	.hash-tag:hover {
		background: #339af0;
		color: white;
	}

	.recent-search-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0.5rem 0;
		max-height: 120px;  /* 최대 4줄 정도 표시 */
		overflow-y: auto;
		padding: 0.5rem;
		scrollbar-width: thin;
		scrollbar-color: #adb5bd #e9ecef;
	}

	.recent-search-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 0.8rem;
		border-bottom: 1px solid #dee2e6;
		margin-bottom: 0.5rem;
	}

	.recent-search-header span {
		font-size: 0.9rem;
		font-weight: 600;
		color: #495057;
	}

	.clear-all-button {
		font-size: 0.8rem;
		padding: 0.3rem 0.8rem;
		background: none;
		border: none;
		color: #868e96;
		cursor: pointer;
	}

	.clear-all-button:hover {
		color: #e03131;
		background: none;
		transform: none;
	}

	.recent-search-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.recent-search-item {
		position: relative;
		display: inline-block;
	}

	.recent-search-tag {
		font-size: 0.85rem;
		padding: 0.5rem 2rem 0.5rem 1rem;
		background: #f1f3f5;
		border: 1px solid #ced4da;
		border-radius: 16px;
		color: #495057;
		position: relative;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.recent-search-tag:hover {
		background: #e9ecef;
		border-color: #adb5bd;
	}

	.delete-button {
		position: absolute;
		right: 8px;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0.4;
		font-size: 1.2rem;
		line-height: 1;
		color: #495057;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: transparent;
		transition: all 0.2s ease;
	}

	.recent-search-tag:hover .delete-button {
		opacity: 1;
		background: #dee2e6;
	}

	.delete-button:hover {
		color: #e03131;
		background: #ffe3e3;
		transform: translateY(-50%) scale(1.1);
	}

	.original-name {
		display: block;
		color: #868e96;
		font-size: 0.85rem;
		margin-top: 0.2rem;
		font-style: italic;
	}

	.product-name {
		font-size: 0.8rem;
		color: #868e96;
		margin-left: 0.5rem;
	}

	.compact-filters {
		background: white;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.filter-chips {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e9ecef;
	}

	.filter-group:last-child {
		padding-bottom: 0;
		border-bottom: none;
	}

	.filter-label {
		font-size: 0.9rem;
		color: #495057;
		font-weight: 600;
		min-width: 60px;
	}

	.chip-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.filter-chip {
		font-size: 0.85rem;
		padding: 0.3rem 0.8rem;
		height: 32px;  /* 버튼 높이 고정 */
		box-sizing: border-box;
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 16px;
		color: #495057;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 1px 2px rgba(0,0,0,0.05);
	}

	.filter-chip:hover {
		background: #e7f5ff;
		border-color: #339af0;
		color: #1971c2;
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.filter-chip.active {
		background: #339af0;
		border-color: #339af0;
		color: white;
		box-shadow: 0 2px 4px rgba(51, 154, 240, 0.2);
	}

	.no-results {
		text-align: center;
		padding: 3rem 1rem;
		color: #868e96;
	}
	
	.no-results-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	
	.no-results .emoji {
		font-size: 2rem;
		margin-bottom: 1rem;
	}
	
	.no-results p {
		margin: 0;
		font-size: 1.1rem;
		color: #495057;
	}
	
	.no-results small {
		color: #adb5bd;
	}

	.loading {
		text-align: center;
		padding: 3rem 1rem;
	}
	
	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	
	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #e9ecef;
		border-top-color: #339af0;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	
	.loading p {
		margin: 0;
		font-size: 1.1rem;
		color: #495057;
	}
	
	.loading small {
		color: #adb5bd;
	}

	.size-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		max-height: 76px;  /* 2줄 높이 (버튼높이 32px + 간격 12px) */
		overflow: hidden;
		transition: max-height 0.3s ease-in-out;
	}

	.size-chips.expanded {
		max-height: 300px;  /* 충분히 큰 값으로 수정 */
	}

	.show-more-btn {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.85rem;
		padding: 0.3rem 0.8rem;
		background: white;
		border: 1px solid #dee2e6;
		border-radius: 16px;
		color: #495057;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.show-more-btn:hover {
		background: #f8f9fa;
		border-color: #adb5bd;
	}

	.show-more-btn svg {
		transition: transform 0.3s ease;
	}

	.show-more-btn svg.rotated {
		transform: rotate(180deg);
	}

	.search-history-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		width: 100%;
		box-sizing: border-box;
		background: white;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		margin-top: 4px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		opacity: 0;
		transform: translateY(-10px);
		pointer-events: none;
		transition: all 0.2s ease;
		z-index: 1000;
		padding: 0.3rem;
	}

	.search-history-dropdown.show {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.search-history-item {
		position: relative;
		padding: 0;
	}

	.history-item {
		box-sizing: border-box;
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background: none;
		border: none;
		color: #495057;
		cursor: pointer;
		transition: all 0.2s ease;
		border-radius: 4px;
		position: relative;
		margin: 0;
	}

	.history-item:hover {
		background: #f1f3f5;
	}

	.history-icon {
		color: #adb5bd;
	}

	.history-text {
		font-size: 0.85rem;
		font-weight: normal;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.remove-history {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		padding: 0.2rem;
		color: #adb5bd;
		background: none;
		border: none;
		font-size: 1.2rem;
		cursor: pointer;
		opacity: 0;
		transition: all 0.2s ease;
		line-height: 1;
		display: flex;
		align-items: center;
	}

	.history-item:hover .remove-history {
		opacity: 1;
	}

	.remove-history:hover {
		color: #e03131;
	}

	.recent-search-list::-webkit-scrollbar {
		width: 6px;
	}

	.recent-search-list::-webkit-scrollbar-track {
		background: #e9ecef;
		border-radius: 4px;
	}

	.recent-search-list::-webkit-scrollbar-thumb {
		background: #adb5bd;
		border-radius: 4px;
		border: 1px solid #e9ecef;
	}
</style> 