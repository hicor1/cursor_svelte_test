import { supabase } from '$lib/server/supabase';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    // 관리자 인증 확인
    const isAdmin = cookies.get('adminAuthenticated') === 'true';
    if (!isAdmin) {
        throw redirect(302, '/admin');
    }
    
    try {
        // 공지사항 데이터 가져오기 (최신 등록순)
        const { data, error: supabaseError } = await supabase
            .from('notices')
            .select('*')
            .order('id', { ascending: false });

        if (supabaseError) {
            console.error('Supabase error:', supabaseError);
            throw error(500, '공지사항을 불러오는 중 오류가 발생했습니다.');
        }

        return {
            notices: data || []
        };
    } catch (err) {
        console.error('Server error:', err);
        throw error(500, '서버 오류가 발생했습니다.');
    }
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const title = formData.get('title')?.toString();
        const content = formData.get('content')?.toString();
        const author = formData.get('author')?.toString() || '관리자';
        
        if (!title || !content) {
            return { success: false, error: '제목과 내용은 필수입니다.' };
        }
        
        try {
            const { data, error: insertError } = await supabase
                .from('notices')
                .insert([
                    { 
                        title, 
                        content, 
                        author, 
                        views: 0
                    }
                ])
                .select();
                
            if (insertError) {
                console.error('Insert error:', insertError);
                return { success: false, error: '공지사항 저장 중 오류가 발생했습니다.' };
            }
            
            return { success: true, notice: data?.[0] };
        } catch (err) {
            console.error('Action error:', err);
            return { success: false, error: '서버 오류가 발생했습니다.' };
        }
    },
    
    update: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const title = formData.get('title')?.toString();
        const content = formData.get('content')?.toString();
        const author = formData.get('author')?.toString();
        
        if (!id || !title || !content) {
            return { success: false, error: 'ID, 제목, 내용은 필수입니다.' };
        }
        
        try {
            const { data, error: updateError } = await supabase
                .from('notices')
                .update({ 
                    title, 
                    content, 
                    author
                })
                .eq('id', id)
                .select();
                
            if (updateError) {
                console.error('Update error:', updateError);
                return { success: false, error: '공지사항 수정 중 오류가 발생했습니다.' };
            }
            
            return { success: true, notice: data?.[0] };
        } catch (err) {
            console.error('Action error:', err);
            return { success: false, error: '서버 오류가 발생했습니다.' };
        }
    },
    
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        
        if (!id) {
            return { success: false, error: 'ID는 필수입니다.' };
        }
        
        try {
            const { error: deleteError } = await supabase
                .from('notices')
                .delete()
                .eq('id', id);
                
            if (deleteError) {
                console.error('Delete error:', deleteError);
                return { success: false, error: '공지사항 삭제 중 오류가 발생했습니다.' };
            }
            
            return { success: true };
        } catch (err) {
            console.error('Action error:', err);
            return { success: false, error: '서버 오류가 발생했습니다.' };
        }
    }
}; 