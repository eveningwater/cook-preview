import { Injectable, signal, effect, inject } from '@angular/core';
import { BaseThemeService, StorageAdapter, DomAdapter } from '@cook/core';
import { AngularStorageAdapter } from '../../adapters/storage.adapter';
import { AngularDomAdapter } from '../../adapters/dom.adapter';

@Injectable({
  providedIn: 'root'
})
export class ThemeService extends BaseThemeService {
  private storageAdapter: StorageAdapter;
  private domAdapter: DomAdapter;

  // 使用 Angular Signals 的响应式状态
  currentThemeSignal = signal(this.getCurrentTheme());
  customThemeSignal = signal(this.getCustomTheme());

  constructor() {
    super();
    this.storageAdapter = new AngularStorageAdapter();
    this.domAdapter = inject(AngularDomAdapter);
    
    // 监听主题变化并更新 signals
    effect(() => {
      this.currentThemeSignal.set(this.getCurrentTheme());
      this.customThemeSignal.set(this.getCustomTheme());
    });
  }

  getStorageAdapter(): StorageAdapter {
    return this.storageAdapter;
  }

  getDomAdapter(): DomAdapter {
    return this.domAdapter;
  }

  getRootElement(): Element {
    return document.documentElement;
  }

  // 重写 setTheme 方法以更新 signals
  override setTheme(mode: any, custom?: any): void {
    super.setTheme(mode, custom);
    this.currentThemeSignal.set(this.getCurrentTheme());
    this.customThemeSignal.set(this.getCustomTheme());
  }
}
