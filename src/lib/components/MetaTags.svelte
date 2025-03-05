<script lang="ts">
    export let title = 'Theresella - 카드뉴스 제작 플랫폼';
    export let description = '손쉽게 만들고 공유하는 카드뉴스 플랫폼';
    export let keywords = '카드뉴스, 디자인, 템플릿, 공유, 커뮤니티, theresella';
    export let image = 'https://theresella.com/og-image.png';
    export let url = 'https://theresella.com';
    export let type = 'website';
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
    <meta property="og:site_name" content="Theresella" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    
    <link rel="canonical" href={url} />
</svelte:head> 