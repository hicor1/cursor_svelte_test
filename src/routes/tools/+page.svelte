<script lang="ts">
	const tools = [
		{
			title: '마진 계산기',
			description: '플랫폼별 수수료를 고려한 판매가 계산',
			link: '/tools/calculator',
			icon: '💰'
		},
		{
			title: '가격 추적',
			description: '상품 가격 변동 모니터링 및 알림',
			link: '/tools/price-tracker',
			icon: '📊'
		},
		{
			title: '재고 알리미',
			description: '상품 재입고 알림 설정',
			link: '/tools/stock-alert',
			icon: '🔔'
		},
		{
			title: '경쟁가 분석',
			description: '플랫폼별 판매가 비교 분석',
			link: '/tools/price-analysis',
			icon: '📈'
		},
		{
			title: '수수료 비교',
			description: '리셀 플랫폼별 수수료 비교',
			link: '/tools/fees',
			icon: '💸'
		},
		{
			title: '사이즈 변환',
			description: '국가별 신발 사이즈 변환',
			link: '/tools/size',
			icon: '👟'
		},
		{
			title: '관세 계산',
			description: '해외 직구 관세 계산',
			link: '/tools/customs',
			icon: '✈️'
		}
	];
</script>

<div class="tools-container">
	<h2>리셀러 도구</h2>
	<div class="tools-grid">
		{#each tools as tool}
			<a href={tool.link} class="tool-card">
				<div class="tool-icon">{tool.icon}</div>
				<div class="tool-content">
					<h3>{tool.title}</h3>
					<p>{tool.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.tools-container {
		max-width: 1200px;
		margin: 40px auto;
		padding: 0 20px;
	}

	h2 {
		color: #333;
		margin-bottom: 30px;
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
	}

	.tool-card {
		background: white;
		padding: 20px;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 15px;
		border: 1px solid #eee;
	}

	.tool-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 12px rgba(0,0,0,0.15);
		border-color: #ff6b6b;
	}

	.tool-icon {
		font-size: 24px;
		min-width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.tool-content {
		flex: 1;
	}

	.tool-card h3 {
		color: #ff6b6b;
		margin: 0 0 10px 0;
	}

	.tool-card p {
		color: #666;
		margin: 0;
		font-size: 14px;
	}
</style> 