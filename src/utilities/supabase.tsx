import {createClient, SupabaseClient} from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_NEWEST_URL || '';
const supabaseKey: string = import.meta.env.VITE_NEWEST_KEY || '';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
export default supabase;
