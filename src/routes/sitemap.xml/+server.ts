import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    // 현재 날짜를 ISO 형식으로 가져옴
    const today = new Date().toISOString().split('T')[0];

    // 기본 페이지 목록
    const pages = [
        {
            url: '',
            priority: '1.0',
            changefreq: 'daily'
        },
        {
            url: '/notices',
            priority: '0.8',
            changefreq: 'daily'
        },
        {
            url: '/xfind',
            priority: '0.9',
            changefreq: 'daily'
        }
    ];

    // XML 생성
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages.map(page => `
    <url>
        <loc>https://theresella.com${page.url}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('')}
</urlset>`;

    return new Response(xml.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}; 