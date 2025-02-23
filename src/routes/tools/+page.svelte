<script lang="ts">
	const tools = [
		{
			title: '마진 계산기',
			description: '플랫폼별 수수료를 고려한 판매가 계산',
			link: '/tools/calculator'
		},
		{
			title: '수수료 비교',
			description: '리셀 플랫폼별 수수료 비교',
			link: '/tools/fees'
		},
		{
			title: '사이즈 변환',
			description: '국가별 신발 사이즈 변환',
			link: '/tools/size'
		},
		{
			title: '관세 계산',
			description: '해외 직구 관세 계산',
			link: '/tools/customs'
		}
	];
</script>

<div class="tools-container">
	<h2>리셀러 도구</h2>
	<div class="tools-grid">
		{#each tools as tool}
			<a href={tool.link} class="tool-card">
				<h3>{tool.title}</h3>
				<p>{tool.description}</p>
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
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s;
	}

	.tool-card:hover {
		transform: translateY(-2px);
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