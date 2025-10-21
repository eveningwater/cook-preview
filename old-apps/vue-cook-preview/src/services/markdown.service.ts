import { marked } from 'marked';
import { cookApiService } from './cook-api.service';

/**
 * Markdown 服务
 * 用于解析和处理 Markdown 内容
 */
class MarkdownService {
  constructor() {
    // 配置 marked 选项
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  /**
   * 将 Markdown 转换为 HTML
   */
  toHtml(markdown: string): string {
    if (!markdown) return '';
    return marked.parse(markdown) as string;
  }

  /**
   * 转换 Markdown 中的链接为正确的 URL
   */
  transformLinks(markdown: string, categoryPath: string): string {
    if (!markdown) return '';

    // 匹配 markdown 链接格式: [文本](路径)
    // 但排除图片: ![文本](路径)
    const linkRegex = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;
    
    let processedMarkdown = markdown;
    let match;
    const links: { match: string; text: string; url: string }[] = [];

    while ((match = linkRegex.exec(markdown)) !== null) {
      links.push({
        match: match[0],
        text: match[1],
        url: match[2]
      });
    }

    // 替换所有相对链接为完整 URL
    for (const link of links) {
      try {
        // 使用 cookApiService 的 getLinkUrl 方法转换链接
        const fullUrl = cookApiService.getLinkUrl(link.url, categoryPath);
        const newLinkTag = `[${link.text}](${fullUrl})`;
        processedMarkdown = processedMarkdown.replace(link.match, newLinkTag);
      } catch (error) {
        console.error(`Failed to transform link: ${link.url}`, error);
        // 如果转换失败，保持原始链接
      }
    }

    return processedMarkdown;
  }

  /**
   * 转换 Markdown 并将图片转换为 Base64
   */
  async transformWithBase64Images(markdown: string, categoryPath: string): Promise<string> {
    if (!markdown) return '';

    // 首先转换链接
    let processedMarkdown = this.transformLinks(markdown, categoryPath);

    // 查找所有图片标记
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images: { match: string; alt: string; src: string }[] = [];
    let match;

    while ((match = imageRegex.exec(processedMarkdown)) !== null) {
      images.push({
        match: match[0],
        alt: match[1],
        src: match[2]
      });
    }

    // 如果没有图片，直接返回（链接已经转换过了）
    if (images.length === 0) {
      return processedMarkdown;
    }

    // 替换所有图片路径为 Base64
    for (const image of images) {
      try {
        // 获取图片的 Base64 数据
        const base64Url = await cookApiService.getImageDataUrl(image.src);
        
        // 替换原始图片路径为 Base64
        const newImageTag = `![${image.alt}](${base64Url})`;
        processedMarkdown = processedMarkdown.replace(image.match, newImageTag);
      } catch (error) {
        console.error(`Failed to load image: ${image.src}`, error);
        // 如果加载失败，保持原始路径
      }
    }

    return processedMarkdown;
  }

  /**
   * 提取 Markdown 中的所有图片路径
   */
  extractImagePaths(markdown: string): string[] {
    if (!markdown) return [];

    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const imagePaths: string[] = [];
    let match;

    while ((match = imageRegex.exec(markdown)) !== null) {
      imagePaths.push(match[2]);
    }

    return imagePaths;
  }

  /**
   * 提取 Markdown 中的标题
   */
  extractHeadings(markdown: string): { level: number; text: string }[] {
    if (!markdown) return [];

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: { level: number; text: string }[] = [];
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim()
      });
    }

    return headings;
  }
}

export const markdownService = new MarkdownService();

