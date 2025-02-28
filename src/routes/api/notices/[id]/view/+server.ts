import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// 조회수 증가 API 엔드포인트
export const POST: RequestHandler = async ({ params }) => {
    const { id } = params;
    
    if (!id || isNaN(Number(id))) {
        return json({ error: '잘못된 ID입니다.' }, { status: 400 });
    }
    
    try {
        // 먼저 현재 공지사항 데이터 가져오기
        const { data: notice, error: fetchError } = await supabase
            .from('notices')
            .select('views')
            .eq('id', id)
            .single();
            
        if (fetchError) {
            console.error('공지사항 조회 에러:', fetchError);
            return json({ error: '공지사항을 찾을 수 없습니다.' }, { status: 404 });
        }
        
        // 조회수 증가 업데이트
        const updateData = {
            views: (notice.views || 0) + 1
        };
        
        // 조회수 증가 업데이트
        const { data: updatedNotice, error: updateError } = await supabase
            .from('notices')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
            
        if (updateError) {
            console.error('조회수 업데이트 에러:', updateError);
            return json({ error: '조회수 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
        }
        
        return json(updatedNotice);
    } catch (err) {
        console.error('서버 에러:', err);
        return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}; 