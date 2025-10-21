import { ref, watch } from 'vue';
import type { ThemeMode, ThemeConfig, CustomTheme } from '../models/theme.models';
import { PRESET_CUSTOM_THEMES } from '../models/theme.models';

const STORAGE_KEY = 'cook-app-theme';

// 当前主题模式
const currentTheme = ref<ThemeMode>('light');

// 自定义主题配置
const customTheme = ref<CustomTheme | undefined>(undefined);

/**
 * 设置主题
 */
function setTheme(mode: ThemeMode, custom?: CustomTheme): void {
  currentTheme.value = mode;
  
  if (mode === 'custom' && custom) {
    customTheme.value = custom;
  } else if (mode === 'custom' && !custom) {
    // 如果是自定义模式但没有提供主题，使用第一个预设主题
    customTheme.value = PRESET_CUSTOM_THEMES['ocean'];
  }
  
  // 保存到本地存储
  saveThemeToStorage();
}

/**
 * 切换到下一个主题
 */
function toggleTheme(): void {
  const modes: ThemeMode[] = ['light', 'dark', 'custom'];
  const currentIndex = modes.indexOf(currentTheme.value);
  const nextIndex = (currentIndex + 1) % modes.length;
  const nextMode = modes[nextIndex];
  
  setTheme(nextMode);
}

/**
 * 应用主题到 DOM
 */
function applyTheme(mode: ThemeMode, custom?: CustomTheme): void {
  const root = document.documentElement;
  
  // 移除所有主题类
  root.classList.remove('theme-light', 'theme-dark', 'theme-custom');
  
  // 添加新的主题类
  root.classList.add(`theme-${mode}`);
  
  // 应用自定义主题的 CSS 变量
  if (mode === 'custom' && custom) {
    root.style.setProperty('--theme-primary', custom.primary);
    root.style.setProperty('--theme-secondary', custom.secondary);
    root.style.setProperty('--theme-background', custom.background);
    root.style.setProperty('--theme-surface', custom.surface);
    root.style.setProperty('--theme-text', custom.text);
    root.style.setProperty('--theme-text-secondary', custom.textSecondary);
    root.style.setProperty('--theme-border', custom.border);
    root.style.setProperty('--theme-shadow', custom.shadow);
  } else {
    // 清除自定义主题变量
    root.style.removeProperty('--theme-primary');
    root.style.removeProperty('--theme-secondary');
    root.style.removeProperty('--theme-background');
    root.style.removeProperty('--theme-surface');
    root.style.removeProperty('--theme-text');
    root.style.removeProperty('--theme-text-secondary');
    root.style.removeProperty('--theme-border');
    root.style.removeProperty('--theme-shadow');
  }
}

/**
 * 从本地存储加载主题
 */
function loadThemeFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const config: ThemeConfig = JSON.parse(stored);
      currentTheme.value = config.mode;
      if (config.customTheme) {
        customTheme.value = config.customTheme;
      }
    }
  } catch (error) {
    console.error('Failed to load theme from storage:', error);
  }
}

/**
 * 保存主题到本地存储
 */
function saveThemeToStorage(): void {
  try {
    const config: ThemeConfig = {
      mode: currentTheme.value,
      customTheme: customTheme.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save theme to storage:', error);
  }
}

/**
 * 获取预设的自定义主题
 */
function getPresetThemes(): Record<string, CustomTheme> {
  return PRESET_CUSTOM_THEMES;
}

/**
 * 应用预设主题
 */
function applyPresetTheme(presetName: string): void {
  const preset = PRESET_CUSTOM_THEMES[presetName];
  if (preset) {
    setTheme('custom', preset);
  }
}

// 初始化主题
loadThemeFromStorage();
applyTheme(currentTheme.value, customTheme.value);

// 监听主题变化并应用
watch([currentTheme, customTheme], () => {
  applyTheme(currentTheme.value, customTheme.value);
});

export const themeService = {
  currentTheme,
  customTheme,
  setTheme,
  toggleTheme,
  getPresetThemes,
  applyPresetTheme
};

