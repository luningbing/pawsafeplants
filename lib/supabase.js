import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

// 硬编码的SERVICE_ROLE_KEY - 确保万无一失
const HARDCODED_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5NDUwMSwiZXhwIjoyMDc5NTcwNTAxfQ.uF3IofVn0ZkFSM6aSYsWCmOWHl26ybxv_bwMST3Zsio';

// 确保URL存在
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rczfbgzghwiqpxihlexs.supabase.co';

// 使用硬编码的Service Role Key作为最后保障
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || HARDCODED_SERVICE_ROLE_KEY;

// 导出管理员客户端（最高权限）
export const supabaseAdmin = supabaseCreateClient(supabaseUrl, supabaseKey);

// 导出创建客户端函数（兼容性）
export const createSupabaseClient = (url = supabaseUrl, key = supabaseKey) => {
  return supabaseCreateClient(url, key);
};

// 导出原始createClient以避免循环引用
export { supabaseCreateClient as createClient };
