<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	
	// 서버에서 가져온 데이터
	export let data: PageData;
	export let form: ActionData;
	
	// 공지사항 인터페이스 정의
	interface Notice {
		id: number;
		title: string;
		content: string;
		created_at: string;
		author: string;
		views: number;
	}
	
	let isAuthenticated = true; // 이미 서버에서 인증 확인함
	
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
	function selectNotice(notice: Notice): void {
		selectedNotice = { ...notice }; // 복사본 생성
	}
	
	// 목록으로 돌아가기
	function backToList(): void {
		selectedNotice = null;
		isWriting = false;
		isEditing = false;
	}
	
	// 날짜 포맷팅 함수
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
	}
	
	// 글 작성 관련 변수
	let isWriting = false;
	let isEditing = false;
	let newNotice: Notice = {
		id: 0,
		title: '',
		content: '',
		created_at: '',
		author: '관리자',
		views: 0
	};
	
	// 글 작성 폼 초기화
	function initNewNotice(): void {
		newNotice = {
			id: 0,
			title: '',
			content: '',
			created_at: '',
			author: '관리자',
			views: 0
		};
	}
	
	// 글 작성 모드로 전환
	function startWriting(): void {
		isWriting = true;
		isEditing = false;
		selectedNotice = null;
		initNewNotice();
	}
	
	// 글 수정 모드로 전환
	function startEditing(notice: Notice): void {
		if (!notice) return;
		
		isEditing = true;
		isWriting = false;
		newNotice = { ...notice }; // 복사본 생성
	}
	
	// 폼 제출 후 처리
	$: if (form?.success) {
		isWriting = false;
		isEditing = false;
		// 페이지 새로고침하여 최신 데이터 가져오기
		window.location.reload();
	}
	
	// 대시보드로 돌아가기
	function backToDashboard(): void {
		goto('/admin/dashboard');
	}
</script>

<div class="admin-container">
	{#if isAuthenticated}
		<div class="admin-header">
			<div class="header-left">
				<button class="back-to-dashboard" on:click={backToDashboard}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="19" y1="12" x2="5" y2="12"></line>
						<polyline points="12 19 5 12 12 5"></polyline>
					</svg>
					대시보드
				</button>
				<h2>공지사항 관리</h2>
			</div>
		</div>
		
		<!-- 오류 메시지 표시 -->
		{#if form?.error}
			<div class="error-message">
				{form.error}
			</div>
		{/if}
		
		{#if !selectedNotice && !isWriting && !isEditing}
			<!-- 글쓰기 버튼 -->
			<div class="button-container write-btn-container">
				<button class="write-btn" on:click={startWriting}>글쓰기</button>
			</div>
			
			<!-- 공지사항 목록 -->
			<div class="board-container">
				<div class="board-header">
					<div class="col-id">번호</div>
					<div class="col-title">제목</div>
					<div class="col-author">작성자</div>
					<div class="col-date">등록일</div>
					<div class="col-views">조회수</div>
					<div class="col-actions">관리</div>
				</div>
				
				{#each paginatedNotices as notice}
					<div class="board-row">
						<div class="col-id">{notice.id}</div>
						<div class="col-title" on:click={() => selectNotice(notice)}>{notice.title}</div>
						<div class="col-author">{notice.author}</div>
						<div class="col-date">{formatDate(notice.created_at)}</div>
						<div class="col-views">{notice.views}</div>
						<div class="col-actions">
							<button class="edit-btn" on:click={() => startEditing(notice)}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
								</svg>
							</button>
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={notice.id}>
								<button 
									class="delete-btn" 
									type="submit" 
									on:click={(e) => {
										if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
											e.preventDefault();
										}
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="3 6 5 6 21 6"></polyline>
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
									</svg>
								</button>
							</form>
						</div>
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
	
		{:else if isWriting || isEditing}
			<!-- 공지사항 작성/수정 폼 -->
			<div class="notice-form">
				<div class="form-header">
					<h3>{isEditing ? '공지사항 수정' : '공지사항 작성'}</h3>
				</div>
				
				<form method="POST" action={isEditing ? '?/update' : '?/create'} use:enhance>
					{#if isEditing}
						<input type="hidden" name="id" value={newNotice.id}>
					{/if}
					
					<div class="form-group">
						<label for="title">제목</label>
						<input 
							type="text" 
							id="title" 
							name="title"
							bind:value={newNotice.title} 
							placeholder="제목을 입력하세요"
							required
						>
					</div>
					
					<div class="form-group">
						<label for="content">내용</label>
						<RichTextEditor bind:content={newNotice.content} />
						<input type="hidden" name="content" value={newNotice.content}>
					</div>
					
					<div class="form-group">
						<label for="author">작성자</label>
						<input 
							type="text" 
							id="author" 
							name="author"
							bind:value={newNotice.author} 
							placeholder="작성자"
						>
					</div>
					
					<div class="button-group">
						<button type="button" class="cancel-btn" on:click={backToList}>취소</button>
						<button type="submit" class="save-btn">저장</button>
					</div>
				</form>
			</div>
			
		{:else}
			<!-- 공지사항 상세 보기 -->
			<div class="notice-detail">
				<div class="detail-header">
					<h3>{selectedNotice?.title}</h3>
					<div class="detail-info">
						<span>작성자: {selectedNotice?.author}</span>
						<span>등록일: {selectedNotice ? formatDate(selectedNotice.created_at) : ''}</span>
						<span>조회수: {selectedNotice?.views}</span>
					</div>
				</div>
				
				<div class="detail-content">
					{#if selectedNotice?.content}
						{@html selectedNotice.content}
					{/if}
				</div>
				
				<div class="button-container">
					<button class="back-btn" on:click={backToList}>목록으로</button>
					<div class="action-buttons">
						{#if selectedNotice !== null}
							<button 
								class="edit-action-btn" 
								on:click={() => { 
									if (selectedNotice) startEditing(selectedNotice);
								}}
							>
								수정
							</button>
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={selectedNotice.id}>
								<button 
									class="delete-action-btn" 
									type="submit"
									on:click={(e) => {
										if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
											e.preventDefault();
										}
									}}
								>
									삭제
								</button>
							</form>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<div class="loading">관리자 정보를 확인 중입니다...</div>
	{/if}
</div>

<style>
	.admin-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		padding-bottom: 15px;
		border-bottom: 2px solid #4299E1;
	}
	
	.header-left {
		display: flex;
		align-items: center;
		gap: 15px;
	}
	
	.back-to-dashboard {
		display: flex;
		align-items: center;
		gap: 5px;
		background: none;
		border: none;
		color: #4A5568;
		font-size: 14px;
		cursor: pointer;
		padding: 5px 0;
	}
	
	.back-to-dashboard:hover {
		color: #4299E1;
	}
	
	.admin-header h2 {
		margin: 0;
		color: #2D3748;
		font-size: 1.5rem;
	}
	
	.error-message {
		background-color: #FED7D7;
		border: 1px solid #F56565;
		color: #C53030;
		padding: 12px 16px;
		border-radius: 4px;
		margin-bottom: 20px;
		font-size: 0.9rem;
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
		align-items: center;
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
		cursor: pointer;
	}
	
	.col-title:hover {
		color: #4299E1;
		text-decoration: underline;
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
	
	.col-actions {
		flex: 0 0 80px;
		display: flex;
		justify-content: center;
		gap: 10px;
	}
	
	.edit-btn, .delete-btn {
		border: none;
		background: none;
		cursor: pointer;
		padding: 5px;
		border-radius: 4px;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.edit-btn {
		color: #4299E1;
	}
	
	.edit-btn:hover {
		background-color: #EBF8FF;
	}
	
	.delete-btn {
		color: #F56565;
	}
	
	.delete-btn:hover {
		background-color: #FED7D7;
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
	
	.write-btn-container {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 20px;
	}
	
	.write-btn {
		padding: 8px 16px;
		background-color: #4299E1;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	
	.write-btn:hover {
		background-color: #3182CE;
		transform: translateY(-1px);
	}
	
	.write-btn::before {
		content: '+';
		font-size: 18px;
		line-height: 1;
	}
	
	.notice-form {
		border-top: 2px solid #4299E1;
		border-bottom: 1px solid #E2E8F0;
		padding: 20px;
		background-color: white;
	}
	
	.form-header {
		padding-bottom: 20px;
		margin-bottom: 20px;
		border-bottom: 1px solid #E2E8F0;
	}
	
	.form-header h3 {
		margin: 0;
		font-size: 1.25rem;
		color: #2D3748;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	.form-group label {
		display: block;
		margin-bottom: 8px;
		font-weight: 600;
		color: #4A5568;
	}
	
	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid #E2E8F0;
		border-radius: 4px;
		font-size: 14px;
		transition: all 0.2s ease;
	}
	
	.form-group input:focus,
	.form-group textarea:focus {
		border-color: #4299E1;
		box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
		outline: none;
	}
	
	.button-group {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-top: 30px;
	}
	
	.cancel-btn {
		padding: 10px 20px;
		background-color: #E2E8F0;
		color: #4A5568;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
		font-weight: 600;
	}
	
	.save-btn {
		padding: 10px 20px;
		background-color: #4299E1;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
		font-weight: 600;
	}
	
	.cancel-btn:hover {
		background-color: #CBD5E0;
	}
	
	.save-btn:hover {
		background-color: #3182CE;
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
		justify-content: space-between;
		margin: 20px 0;
		padding: 0 20px;
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
	
	.action-buttons {
		display: flex;
		gap: 10px;
	}
	
	.edit-action-btn {
		padding: 8px 20px;
		background-color: #4299E1;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.edit-action-btn:hover {
		background-color: #3182CE;
	}
	
	.delete-action-btn {
		padding: 8px 20px;
		background-color: #F56565;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.delete-action-btn:hover {
		background-color: #E53E3E;
	}
	
	.loading {
		text-align: center;
		padding: 50px;
		color: #718096;
		font-size: 1.1rem;
	}
</style> 