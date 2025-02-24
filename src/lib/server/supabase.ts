import { createClient } from '@supabase/supabase-js';
import { PRIVATE_SUPABASE_URL, PRIVATE_SUPABASE_ANON_KEY } from '$env/static/private';
import type { MarketPrice } from '$lib/types';

// 일단 타입 정의 없이 클라이언트만 생성
export const supabase = createClient(
    PRIVATE_SUPABASE_URL,
    PRIVATE_SUPABASE_ANON_KEY
); 