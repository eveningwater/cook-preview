const fs = require('fs');
const path = require('path');

// 构建部署目录
const deployDir = path.join(__dirname, '../cook-preview-v2');
const angularDistDir = path.join(__dirname, '../apps/angular-app/dist');
const vueDistDir = path.join(__dirname, '../apps/vue-app/dist');
const reactDistDir = path.join(__dirname, '../apps/react-app/dist');

// 创建部署目录
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

// 创建框架选择页面
const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cook 菜谱预览 - 选择框架版本</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Roboto', 'Google Sans', 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .container {
            text-align: center;
            max-width: 600px;
            padding: 2rem;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 3rem;
            opacity: 0.9;
        }
        
        .framework-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .framework-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 2rem;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .framework-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .framework-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .framework-name {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .framework-desc {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .footer {
            margin-top: 3rem;
            opacity: 0.7;
        }
        
        .footer a {
            color: white;
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .framework-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .framework-card {
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🥢 Cook 菜谱预览</h1>
        <p class="subtitle">像老乡鸡那样做饭 - 选择你喜欢的框架版本</p>
        
        <div class="framework-grid">
            <a href="./angular/" class="framework-card">
                <div class="framework-icon">🅰️</div>
                <div class="framework-name">Angular</div>
                <div class="framework-desc">企业级应用框架</div>
            </a>
            
            <a href="./vue/" class="framework-card">
                <div class="framework-icon">💚</div>
                <div class="framework-name">Vue</div>
                <div class="framework-desc">渐进式框架</div>
            </a>
            
            <a href="./react/" class="framework-card">
                <div class="framework-icon">⚛️</div>
                <div class="framework-name">React</div>
                <div class="framework-desc">用户界面库</div>
            </a>
        </div>
        
        <div class="footer">
            <p>数据来源: <a href="https://atomgit.com/eveningwater/CookLikeHOC" target="_blank">CookLikeHOC</a></p>
            <p>Inspired by: <a href="https://github.com/Gar-b-age/CookLikeHOC" target="_blank">@Gar-b-age/CookLikeHOC</a></p>
        </div>
    </div>
</body>
</html>`;

// 写入主页面
fs.writeFileSync(path.join(deployDir, 'index.html'), indexHtml);

// 复制 Angular 构建产物
if (fs.existsSync(angularDistDir)) {
  const angularDeployDir = path.join(deployDir, 'angular');
  if (fs.existsSync(angularDeployDir)) {
    fs.rmSync(angularDeployDir, { recursive: true });
  }
  fs.cpSync(angularDistDir, angularDeployDir, { recursive: true });
  console.log('✅ Angular 应用已复制到 /angular/');
} else {
  console.log('⚠️  Angular 构建产物不存在，请先运行 pnpm build:angular');
}

// 复制 Vue 构建产物
if (fs.existsSync(vueDistDir)) {
  const vueDeployDir = path.join(deployDir, 'vue');
  if (fs.existsSync(vueDeployDir)) {
    fs.rmSync(vueDeployDir, { recursive: true });
  }
  fs.cpSync(vueDistDir, vueDeployDir, { recursive: true });
  console.log('✅ Vue 应用已复制到 /vue/');
} else {
  console.log('⚠️  Vue 构建产物不存在，请先运行 pnpm build:vue');
}

// 复制 React 构建产物
if (fs.existsSync(reactDistDir)) {
  const reactDeployDir = path.join(deployDir, 'react');
  if (fs.existsSync(reactDeployDir)) {
    fs.rmSync(reactDeployDir, { recursive: true });
  }
  fs.cpSync(reactDistDir, reactDeployDir, { recursive: true });
  console.log('✅ React 应用已复制到 /react/');
} else {
  console.log('⚠️  React 构建产物不存在，请先运行 pnpm build:react');
}

console.log('🎉 部署构建完成！');
console.log('📁 部署目录:', deployDir);
console.log('🌐 访问方式:');
console.log('   - 主页: /');
console.log('   - Angular: /angular/');
console.log('   - Vue: /vue/');
console.log('   - React: /react/');
