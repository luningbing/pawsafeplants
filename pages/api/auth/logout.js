export default async function handler(req, res) {
  const attrs = [`psp_admin=0`, `Path=/`, `HttpOnly`, `SameSite=Lax`, `Max-Age=0`]
  const isHttps = (req.headers['x-forwarded-proto'] || '').includes('https') || (req.socket && req.socket.encrypted)
  const secure = isHttps || process.env.NODE_ENV === 'production'
  if (secure) attrs.push('Secure')
  res.setHeader('Set-Cookie', attrs.join('; '))
  return res.status(200).json({ ok: true })
}

