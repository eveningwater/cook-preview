import { Injectable, inject } from '@angular/core';
import { BaseMarkdownService } from '@cook/core';
import { CookApiService } from './cook-api.service';

/**
 * Angular版本的Markdown服务
 * 继承核心业务逻辑，使用Angular的依赖注入
 */
@Injectable({
  providedIn: 'root'
})
export class AngularMarkdownService extends BaseMarkdownService {
  private cookApiService = inject(CookApiService);

  constructor() {
    super(); // 显式调用父类构造函数
  }

  /**
   * 实现抽象方法：获取图片的base64数据URL
   */
  async getImageDataUrl(imagePath: string): Promise<string> {
    return await this.cookApiService.getImageDataUrl(imagePath);
  }

  /**
   * 重写链接转换方法，为Angular的hash路由模式添加#前缀
   */
  override convertLinks(html: string, categoryPath: string): string {
    // 调用父类方法获取转换后的HTML
    const convertedHtml = super.convertLinks(html, categoryPath);
    
    // 为Angular的hash路由模式添加#前缀
    return convertedHtml.replace(/href="\/recipe\//g, 'href="#/recipe/');
  }
}
