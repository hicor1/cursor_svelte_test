<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let isAuthenticated = false;
	
	// 관리자 인증 상태 확인
	onMount(() => {
		const authStatus = sessionStorage.getItem('adminAuthenticated');
		if (authStatus !== 'true') {
			// 인증되지 않은 경우 로그인 페이지로 리디렉션
			goto('/admin');
		} else {
			isAuthenticated = true;
		}
	});
	
	function handleLogout() {
		sessionStorage.removeItem('adminAuthenticated');
		goto('/admin');
	}
	
	// 공지사항 관리 페이지로 이동
	function goToNoticeManager() {
		goto('/admin/notices');
	}
</script>

<div class="admin-dashboard">
	{#if isAuthenticated}
		<div class="dashboard-header">
			<h1>관리자 대시보드</h1>
			<button class="logout-btn" on:click={handleLogout}>로그아웃</button>
		</div>
		
		<div class="dashboard-content">
			<div class="admin-menu-grid">
				<div class="admin-menu-card" on:click={goToNoticeManager}>
					<div class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
						</svg>
					</div>
					<h3>공지사항 관리</h3>
					<p>공지사항을 작성, 수정, 삭제합니다.</p>
				</div>
				
				<div class="admin-menu-card disabled">
					<div class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
							<circle cx="9" cy="7" r="4"></circle>
							<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
							<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
						</svg>
					</div>
					<h3>회원 관리</h3>
					<p>회원 정보를 관리합니다.</p>
					<span class="coming-soon">Coming Soon</span>
				</div>
				
				<div class="admin-menu-card disabled">
					<div class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
							<line x1="1" y1="10" x2="23" y2="10"></line>
						</svg>
					</div>
					<h3>결제 관리</h3>
					<p>결제 및 주문 정보를 관리합니다.</p>
					<span class="coming-soon">Coming Soon</span>
				</div>
				
				<div class="admin-menu-card disabled">
					<div class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="3"></circle>
							<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
						</svg>
					</div>
					<h3>사이트 설정</h3>
					<p>사이트 기본 설정을 관리합니다.</p>
					<span class="coming-soon">Coming Soon</span>
				</div>
			</div>
		</div>
	{:else}
		<div class="loading">관리자 정보를 확인 중입니다...</div>
	{/if}
</div>

<style>
	.admin-dashboard {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		padding-bottom: 15px;
		border-bottom: 2px solid #4299E1;
	}
	
	.dashboard-header h1 {
		margin: 0;
		color: #2D3748;
		font-size: 1.8rem;
	}
	
	.logout-btn {
		padding: 8px 16px;
		background-color: #E2E8F0;
		color: #4A5568;
		border: none;
		border-radius: 4px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.logout-btn:hover {
		background-color: #CBD5E0;
	}
	
	.admin-menu-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 20px;
		margin-top: 20px;
	}
	
	.admin-menu-card {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
		padding: 20px;
		transition: all 0.3s ease;
		border: 1px solid #E2E8F0;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.admin-menu-card:hover:not(.disabled) {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(66, 153, 225, 0.15);
		border-color: #4299E1;
	}
	
	.icon {
		background-color: #EBF8FF;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 15px;
		color: #4299E1;
	}
	
	.admin-menu-card h3 {
		margin: 0 0 10px 0;
		color: #2D3748;
		font-size: 1.2rem;
	}
	
	.admin-menu-card p {
		margin: 0;
		color: #718096;
		font-size: 0.9rem;
	}
	
	.admin-menu-card.disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
	
	.coming-soon {
		position: absolute;
		top: 10px;
		right: 10px;
		background-color: #FBD38D;
		color: #C05621;
		font-size: 0.7rem;
		padding: 2px 6px;
		border-radius: 10px;
		font-weight: 600;
	}
	
	.loading {
		text-align: center;
		padding: 50px;
		color: #718096;
		font-size: 1.1rem;
	}
</style> 