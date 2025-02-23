<script>
	import { page } from '$app/stores';
</script>

<main>
	<header>
		<div class="header-content">
			<div class="logo">
				<a href="/" class="logo-link">
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
						<path fill="#ff6b6b" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13v10h2v-4h2l2 4h2l-2-4c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-6zm2 2h4v2h-4v-2z"/>
					</svg>
					<h1>RESELLA</h1>
				</a>
			</div>
			<nav>
				<ul>
					<li class:active={$page.url.pathname === '/'}>
						<a href="/">전체</a>
					</li>
					<li class:active={$page.url.pathname.includes('/shopping-info')}>
						<a href="/shopping-info">쇼핑정보</a>
						<ul class="dropdown">
							<li><a href="/shopping-info/popular">인기정보</a></li>
							<li><a href="/shopping-info/fashion">패션정보</a></li>
							<li><a href="/shopping-info/other">기타정보</a></li>
							<li><a href="/shopping-info/raffle">래플정보</a></li>
							<li><a href="/shopping-info/event">이벤트정보</a></li>
						</ul>
					</li>
					<li class:active={$page.url.pathname.includes('/tools')}>
						<a href="/tools">리셀러 도구</a>
						<ul class="dropdown">
							<li><a href="/tools/calculator">마진 계산기</a></li>
							<li><a href="/tools/fees">수수료 비교</a></li>
							<li><a href="/tools/size">사이즈 변환</a></li>
							<li><a href="/tools/customs">관세 계산</a></li>
						</ul>
					</li>
					<li class:active={$page.url.pathname.includes('/resell-search')}>
						<a href="/resell-search">리셀서치</a>
					</li>
					<li class:active={$page.url.pathname.includes('/community')}>
						<a href="/community">커뮤니티</a>
					</li>
					<li class:active={$page.url.pathname.includes('/notices')}>
						<a href="/notices">공지사항</a>
					</li>
					<li class:active={$page.url.pathname.includes('/api')}>
						<a href="/api">API</a>
					</li>
					<li class:active={$page.url.pathname.includes('/resell-lens')}>
						<a href="/resell-lens">리셀렌즈</a>
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
		background: #333;
		color: white;
		padding: 0 20px;
		margin: -20px -20px 0;
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60px;
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
		color: #ff6b6b;
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
		top: 100%;
		left: 0;
		background: #fff;
		min-width: 200px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.2);
		border-radius: 4px;
		padding: 8px 0;
		z-index: 1000;
	}

	.dropdown li {
		display: block;
		margin: 0;
		padding: 0;
	}

	.dropdown li a {
		color: #333;
		padding: 8px 16px;
		display: block;
		text-decoration: none;
	}

	.dropdown li a:hover {
		background: #f5f5f5;
	}

	header nav ul li:hover .dropdown {
		display: block;
	}

	header nav a {
		color: white;
		text-decoration: none;
		padding: 10px 0;
		display: inline-block;
	}

	.active > a {
		color: #ff6b6b;
		font-weight: bold;
	}

	.active .dropdown a {
		color: #333;
		font-weight: normal;
	}

	.icon {
		width: 32px;
		height: 32px;
		color: #ff6b6b;
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
</style>
