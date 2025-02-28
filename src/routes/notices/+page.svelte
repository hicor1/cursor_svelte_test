<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	
	// 서버로부터 데이터 가져오기
	export let data: PageData;
	
	// 공지사항 인터페이스 정의
	interface Notice {
		id: number;
		title: string;
		content: string;
		created_at: string;
		author: string;
		views: number;
	}
	
	// 공지사항 데이터
	$: notices = data.notices || [];

	// 페이지네이션 관련 변수
	let currentPage = 1;
	const itemsPerPage = 10;
	$: totalPages = Math.ceil(notices.length / itemsPerPage);
	
	// 현재 페이지에 해당하는 공지사항만 필터링
	$: paginatedNotices = notices.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	
	// 페이지 변경 함수
	function changePage(page: number): void {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	// 선택된 공지사항
	let selectedNotice: Notice | null = null;
	
	// 공지사항 선택 함수
	async function selectNotice(notice: Notice): Promise<void> {
		selectedNotice = { ...notice }; // 복사본 생성
		
		// 조회수 증가 (Supabase API 호출)
		try {
			const response = await fetch(`/api/notices/${notice.id}/view`, {
				method: 'POST'
			});
			
			if (response.ok) {
				// 성공적으로 조회수가 증가되면 로컬 상태도 업데이트
				const updatedNotice = await response.json();
				notices = notices.map(n => 
					n.id === notice.id ? { ...n, views: updatedNotice.views } : n
				);
			}
		} catch (err) {
			console.error('조회수 업데이트 오류:', err);
		}
	}
	
	// 목록으로 돌아가기
	function backToList(): void {
		selectedNotice = null;
	}
	
	// 날짜 포맷팅 함수
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
	}
</script>

<div class="container">
	<h2 class="page-title">공지사항</h2>

	{#if !selectedNotice}
		<!-- 공지사항 목록 -->
		<div class="board-container">
			<div class="board-header">
				<div class="col-id">번호</div>
				<div class="col-title">제목</div>
				<div class="col-author">작성자</div>
				<div class="col-date">등록일</div>
				<div class="col-views">조회수</div>
			</div>
			
			{#each paginatedNotices as notice}
				<div class="board-row" on:click={() => selectNotice(notice)}>
					<div class="col-id">{notice.id}</div>
					<div class="col-title">{notice.title}</div>
					<div class="col-author">{notice.author}</div>
					<div class="col-date">{formatDate(notice.created_at)}</div>
					<div class="col-views">{notice.views}</div>
				</div>
			{/each}
			
			{#if notices.length === 0}
				<div class="no-items">등록된 공지사항이 없습니다.</div>
			{/if}
		</div>
		
		<!-- 페이지네이션 -->
		{#if totalPages > 1}
			<div class="pagination">
				<button class="page-btn" disabled={currentPage === 1} on:click={() => changePage(currentPage - 1)}>
					이전
				</button>
				
				{#each Array(totalPages) as _, i}
					<button 
						class="page-btn" 
						class:active={currentPage === i + 1}
						on:click={() => changePage(i + 1)}
					>
						{i + 1}
					</button>
				{/each}
				
				<button class="page-btn" disabled={currentPage === totalPages} on:click={() => changePage(currentPage + 1)}>
					다음
				</button>
			</div>
		{/if}
	{:else}
		<!-- 공지사항 상세 보기 -->
		<div class="notice-detail">
			<div class="detail-header">
				<h3>{selectedNotice.title}</h3>
				<div class="detail-info">
					<span>작성자: {selectedNotice.author}</span>
					<span>등록일: {formatDate(selectedNotice.created_at)}</span>
					<span>조회수: {selectedNotice.views}</span>
				</div>
			</div>
			
			<div class="detail-content">
				{#if selectedNotice?.content}
					{@html selectedNotice.content}
				{:else}
					<!-- 콘텐츠가 없는 경우 -->
					<p>내용이 없습니다.</p>
				{/if}
			</div>
			
			<div class="button-container">
				<button class="back-btn" on:click={backToList}>목록으로</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.page-title {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #4299E1;
		color: #2D3748;
	}
	
	.board-container {
		border-top: 2px solid #4299E1;
		border-bottom: 1px solid #E2E8F0;
	}
	
	.board-header {
		display: flex;
		background-color: #F7FAFC;
		padding: 12px 16px;
		font-weight: bold;
		border-bottom: 1px solid #E2E8F0;
	}
	
	.board-row {
		display: flex;
		padding: 14px 16px;
		border-bottom: 1px solid #E2E8F0;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.board-row:hover {
		background-color: #EBF8FF;
	}
	
	.col-id {
		flex: 0 0 50px;
		text-align: center;
	}
	
	.col-title {
		flex: 1;
	}
	
	.col-author {
		flex: 0 0 100px;
		text-align: center;
	}
	
	.col-date {
		flex: 0 0 100px;
		text-align: center;
	}
	
	.col-views {
		flex: 0 0 80px;
		text-align: center;
	}
	
	.pagination {
		display: flex;
		justify-content: center;
		margin-top: 20px;
		gap: 5px;
	}
	
	.page-btn {
		padding: 6px 12px;
		border: 1px solid #E2E8F0;
		background-color: white;
		color: #4A5568;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
	}
	
	.page-btn:hover:not(:disabled) {
		background-color: #EBF8FF;
		border-color: #4299E1;
		color: #4299E1;
	}
	
	.page-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.page-btn.active {
		background-color: #4299E1;
		color: white;
		border-color: #4299E1;
	}
	
	.no-items {
		padding: 30px;
		text-align: center;
		color: #A0AEC0;
	}
	
	.notice-detail {
		border-top: 2px solid #4299E1;
		border-bottom: 1px solid #E2E8F0;
	}
	
	.detail-header {
		padding: 20px;
		border-bottom: 1px solid #E2E8F0;
	}
	
	.detail-header h3 {
		margin: 0 0 10px 0;
		font-size: 1.25rem;
		color: #2D3748;
	}
	
	.detail-info {
		display: flex;
		color: #718096;
		font-size: 0.875rem;
		gap: 15px;
	}
	
	.detail-content {
		padding: 30px 20px;
		min-height: 200px;
		line-height: 1.6;
		white-space: pre-wrap;
	}
	
	.button-container {
		display: flex;
		justify-content: center;
		margin: 20px 0;
	}
	
	.back-btn {
		padding: 8px 20px;
		background-color: #4299E1;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.back-btn:hover {
		background-color: #3182CE;
	}
</style> 