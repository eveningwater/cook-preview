<template>
  <div ref="themeSwitcherRef" class="theme-switcher">
    <div class="theme-buttons">
      <button
        class="theme-button"
        :class="{ active: currentTheme === 'light' }"
        @click="switchTheme('light')"
        title="明亮模式"
      >
        <span class="theme-icon">☀️</span>
        <span class="theme-label">明亮</span>
      </button>
      <button
        class="theme-button"
        :class="{ active: currentTheme === 'dark' }"
        @click="switchTheme('dark')"
        title="暗黑模式"
      >
        <span class="theme-icon">🌙</span>
        <span class="theme-label">暗黑</span>
      </button>
      <button
        class="theme-button"
        :class="{ active: currentTheme === 'custom' }"
        @click="switchTheme('custom')"
        title="自定义模式"
      >
        <span class="theme-icon">🎨</span>
        <span class="theme-label">自定义</span>
      </button>
    </div>

    <!-- 自定义主题选择器 -->
    <transition name="slide">
      <div v-if="showCustomThemes && currentTheme === 'custom'" class="custom-themes">
        <div class="custom-themes-header">
          <span class="custom-themes-title">预设主题</span>
        </div>
        <div class="preset-themes">
          <button
            v-for="preset in presetThemes"
            :key="preset"
            class="preset-theme-button"
            @click="applyPresetTheme(preset)"
            :title="getPresetName(preset)"
          >
            <div class="preset-theme-preview" :data-theme="preset">
              <div class="preview-dot"></div>
              <div class="preview-dot"></div>
              <div class="preview-dot"></div>
            </div>
            <span class="preset-theme-name">{{ getPresetName(preset) }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { themeService } from '../services/theme.service';
import { PRESET_CUSTOM_THEMES } from '../models/theme.models';
import type { ThemeMode } from '../models/theme.models';

const currentTheme = themeService.currentTheme;
const themeSwitcherRef = ref<HTMLElement | null>(null);
const showCustomThemes = ref(false);

const presetThemes = computed(() => Object.keys(PRESET_CUSTOM_THEMES));

function switchTheme(mode: ThemeMode) {
  themeService.setTheme(mode);
  if (mode === 'custom') {
    showCustomThemes.value = true;
  } else {
    showCustomThemes.value = false;
  }
}

function applyPresetTheme(presetName: string) {
  themeService.applyPresetTheme(presetName);
}

function getPresetName(key: string): string {
  const names: Record<string, string> = {
    ocean: '海洋',
    forest: '森林',
    sunset: '日落'
  };
  return names[key] || key;
}

// 点击外部关闭自定义主题面板
function handleClickOutside(event: MouseEvent) {
  if (themeSwitcherRef.value && !themeSwitcherRef.value.contains(event.target as Node)) {
    showCustomThemes.value = false;
  }
}

// 监听主题切换
watch(currentTheme, (newTheme) => {
  if (newTheme === 'custom') {
    showCustomThemes.value = true;
  } else {
    showCustomThemes.value = false;
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // 如果当前是自定义主题，显示面板
  if (currentTheme.value === 'custom') {
    showCustomThemes.value = true;
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-buttons {
  display: flex;
  gap: 6px;
  background: var(--el-fill-color-light);
  padding: 3px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.theme-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  border: none;
  background: transparent;
  color: var(--el-text-color-regular);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  min-height: auto;
}

.theme-button:hover {
  background: var(--el-fill-color);
  transform: translateY(-2px);
}

.theme-button.active {
  background: var(--el-color-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.theme-icon {
  font-size: 18px;
  line-height: 1;
}

.theme-label {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
}

/* 自定义主题面板 */
.custom-themes {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 240px;
  max-height: 200px;
  overflow-y: auto;
}

.custom-themes-header {
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.custom-themes-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.preset-themes {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preset-theme-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-lighter);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preset-theme-button:hover {
  background: var(--el-fill-color);
  border-color: var(--el-color-primary);
  transform: translateX(4px);
}

.preset-theme-preview {
  display: flex;
  gap: 3px;
  padding: 4px 6px;
  border-radius: 3px;
  flex-shrink: 0;
}

.preset-theme-preview[data-theme="ocean"] {
  background: #f0f8ff;
}

.preset-theme-preview[data-theme="forest"] {
  background: #f1faee;
}

.preset-theme-preview[data-theme="sunset"] {
  background: #fef6e4;
}

.preview-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.preset-theme-preview[data-theme="ocean"] .preview-dot:nth-child(1) {
  background: #0077be;
}

.preset-theme-preview[data-theme="ocean"] .preview-dot:nth-child(2) {
  background: #00a8e8;
}

.preset-theme-preview[data-theme="ocean"] .preview-dot:nth-child(3) {
  background: #0077be;
}

.preset-theme-preview[data-theme="forest"] .preview-dot:nth-child(1) {
  background: #2d6a4f;
}

.preset-theme-preview[data-theme="forest"] .preview-dot:nth-child(2) {
  background: #52b788;
}

.preset-theme-preview[data-theme="forest"] .preview-dot:nth-child(3) {
  background: #2d6a4f;
}

.preset-theme-preview[data-theme="sunset"] .preview-dot:nth-child(1) {
  background: #e76f51;
}

.preset-theme-preview[data-theme="sunset"] .preview-dot:nth-child(2) {
  background: #f4a261;
}

.preset-theme-preview[data-theme="sunset"] .preview-dot:nth-child(3) {
  background: #e76f51;
}

.preset-theme-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}

/* 动画效果 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 768px) {
  .theme-buttons {
    gap: 4px;
    padding: 3px;
  }

  .theme-button {
    padding: 6px 8px;
  }

  .theme-icon {
    font-size: 18px;
  }

  .theme-label {
    font-size: 10px;
  }

  .custom-themes {
    min-width: 240px;
  }
}
</style>
