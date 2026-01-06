const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = 'laifu';
  const saltRounds = 12;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password hash for "laifu":');
    console.log(hash);
    console.log('');
    console.log('SQL INSERT statement:');
    console.log(`INSERT INTO admin_users (username, password_hash) VALUES ('laifu', '${hash}');`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generatePasswordHash();
