<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { ActionData } from './$types';
	
	// 폼 결과 데이터
	export let form: ActionData;
	
	let username = form?.username || '';
	let password = '';
	let isAuthenticated = false;
</script>

<div class="admin-login-container">
	<div class="login-card">
		<h2>관리자 로그인</h2>
		
		{#if !isAuthenticated}
			<form method="POST" action="?/login" use:enhance>
				{#if form?.error}
					<div class="error-message">
						{form.error}
					</div>
				{/if}
				
				<div class="form-group">
					<label for="username">아이디</label>
					<input 
						type="text" 
						id="username" 
						name="username"
						bind:value={username} 
						placeholder="관리자 아이디 입력"
						required
					>
				</div>
				
				<div class="form-group">
					<label for="password">비밀번호</label>
					<input 
						type="password" 
						id="password" 
						name="password"
						bind:value={password} 
						placeholder="비밀번호 입력"
						required
					>
				</div>
				
				<button type="submit" class="login-btn">로그인</button>
			</form>
		{:else}
			<div class="auth-success">
				<p>이미 로그인되어 있습니다.</p>
				<div class="button-group">
					<button class="dashboard-btn" on:click={() => goto('/admin/dashboard')}>
						관리자 대시보드
					</button>
					<form method="POST" action="?/logout" use:enhance>
						<button type="submit" class="logout-btn">로그아웃</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.admin-login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
		padding: 20px;
	}
	
	.login-card {
		width: 100%;
		max-width: 400px;
		padding: 30px;
		border-radius: 8px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		background: white;
	}
	
	h2 {
		text-align: center;
		margin-bottom: 30px;
		color: #2D3748;
		font-weight: 600;
		border-bottom: 2px solid #4299E1;
		padding-bottom: 10px;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	label {
		display: block;
		margin-bottom: 8px;
		font-weight: 600;
		color: #4A5568;
	}
	
	input {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid #E2E8F0;
		border-radius: 4px;
		font-size: 14px;
		transition: all 0.2s ease;
	}
	
	input:focus {
		border-color: #4299E1;
		box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
		outline: none;
	}
	
	.login-btn {
		width: 100%;
		padding: 12px;
		background-color: #4299E1;
		color: white;
		border: none;
		border-radius: 4px;
		font-weight: 600;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.2s;
		margin-top: 10px;
	}
	
	.login-btn:hover {
		background-color: #3182CE;
	}
	
	.error-message {
		background-color: #FED7D7;
		border: 1px solid #F56565;
		color: #C53030;
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 20px;
		font-size: 14px;
	}
	
	.auth-success {
		text-align: center;
	}
	
	.auth-success p {
		margin-bottom: 20px;
		color: #2F855A;
		font-weight: 600;
	}
	
	.button-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.dashboard-btn, .logout-btn {
		padding: 10px;
		border-radius: 4px;
		border: none;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.dashboard-btn {
		background-color: #4299E1;
		color: white;
	}
	
	.dashboard-btn:hover {
		background-color: #3182CE;
	}
	
	.logout-btn {
		background-color: #E2E8F0;
		color: #4A5568;
	}
	
	.logout-btn:hover {
		background-color: #CBD5E0;
	}
</style> 