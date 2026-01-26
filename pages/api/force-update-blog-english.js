import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('🔄 强制更新博客内容为英文...');

    // 英文内容
    const englishContent = `# 💕 Valentine's Day Cat-Safe Flowers Guide

> Love is in the air, flowers are blooming, but are our furry friends safe?

When Valentine's Day romance fills the air, many couples exchange beautiful flowers to express their love. However, for our beloved feline family members, some of the most popular Valentine's flowers may hide dangers. Let's ensure your romantic moment doesn't turn into a veterinary emergency.

## 🌹 Traditional Valentine's Flowers and Their Risks

### Roses - Relatively Safe Choice
**Toxicity Level**: 🟢 Generally Safe - Thorns are the main concern

Good news! Roses are generally non-toxic to cats. The main risk comes from thorns on the stem, which can cause physical injury. However, if roses have been treated (such as dyed or sprayed with preservatives), the situation might be different.

**Safety Tips**:
- Remove thorns from stems
- Ensure roses are not chemically treated
- Watch for any unusual behavior in your cat

### Lilies - Extremely Dangerous
**Toxicity Level**: 🔴 Extremely Dangerous - All parts are toxic

This is the most important warning! Lilies are highly toxic to cats. Even small amounts (just drinking from the vase water or licking petals) can cause acute kidney failure.

**Toxic Parts**:
- Petals
- Leaves  
- Pollen
- Stems
- Even the vase water

**Poisoning Symptoms**:
- Vomiting within 2-6 hours
- Loss of appetite
- Lethargy
- Acute kidney failure within 12-24 hours

### Tulips - Moderate Risk
**Toxicity Level**: 🟡 Moderately Toxic

Tulips contain toxins, primarily concentrated in their bulbs, but flowers and leaves can also cause problems.

**Poisoning Symptoms**:
- Excessive drooling
- Nausea and vomiting
- Diarrhea
- Loss of appetite

## 🛡️ Safe Valentine's Flower Alternatives

### African Violets - Perfectly Safe
**Toxicity Level**: 🟢 Completely Safe

These beautiful purple flowers are not only completely safe for cats but can also add elegant color to your home.

### Carnations - Relatively Safe
**Toxicity Level**: 🟢 Generally Safe

Carnations are generally non-toxic to cats but may cause mild gastrointestinal upset.

### Sunflowers - Absolutely Safe
**Toxicity Level**: 🟢 Completely Safe

Sunflowers are not only beautiful but completely harmless to cats, making them an ideal choice for Valentine's decorations.

### Lavender - Safe and Aromatic
**Toxicity Level**: 🟢 Generally Safe

Lavender is relatively safe for cats, and its calming scent may even help relieve cat anxiety.

## 🎁 Creating Cat-Friendly Valentine's

### Safe Celebration Ways
1. **Choose Safe Flowers**: Prioritize African violets, sunflowers, or carnations
2. **Vase Placement**: Place vases where cats cannot reach them
3. **Artificial Flowers**: Consider high-quality artificial flowers - beautiful and safe
4. **Cat-Specific Gifts**: Prepare special Valentine's gifts for your cat

### Emergency Preparedness
- **Veterinary Contact**: Always have 24-hour pet hospital contact information ready
- **Poisoning Symptom Recognition**: Know common poisoning symptoms
- **Quick Action**: If poisoning is suspected, seek veterinary help immediately

## 📋 Valentine's Flower Safety Checklist

| Flower | Safety Level | Main Risk | Recommendation |
|--------|-------------|-----------|----------------|
| 🌹 Rose | 🟢 Safe | Thorn injury | Remove thorns |
| 🌺 Lily | 🔴 Dangerous | Kidney failure | Absolutely avoid |
| 🌷 Tulip | 🟡 Moderate | GI upset | Use with caution |
| 🌻 Sunflower | 🟢 Safe | None | Recommended |
| 🌸 African Violet | 🟢 Safe | None | Ideal choice |

## 💡 Care Tips

### If Your Cat Ingests Toxic Flowers
1. **Don't Wait**: Contact your veterinarian immediately
2. **Collect Evidence**: Keep flower samples for veterinarian identification
3. **Don't Induce Vomiting**: Unless instructed by veterinarian
4. **Stay Calm**: Your calm helps your cat stay calm

### Preventive Measures
- Ask if flowers are pet-safe before purchasing
- Keep all flowers where cats cannot reach them
- Consider cat grass as a safe alternative
- Regularly check for fallen petals or leaves

## 🌈 Conclusion

Valentine's Day is a beautiful moment to express love, but this love should extend to all our family members, including our feline friends. By choosing safe decorations and staying vigilant, we can ensure this Valentine's Day is happy and safe for everyone.

Remember, true love is protecting everything we care about. Let's celebrate this special day with wisdom and care, ensuring our furry friends can safely accompany us.

---

**🚨 Emergency Contact Information**: If your cat shows any poisoning symptoms, contact your veterinarian or local 24-hour pet emergency hospital immediately.

**💝 Cat-Safe Valentine's Day!** Let love bloom, let safety prevail.`;

    const englishTitle = "💕 Valentine's Day Cat-Safe Flowers Guide";
    const englishExcerpt = "Valentine's Day Cat-Safe Flowers Guide - Learn which flowers are safe for cats, which are toxic, and how to create a cat-friendly Valentine's environment. Includes detailed safety analysis of roses, lilies, tulips and more.";

    // 更新数据库记录
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: englishTitle,
        content: englishContent,
        excerpt: englishExcerpt,
        updated_at: new Date().toISOString()
      })
      .eq('slug', 'valentines-day-cat-safe-flowers-guide')
      .select()
      .single();

    if (error) {
      console.error('❌ 更新失败:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ 博客内容已更新为英文:', data);

    return res.status(200).json({
      success: true,
      message: 'Blog content updated to English successfully',
      data: data
    });

  } catch (error) {
    console.error('💥 错误:', error);
    return res.status(500).json({ error: error.message });
  }
}
