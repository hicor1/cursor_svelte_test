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

<style>
    .tools-section {
        position: relative;
        z-index: 1; /* 매우 낮은 z-index */
        margin-bottom: 40px;
    }

    /* 기존 도구 관련 스타일 */
</style> 