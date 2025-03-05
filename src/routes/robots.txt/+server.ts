import type { RequestHandler } from '@sveltejs/kit';

// robots.txt 엔드포인트
export const GET: RequestHandler = async () => {
    const robotsTxt = `
# https://theresella.com robots.txt
User-agent: *
Allow: /
Allow: /notices/
Allow: /xfind/
Allow: /resell-search/

# 보안을 위해 관리자 페이지만 제한
Disallow: /admin/

# 사이트맵 위치
Sitemap: https://theresella.com/sitemap.xml

# 크롤링 최적화 설정
Crawl-delay: 1
`.trim();

    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}; 