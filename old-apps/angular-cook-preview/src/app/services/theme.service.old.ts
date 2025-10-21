import { Injectable, signal, effect } from '@angular/core';
import { ThemeMode, ThemeConfig, CustomTheme, PRESET_CUSTOM_THEMES } from '../models/theme.models';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'cook-app-theme';
  
  // 当前主题模式
  currentTheme = signal<ThemeMode>('light');
  
  // 自定义主题配置
  customTheme = signal<CustomTheme | undefined>(undefined);

  constructor() {
    // 从本地存储加载主题
    this.loadThemeFromStorage();
    
    // 监听主题变化并应用
    effect(() => {
      this.applyTheme(this.currentTheme(), this.customTheme());
    });
  }

  /**
   * 设置主题
   */
  setTheme(mode: ThemeMode, customTheme?: CustomTheme): void {
    this.currentTheme.set(mode);
    
    if (mode === 'custom' && customTheme) {
      this.customTheme.set(customTheme);
    } else if (mode === 'custom' && !customTheme) {
      // 如果是自定义模式但没有提供主题，使用第一个预设主题
      this.customTheme.set(PRESET_CUSTOM_THEMES['ocean']);
    }
    
    // 保存到本地存储
    this.saveThemeToStorage();
  }

  /**
   * 切换到下一个主题
   */
  toggleTheme(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'custom'];
    const currentIndex = modes.indexOf(this.currentTheme());
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    
    this.setTheme(nextMode);
  }

  /**
   * 应用主题到 DOM
   */
  private applyTheme(mode: ThemeMode, customTheme?: CustomTheme): void {
    const root = document.documentElement;
    
    // 移除所有主题类
    root.classList.remove('theme-light', 'theme-dark', 'theme-custom');
    
    // 添加新的主题类
    root.classList.add(`theme-${mode}`);
    
    // 应用自定义主题的 CSS 变量
    if (mode === 'custom' && customTheme) {
      root.style.setProperty('--theme-primary', customTheme.primary);
      root.style.setProperty('--theme-secondary', customTheme.secondary);
      root.style.setProperty('--theme-background', customTheme.background);
      root.style.setProperty('--theme-surface', customTheme.surface);
      root.style.setProperty('--theme-text', customTheme.text);
      root.style.setProperty('--theme-text-secondary', customTheme.textSecondary);
      root.style.setProperty('--theme-border', customTheme.border);
      root.style.setProperty('--theme-shadow', customTheme.shadow);
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
  private loadThemeFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const config: ThemeConfig = JSON.parse(stored);
        this.currentTheme.set(config.mode);
        if (config.customTheme) {
          this.customTheme.set(config.customTheme);
        }
      }
    } catch (error) {
      console.error('Failed to load theme from storage:', error);
    }
  }

  /**
   * 保存主题到本地存储
   */
  private saveThemeToStorage(): void {
    try {
      const config: ThemeConfig = {
        mode: this.currentTheme(),
        customTheme: this.customTheme()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
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
}
