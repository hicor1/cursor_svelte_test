<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { searchResults } from '$lib/stores/search';
	
	let searchQuery = '';
	let searchInputFocused = false;
	let recentSearches: string[] = [];
	let showSearchHistory = false;
	const MAX_RECENT_SEARCHES = 10;
	let searching = false;

	// 페이지 로드시 최근 검색어 불러오기
	onMount(() => {
		const saved = localStorage.getItem('recentSearches');
		if (saved) {
			recentSearches = JSON.parse(saved);
		}
	});

	async function handleSearch() {
		if (searchQuery.length < 2) {
			alert('검색어는 2글자 이상 입력해야 합니다.');
			return;
		}

		searching = true;
		try {
			await searchResults.search(searchQuery);
			goto(`/resell-search?q=${encodeURIComponent(searchQuery)}`);
		} catch (error) {
			console.error('Search error:', error);
			alert('검색 중 오류가 발생했습니다.');
		} finally {
			searching = false;
		}
	}

	function handleSearchFocus() {
		searchInputFocused = true;
		if (recentSearches.length > 0) {
			showSearchHistory = true;
		}
	}

	function handleSearchBlur() {
		setTimeout(() => {
			searchInputFocused = false;
			showSearchHistory = false;
		}, 200);
	}

	const tools = [
		{
			title: '마진 계산기',
			description: '플랫폼별 수수료를 고려한 판매가 계산',
			link: '/tools/calculator',
			icon: '💰'
		},
		{
			title: '수수료 비교',
			description: '리셀 플랫폼별 수수료 비교',
			link: '/tools/fees',
			icon: '📊'
		},
		{
			title: '사이즈 변환',
			description: '국가별 신발 사이즈 변환',
			link: '/tools/size',
			icon: '📏'
		},
		{
			title: '관세 계산',
			description: '해외 직구 관세 계산',
			link: '/tools/customs',
			icon: '✈️'
		}
	];
</script>

<div class="container">
	<section class="welcome-section">
		<h1>RESELLA에 오신 것을 환영합니다</h1>
		<p>전세계 브랜드 유통정보를 한눈에, 리셀러를 위한 모든 도구</p>
		
		<!-- 검색창을 welcome-section 안으로 이동 -->
		<div class="search-box">
			<div class="search-input-wrapper">
				<svg class="search-icon" width="20" height="20" viewBox="0 0 20 20">
					<path d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z" fill="currentColor"/>
				</svg>
				<input 
					type="text" 
					bind:value={searchQuery}
					placeholder="품번 또는 제품명을 입력하세요 (예: B75806, Samba OG)"
					on:keydown={(e) => e.key === 'Enter' && handleSearch()}
					on:focus={handleSearchFocus}
					on:blur={handleSearchBlur}
				/>
				<button on:click={handleSearch} disabled={searching}>
					{#if searching}
						<div class="loading-spinner"></div>
					{:else}
						검색
					{/if}
				</button>
				{#if showSearchHistory && recentSearches.length > 0}
					<div class="search-history-dropdown" class:show={searchInputFocused}>
						{#each recentSearches as search}
							<div class="history-item">
								<div 
									class="history-text"
									on:mousedown={() => {
										searchQuery = search;
										handleSearch();
									}}
								>
									<svg class="history-icon" width="14" height="14" viewBox="0 0 24 24">
										<path d="M12.25 2c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.5 17.135 2.5 11.75 6.865 2 12.25 2zM12.25 4.5c-4.005 0-7.25 3.245-7.25 7.25s3.245 7.25 7.25 7.25 7.25-3.245 7.25-7.25-3.245-7.25-7.25-7.25zm.75 3.25v4.5l3.5 2-0.75 1.25L11.5 13V7.75h1.5z" fill="currentColor"/>
									</svg>
									<span>{search}</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</section>

	<section class="tools-section">
		<h2>리셀러 도구</h2>
		<div class="tools-grid">
			{#each tools as tool}
				<a href={tool.link} class="tool-card">
					<div class="tool-icon">{tool.icon}</div>
					<h3>{tool.title}</h3>
					<p>{tool.description}</p>
				</a>
			{/each}
		</div>
	</section>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.welcome-section {
		text-align: center;
		padding: 60px 0;
		background: linear-gradient(to right, #ff6b6b11, #ff6b6b22);
		border-radius: 12px;
		margin-bottom: 40px;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.subtitle {
		color: #666;
		margin-bottom: 2rem;
	}

	.search-box {
		max-width: 600px;
		margin: 30px auto 0;
		position: relative;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}

	.search-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #666;
	}

	input {
		flex: 1;
		padding: 12px 12px 12px 40px;
		border: 1px solid #ddd;
		border-radius: 8px 0 0 8px;
		font-size: 16px;
		border-right: none;
	}

	button {
		padding: 12px 24px;
		background: #ff6b6b;
		color: white;
		border: none;
		border-radius: 0 8px 8px 0;
		cursor: pointer;
		white-space: nowrap;
	}

	button:hover {
		background: #ff5252;
	}

	.search-history-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		margin-top: 4px;
		z-index: 1000;
		display: none;
	}

	.search-history-dropdown.show {
		display: block;
	}

	.history-item {
		padding: 8px 12px;
		cursor: pointer;
	}

	.history-item:hover {
		background: #f5f5f5;
	}

	.history-text {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.tools-section {
		margin-bottom: 40px;
	}

	.tools-section h2 {
		color: #333;
		margin-bottom: 24px;
		font-size: 1.8em;
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
	}

	.tool-card {
		background: white;
		padding: 24px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.tool-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0,0,0,0.15);
	}

	.tool-icon {
		font-size: 2.5em;
		margin-bottom: 16px;
	}

	.tool-card h3 {
		color: #ff6b6b;
		margin: 0 0 12px 0;
		font-size: 1.3em;
	}

	.tool-card p {
		color: #666;
		margin: 0;
		font-size: 0.95em;
		line-height: 1.5;
	}

	/* 반응형 디자인 */
	@media (max-width: 768px) {
		.welcome-section {
			padding: 40px 20px;
		}

		.welcome-section h1 {
			font-size: 2em;
		}

		.tools-grid {
			grid-template-columns: 1fr;
		}
	}

	.loading-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #ffffff;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>
