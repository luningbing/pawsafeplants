import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('🔍 检查博客数据库记录...');

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', 'valentines-day-cat-safe-flowers-guide')
      .single();

    if (error) {
      console.error('❌ 查询失败:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('📊 博客数据:', data);

    // 检查内容是否为中文
    const hasChinese = /[\u4e00-\u9fff]/.test(data.content || '');
    const titleHasChinese = /[\u4e00-\u9fff]/.test(data.title || '');
    const excerptHasChinese = /[\u4e00-\u9fff]/.test(data.excerpt || '');

    return res.status(200).json({
      success: true,
      data: data,
      analysis: {
        content_has_chinese: hasChinese,
        title_has_chinese: titleHasChinese,
        excerpt_has_chinese: excerptHasChinese,
        content_length: data.content?.length || 0,
        title_length: data.title?.length || 0,
        excerpt_length: data.excerpt?.length || 0
      }
    });

  } catch (error) {
    console.error('💥 错误:', error);
    return res.status(500).json({ error: error.message });
  }
}
