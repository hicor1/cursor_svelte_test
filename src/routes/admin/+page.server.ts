import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// 관리자 정보 (실제로는 환경 변수나 서버에서 관리해야 함)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin1234'; // 실무에서는 해시화된 비밀번호 사용

export const load: PageServerLoad = async ({ cookies }) => {
    // 이미 인증된 상태라면 대시보드로 리디렉션
    const isAuthenticated = cookies.get('adminAuthenticated') === 'true';
    if (isAuthenticated) {
        throw redirect(302, '/admin/dashboard');
    }
    
    return {};
};

export const actions: Actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get('username')?.toString();
        const password = data.get('password')?.toString();
        
        if (!username || !password) {
            return fail(400, { 
                error: '아이디와 비밀번호를 모두 입력해주세요.',
                username
            });
        }
        
        // 관리자 인증 (실제로는 데이터베이스 조회 등으로 처리)
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // 쿠키에 인증 정보 저장 (실제로는 세션 토큰이나 JWT 토큰 사용)
            cookies.set('adminAuthenticated', 'true', {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 24시간 유효
            });
            
            throw redirect(302, '/admin/dashboard');
        }
        
        return fail(401, {
            error: '아이디 또는 비밀번호가 올바르지 않습니다.',
            username
        });
    },
    
    logout: async ({ cookies }) => {
        cookies.delete('adminAuthenticated', { path: '/' });
        throw redirect(302, '/admin');
    }
}; 