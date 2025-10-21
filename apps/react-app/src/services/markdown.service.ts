import { BaseMarkdownService, markdownToHtml } from '@cook/core';
import { cookApiService } from './cook-api.service';

/**
 * React版本的Markdown服务
 */
export class ReactMarkdownService extends BaseMarkdownService {
  constructor() {
    super({
      // 不设置linkBaseUrl，让链接保持相对路径，然后通过convertLinks方法处理
      linkBaseUrl: undefined
    });
  }
  /**
   * 实现抽象方法：获取图片的base64数据URL
   */
  async getImageDataUrl(imagePath: string): Promise<string> {
    return await cookApiService.getImageDataUrl(imagePath);
  }

  /**
   * 重写toHtml方法，确保链接转换正确
   */
  toHtml(markdown: string, categoryPath?: string): string {
    if (!markdown) return '';
    let html = markdownToHtml(markdown);
    
    // 如果提供了分类路径，处理链接转换
    if (categoryPath) {
      html = this.convertLinks(html, categoryPath);
    }
    
    return html;
  }

  /**
   * 重写transformWithBase64Images方法，确保链接转换正确
   */
  async transformWithBase64Images(markdown: string, categoryPath: string): Promise<string> {
    if (!markdown) return '';
    
    // 先转换为HTML
    let html = markdownToHtml(markdown);
    
    // 处理链接转换（使用我们的convertLinks方法）
    html = this.convertLinks(html, categoryPath);
    
    // 提取图片路径
    const images = this.extractImages(markdown);
    
    // 处理每个图片
    for (const imagePath of images) {
      try {
        const dataUrl = await this.getImageDataUrl(imagePath);
        
        // 替换HTML中的图片src，使用文件名匹配
        const pathOnly = imagePath.split('/').pop();
        const encodedPathOnly = encodeURIComponent(pathOnly || '');
        
        // 匹配任何包含这个文件名的src属性
        const regex = new RegExp(`src="[^"]*${encodedPathOnly.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
        html = html.replace(regex, `src="${dataUrl}"`);
      } catch (error) {
        console.warn(`Failed to load image ${imagePath}:`, error);
        // 如果加载失败，保持原始路径
      }
    }
    
    return html;
  }

  /**
   * 重写链接转换方法，为React的hash路由模式添加#前缀
   */
  convertLinks(html: string, categoryPath: string): string {
    // 调用父类方法获取转换后的HTML
    const convertedHtml = super.convertLinks(html, categoryPath);
    
    // 为React的hash路由模式添加#前缀
    return convertedHtml.replace(/href="\/recipe\//g, 'href="#/recipe/');
  }
}

export const markdownService = new ReactMarkdownService();
