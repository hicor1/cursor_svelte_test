<script>
	import { page } from '$app/stores';
</script>

<main>
	<header>
		<h1>EOMISAE</h1>
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
		padding: 10px 0;
		text-align: center;
		margin: -20px -20px 0;  /* 헤더가 페이지 전체 너비를 차지하도록 */
	}

	header nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
		position: relative;
	}

	header nav ul li {
		display: inline-block;
		margin: 0 15px;
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

	/* 활성화된 메뉴 스타일 */
	.active > a {
		color: #ff6b6b;
		font-weight: bold;
	}

	.active .dropdown a {
		color: #333;
		font-weight: normal;
	}
</style>
