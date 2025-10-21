<template>
  <div id="app">
    <!-- 头部 -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-text">
          <router-link to="/" class="logo">
            <h1>🥢 老乡鸡菜谱预览</h1>
          </router-link>
          <p class="app-subtitle">像老乡鸡那样做饭 - 菜谱预览</p>
        </div>
        <div class="header-decoration">
          <span class="decoration-icon">🍳</span>
          <span class="decoration-icon">🥘</span>
          <span class="decoration-icon">🍲</span>
        </div>
        <div class="header-actions">
          <VersionSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>

    <!-- 路由视图 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="footer-content">
        <p>
          数据来源：
          <a :href="repoUrl" target="_blank" rel="noopener noreferrer">
            CookLikeHOC
          </a>
        </p>
        <p>
          Inspired by: 
          <a href="https://github.com/Gar-b-age/CookLikeHOC" target="_blank" rel="noopener noreferrer">
            @Gar-b-age/CookLikeHOC
          </a>
          - 感谢提供数据来源
        </p>
        <p class="footer-note">像老乡鸡那样做饭 - 传承经典，品味生活</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import VersionSwitcher from './components/VersionSwitcher.vue';
import { environment } from './environments/environment';

const repoUrl = environment.repoUrl;
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 主题变量 */
:root {
  --header-height: 64px;
}

/* 亮色主题 */
.theme-light {
  --el-bg-color: #ffffff;
  --el-bg-color-page: #f5f7fa;
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-border-color: #dcdfe6;
  --el-border-color-lighter: #e4e7ed;
  --el-fill-color: #f0f2f5;
  --el-fill-color-light: #f5f7fa;
}

/* 暗色主题 */
.theme-dark {
  --el-bg-color: #1a1a1a;
  --el-bg-color-page: #0d0d0d;
  --el-text-color-primary: #e8e8e8;
  --el-text-color-regular: #c0c0c0;
  --el-text-color-secondary: #909399;
  --el-border-color: #363636;
  --el-border-color-lighter: #2b2b2b;
  --el-fill-color: #262626;
  --el-fill-color-light: #1f1f1f;
  --el-color-primary: #409eff;
}

/* 自定义主题 */
.theme-custom {
  --el-bg-color: var(--theme-surface, #ffffff);
  --el-bg-color-page: var(--theme-background, #f5f7fa);
  --el-text-color-primary: var(--theme-text, #303133);
  --el-text-color-regular: var(--theme-text, #606266);
  --el-text-color-secondary: var(--theme-text-secondary, #909399);
  --el-border-color: var(--theme-border, #dcdfe6);
  --el-border-color-lighter: var(--theme-border, #e4e7ed);
  --el-color-primary: var(--theme-primary, #409eff);
}

/* 暗色主题下的Element Plus组件样式调整 */
.theme-dark .el-card,
.theme-dark .el-button,
.theme-dark .el-input__wrapper {
  background-color: var(--el-fill-color);
  border-color: var(--el-border-color);
  color: var(--el-text-color-primary);
}

.theme-dark .el-card__header {
  background-color: var(--el-fill-color-light);
  border-color: var(--el-border-color);
}

/* 头部样式 */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: var(--header-height);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo {
  text-decoration: none;
  color: inherit;
}

.logo h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.app-subtitle {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.header-decoration {
  display: flex;
  gap: 8px;
  font-size: 20px;
}

.decoration-icon {
  animation: float 3s ease-in-out infinite;
}

.decoration-icon:nth-child(2) {
  animation-delay: 0.5s;
}

.decoration-icon:nth-child(3) {
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.repo-link {
  text-decoration: none;
}

/* 页脚样式 */
.app-footer {
  margin-top: auto;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color);
  padding: 24px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-content p {
  margin: 8px 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.footer-note {
  font-style: italic;
  font-size: 13px;
}

.footer-content a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.footer-content a:hover {
  text-decoration: underline;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    height: auto;
    padding: 12px 0;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-text {
    width: 100%;
  }
  
  .logo h1 {
    font-size: 16px;
  }
  
  .app-subtitle {
    font-size: 12px;
  }
  
  .header-decoration {
    font-size: 16px;
    gap: 6px;
  }
  
  .header-actions {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .logo h1 {
    font-size: 14px;
  }
  
  .app-subtitle {
    font-size: 11px;
  }
  
  .header-decoration {
    font-size: 14px;
  }
}
</style>


