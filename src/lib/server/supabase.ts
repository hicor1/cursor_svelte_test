import { createClient } from '@supabase/supabase-js';
import { PRIVATE_SUPABASE_URL, PRIVATE_SUPABASE_ANON_KEY } from '$env/static/private';

// 직접 할당하는 방식으로 변경
const supabaseUrl = 'https://wqpudzjtoiifbzvrvkrg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcHVkemp0b2lpZmJ6dnJ2a3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMjA1ODksImV4cCI6MjA1NTg5NjU4OX0.z1YfyX8tIA9lCq_ty9gZKfpsFoCuoC9r3l-eZFxoiF8';

console.log('직접 할당된 SUPABASE URL:', supabaseUrl);
console.log('직접 할당된 SUPABASE KEY:', supabaseKey ? '존재함' : '없음');

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
); 