import { createClient } from '@supabase/supabase-js';

// Standardized Supabase client configuration
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  // Connection check
  if (!supabaseUrl) {
    console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable is missing');
    throw new Error('Missing Supabase URL configuration');
  }

  if (!supabaseKey) {
    console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY environment variable is missing');
    throw new Error('Missing Supabase Key configuration');
  }

  console.log('✅ Supabase 已连接 - URL:', supabaseUrl.substring(0, 20) + '...');
  
  return createClient(supabaseUrl, supabaseKey);
}

// Export singleton instance for reuse
let supabaseInstance = null;
export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
}
