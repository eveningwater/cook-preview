import { ref, watch } from 'vue';
import { 
  BaseThemeService,
  StorageAdapter,
  DomAdapter,
  ThemeMode,
  CustomTheme
} from '@cook/core';

/**
 * Vue 的存储适配器
 */
class VueStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}

/**
 * Vue 的 DOM 适配器
 */
class VueDomAdapter implements DomAdapter {
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
 * Vue 版本的 ThemeService
 * 继承核心主题逻辑，使用 Vue Refs 响应式
 */
class ThemeService extends BaseThemeService {
  // Vue refs
  currentTheme = ref<ThemeMode>('light');
  customTheme = ref<CustomTheme | undefined>(undefined);

  constructor() {
    const storage = new VueStorageAdapter();
    const dom = new VueDomAdapter();
    super(storage, dom);

    // 初始化 refs
    this.currentTheme.value = this.getCurrentTheme();
    this.customTheme.value = this.getCustomTheme();
  }

  /**
   * 重写 onThemeChange 来更新 refs
   */
  protected override onThemeChange(mode: ThemeMode, customTheme?: CustomTheme): void {
    this.currentTheme.value = mode;
    this.customTheme.value = customTheme;
  }
}

export const themeService = new ThemeService();

