<script lang="ts">
	import { onMount } from 'svelte';
	
	let image1Url = '';
	let image2Url = '';
	let loading = false;
	let result: { similarity: number; isMatch: boolean } | null = null;
	let error: string | null = null;

	async function compareImages() {
		if (!image1Url || !image2Url) {
			error = '두 이미지 URL을 모두 입력해주세요.';
			return;
		}

		loading = true;
		error = null;
		
		try {
			const response = await fetch('/api/compare-images', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ image1Url, image2Url })
			});

			if (!response.ok) throw new Error('이미지 비교 중 오류가 발생했습니다.');
			
			result = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
			result = null;
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<section class="lens-section">
		<h1>리셀렌즈</h1>
		<p class="description">
			두 상품 이미지의 URL을 입력하여 동일 상품인지 비교해보세요.
		</p>

		<div class="input-group">
			<div class="url-input">
				<label for="image1">첫 번째 이미지 URL</label>
				<input
					type="text"
					id="image1"
					bind:value={image1Url}
					placeholder="예: https://example.com/image1.jpg"
				/>
				{#if image1Url}
					<div class="preview">
						<img src={image1Url} alt="첫 번째 이미지 미리보기" />
					</div>
				{/if}
			</div>

			<div class="url-input">
				<label for="image2">두 번째 이미지 URL</label>
				<input
					type="text"
					id="image2"
					bind:value={image2Url}
					placeholder="예: https://example.com/image2.jpg"
				/>
				{#if image2Url}
					<div class="preview">
						<img src={image2Url} alt="두 번째 이미지 미리보기" />
					</div>
				{/if}
			</div>
		</div>

		<button 
			class="compare-btn" 
			on:click={compareImages} 
			disabled={loading || !image1Url || !image2Url}
		>
			{loading ? '분석 중...' : '이미지 비교하기'}
		</button>

		{#if error}
			<div class="error">
				{error}
			</div>
		{/if}

		{#if result}
			<div class="result">
				<h3>분석 결과</h3>
				<div class="similarity">
					유사도: {(result.similarity * 100).toFixed(2)}%
				</div>
				<div class="match-result">
					{result.isMatch ? 
						'✅ 동일한 상품으로 판단됩니다.' : 
						'❌ 서로 다른 상품으로 판단됩니다.'}
				</div>
			</div>
		{/if}
	</section>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.lens-section {
		background: white;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}

	h1 {
		color: #333;
		margin-bottom: 16px;
	}

	.description {
		color: #666;
		margin-bottom: 30px;
	}

	.input-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin-bottom: 30px;
	}

	.url-input {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-size: 14px;
		color: #666;
	}

	input {
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
	}

	.preview {
		width: 100%;
		height: 200px;
		border: 1px solid #ddd;
		border-radius: 4px;
		overflow: hidden;
	}

	.preview img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.compare-btn {
		background: #ff6b6b;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		transition: background 0.2s;
	}

	.compare-btn:hover {
		background: #ff5252;
	}

	.compare-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.error {
		color: #ff4444;
		margin-top: 20px;
		padding: 10px;
		background: #ffebee;
		border-radius: 4px;
	}

	.result {
		margin-top: 30px;
		padding: 20px;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.similarity {
		font-size: 24px;
		font-weight: bold;
		color: #ff6b6b;
		margin: 10px 0;
	}

	.match-result {
		font-size: 18px;
		color: #333;
	}

	@media (max-width: 768px) {
		.input-group {
			grid-template-columns: 1fr;
		}
	}
</style> 