import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // 1. 初始化，增加保险
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. 默认的英文内容（Fallback）
  const defaultData = [
    {
      title: "A Proposal & A Kitten",
      subtitle: "The heartwarming story behind Brianna's cat-safe bouquet.",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
    }
  ];

  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(200).json({ success: true, data: defaultData });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('hero_content').select('*');
    
    if (error || !data || data.length === 0) {
      return res.status(200).json({ success: true, data: defaultData });
    }
    
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(200).json({ success: true, data: defaultData });
  }
}
