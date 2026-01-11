import { createClient } from '@supabase/supabase-js';

// Standardized Supabase client configuration
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  // Connection check
  if (!supabaseUrl) {
    console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable is missing');
    // Fallback to hardcoded values for production
    console.warn('Using fallback Supabase URL for production');
    return createClient('https://rczfbgzghwiqpxihlexs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjemZiZ3pnaHdpcXB4aWhsZXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5NDUwMSwiZXhwIjoyMDc1NTcwNTAxfQ.uF3IofVn0ZkFSM6aSYsWCmOWHl26ybxv_bwMST3Zsio');
  }

  if (!supabaseKey) {
    console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY environment variable is missing');
    // Fallback to hardcoded SERVICE_ROLE_KEY for production
    console.warn('Using fallback SERVICE_ROLE_KEY for production');
    return createClient('https://rczfbgzghwiqpxihlexs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjemZiZ3pnaHdpcXB4aWhsZXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5NDUwMSwiZXhwIjoyMDc1NTcwNTAxfQ.uF3IofVn0ZkFSM6aSYsWCmOWHl26ybxv_bwMST3Zsio');
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
