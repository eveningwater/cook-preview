import { ref, watch } from 'vue';
import { ThemeMode, CustomTheme, PRESET_CUSTOM_THEMES } from '@cook/core';
import { VueDomAdapter } from '../adapters/dom.adapter';
import { VueStorageAdapter } from '../adapters/storage.adapter';

class VueThemeService {
  private domAdapter = new VueDomAdapter();
  private storageAdapter = new VueStorageAdapter();
  private storageKey = 'cook-app-theme';
  
  // Vue refs for reactivity
  public currentThemeRef = ref<ThemeMode>('light');
  public customThemeRef = ref<CustomTheme | undefined>(undefined);

  constructor() {
    this.initializeTheme();
  }

  public getDomAdapter() {
    return this.domAdapter;
  }

  public getStorageAdapter() {
    return this.storageAdapter;
  }

  public getRootElement(): HTMLElement {
    return this.domAdapter.getRootElement();
  }

  /**
   * 设置主题
   */
  setTheme(mode: ThemeMode, customTheme?: CustomTheme) {
    this.currentThemeRef.value = mode;
    
    if (mode === 'custom' && customTheme) {
      this.customThemeRef.value = customTheme;
    } else if (mode === 'custom' && !customTheme) {
      // 如果是自定义模式但没有提供主题，使用第一个预设主题
      this.customThemeRef.value = PRESET_CUSTOM_THEMES['ocean'];
    }
    
    // 保存到本地存储
    this.saveThemeToStorage();
    // 应用主题
    this.applyTheme();
  }

  /**
   * 获取当前主题模式
   */
  getCurrentThemeMode(): ThemeMode {
    return this.currentThemeRef.value;
  }

  /**
   * 应用预设主题
   */
  applyPresetTheme(presetName: string): void {
    const preset = PRESET_CUSTOM_THEMES[presetName];
    if (preset) {
      this.setTheme('custom', preset);
    }
  }

  /**
   * 初始化主题
   */
  initializeTheme() {
    // 从存储加载主题
    this.loadThemeFromStorage();
    
    // 监听主题变化
    watch(() => this.currentThemeRef.value, (newMode) => {
      this.applyElementPlusTheme(newMode);
    });

    // 应用初始主题
    this.applyElementPlusTheme(this.currentThemeRef.value);
  }

  /**
   * 应用主题到Element Plus
   */
  private applyElementPlusTheme(themeMode: ThemeMode) {
    const htmlElement = document.documentElement;
    
    // 移除所有主题类
    htmlElement.classList.remove('theme-light', 'theme-dark', 'theme-custom');
    
    // 添加新主题类
    htmlElement.classList.add(`theme-${themeMode}`);
    
    // 如果是自定义主题，应用CSS变量
    if (themeMode === 'custom') {
      this.applyCustomThemeVariables();
    }
  }

  /**
   * 应用自定义主题的CSS变量
   */
  private applyCustomThemeVariables() {
    const customTheme = this.customThemeRef.value;
    if (customTheme) {
      const root = document.documentElement;
      
      // 应用自定义主题的CSS变量
      root.style.setProperty('--theme-primary', customTheme.primary);
      root.style.setProperty('--theme-secondary', customTheme.secondary);
      root.style.setProperty('--theme-background', customTheme.background);
      root.style.setProperty('--theme-surface', customTheme.surface);
      root.style.setProperty('--theme-text', customTheme.text);
      root.style.setProperty('--theme-text-secondary', customTheme.textSecondary);
      root.style.setProperty('--theme-border', customTheme.border);
      root.style.setProperty('--theme-shadow', customTheme.shadow);
    }
  }

  /**
   * 应用主题到DOM
   */
  private applyTheme() {
    const root = this.getRootElement();
    
    // 移除所有主题类
    this.domAdapter.removeClass(root, 'theme-light');
    this.domAdapter.removeClass(root, 'theme-dark');
    this.domAdapter.removeClass(root, 'theme-custom');
    
    // 添加新的主题类
    this.domAdapter.addClass(root, `theme-${this.currentThemeRef.value}`);
    
    // 应用自定义主题的CSS变量
    if (this.currentThemeRef.value === 'custom' && this.customThemeRef.value) {
      this.domAdapter.setStyle(root, '--theme-primary', this.customThemeRef.value.primary);
      this.domAdapter.setStyle(root, '--theme-secondary', this.customThemeRef.value.secondary);
      this.domAdapter.setStyle(root, '--theme-background', this.customThemeRef.value.background);
      this.domAdapter.setStyle(root, '--theme-surface', this.customThemeRef.value.surface);
      this.domAdapter.setStyle(root, '--theme-text', this.customThemeRef.value.text);
      this.domAdapter.setStyle(root, '--theme-text-secondary', this.customThemeRef.value.textSecondary);
      this.domAdapter.setStyle(root, '--theme-border', this.customThemeRef.value.border);
      this.domAdapter.setStyle(root, '--theme-shadow', this.customThemeRef.value.shadow);
    } else {
      // 清除自定义主题变量
      this.domAdapter.removeStyle(root, '--theme-primary');
      this.domAdapter.removeStyle(root, '--theme-secondary');
      this.domAdapter.removeStyle(root, '--theme-background');
      this.domAdapter.removeStyle(root, '--theme-surface');
      this.domAdapter.removeStyle(root, '--theme-text');
      this.domAdapter.removeStyle(root, '--theme-text-secondary');
      this.domAdapter.removeStyle(root, '--theme-border');
      this.domAdapter.removeStyle(root, '--theme-shadow');
    }
  }

  /**
   * 从本地存储加载主题
   */
  private loadThemeFromStorage() {
    try {
      const stored = this.storageAdapter.getItem(this.storageKey);
      if (stored) {
        const config = JSON.parse(stored);
        this.currentThemeRef.value = config.mode;
        if (config.customTheme) {
          this.customThemeRef.value = config.customTheme;
        }
      }
    } catch (error) {
      console.error('Failed to load theme from storage:', error);
    }
  }

  /**
   * 保存主题到本地存储
   */
  private saveThemeToStorage() {
    try {
      const config = {
        mode: this.currentThemeRef.value,
        customTheme: this.customThemeRef.value
      };
      this.storageAdapter.setItem(this.storageKey, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  }
}

export const themeService = new VueThemeService();