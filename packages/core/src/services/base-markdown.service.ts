import { markdownToHtml, extractImagesFromMarkdown, convertMarkdownLinks } from '../utils/markdown.utils';

export interface MarkdownServiceConfig {
  imageBaseUrl?: string;
  linkBaseUrl?: string;
}

/**
 * 基础Markdown服务类
 * 提供统一的markdown处理功能
 */
export abstract class BaseMarkdownService {
  protected config: MarkdownServiceConfig;

  constructor(config: MarkdownServiceConfig = {}) {
    this.config = config;
  }

  /**
   * 将Markdown转换为HTML
   */
  toHtml(markdown: string, categoryPath?: string): string {
    if (!markdown) return '';
    let html = markdownToHtml(markdown);
    
    // 如果提供了分类路径，处理链接转换
    if (categoryPath) {
      html = convertMarkdownLinks(html, categoryPath);
    }
    
    return html;
  }

  /**
   * 提取markdown中的图片路径
   */
  extractImages(markdown: string): string[] {
    return extractImagesFromMarkdown(markdown);
  }

  /**
   * 转换markdown链接
   */
  convertLinks(html: string, categoryPath: string): string {
    return convertMarkdownLinks(html, categoryPath, this.config.linkBaseUrl);
  }

  /**
   * 处理图片替换的抽象方法，由具体实现类提供
   */
  abstract getImageDataUrl(imagePath: string): Promise<string>;

  /**
   * 将Markdown转换为HTML，并处理图片为base64和链接转换
   */
  async transformWithBase64Images(markdown: string, categoryPath: string): Promise<string> {
    if (!markdown) return '';
    
    // 先转换为HTML
    let html = markdownToHtml(markdown);
    
    // 处理链接转换，使用convertLinks方法保持一致性
    html = this.convertLinks(html, categoryPath);
    
    // 提取图片路径
    const images = extractImagesFromMarkdown(markdown);
    
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
}
