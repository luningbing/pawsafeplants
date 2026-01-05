import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  try {
    const petsDir = path.join(process.cwd(), 'public', 'images', 'pets')
    let files = []
    
    try {
      files = fs.readdirSync(petsDir)
    } catch (error) {
      // 如果目录不存在，返回空数组
      return res.status(200).json({ paths: [] })
    }
    
    // 过滤出图片文件
    const imageFiles = files.filter(f => 
      !/\.(tmp|part)$/i.test(f) && 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f)
    )
    
    const paths = imageFiles.map(f => '/images/pets/' + f)
    return res.status(200).json({ paths })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
