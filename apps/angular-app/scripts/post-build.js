const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const browserDir = path.join(distDir, 'browser');

// 检查browser目录是否存在
if (fs.existsSync(browserDir)) {
  console.log('Moving files from browser/ to dist/...');
  
  // 移动browser目录中的所有文件到dist目录
  const files = fs.readdirSync(browserDir);
  
  files.forEach(file => {
    const srcPath = path.join(browserDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Moved: ${file}`);
    }
  });
  
  // 删除browser目录
  fs.rmSync(browserDir, { recursive: true });
  console.log('Removed browser/ directory');
  
  console.log('✅ Post-build script completed');
} else {
  console.log('No browser directory found, skipping post-build');
}
