<script lang="ts">
	import SubNavigation from '$lib/components/SubNavigation.svelte';
	import NoticeTable from '$lib/components/NoticeTable.svelte';
	import PostCard from '$lib/components/PostCard.svelte';

	interface Notice {
		type: string;
		category: string;
		title: string;
		author: string;
		date: string;
		likes: number;
	}

	interface Post {
		type: string;      // 인기/패션/기타정보
		category: string;  // 패션국내/해외 등
		title: string;
		date: string;
		views: number;
		likes: number;
		comments: number;
		thumbnail?: string;
		author: {
			name: string;
			image?: string;
		};
		tags?: string[];
	}

	let notices: Notice[] = [
		{
			type: '공지',
			category: '공지',
			title: '쇼핑정보 게시판 이용 규정 352',
			author: '어미새',
			date: '17.12.02',
			likes: 0
		},
		{
			type: '공지',
			category: '공지',
			title: '새벽 정보 문화상품권 이벤트 243',
			author: '어미새',
			date: '18.02.12',
			likes: 0
		}
	];

	let posts: Post[] = [
		{
			type: '인기',
			category: '기타국내',
			title: '쿠팡 로켓배송 청정원 진한 토마토케찹 1,380원',
			date: '25.02.22',
			views: 3167,
			likes: 29,
			comments: 3,
			thumbnail: '/images/ketchup.jpg',
			author: {
				name: '성기사'
			}
		},
		{
			type: '인기',
			category: '기타국내',
			title: '운영 재입고',
			date: '25.02.22',
			views: 8599,
			likes: 24,
			comments: 8,
			thumbnail: '/images/restock.jpg',
			author: {
				name: '오희'
			}
		}
	];

	let selectedFilter = '전체';
	let selectedCategory = '전체';

	let subNavItems = [
		{ id: 'popular', name: '인기정보', active: true },
		{ id: 'fashion', name: '패션정보', active: false },
		{ id: 'other', name: '기타정보', active: false },
		{ id: 'raffle', name: '래플정보', active: false },
		{ id: 'event', name: '이벤트정보', active: false }
	];
</script>

<div class="container">
	<SubNavigation items={subNavItems} />
	<NoticeTable {notices} />

	<div class="filters">
		<div class="filter-group">
			<button class="filter-btn" class:active={selectedFilter === '분류'}>분류</button>
			<button class="filter-btn" class:active={selectedFilter === '정렬'}>정렬</button>
			<button class="filter-btn" class:active={selectedFilter === '필터'}>필터</button>
		</div>
		<div class="action-buttons">
			<button class="action-btn">쓰기</button>
			<button class="action-btn">검색</button>
			<button class="action-btn">목록</button>
		</div>
	</div>

	<div class="posts-grid">
		{#each posts as post}
			<PostCard {post} />
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	/* 필터 섹션 스타일 */
	.filters {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
		padding: 10px 0;
		border-bottom: 1px solid #eee;
	}

	.filter-group {
		display: flex;
		gap: 10px;
	}

	.filter-btn, .action-btn {
		padding: 8px 16px;
		border: none;
		background: none;
		cursor: pointer;
		border-radius: 4px;
	}

	.filter-btn:hover, .action-btn:hover {
		background: #f5f5f5;
	}

	.filter-btn.active {
		background: #333;
		color: white;
	}

	.action-buttons {
		display: flex;
		gap: 10px;
	}

	/* 게시물 그리드 스타일 */
	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 20px;
	}
</style> 