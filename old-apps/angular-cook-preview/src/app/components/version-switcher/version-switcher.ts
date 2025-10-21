import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-version-switcher',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule],
  templateUrl: './version-switcher.html',
  styleUrl: './version-switcher.scss'
})
export class VersionSwitcherComponent {
  /**
   * 切换到 Vue 版本
   */
  switchToVue(): void {
    // 判断是否为开发环境
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // 获取当前路径
    const currentHash = window.location.hash;
    
    // 构建 Vue 版本的 URL
    let vueUrl: string;
    
    if (isDev) {
      // 开发环境：http://localhost:5173
      vueUrl = 'http://localhost:5173/';
      
      // 尝试保持当前路径
      if (currentHash && currentHash.length > 2) {
        // 移除 #/ 前缀
        const pathWithoutHash = currentHash.substring(2);
        vueUrl += pathWithoutHash;
      }
    } else {
      // 生产环境：使用当前域名根路径
      vueUrl = `${window.location.origin}/vue-cook-preview/#/`;
      
      if (currentHash && currentHash.length > 2) {
        const pathWithoutHash = currentHash.substring(2);
        vueUrl += pathWithoutHash;
      }
    }
    
    // 跳转到 Vue 版本
    window.location.href = vueUrl;
  }
}

