import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';

export const GET: RequestHandler = async () => {
    // 현재 날짜를 ISO 형식으로 가져옴
    const today = new Date().toISOString();

    // 기본 페이지 목록
    const staticPages = [
        {
            url: '/',
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
        },
        {
            url: '/resell-search',
            priority: '0.9',
            changefreq: 'daily'
        }
    ];

    try {
        // 공지사항 목록 가져오기
        const { data: notices } = await supabase
            .from('notices')
            .select('id, updated_at')
            .order('updated_at', { ascending: false });

        // XML 생성 시작
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // 정적 페이지 추가
        staticPages.forEach(page => {
            xml += `
    <url>
        <loc>https://theresella.com${page.url}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
        });

        // 공지사항 페이지 추가
        if (notices) {
            notices.forEach(notice => {
                xml += `
    <url>
        <loc>https://theresella.com/notices/${notice.id}</loc>
        <lastmod>${notice.updated_at}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;
            });
        }

        // XML 닫기
        xml += `
</urlset>`;

        return new Response(xml.trim(), {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'max-age=0, s-maxage=3600'
            }
        });
    } catch (error) {
        console.error('Sitemap generation error:', error);
        
        // 에러 발생 시 기본 정적 페이지만 포함한 사이트맵 반환
        const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages.map(page => `
    <url>
        <loc>https://theresella.com${page.url}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('')}
</urlset>`;

        return new Response(fallbackXml.trim(), {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'max-age=0, s-maxage=3600'
            }
        });
    }
}; 