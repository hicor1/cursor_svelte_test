import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return new Response('google-site-verification: googlef9428cb2d44da04e.html', {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}; 