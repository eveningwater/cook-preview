import { marked } from 'marked';
import { Recipe } from '../models/repo.models';

/**
 * 解析README.md内容获取菜谱列表
 */
export function parseReadmeContent(readmeContent: string, categoryPath: string): Recipe[] {
  const recipes: Recipe[] = [];
  const lines = readmeContent.split('\n');
  
  for (const line of lines) {
    // 匹配markdown链接格式: - [菜谱名称](./菜谱文件.md)
    const linkMatch = line.match(/^\s*-\s*\[([^\]]+)\]\(\.\/([^)]+\.md)\)/);
    if (linkMatch) {
      const recipeName = linkMatch[1];
      const fileName = linkMatch[2];
      
      // 过滤掉README.md文件
      if (fileName !== 'README.md') {
        const filePath = `${categoryPath}/${fileName}`;
        
        recipes.push({
          name: recipeName,
          path: filePath,
          sha: ''
        });
      }
    }
  }
  
  // 按名称排序
  return recipes.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

/**
 * 将 Markdown 内容转换为 HTML
 */
export function markdownToHtml(markdown: string): string {
  return marked(markdown) as string;
}

/**
 * 转换Markdown链接为应用路由链接
 */
export function convertMarkdownLinks(html: string, categoryPath: string, baseUrl?: string): string {
  // 匹配相对路径的.md链接
  const linkRegex = /<a\s+href="([^"]*\.md)"([^>]*)>([^<]*)<\/a>/g;
  
  return html.replace(linkRegex, (match, href, attributes, text) => {
    // 处理相对路径链接
    if (href.startsWith('./')) {
      const fileName = href.substring(2); // 移除 './'
      const recipeName = fileName.replace('.md', '');
      
      // 构建应用路由链接
      const appRoute = baseUrl ? `${baseUrl}/recipe/${categoryPath}/${recipeName}` : `/recipe/${categoryPath}/${recipeName}`;
      return `<a href="${appRoute}"${attributes}>${text}</a>`;
    }
    
    // 处理其他相对路径
    if (href.startsWith('../')) {
      const pathParts = href.split('/');
      const targetCategory = pathParts[1]; // 假设格式为 ../category/file.md
      const fileName = pathParts[2];
      const recipeName = fileName.replace('.md', '');
      
      const appRoute = baseUrl ? `${baseUrl}/recipe/${targetCategory}/${recipeName}` : `/recipe/${targetCategory}/${recipeName}`;
      return `<a href="${appRoute}"${attributes}>${text}</a>`;
    }
    
    // 处理绝对路径（以/开头）
    if (href.startsWith('/')) {
      const pathParts = href.split('/').filter((part: string) => part);
      if (pathParts.length >= 2) {
        const targetCategory = pathParts[0];
        const fileName = pathParts[1];
        const recipeName = fileName.replace('.md', '');
        
        const appRoute = baseUrl ? `${baseUrl}/recipe/${targetCategory}/${recipeName}` : `/recipe/${targetCategory}/${recipeName}`;
        return `<a href="${appRoute}"${attributes}>${text}</a>`;
      }
    }
    
    // 保持其他链接不变
    return match;
  });
}

/**
 * 从 Markdown 内容中提取图片链接
 */
export function extractImagesFromMarkdown(markdown: string): string[] {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const images: string[] = [];
  let match;
  
  while ((match = imageRegex.exec(markdown)) !== null) {
    images.push(match[1]);
  }
  
  return images;
}
