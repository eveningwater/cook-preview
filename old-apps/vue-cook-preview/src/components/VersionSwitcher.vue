<template>
  <div class="version-switcher">
    <el-dropdown trigger="click" @command="handleCommand">
      <el-button>
        <el-icon><Grid /></el-icon>
        <span class="version-label">版本</span>
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item disabled>
            <div class="current-version">
              <el-icon><Check /></el-icon>
              <span>Vue 3 版本</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided command="angular">
            <div class="version-option">
              <span class="version-icon">🅰️</span>
              <div class="version-info">
                <div class="version-name">Angular 版本</div>
                <div class="version-desc">切换到 Angular 实现</div>
              </div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { Grid, ArrowDown, Check } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

function handleCommand(command: string) {
  if (command === 'angular') {
    // 判断是否为开发环境
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // 获取当前路径
    const currentPath = window.location.pathname;
    
    // 构建 Angular 版本的 URL
    let angularUrl: string;
    
    if (isDev) {
      // 开发环境：http://localhost:4200/cook-preview
      angularUrl = 'http://localhost:4200/cook-preview/#/';
      
      // 尝试保持当前路径
      if (currentPath && currentPath !== '/') {
        const pathWithoutSlash = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath;
        angularUrl += pathWithoutSlash;
      }
    } else {
      // 生产环境：使用当前域名
      angularUrl = `${window.location.origin}/cook-preview/#/`;
      
      if (currentPath && currentPath !== '/' && !currentPath.startsWith('/cook-preview')) {
        const pathWithoutSlash = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath;
        angularUrl += pathWithoutSlash;
      }
    }
    
    ElMessage.success('正在切换到 Angular 版本...');
    
    // 延迟跳转，让用户看到提示
    setTimeout(() => {
      window.location.href = angularUrl;
    }, 500);
  }
}
</script>

<style scoped>
.version-switcher {
  display: inline-flex;
}

.version-label {
  margin: 0 4px;
}

.current-version {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-color-primary);
  font-weight: 600;
  padding: 4px 0;
}

.version-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.version-icon {
  font-size: 24px;
  line-height: 1;
}

.version-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.version-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.version-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

@media (max-width: 768px) {
  .version-label {
    display: none;
  }
}
</style>

