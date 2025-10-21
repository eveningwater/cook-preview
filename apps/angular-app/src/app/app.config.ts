import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideZoneChangeDetection } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './services/theme.service';

import { routes } from './app.routes';

// 检查是否为生产环境
export const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// 初始化主题服务
function initializeTheme(themeService: ThemeService) {
  return () => {
    // 主题服务会在构造函数中自动加载并应用主题
    console.log('Theme service initialized');
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // 生产环境使用hash路由，开发环境使用history路由
    isProduction ? provideRouter(routes, withHashLocation()) : provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    // 提供Material图标模块
    importProvidersFrom(MatIconModule),
    // 提供主题服务并初始化
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      deps: [ThemeService],
      multi: true
    }
  ]
};
