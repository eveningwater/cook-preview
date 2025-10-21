# 🥢 老乡鸡菜谱预览网站

一个基于Angular + TypeScript + Vite的美观菜谱预览网站，展示来自CookLikeHOC仓库的中文菜谱内容。

## ✨ 特性

- 🎨 现代化的UI设计，使用CSS变量实现主题系统
- 📱 完全响应式设计，支持移动端和桌面端
- 🏷️ 智能分类，自动识别中文菜名目录
- 📖 可展开的菜谱详情，支持Markdown格式内容
- ⚡ 基于Angular最新版本，使用独立组件架构

## 🛠️ 技术栈

- **前端框架**: Angular 18+
- **构建工具**: Vite
- **包管理器**: pnpm
- **样式**: SCSS + CSS变量
- **TypeScript**: 严格模式
- **API**: AtomGit REST API

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm start
```

访问 http://localhost:4200 查看应用。

### 构建生产版本
```bash
pnpm build
```

## 📁 项目结构

```
src/
├── app/
│   ├── components/          # 组件目录
│   │   ├── recipe-card/     # 菜谱卡片组件
│   │   └── recipe-category/ # 菜谱分类组件
│   ├── models/              # 数据模型
│   │   └── repo.models.ts   # 仓库数据接口
│   ├── services/            # 服务层
│   │   └── cook-api.service.ts # API服务
│   ├── app.html            # 主应用模板
│   ├── app.scss            # 全局样式
│   └── app.ts              # 主应用组件
├── index.html              # HTML入口
└── styles.scss             # 全局样式入口
```

## 🎨 设计特色

### CSS变量主题系统
- 使用CSS变量实现统一的颜色主题
- 支持响应式间距和字体大小
- 平滑的动画过渡效果

### 组件化架构
- 独立的菜谱分类组件
- 可复用的菜谱卡片组件
- 清晰的组件通信机制

### 用户体验
- 加载状态指示器
- 错误处理和重试机制
- 优雅的展开/收起动画

## 🔧 开发说明

### API配置

API服务配置在 [`src/environments/environment.example.ts`](./src/environments/environment.example.ts) 中。

### 样式定制
通过修改 `:root` 中的CSS变量来定制主题：

```scss
:root {
  --primary-color: #ff6b35;
  --secondary-color: #4a90e2;
  // ... 其他变量
}
```

## 📝 许可证

本项目基于MIT许可证开源。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！