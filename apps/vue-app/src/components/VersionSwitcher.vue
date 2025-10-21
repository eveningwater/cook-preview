<template>
  <el-dropdown @command="handleCommand">
    <el-button type="text" class="version-switcher">
      <el-icon><Switch /></el-icon>
      <span class="version-text">Vue版本</span>
      <el-icon class="el-icon--right"><ArrowDown /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="angular">
          <el-icon><Document /></el-icon>
          Angular版本
        </el-dropdown-item>
        <el-dropdown-item command="vue" disabled>
          <el-icon><Check /></el-icon>
          Vue版本 (当前)
        </el-dropdown-item>
        <el-dropdown-item command="react">
          <el-icon><Document /></el-icon>
          React版本
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { Switch, ArrowDown, Document, Check } from '@element-plus/icons-vue';
import { createVersionSwitcher } from '@cook/core';

const versionSwitcher = createVersionSwitcher();

function handleCommand(command: string) {
  versionSwitcher.switchToVersion(command);
}
</script>

<style scoped>
.version-switcher {
  color: var(--el-text-color-primary);
  border: none;
  background: transparent;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.version-switcher:hover {
  background-color: var(--el-fill-color-light);
}

.version-text {
  margin: 0 4px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .version-text {
    display: none;
  }
}
</style>