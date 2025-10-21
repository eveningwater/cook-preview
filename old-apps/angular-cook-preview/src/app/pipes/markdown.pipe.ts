import { Pipe, PipeTransform, inject } from '@angular/core';
import { marked } from 'marked';
import { firstValueFrom } from 'rxjs';
import { CookApiService } from '../services/cook-api.service';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  private cookApiService = inject(CookApiService);

  transform(value: string, categoryPath?: string): string {
    if (!value) {
      return '';
    }

    try {
      // 先处理图片路径和链接路径
      const processedValue = this.processImagePaths(this.processLinkPaths(value, categoryPath));
      
      // 配置marked选项
      marked.setOptions({
        breaks: true, // 支持换行
        gfm: true, // GitHub Flavored Markdown
      });

      const result = marked.parse(processedValue);
      return typeof result === 'string' ? result : processedValue;
    } catch (error) {
      return value; // 如果解析失败，返回原始内容
    }
  }

  // 异步转换方法，将绝对路径转换为base64
  async transformWithBase64Images(value: string, categoryPath?: string): Promise<string> {
    if (!value) {
      return '';
    }

    try {
      // 先处理链接路径和图片路径（相对路径转绝对路径）
      const processedValue = this.processImagePaths(this.processLinkPaths(value, categoryPath));
      
      // 将绝对路径转换为base64
      const processedWithImages = await this.processImagePathsToBase64(processedValue);
      
      // 配置marked选项
      marked.setOptions({
        breaks: true, // 支持换行
        gfm: true, // GitHub Flavored Markdown
      });

      const result = marked.parse(processedWithImages);
      return typeof result === 'string' ? result : processedWithImages;
    } catch (error) {
      return value; // 如果解析失败，返回原始内容
    }
  }

  private processImagePaths(content: string): string {
    // 匹配markdown图片语法 ![alt](path) 和 HTML img标签
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const htmlImageRegex = /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
    
    // 处理markdown图片语法
    let processedContent = content.replace(imageRegex, (match, alt, path) => {
      // 只处理相对路径的图片
      if (this.isRelativePath(path)) {
        const fullUrl = this.cookApiService.getImageUrl(path);
        return `![${alt}](${fullUrl})`;
      }
      return match; // 保持绝对路径不变
    });
    
    // 处理HTML img标签
    processedContent = processedContent.replace(htmlImageRegex, (match, before, src, after) => {
      // 只处理相对路径的图片
      if (this.isRelativePath(src)) {
        // 为相对路径的图片添加特殊标识，稍后异步处理
        const imgId = `img_${Math.random().toString(36).substr(2, 9)}`;
        return `<img${before}id="${imgId}" data-src="${src}" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y4ZjlmYSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSI4Ii8+PHRleHQgeD0iMTAwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Yqg6L295aSx6LSlPC90ZXh0Pjx0ZXh0IHg9IjEwMCIgeT0iOTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+${after} style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" onerror="this.style.display='none';" onload="">`;
      }
      return match; // 保持绝对路径不变
    });
    
    return processedContent;
  }

  // 异步处理图片路径，将绝对路径转换为base64
  private async processImagePathsToBase64(content: string): Promise<string> {
    // 匹配markdown图片语法 ![alt](path) 和 HTML img标签
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const htmlImageRegex = /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
    
    let processedContent = content;
    
    // 处理markdown图片语法
    const imageMatches = Array.from(content.matchAll(imageRegex));
    for (const match of imageMatches) {
      const [fullMatch, alt, url] = match;
      if (this.shouldProcessImageForBase64(url)) {
        try {
          const base64Url = await firstValueFrom(this.cookApiService.getImageDataUrl(url));
          processedContent = processedContent.replace(fullMatch, `![${alt}](${base64Url})`);
        } catch (error) {
          // 保持原始路径
        }
      }
    }
    
    // 处理HTML img标签
    const htmlImageMatches = Array.from(content.matchAll(htmlImageRegex));
    for (const match of htmlImageMatches) {
      const [fullMatch, before, src, after] = match;
      if (this.shouldProcessImageForBase64(src)) {
        try {
          const base64Url = await firstValueFrom(this.cookApiService.getImageDataUrl(src));
          processedContent = processedContent.replace(fullMatch, `<img${before}src="${base64Url}"${after}>`);
        } catch (error) {
          // 保持原始路径
        }
      }
    }
    
    return processedContent;
  }

  private processLinkPaths(content: string, categoryPath?: string): string {
    // 匹配markdown链接语法 [text](url) 和 HTML a标签
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const htmlLinkRegex = /<a([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi;
    
    // 处理markdown链接语法
    let processedContent = content.replace(linkRegex, (match, text, url) => {
      // 只处理相对路径的链接
      if (this.isRelativePath(url)) {
        const fullUrl = this.cookApiService.getLinkUrl(url, categoryPath);
        return `[${text}](${fullUrl})`;
      }
      return match; // 保持绝对路径不变
    });
    
    // 处理HTML a标签
    processedContent = processedContent.replace(htmlLinkRegex, (match, before, href, after) => {
      // 只处理相对路径的链接
      if (this.isRelativePath(href)) {
        const fullUrl = this.cookApiService.getLinkUrl(href, categoryPath);
        return `<a${before}href="${fullUrl}"${after}>`;
      }
      return match; // 保持绝对路径不变
    });
    
    return processedContent;
  }

  private isRelativePath(path: string): boolean {
    // 判断是否为相对路径（不是以http://或https://开头）
    return !path.startsWith('http://') && !path.startsWith('https://') && !path.startsWith('//');
  }

  private shouldProcessImage(path: string): boolean {
    // 处理相对路径和AtomGit的绝对路径
    return this.isRelativePath(path) || path.includes(`${environment.rawUrlPrefix}/images/`);
  }

  private shouldProcessImageForBase64(path: string): boolean {
    // 只处理AtomGit的绝对路径
    return path.includes(`${environment.rawUrlPrefix}/images/`);
  }

  // 异步加载图片并更新DOM
  loadImagesAsync(element: HTMLElement): void {
    const images = element.querySelectorAll('img[data-src]');
    
    images.forEach((imgElement: Element, index: number) => {
      const img = imgElement as HTMLImageElement;
      const src = img.getAttribute('data-src');
      
      if (src && this.isRelativePath(src)) {
        // 添加加载状态
        img.style.opacity = '0.5';
        img.style.transition = 'opacity 0.3s ease';
        
        this.cookApiService.getImageDataUrl(src).subscribe({
          next: (dataUrl) => {
            img.src = dataUrl;
            img.removeAttribute('data-src');
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.3s ease';
          },
          error: (error) => {
            // 显示错误占位符
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmY2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjY2M2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Yqg6L295aSx6LSl5aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
            img.removeAttribute('data-src');
            img.style.opacity = '1';
          }
        });
      } else {
      }
    });
  }

}
