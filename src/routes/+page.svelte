<script lang="ts">
	const tools = [
		{
			title: '마진 계산기',
			description: '플랫폼별 수수료를 고려한 판매가 계산',
			link: '/tools/calculator',
			icon: '💰'
		},
		{
			title: '수수료 비교',
			description: '리셀 플랫폼별 수수료 비교',
			link: '/tools/fees',
			icon: '📊'
		},
		{
			title: '사이즈 변환',
			description: '국가별 신발 사이즈 변환',
			link: '/tools/size',
			icon: '📏'
		},
		{
			title: '관세 계산',
			description: '해외 직구 관세 계산',
			link: '/tools/customs',
			icon: '✈️'
		}
	];
</script>

<div class="container">
	<section class="welcome-section">
		<h1>RESELLA에 오신 것을 환영합니다</h1>
		<p>전세계 브랜드 유통정보를 한눈에, 리셀러를 위한 모든 도구</p>
	</section>

	<section class="tools-section">
		<h2>리셀러 도구</h2>
		<div class="tools-grid">
			{#each tools as tool}
				<a href={tool.link} class="tool-card">
					<div class="tool-icon">{tool.icon}</div>
					<h3>{tool.title}</h3>
					<p>{tool.description}</p>
				</a>
			{/each}
		</div>
	</section>

	<!-- 다른 섹션들도 추가 가능 -->
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.welcome-section {
		text-align: center;
		padding: 60px 0;
		background: linear-gradient(to right, #ff6b6b11, #ff6b6b22);
		border-radius: 12px;
		margin-bottom: 40px;
	}

	.welcome-section h1 {
		color: #333;
		font-size: 2.5em;
		margin-bottom: 16px;
	}

	.welcome-section p {
		color: #666;
		font-size: 1.2em;
	}

	.tools-section {
		margin-bottom: 40px;
	}

	.tools-section h2 {
		color: #333;
		margin-bottom: 24px;
		font-size: 1.8em;
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
	}

	.tool-card {
		background: white;
		padding: 24px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.tool-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0,0,0,0.15);
	}

	.tool-icon {
		font-size: 2.5em;
		margin-bottom: 16px;
	}

	.tool-card h3 {
		color: #ff6b6b;
		margin: 0 0 12px 0;
		font-size: 1.3em;
	}

	.tool-card p {
		color: #666;
		margin: 0;
		font-size: 0.95em;
		line-height: 1.5;
	}

	/* 반응형 디자인 */
	@media (max-width: 768px) {
		.welcome-section {
			padding: 40px 20px;
		}

		.welcome-section h1 {
			font-size: 2em;
		}

		.tools-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
