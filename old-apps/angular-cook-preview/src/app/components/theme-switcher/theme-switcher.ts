import { Component, inject, HostListener, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { PRESET_CUSTOM_THEMES } from '../../models/theme.models';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss'
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
  private elementRef = inject(ElementRef);
  showCustomThemes = false;

  constructor() {
    // 监听主题变化
    effect(() => {
      const theme = this.themeService.currentTheme();
      if (theme === 'custom') {
        this.showCustomThemes = true;
      } else {
        this.showCustomThemes = false;
      }
    });
  }

  get currentTheme() {
    return this.themeService.currentTheme();
  }

  get presetThemes() {
    return Object.keys(PRESET_CUSTOM_THEMES);
  }

  /**
   * 切换主题模式
   */
  switchTheme(mode: 'light' | 'dark' | 'custom'): void {
    this.themeService.setTheme(mode);
    if (mode === 'custom') {
      this.showCustomThemes = true;
    } else {
      this.showCustomThemes = false;
    }
  }

  /**
   * 监听全局点击事件，点击外部关闭自定义主题面板
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.showCustomThemes) {
      this.showCustomThemes = false;
    }
  }

  /**
   * 应用预设主题
   */
  applyPresetTheme(presetName: string): void {
    this.themeService.applyPresetTheme(presetName);
    this.showCustomThemes = false;
  }

  /**
   * 切换自定义主题面板
   */
  toggleCustomThemes(): void {
    this.showCustomThemes = !this.showCustomThemes;
  }

  /**
   * 获取主题图标
   */
  getThemeIcon(mode: string): string {
    const icons: Record<string, string> = {
      light: '☀️',
      dark: '🌙',
      custom: '🎨'
    };
    return icons[mode] || '🎨';
  }

  /**
   * 获取主题名称
   */
  getThemeName(mode: string): string {
    const names: Record<string, string> = {
      light: '明亮',
      dark: '暗黑',
      custom: '自定义'
    };
    return names[mode] || mode;
  }

  /**
   * 获取预设主题名称
   */
  getPresetName(key: string): string {
    const names: Record<string, string> = {
      ocean: '海洋',
      forest: '森林',
      sunset: '日落'
    };
    return names[key] || key;
  }
}
