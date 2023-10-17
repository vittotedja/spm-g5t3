import {createClient, SupabaseClient} from '@supabase/supabase-js';

var supabaseUrl: string = import.meta.env.VITE_NEWEST_URL || '';
var supabaseKey: string = import.meta.env.VITE_NEWEST_KEY || '';
if (process.env.NODE_ENV != 'development') {
	supabaseUrl = process.env.VITE_NEWEST_URL || '';
	supabaseKey = process.env.VITE_NEWEST_KEY || '';
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
export default supabase;
