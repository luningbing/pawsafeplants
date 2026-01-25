import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 验证管理员权限
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      if (!decoded.username) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🔄 开始工业级博客迁移...');

    // 首先尝试创建表结构 - 使用简单的INSERT方式来测试字段
    console.log('🔧 测试表结构...');
    
    let tableStructureOk = false;
    
    // 尝试插入测试数据来检查字段是否存在
    try {
      const testData = {
        title: 'test',
        slug: 'test-slug',
        content: 'test content',
        excerpt: 'test excerpt',
        image_slots: { slot1: 'test' },
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: insertTest, error: insertError } = await supabase
        .from('blog_posts')
        .insert(testData)
        .select('id')
        .single();
      
      if (insertError) {
        console.log('⚠️ 表结构检查失败，字段可能不存在:', insertError);
        
        // 如果是字段不存在错误，返回具体的SQL
        if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
          return res.status(500).json({ 
            error: 'Table structure needs to be updated',
            details: insertError.message,
            sql: `
请先在Supabase SQL Editor中执行以下SQL：

-- 添加缺失的字段
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS image_slots JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS excerpt text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);

执行完成后，请重新运行数据库设置。
            `
          });
        }
        
        return res.status(500).json({ 
          error: 'Table structure check failed',
          details: insertError.message 
        });
      }
      
      // 删除测试数据
      if (insertTest && insertTest.id) {
        await supabase
          .from('blog_posts')
          .delete()
          .eq('id', insertTest.id);
      }
      
      tableStructureOk = true;
      console.log('✅ 表结构检查通过');
      
    } catch (testError) {
      console.error('💥 表结构测试异常:', testError);
      return res.status(500).json({ 
        error: 'Table structure test failed',
        details: testError.message 
      });
    }

    // 情人节博客完整内容
    const valentinesContent = `# 💕 情人节猫咪安全花卉指南

> 爱在空气中，花朵在绽放，但我们毛茸茸的朋友安全吗？

当情人节的浪漫气息弥漫时，许多情侣会交换美丽的鲜花来表达爱意。然而，对于我们心爱的猫咪家庭成员来说，一些最受欢迎的情人节花卉可能隐藏着危险。让我们确保您的浪漫时刻不会变成兽医紧急情况。

## 🌹 传统情人节花卉及其风险

### 玫瑰 - 相对安全的选择
**毒性等级**: 🟢 一般安全 - 刺伤是主要问题

好消息！玫瑰通常对猫咪无毒。主要风险来自花茎上的刺，可能造成物理伤害。不过，如果玫瑰经过处理（如染色或喷洒保鲜剂），情况可能会有所不同。

**安全提示**:
- 去除花茎上的刺
- 确保玫瑰未经过化学处理
- 观察猫咪是否有异常行为

### 百合花 - 极度危险
**毒性等级**: 🔴 极度危险 - 所有部分都有毒

这是最需要警惕的！百合花对猫咪来说是剧毒植物。即使是少量摄入（只是喝了花瓶中的水或舔了花瓣）也可能导致急性肾衰竭。

**危险部分**:
- 花瓣
- 叶子  
- 花粉
- 花茎
- 甚至花瓶中的水

**中毒症状**:
- 2-6小时内出现呕吐
- 食欲不振
- 嗜睡
- 12-24小时内发展为急性肾衰竭

### 郁金香 - 中度风险
**毒性等级**: 🟡 中度毒性

郁金香含有毒素，主要集中在其球茎中，但花朵和叶子也可能引起问题。

**中毒症状**:
- 大量流口水
- 恶心和呕吐
- 腹泻
- 食欲不振

## 🛡️ 情人节安全花卉替代方案

### 非洲紫罗兰 - 完美安全
**毒性等级**: 🟢 完全安全

这些美丽的紫色花朵不仅对猫咪完全安全，还能为您的家增添优雅的色彩。

### 康乃馨 - 相对安全
**毒性等级**: 🟢 一般安全

康乃馨通常对猫咪无毒，但可能引起轻微的肠胃不适。

### 向日葵 - 绝对安全
**毒性等级**: 🟢 完全安全

向日葵不仅美丽，而且对猫咪完全无害，是情人节装饰的理想选择。

### 薰衣草 - 安全且芳香
**毒性等级**: 🟢 一般安全

薰衣草对猫咪相对安全，其镇静香气甚至可能帮助缓解猫咪的焦虑。

## 🎁 创造猫咪友好的情人节

### 安全庆祝方式
1. **选择安全花卉**: 优先考虑非洲紫罗兰、向日葵或康乃馨
2. **花瓶位置**: 将花瓶放在猫咪无法触及的地方
3. **人工花卉**: 考虑高质量的人工花卉，既美观又安全
4. **猫咪专属礼物**: 为您的猫咪准备特别的情人节礼物

### 紧急准备
- **兽医联系方式**: 始终准备好24小时宠物医院电话
- **中毒症状识别**: 了解常见的中毒症状
- **快速行动**: 如果怀疑中毒，立即寻求兽医帮助

## 📋 情人节花卉安全检查表

| 花卉 | 安全等级 | 主要风险 | 建议 |
|------|----------|----------|------|
| 🌹 玫瑰 | 🟢 安全 | 刺伤 | 去刺处理 |
| 🌺 百合 | 🔴 危险 | 肾衰竭 | 绝对避免 |
| 🌷 郁金香 | 🟡 中度 | 肠胃不适 | 谨慎使用 |
| 🌻 向日葵 | 🟢 安全 | 无 | 推荐选择 |
| 🌸 非洲紫罗兰 | 🟢 安全 | 无 | 理想选择 |

## 💡 爱护小贴士

### 如果您的猫咪摄入了有毒花卉
1. **不要等待**: 立即联系兽医
2. **收集证据**: 保留花卉样本供兽医识别
3. **不要催吐**: 除非兽医指示
4. **保持冷静**: 您的平静有助于猫咪保持冷静

### 预防措施
- 在购买花卉前询问是否对宠物安全
- 将所有花卉放在猫咪接触不到的地方
- 考虑为猫咪准备猫草作为安全的替代品
- 定期检查家中是否有掉落的花瓣或叶子

## 🌈 结语

情人节是表达爱的美好时刻，但这种爱应该延伸到我们所有的家庭成员，包括我们的猫咪朋友。通过选择安全的装饰和保持警惕，我们可以确保这个情人节对每个人都是快乐和安全的。

记住，真正的爱是保护我们所关心的一切。让我们用智慧和关怀来庆祝这个特殊的日子，确保我们的毛茸茸朋友能够安全地陪伴在我们身边。

---

**🚨 紧急联系信息**: 如果您的猫咪出现任何中毒症状，请立即联系您的兽医或当地24小时宠物急诊医院。

**💝 猫咪安全情人节！** 让爱绽放，让安全常在。`;

    // 工业级5个图片槽位
    const imageSlots = {
      "slot1": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop&crop=faces",
      "slot2": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop&crop=faces",
      "slot3": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop&crop=faces",
      "slot4": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=600&fit=crop&crop=faces",
      "slot5": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&crop=faces"
    };

    // 生成SEO优化的摘要
    const excerpt = "情人节猫咪安全花卉指南 - 了解哪些花卉对猫咪安全，哪些有毒，以及如何创造一个猫咪友好的情人节环境。包含玫瑰、百合、郁金香等花卉的详细安全分析。";

    // 检查是否已存在情人节博客
    console.log('🔍 检查现有博客...');
    const { data: existingBlog, error: checkError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', 'valentines-day-cat-safe-flowers-guide')
      .single();

    console.log('📊 检查结果:', { existingBlog, checkError, errorCode: checkError?.code });

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ 检查现有博客失败:', checkError);
      console.error('❌ 错误详情:', {
        message: checkError.message,
        details: checkError.details,
        hint: checkError.hint,
        code: checkError.code
      });
      return res.status(500).json({ 
        error: 'Failed to check existing blog',
        details: checkError.message,
        code: checkError.code
      });
    }

    if (existingBlog) {
      // 更新现有博客
      console.log('📝 更新现有情人节博客...');
      const { data: updateData, error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: '💕 情人节猫咪安全花卉指南',
          slug: 'valentines-day-cat-safe-flowers-guide',
          content: valentinesContent,
          excerpt: excerpt,
          cover_image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=630&fit=crop',
          image_slots: imageSlots,
          tags: ['情人节', '猫咪安全', '花卉指南', '宠物护理', '浪漫', '百合', '玫瑰'],
          status: 'published',
          featured: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingBlog.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ 更新情人节博客失败:', updateError);
        return res.status(500).json({ 
          error: 'Failed to update Valentine\'s blog',
          details: updateError.message 
        });
      }

      console.log('✅ 情人节博客更新成功:', updateData.id);

      return res.status(200).json({
        success: true,
        action: 'updated',
        data: {
          blog: updateData,
          message: 'Valentine\'s Day blog updated successfully with industrial-grade structure'
        }
      });
    } else {
      // 创建新博客
      console.log('📝 创建新情人节博客...');
      const { data: createData, error: createError } = await supabase
        .from('blog_posts')
        .insert({
          title: '💕 情人节猫咪安全花卉指南',
          slug: 'valentines-day-cat-safe-flowers-guide',
          content: valentinesContent,
          excerpt: excerpt,
          cover_image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=630&fit=crop',
          image_slots: imageSlots,
          tags: ['情人节', '猫咪安全', '花卉指南', '宠物护理', '浪漫', '百合', '玫瑰'],
          status: 'published',
          featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ 创建情人节博客失败:', createError);
        return res.status(500).json({ 
          error: 'Failed to create Valentine\'s blog',
          details: createError.message 
        });
      }

      console.log('✅ 情人节博客创建成功:', createData.id);

      return res.status(200).json({
        success: true,
        action: 'created',
        data: {
          blog: createData,
          message: 'Valentine\'s Day blog created successfully with industrial-grade structure'
        }
      });
    }

  } catch (error) {
    console.error('🚨 Industrial blog migration API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
