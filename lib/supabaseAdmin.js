import { createClient } from '@supabase/supabase-api';

// 硬编码的Fallback配置
const FALLBACK_CONFIG = {
  url: 'https://rczfbgzghwiqpxihlexs.supabase.co',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjemZiZ3pnaHdpcXB4aWhsZXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5NDUwMDE3MDAxfQ.uF3IofVn0ZkFSM6aSYsWCmOWHl26ybxv_bwMST3Zsio'
};

// 服务端专用Supabase客户端，使用SERVICE_ROLE_KEY
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_CONFIG.url,
  process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_CONFIG.serviceRoleKey
);

export default supabaseAdmin;
