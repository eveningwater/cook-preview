import { BaseThemeService } from '@cook/core';
import { storageAdapter } from '../adapters/storage.adapter';
import { domAdapter } from '../adapters/dom.adapter';

export type ThemeType = 'light' | 'dark' | 'custom';

/**
 * React版本的主题服务
 */
export class ReactThemeService extends BaseThemeService {
  constructor() {
    super();
  }

  /**
   * 获取存储适配器
   */
  getStorageAdapter() {
    return storageAdapter;
  }

  /**
   * 获取DOM适配器
   */
  getDomAdapter() {
    return domAdapter;
  }

  /**
   * 获取根元素
   */
  getRootElement() {
    return document.documentElement;
  }

  /**
   * 应用主题到DOM
   */
  applyTheme(theme?: ThemeType): void {
    if (theme) {
      // 移除所有主题类
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-custom');
      
      // 添加新主题类
      document.documentElement.classList.add(`theme-${theme}`);
      
      // 更新Ant Design主题
      this.updateAntdTheme(theme);
    }
  }

  /**
   * 应用预设主题
   */
  applyPresetTheme(presetName: string): void {
    const presets = this.getPresetThemes();
    const preset = presets[presetName as keyof typeof presets];
    if (preset) {
      this.setTheme('custom', preset);
      // 应用自定义主题的CSS变量
      this.applyCustomThemeVariables(preset);
    }
  }

  /**
   * 应用自定义主题CSS变量
   */
  private applyCustomThemeVariables(theme: any): void {
    const root = document.documentElement;
    root.style.setProperty('--theme-surface', theme.surface);
    root.style.setProperty('--theme-background', theme.background);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-secondary', theme.textSecondary);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-warning-bg', theme.warningBg);
    root.style.setProperty('--theme-warning-text', theme.warningText);
  }

  /**
   * 获取预设主题
   */
  getPresetThemes(): Record<string, any> {
    return {
      ocean: {
        surface: '#f0f8ff',
        background: '#e6f3ff',
        text: '#003d66',
        textSecondary: '#0066cc',
        border: '#b3d9ff',
        primary: '#0077be',
        shadow: 'rgba(0, 119, 190, 0.1)',
        warningBg: '#e6f7ff',
        warningText: '#0050b3'
      },
      forest: {
        surface: '#f1faee',
        background: '#e8f5e8',
        text: '#2d5016',
        textSecondary: '#4a7c59',
        border: '#c8e6c9',
        primary: '#2d6a4f',
        shadow: 'rgba(45, 106, 79, 0.1)',
        warningBg: '#f6ffed',
        warningText: '#389e0d'
      },
      sunset: {
        surface: '#fef6e4',
        background: '#fdebd0',
        text: '#8b4513',
        textSecondary: '#d2691e',
        border: '#f4a261',
        primary: '#e76f51',
        shadow: 'rgba(231, 111, 81, 0.1)',
        warningBg: '#fff7e6',
        warningText: '#d46b08'
      }
    };
  }

  /**
   * 更新Ant Design主题
   */
  private updateAntdTheme(theme: ThemeType): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.setProperty('--ant-color-bg-base', '#1a1a1a');
      root.style.setProperty('--ant-color-bg-container', '#262626');
      root.style.setProperty('--ant-color-text', '#e8e8e8');
      root.style.setProperty('--ant-color-text-secondary', '#c0c0c0');
      root.style.setProperty('--ant-color-border', '#363636');
    } else if (theme === 'light') {
      root.style.setProperty('--ant-color-bg-base', '#ffffff');
      root.style.setProperty('--ant-color-bg-container', '#f5f7fa');
      root.style.setProperty('--ant-color-text', '#303133');
      root.style.setProperty('--ant-color-text-secondary', '#606266');
      root.style.setProperty('--ant-color-border', '#dcdfe6');
    } else {
      // 自定义主题，使用CSS变量
      root.style.setProperty('--ant-color-bg-base', 'var(--theme-surface, #ffffff)');
      root.style.setProperty('--ant-color-bg-container', 'var(--theme-background, #f5f7fa)');
      root.style.setProperty('--ant-color-text', 'var(--theme-text, #303133)');
      root.style.setProperty('--ant-color-text-secondary', 'var(--theme-text-secondary, #606266)');
      root.style.setProperty('--ant-color-border', 'var(--theme-border, #dcdfe6)');
    }
  }
}

export const themeService = new ReactThemeService();
