<script>
	import { page } from '$app/stores';
</script>

<main>
	<header>
		<div class="header-content">
			<div class="logo">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ff6b6b">
					<path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.123 10.33 10.33 0 0 0 .372-.292.073.073 0 0 1 .077-.01c3.927 1.764 8.18 1.764 12.061 0a.073.073 0 0 1 .078.01c.12.098.245.198.372.292a.075.075 0 0 1-.006.127c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.963a.077.077 0 0 0 .084.026 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
				</svg>
				<h1>RESELLA</h1>
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
					<li class:active={$page.url.pathname.includes('/community')}>
						<a href="/community">커뮤니티</a>
					</li>
					<li class:active={$page.url.pathname.includes('/notices')}>
						<a href="/notices">공지사항</a>
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
</style>
