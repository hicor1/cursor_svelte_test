import { supabase } from '$lib/server/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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