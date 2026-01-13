import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, newPassword } = req.body || {}
    
    if (!username || !newPassword) {
      return res.status(400).json({ error: 'Username and new password required' })
    }

    // Generate new salt and hash
    const salt = crypto.randomBytes(32).toString('hex')
    const iterations = 120000
    const hash = crypto.pbkdf2Sync(newPassword, salt, iterations, 32, 'sha256').toString('hex')

    console.log('🔄 Resetting password for:', username)
    console.log('🔑 New salt:', salt)
    console.log('🔑 New hash:', hash)

    // Update password in database
    const { data, error } = await supabaseAdmin
      .from('admin_credentials')
      .update({
        hash: hash,
        salt: salt,
        iterations: iterations,
        updated_at: new Date().toISOString()
      })
      .eq('username', username)
      .select()

    if (error) {
      console.error('❌ Database error:', error)
      return res.status(500).json({ error: 'Failed to reset password' })
    }

    console.log('✅ Password reset successful for:', username)
    return res.status(200).json({ 
      success: true, 
      message: `Password reset successful for ${username}`,
      data: data?.[0]
    })

  } catch (error) {
    console.error('💥 Reset error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
