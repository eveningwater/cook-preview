# Cook 菜谱预览 - Monorepo

一个基于多框架的菜谱预览应用，支持 Angular、Vue 和 React 版本，共享核心业务逻辑。

## 🏗️ 项目结构

```
core/
├── packages/
│   └── core/                    # 共享核心包 @cook/core
│       ├── src/
│       │   ├── models/          # 数据模型
│       │   ├── services/        # 业务逻辑服务
│       │   ├── utils/           # 工具函数
│       │   └── config/          # 配置管理
│       └── package.json
├── apps/
│   ├── angular-app/             # Angular 应用
│   ├── vue-app/                 # Vue 应用
│   └── react-app/               # React 应用
├── scripts/
│   └── build-deploy.js          # 统一构建脚本
└── package.json                 # Monorepo 根配置
```

## 🚀 快速开始

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 构建核心包
pnpm build:core

# 构建所有应用
pnpm build:all

# 构建部署版本
pnpm run deploy:build
```

### 开发模式

```bash
# 开发 Angular 应用
pnpm dev:angular

# 开发 Vue 应用
pnpm dev:vue

# 开发 React 应用
pnpm dev:react
```

## 📦 核心包 (@cook/core)

### 功能特性

- **数据模型**: 统一的 TypeScript 接口定义
- **API 服务**: 框架无关的业务逻辑
- **主题服务**: 多主题支持（亮色/暗色/自定义）
- **工具函数**: 文本处理、路径处理、Markdown 解析

### 使用方式

```typescript
import { 
  Recipe, 
  RecipeCategory, 
  BaseCookApiService,
  BaseThemeService 
} from '@cook/core';
```

## 🔧 技术栈

### 共享核心
- TypeScript
- Marked (Markdown 解析)

### Angular 应用
- Angular 20
- Angular Material
- RxJS
- SCSS

### Vue 应用
- Vue 3
- Element Plus
- Pinia
- Vite

### React 应用
- React 18
- Ant Design
- React Router
- Vite

## 🌐 部署

### 构建部署版本

```bash
pnpm run deploy:build
```

这将创建 `deploy/` 目录，包含：
- `index.html` - 框架选择页面
- `angular/` - Angular 应用
- `vue/` - Vue 应用
- `react/` - React 应用

### 访问方式

- 主页: `/` - 框架选择页面
- Angular: `/angular/` - Angular 版本
- Vue: `/vue/` - Vue 版本
- React: `/react/` - React 版本

## 🎨 主题系统

支持三种主题模式：
- **明亮模式**: 适合日间使用
- **暗黑模式**: 适合夜间使用  
- **自定义模式**: 多种预设主题

## 📱 移动端支持

所有框架版本都针对移动端进行了优化：
- **响应式设计**: 适配各种屏幕尺寸
- **触摸友好**: 优化的按钮和交互元素
- **性能优化**: 针对移动设备的加载和渲染优化
- **主题切换**: 移动端友好的主题切换体验

## 📝 开发指南

### 添加新功能

1. 在 `@cook/core` 中添加共享逻辑
2. 在各框架应用中实现适配器
3. 更新构建脚本

### 添加新框架

1. 在 `apps/` 下创建新应用目录
2. 实现框架特定的适配器
3. 更新构建脚本和路由配置

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
