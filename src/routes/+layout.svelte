<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
	let activeDropdown: string | null = null;
	
	// 드롭다운 메뉴 이외의 영역 클릭 시 닫기
	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (activeDropdown && !(event.target as Element).closest('.nav-item-with-dropdown')) {
				activeDropdown = null;
			}
		};
		
		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
	
	function toggleDropdown(id: string) {
		activeDropdown = activeDropdown === id ? null : id;
	}
</script>

<main>
	<header>
		<div class="header-content">
			<div class="logo">
				<a href="/" class="logo-link">
					<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
						<path d="M3.27 6.96L12 12.01l8.73-5.05" />
						<path d="M12 22.08V12" />
					</svg>
					<h1>RESELLA</h1>
				</a>
			</div>
			<nav>
				<ul>
					<li class:active={$page.url.pathname === '/'}>
						<a href="/">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
								<polyline points="9 22 9 12 15 12 15 22"></polyline>
							</svg>
							홈
						</a>
					</li>
					<li class:active={$page.url.pathname.includes('/shopping-info')} class="nav-item-with-dropdown">
						<a href="/shopping-info" on:click|preventDefault={() => toggleDropdown('shopping')}>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
								<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
								<line x1="3" y1="6" x2="21" y2="6"></line>
								<path d="M16 10a4 4 0 0 1-8 0"></path>
							</svg>
							쇼핑정보
						</a>
						<ul class="dropdown" class:show={activeDropdown === 'shopping'}>
							<li><a href="/shopping-info/popular">인기정보</a></li>
							<li><a href="/shopping-info/fashion">패션정보</a></li>
							<li><a href="/shopping-info/other">기타정보</a></li>
							<li><a href="/shopping-info/raffle">래플정보</a></li>
							<li><a href="/shopping-info/event">이벤트정보</a></li>
						</ul>
					</li>
					<li class:active={$page.url.pathname.includes('/tools')} class="nav-item-with-dropdown">
						<a href="/tools" on:click|preventDefault={() => toggleDropdown('tools')}>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
								<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
							</svg>
							리셀러 도구
						</a>
						<ul class="dropdown" class:show={activeDropdown === 'tools'}>
							<li><a href="/tools/calculator">마진 계산기</a></li>
							<li><a href="/tools/fees">수수료 비교</a></li>
							<li><a href="/tools/size">사이즈 변환</a></li>
							<li><a href="/tools/customs">관세 계산</a></li>
						</ul>
					</li>
					<li class:active={$page.url.pathname.includes('/resell-search')}>
						<a href="/resell-search">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
								<circle cx="11" cy="11" r="8"></circle>
								<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
							</svg>
							리셀서치
						</a>
					</li>
					<li class:active={$page.url.pathname.includes('/community')}>
						<a href="/community">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
								<circle cx="9" cy="7" r="4"></circle>
								<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
								<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
							</svg>
							커뮤니티
						</a>
					</li>
					<li class:active={$page.url.pathname.includes('/notices')}>
						<a href="/notices">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
								<path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
							</svg>
							공지사항
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</header>

	<slot />
</main>

<style>
	main {
		padding: 20px;
	}

	header {
		background: white;
		color: #2D3748;
		padding: 0 20px;
		margin: -20px -20px 0;
		box-shadow: 0 4px 16px rgba(66, 153, 225, 0.1);
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 70px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.logo h1 {
		margin: 0;
		font-size: 24px;
		font-weight: bold;
		background: linear-gradient(135deg, #4A5568 0%, #2D3748 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
	}

	header nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
		position: relative;
		display: flex;
		gap: 30px;
	}

	header nav ul li {
		position: relative;
	}

	.dropdown {
		display: none;
		position: absolute;
		top: calc(100% + 5px);
		left: -20px;
		background: #fff;
		min-width: 220px;
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
		border-radius: 8px;
		padding: 10px 0;
		z-index: 50; /* 검색 히스토리보다 낮은 값 */
		margin-top: 8px;
		animation: fadeIn 0.2s ease;
		pointer-events: auto;
	}
	
	.dropdown.show {
		display: block;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.dropdown li a {
		color: #4A5568;
		padding: 10px 16px;
		display: block;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.dropdown li a:hover {
		background: #EBF8FF;
		color: #4299E1;
	}

	header nav {
		position: relative;
		z-index: 50; /* 검색 히스토리보다 낮은 값 */
	}

	.active > a::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 3px;
		background: #4299E1;
		border-radius: 3px;
	}

	header nav a {
		color: #4A5568;
		text-decoration: none;
		padding: 10px 0;
		display: inline-block;
		transition: color 0.2s ease;
		position: relative;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.nav-icon {
		color: currentColor;
	}

	.active > a {
		color: #4299E1;
		font-weight: bold;
	}

	.active .dropdown a {
		color: #4A5568;
		font-weight: normal;
	}

	.active .dropdown a:hover {
		color: #4299E1;
	}

	.active .dropdown a.active {
		color: #4299E1;
		font-weight: bold;
	}

	.logo-link {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: inherit;
	}

	.logo-link:hover {
		opacity: 0.9;
	}

	.logo-link svg {
		color: #4299E1;
		transition: transform 0.3s ease;
	}

	.logo-link:hover svg {
		transform: scale(1.1);
	}

	header nav a:hover {
		color: #4299E1;
	}
</style>
