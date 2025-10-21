import { ThemeMode, ThemeConfig, CustomTheme, PRESET_CUSTOM_THEMES } from '../models/theme.models';

/**
 * 存储适配器接口
 */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * DOM 适配器接口
 */
export interface DomAdapter {
  addClass(element: Element, className: string): void;
  removeClass(element: Element, className: string): void;
  setStyle(element: Element, property: string, value: string): void;
  removeStyle(element: Element, property: string): void;
}

/**
 * 主题服务基类
 * 包含所有主题逻辑，框架无关
 */
export abstract class BaseThemeService {
  protected storageKey = 'cook-app-theme';
  protected currentTheme: ThemeMode = 'light';
  protected customTheme?: CustomTheme;

  constructor() {
    this.loadThemeFromStorage();
  }

  // 子类需要实现的抽象方法
  abstract getStorageAdapter(): StorageAdapter;
  abstract getDomAdapter(): DomAdapter;
  abstract getRootElement(): Element;

  /**
   * 设置主题
   */
  setTheme(mode: ThemeMode, custom?: CustomTheme): void {
    this.currentTheme = mode;
    
    if (mode === 'custom' && custom) {
      this.customTheme = custom;
    } else if (mode === 'custom' && !custom) {
      // 如果是自定义模式但没有提供主题，使用第一个预设主题
      this.customTheme = PRESET_CUSTOM_THEMES['ocean'];
    }
    
    // 保存到本地存储
    this.saveThemeToStorage();
    // 应用主题
    this.applyTheme();
  }

  /**
   * 切换到下一个主题
   */
  toggleTheme(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'custom'];
    const currentIndex = modes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    
    this.setTheme(nextMode);
  }

  /**
   * 应用主题到 DOM
   */
  protected applyTheme(): void {
    const root = this.getRootElement();
    const domAdapter = this.getDomAdapter();
    
    // 移除所有主题类
    domAdapter.removeClass(root, 'theme-light');
    domAdapter.removeClass(root, 'theme-dark');
    domAdapter.removeClass(root, 'theme-custom');
    
    // 添加新的主题类
    domAdapter.addClass(root, `theme-${this.currentTheme}`);
    
    // 应用自定义主题的 CSS 变量
    if (this.currentTheme === 'custom' && this.customTheme) {
      domAdapter.setStyle(root, '--theme-primary', this.customTheme.primary);
      domAdapter.setStyle(root, '--theme-secondary', this.customTheme.secondary);
      domAdapter.setStyle(root, '--theme-background', this.customTheme.background);
      domAdapter.setStyle(root, '--theme-surface', this.customTheme.surface);
      domAdapter.setStyle(root, '--theme-text', this.customTheme.text);
      domAdapter.setStyle(root, '--theme-text-secondary', this.customTheme.textSecondary);
      domAdapter.setStyle(root, '--theme-border', this.customTheme.border);
      domAdapter.setStyle(root, '--theme-shadow', this.customTheme.shadow);
    } else {
      // 清除自定义主题变量
      domAdapter.removeStyle(root, '--theme-primary');
      domAdapter.removeStyle(root, '--theme-secondary');
      domAdapter.removeStyle(root, '--theme-background');
      domAdapter.removeStyle(root, '--theme-surface');
      domAdapter.removeStyle(root, '--theme-text');
      domAdapter.removeStyle(root, '--theme-text-secondary');
      domAdapter.removeStyle(root, '--theme-border');
      domAdapter.removeStyle(root, '--theme-shadow');
    }
  }

  /**
   * 从本地存储加载主题
   */
  protected loadThemeFromStorage(): void {
    try {
      const storageAdapter = this.getStorageAdapter();
      if (storageAdapter && typeof storageAdapter.getItem === 'function') {
        const stored = storageAdapter.getItem(this.storageKey);
        if (stored) {
          const config: ThemeConfig = JSON.parse(stored);
          this.currentTheme = config.mode;
          if (config.customTheme) {
            this.customTheme = config.customTheme;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load theme from storage:', error);
    }
  }

  /**
   * 保存主题到本地存储
   */
  protected saveThemeToStorage(): void {
    try {
      const config: ThemeConfig = {
        mode: this.currentTheme,
        customTheme: this.customTheme
      };
      this.getStorageAdapter().setItem(this.storageKey, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  }

  /**
   * 获取预设的自定义主题
   */
  getPresetThemes(): Record<string, CustomTheme> {
    return PRESET_CUSTOM_THEMES;
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
   * 获取当前主题
   */
  getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }

  /**
   * 获取当前自定义主题
   */
  getCustomTheme(): CustomTheme | undefined {
    return this.customTheme;
  }
}
