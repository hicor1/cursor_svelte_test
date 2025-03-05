<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { searchResults } from '$lib/stores/search';
	import Portal from '$lib/components/Portal.svelte';
	import { writable } from 'svelte/store';
	import MetaTags from '$lib/components/MetaTags.svelte';
	
	let searchQuery = '';
	let searchInputFocused = false;
	let recentSearches: string[] = [];
	let showSearchHistory = false;
	const MAX_RECENT_SEARCHES = 10;
	let searching = false;
	// 전역 검색 상태를 위한 스토어 생성
	export const isSearching = writable(false);
	// click outside 처리를 위한 변수
	let searchBox: HTMLElement;
	let dropdownPosition = { top: 0, left: 0, width: 0 };

	// 페이지 로드시 최근 검색어 불러오기
	onMount(() => {
		const saved = localStorage.getItem('recentSearches');
		if (saved) {
			recentSearches = JSON.parse(saved);
		}
		
		// 검색 영역 외부 클릭 이벤트 처리
		const handleClickOutside = (event: MouseEvent) => {
			if (searchBox && !searchBox.contains(event.target as Node)) {
				showSearchHistory = false;
				searchInputFocused = false;
			}
		};
		
		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	async function handleSearch() {
		if (searchQuery.length < 2) {
			alert('검색어는 2글자 이상 입력해야 합니다.');
			return;
		}

		searching = true;
		isSearching.set(true); // 전역 검색 상태 업데이트
		
		try {
			// 최근 검색어에 추가
			if (!recentSearches.includes(searchQuery)) {
				recentSearches = [searchQuery, ...recentSearches].slice(0, MAX_RECENT_SEARCHES);
				localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
			}
			
			await searchResults.search(searchQuery);
			goto(`/resell-search?q=${encodeURIComponent(searchQuery)}`);
		} catch (error) {
			console.error('Search error:', error);
			alert('검색 중 오류가 발생했습니다.');
		} finally {
			searching = false;
			isSearching.set(false); // 전역 검색 상태 업데이트
		}
	}

	function handleSearchFocus() {
		searchInputFocused = true;
		showSearchHistory = recentSearches.length > 0;
		
		// 드롭다운 위치 계산
		updateDropdownPosition();
	}

	function updateDropdownPosition() {
		// setTimeout을 사용하여 DOM 업데이트 후 위치 계산
		setTimeout(() => {
			if (searchBox) {
				const rect = searchBox.getBoundingClientRect();
				dropdownPosition = {
					top: rect.bottom + window.scrollY,
					left: rect.left + window.scrollX,
					width: rect.width
				};
			}
		}, 0);
	}

	function handleSearchBlur() {
		// 타임아웃을 더 증가시켜 충분한 시간 제공
		setTimeout(() => {
			// 클릭 이벤트 리스너로 처리하므로 여기서는 제거
		}, 500);
	}

	// 히스토리 아이템 클릭 핸들러
	function handleHistoryItemClick(search: string) {
		searchQuery = search;
		handleSearch();
	}

	// 창 크기 변경 시 드롭다운 위치 업데이트
	function handleResize() {
		if (showSearchHistory) {
			updateDropdownPosition();
		}
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

<MetaTags
	title="Theresella - 카드뉴스 제작 플랫폼"
	description="손쉽게 만들고 공유하는 카드뉴스 플랫폼"
	url="https://theresella.com"
/>

<svelte:window on:resize={handleResize} />

<div class="container">
	<section class="welcome-section">
		<div class="welcome-title">
			<span class="highlight">RESELLA</span>
			<h1>더 스마트한 리셀링의 시작</h1>
			<div class="underline"></div>
		</div>
		<p>전세계 브랜드 유통정보를 한눈에, 리셀러를 위한 모든 도구</p>
		
		<!-- 검색창을 welcome-section 안으로 이동 -->
		<div class="search-box" bind:this={searchBox}>
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
			</div>
		</div>
			
		<!-- 포털을 사용하여 드롭다운을 body에 직접 렌더링 -->
		{#if showSearchHistory && recentSearches.length > 0}
			<Portal>
				<div 
					class="search-history-dropdown" 
					class:show={searchInputFocused}
					style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; width: {dropdownPosition.width}px;"
				>
					{#each recentSearches as search}
						<div class="history-item">
							<div 
								class="history-text"
								on:mousedown={() => handleHistoryItemClick(search)}
							>
								<svg class="history-icon" width="14" height="14" viewBox="0 0 24 24">
									<path d="M12.25 2c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.5 17.135 2.5 11.75 6.865 2 12.25 2zM12.25 4.5c-4.005 0-7.25 3.245-7.25 7.25s3.245 7.25 7.25 7.25 7.25-3.245 7.25-7.25-3.245-7.25-7.25-7.25zm.75 3.25v4.5l3.5 2-0.75 1.25L11.5 13V7.75h1.5z" fill="currentColor"/>
								</svg>
								<span>{search}</span>
							</div>
						</div>
					{/each}
				</div>
			</Portal>
		{/if}
	</section>

	<section class="tools-section">
		<h2>리셀러 도구</h2>
		<div class="tools-grid">
			{#each tools as tool}
				<!-- 검색 중일 때는 tool-card에 검색 중 상태와 클릭 방지 스타일 적용 -->
				<a 
					href={tool.link} 
					class="tool-card" 
					class:searching={searching}
					on:click|preventDefault={(e) => {
						if (searching) {
							e.preventDefault();
							return false;
						}
					}}
				>
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
		padding: 80px 0;
		background: linear-gradient(135deg, #EBF8FF 0%, #E6F6FF 100%);
		border-radius: 24px;
		margin-bottom: 60px;
		box-shadow: 0 10px 30px rgba(66, 153, 225, 0.08);
		transition: transform 0.3s ease;
	}

	.welcome-section:hover {
		transform: translateY(-2px);
	}

	.welcome-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2rem;
	}

	.welcome-title .highlight {
		font-size: 1.2rem;
		font-weight: 700;
		color: #4299E1;
		letter-spacing: 3px;
		text-transform: uppercase;
		margin-bottom: 0.5rem;
		background: linear-gradient(90deg, #4299E1, #3182CE);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.welcome-title h1 {
		font-size: 3.5rem;
		line-height: 1.2;
		font-weight: 800;
		color: #2D3748;
		margin: 0;
		letter-spacing: -1px;
	}

	.welcome-title .underline {
		width: 100px;
		height: 6px;
		background: linear-gradient(90deg, #4299E1, #3182CE);
		border-radius: 3px;
		margin-top: 1.5rem;
		position: relative;
	}

	.welcome-title .underline::after {
		content: '';
		position: absolute;
		width: 12px;
		height: 12px;
		background: #3182CE;
		border-radius: 50%;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: #2D3748;
		font-weight: 800;
	}

	p {
		color: #4A5568;
		font-size: 1.2rem;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.search-box {
		max-width: 700px;
		margin: 40px auto 0;
		position: relative;
		z-index: 100000 !important; /* 중요! 모든 요소보다 위에 표시 */
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		z-index: 2;
	}

	.search-input-wrapper:focus-within {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
	}

	.search-icon {
		position: absolute;
		left: 20px;
		top: 50%;
		transform: translateY(-50%);
		color: #4299E1;
		transition: color 0.2s ease;
	}

	input {
		flex: 1;
		padding: 18px 18px 18px 56px;
		border: 2px solid transparent;
		border-radius: 16px 0 0 16px;
		font-size: 1.1rem;
		transition: all 0.2s ease;
		background: transparent;
	}

	input:focus {
		outline: none;
		border-color: #4299E1;
	}

	.search-input-wrapper:focus-within .search-icon {
		color: #3182CE;
	}

	button {
		padding: 18px 32px;
		background: linear-gradient(135deg, #4299E1 0%, #3182CE 100%);
		color: white;
		border: none;
		border-radius: 0 16px 16px 0;
		cursor: pointer;
		font-size: 1.1rem;
		font-weight: 600;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	button:hover {
		background: linear-gradient(135deg, #3182CE 0%, #2B6CB0 100%);
		transform: translateX(2px);
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.search-history-dropdown {
		position: absolute; /* Portal 내에서는 absolute 사용 */
		background: white;
		border-radius: 16px;
		box-shadow: 0 8px 30px rgba(66, 153, 225, 0.2);
		margin-top: 5px;
		z-index: 999999 !important; /* 최상위 z-index */
		display: none;
		overflow: hidden;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(66, 153, 225, 0.1);
	}

	.search-history-dropdown.show {
		display: block;
		animation: slideDown 0.2s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.history-item {
		padding: 12px 20px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.history-item:hover {
		background: #EBF8FF;
	}

	.history-text {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #4A5568;
	}

	.tools-section {
		margin-bottom: 60px;
		position: relative;
	}

	.tools-section::before {
		content: '';
		position: absolute;
		top: -30px;
		left: 50%;
		transform: translateX(-50%);
		width: 80px;
		height: 4px;
		background: linear-gradient(90deg, #4299E1, #3182CE);
		border-radius: 2px;
	}

	.tools-section h2 {
		font-size: 2rem;
		margin-bottom: 2rem;
		text-align: center;
		color: #2D3748;
		position: relative;
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 24px;
		padding: 20px;
	}

	.tool-card {
		background: white;
		padding: 32px;
		border-radius: 20px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
		transition: all 0.3s ease;
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		border: 1px solid transparent;
	}

	.tool-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 30px rgba(66, 153, 225, 0.15);
		border-color: rgba(66, 153, 225, 0.2);
	}

	.tool-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		background: #EBF8FF;
		width: 70px;
		height: 70px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20px;
		transition: transform 0.3s ease;
	}

	.tool-card:hover .tool-icon {
		transform: scale(1.1);
	}

	.tool-card h3 {
		font-size: 1.3rem;
		margin-bottom: 0.8rem;
		color: #3182CE;
	}

	.tool-card p {
		color: #718096;
		font-size: 1rem;
		line-height: 1.5;
	}

	.loading-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #ffffff;
		border-top: 2px solid transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 768px) {
		.container {
			padding: 16px;
		}

		.welcome-section {
			padding: 40px 20px;
			margin-bottom: 40px;
		}

		.welcome-title h1 {
			font-size: 2.5rem;
		}

		.welcome-title .highlight {
			font-size: 1rem;
		}

		h1 {
			font-size: 2rem;
		}

		.search-input-wrapper {
			flex-direction: column;
			border-radius: 12px;
		}

		input {
			border-radius: 12px;
			padding: 16px 16px 16px 48px;
		}

		button {
			border-radius: 12px;
			width: 100%;
			margin-top: 8px;
		}

		.tools-grid {
			grid-template-columns: 1fr;
			gap: 16px;
			padding: 10px;
		}

		p {
			font-size: 1rem;
		}
	}

	.history-icon {
		color: #4299E1;
	}

	.tool-card.searching {
		opacity: 0.6;
		cursor: not-allowed;
		pointer-events: none;
	}
</style>
