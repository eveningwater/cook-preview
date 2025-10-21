import { Injectable, signal, effect } from '@angular/core';
import { 
  BaseThemeService,
  StorageAdapter,
  DomAdapter,
  ThemeMode,
  CustomTheme
} from '@cook/core';

/**
 * Angular 的存储适配器
 */
class AngularStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}

/**
 * Angular 的 DOM 适配器
 */
class AngularDomAdapter implements DomAdapter {
  private root = document.documentElement;

  setClass(className: string): void {
    this.root.classList.add(className);
  }

  removeClass(className: string): void {
    this.root.classList.remove(className);
  }

  setProperty(name: string, value: string): void {
    this.root.style.setProperty(name, value);
  }

  removeProperty(name: string): void {
    this.root.style.removeProperty(name);
  }
}

/**
 * Angular 版本的 ThemeService
 * 继承核心主题逻辑，使用 Angular Signals 响应式
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService extends BaseThemeService {
  // Angular signals
  currentTheme = signal<ThemeMode>('light');
  customTheme = signal<CustomTheme | undefined>(undefined);

  constructor() {
    const storage = new AngularStorageAdapter();
    const dom = new AngularDomAdapter();
    super(storage, dom);

    // 初始化 signals
    this.currentTheme.set(this.getCurrentTheme());
    this.customTheme.set(this.getCustomTheme());
  }

  /**
   * 重写 onThemeChange 来更新 signals
   */
  protected override onThemeChange(mode: ThemeMode, customTheme?: CustomTheme): void {
    this.currentTheme.set(mode);
    this.customTheme.set(customTheme);
  }
}

