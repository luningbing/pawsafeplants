import { createClient } from '@supabase/supabase-js';

// Emergency Hardcoded Fallback for Production
const HARDCODED_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjemZiZ3pnaHdpcXB4aWhsZXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5NDUwMSwiZXhwIjoyMDc1NTcwNTAxfQ.uF3IofVn0ZkFSM6aSYsWCmOWHl26ybxv_bwMST3Zsio';

// Standardized Supabase client configuration
export function createSupabaseClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  
  // Dual Key Check - Priority: SERVICE_ROLE_KEY > ANON_KEY > HARDCODED
  let supabaseKey = null;
  let permissionLevel = 'unknown';
  
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    permissionLevel = 'SERVICE_ROLE (Admin)';
  } else if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    permissionLevel = 'ANON_KEY (Read-only)';
  } else if (HARDCODED_SERVICE_ROLE_KEY) {
    supabaseKey = HARDCODED_SERVICE_ROLE_KEY;
    permissionLevel = 'HARDCODED_SERVICE_ROLE (Fallback Admin)';
  }

  // Connection check with detailed logging
  if (!supabaseUrl) {
    console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable is missing');
    console.warn('Using fallback Supabase URL for production');
    supabaseUrl = 'https://rczfbgzghwiqpxihlexs.supabase.co';
  }

  if (!supabaseKey) {
    console.error('CRITICAL: All Supabase keys are missing');
    console.warn('Using hardcoded SERVICE_ROLE_KEY as last resort');
    supabaseKey = HARDCODED_SERVICE_ROLE_KEY;
    permissionLevel = 'HARDCODED_SERVICE_ROLE (Emergency)';
  }

  // Diagnostic logging
  console.log('🔗 Supabase Connection Status:');
  console.log(`   URL: ${supabaseUrl.substring(0, 20)}...`);
  console.log(`   Permission Level: ${permissionLevel}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Create client with correct bucket configuration
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return client;
}

// Export singleton instance for reuse
let supabaseInstance = null;
export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
}
