# 老乡鸡菜谱预览 - Vue3 版本

使用 Vue3 + TypeScript + Element Plus + Axios + Vite 实现的菜谱网站。

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - 类型安全
- Element Plus - UI 组件库
- Axios - HTTP 客户端
- Vite - 下一代前端构建工具
- Vue Router - 路由管理
- Pinia - 状态管理
- Marked - Markdown 解析

## 功能特性

- 📖 菜谱分类浏览
- 🔍 实时搜索功能
- 🎨 主题切换（亮色/暗色/自定义）
- 📱 响应式设计
- ⚡ 快速加载
- 🖼️ 图片懒加载

## 环境配置

1. 复制环境配置文件：
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

2. 编辑 `src/environments/environment.ts`，填入你的仓库信息：
```typescript
export const environment = {
  production: false,
  gitBase: 'https://atomgit.com',
  apiBase: 'https://api.atomgit.com',
  token: 'your_token_here',
  repoOwner: 'your_repo_owner',
  repoName: 'your_repo_name'
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 组件
├── environments/    # 环境配置
├── models/          # 数据模型
├── router/          # 路由配置
├── services/        # 服务层
├── stores/          # 状态管理
├── views/           # 页面视图
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

## 数据来源

数据来源于 [CookLikeHOC](https://atomgit.com/eveningwater/CookLikeHOC) 仓库。

## 许可证

MIT

