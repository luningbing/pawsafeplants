const fs = require('fs');
const path = require('path');

// Chinese to English mappings
const translations = {
  '编辑植物信息': 'Edit Plant Information',
  '植物名称': 'Plant Name',
  '拉丁学名': 'Scientific Name',
  '安全性': 'Safety Level',
  '<option value="Safe">安全 (Safe)</option>': '<option value="Safe">Safe</option>',
  '<option value="Caution">注意 (Caution)</option>': '<option value="Caution">Caution</option>',
  '<option value="Toxic">有毒 (Toxic)</option>': '<option value="Toxic">Toxic</option>',
  '养护难度': 'Care Difficulty',
  '<option value="Easy">简单 (Easy)</option>': '<option value="Easy">Easy</option>',
  '<option value="Moderate">中等 (Moderate)</option>': '<option value="Moderate">Moderate</option>',
  '<option value="Difficult">困难 (Difficult)</option>': '<option value="Difficult">Difficult</option>',
  '详细描述': 'Description',
  '植物图片': 'Plant Image',
  'alt="植物图片预览"': 'alt="Plant Image Preview"',
  '📁 本地上传': '📁 Local Upload',
  '🖼️ 从媒体库选择': '🖼️ Select from Media Library',
  '上传中...': 'Uploading...',
  '上传为': 'Upload as',
  '请先填写植物名称': 'Please enter plant name first',
  '文件:': 'File:',
  'placeholder="或直接输入图片URL..."': 'placeholder="Or enter image URL directly..."',
  '护理技巧': 'Care Tips',
  '水分需求': 'Water Requirements',
  '光照需求': 'Light Requirements',
  '温度要求': 'Temperature Requirements',
  '宠物时刻图片': 'Pet Moment Photo',
  'placeholder="输入猫咪与植物合影的图片路径..."': 'placeholder="Enter path to cat and plant photo..."',
  '🐱 选择猫咪氛围图': '🐱 Select Cat Atmosphere Images',
  '保存中...': 'Saving...',
  '保存更改': 'Save Changes',
  '从媒体库选择图片': 'Select Images from Media Library',
  'alt={`媒体库图片 ${idx}`}': 'alt={`Media Library Image ${idx}`}',
  '<p>还没有上传猫咪图片哦！</p>': '<p>No cat photos uploaded yet!</p>',
  '请将猫咪与植物的合影图片上传到 <code>/public/images/pets/</code> 目录': 'Please upload cat and plant photos to <code>/public/images/pets/</code> directory',
  'alt={`猫咪图片 ${idx + 1}`}': 'alt={`Cat Photo ${idx + 1}`}',
  '登录失败': 'Login Failed',
  '网络错误，请重试': 'Network Error, Please Retry',
  'placeholder="输入用户名"': 'placeholder="Enter Username"',
  'placeholder="输入密码"': 'placeholder="Enter Password"',
  '登录中...': 'Logging in...',
  '登录管理后台': 'Login to Admin',
  '默认登录信息': 'Default Login Info',
  '用户名：<span style={{ color: sageGreen }}>猫猫名字</span>': 'Username: <span style={{ color: sageGreen }}>Cat Name</span>',
  '密码：<span style={{ color: sageGreen }}>你猜</span>': 'Password: <span style={{ color: sageGreen }}>Guess</span>',
  '登录成功！': 'Login Successful!',
  '正在跳转到管理后台...': 'Redirecting to Admin...',
  '慵懒的猫咪': 'Lazy Cat',
  '窗边的小猫': 'Cat by Window',
  '花丛中的猫咪': 'Cat in Flowers',
  '🌸 猫猫氛围': '🌸 Cat Atmosphere'
};

function fixChineseInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Replace Chinese text with English
    Object.entries(translations).forEach(([chinese, english]) => {
      if (content.includes(chinese)) {
        content = content.replace(new RegExp(chinese.replace(/[.*+?^${}()[]|\/\\]/g, '\\$&'), 'g'), english);
        changed = true;
        console.log(`✅ Fixed in ${path.basename(filePath)}: "${chinese}" -> "${english}"`);
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`📝 Updated ${path.basename(filePath)}`);
    } else {
      console.log(`✅ No Chinese found in ${path.basename(filePath)}`);
    }
  } catch (e) {
    console.log(`❌ Error fixing ${filePath}: ${e.message}`);
  }
}

// Fix files with Chinese characters
const filesToFix = [
  './pages/admin.js',
  './pages/cat-safe-flowers.js',
  './pages/index-optimized.js',
  './pages/login.js',
  './pages/setup-blog-db.js',
  './pages/test-login.js',
  './pages/_app.js'
];

console.log('🔧 Starting Chinese character fixes...\n');

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    fixChineseInFile(file);
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
});

console.log('\n🎉 Chinese character fix complete!');
console.log('\n📋 Next steps:');
console.log('1. git add .');
console.log('2. git commit -m "fix: remove Chinese characters from code"');
console.log('3. git push origin main');
