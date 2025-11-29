import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import Link from 'next/link'

export default function PRDPage({ contentHtml, exists }) {
  return (
    <div style={{ padding: 20, maxWidth: 860, margin: '0 auto' }}>
      <h1>PRD 文档预览</h1>
      <p><Link href="/">← 返回首页</Link></p>
      {!exists && <div style={{ color: '#c62828' }}>未找到文档：docs/PRD.md</div>}
      {exists && <div dangerouslySetInnerHTML={{ __html: contentHtml }} />}
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const fp = path.join(process.cwd(), 'docs', 'PRD.md')
    if (!fs.existsSync(fp)) {
      return { props: { contentHtml: '', exists: false } }
    }
    const md = fs.readFileSync(fp, 'utf8')
    const processed = await remark().use(html).process(md)
    const contentHtml = processed.toString()
    return { props: { contentHtml, exists: true } }
  } catch {
    return { props: { contentHtml: '', exists: false } }
  }
}

