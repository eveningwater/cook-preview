import axios, { AxiosInstance } from 'axios';
import type { RepoItem, RepoContent, RecipeCategory, Recipe } from '../models/repo.models';
import { environment } from '../environments/environment';

class CookApiService {
  private api: AxiosInstance;
  private readonly API_BASE = environment.apiBase;
  private readonly TOKEN = environment.token;
  private readonly REPO_OWNER = environment.repoOwner;
  private readonly REPO_NAME = environment.repoName;

  constructor() {
    this.api = axios.create({
      baseURL: this.API_BASE,
      headers: {
        'Authorization': `Bearer ${this.TOKEN}`
      }
    });
  }

  // 接口1: 获取仓库信息
  async getRepoInfo(): Promise<any> {
    const response = await this.api.get(
      `/repos/${this.REPO_OWNER}/${this.REPO_NAME}`
    );
    return response.data;
  }

  // 接口2: 获取文件内容
  async getFileContent(path: string): Promise<RepoContent> {
    const response = await this.api.get<RepoContent>(
      `/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${path}`
    );
    return response.data;
  }

  // 接口3: 获取目录树
  async getRepoTree(): Promise<RepoItem[]> {
    const response = await this.api.get<RepoItem[]>(
      `/repos/${this.REPO_OWNER}/${this.REPO_NAME}/trees/main`,
      {
        params: { recursive: 'true' }
      }
    );
    return response.data;
  }

  // 获取所有菜谱分类
  async getRecipeCategories(): Promise<RecipeCategory[]> {
    const items = await this.getRepoTree();
    
    // 过滤出中文菜名目录
    const chineseCategories = items.filter(item => 
      item.type === 'tree' && 
      this.isChineseDirectory(item.path) &&
      !item.path.startsWith('.') &&
      item.path !== 'images'
    );
    
    return chineseCategories.map(item => ({
      name: item.path,
      path: item.path,
      sha: item.sha
    }));
  }

  // 获取指定分类下的菜谱列表
  async getRecipesByCategory(category: RecipeCategory): Promise<Recipe[]> {
    try {
      const response = await this.api.get<any>(
        `/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${category.path}`
      );
      
      // 检查响应是否为数组，如果不是则从entries字段获取
      const items = Array.isArray(response.data) ? response.data : (response.data.entries || []);
      
      // 查找README.md文件
      const readmeFile = items.find((item: { name: string }) => item.name === 'README.md');
      
      if (readmeFile) {
        // 如果有README.md文件，获取其内容并解析
        const readmeContent = await this.getFileContent(readmeFile.path);
        const content = readmeContent.content ? this.decodeBase64UTF8(readmeContent.content) : '';
        return this.parseReadmeContent(content, category.path);
      } else {
        // 如果没有README.md，返回其他.md文件（排除README.md）
        return items
          .filter((item: { type: string; name: string }) => 
            item.type === 'file' && item.name.endsWith('.md') && item.name !== 'README.md'
          )
          .map((item: { name: string; path: string; sha: string }) => ({
            name: item.name.replace('.md', ''),
            path: item.path,
            sha: item.sha
          }));
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      return [];
    }
  }

  /**
   * 解析README.md内容获取菜谱列表
   */
  parseReadmeContent(readmeContent: string, categoryPath: string): Recipe[] {
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

  // 获取菜谱详细内容
  async getRecipeDetail(recipe: Recipe): Promise<Recipe> {
    const content = await this.getFileContent(recipe.path);
    return {
      ...recipe,
      content: content.content ? this.decodeBase64UTF8(content.content) : ''
    };
  }

  /**
   * 正确解码Base64编码的UTF-8内容
   */
  private decodeBase64UTF8(base64String: string): string {
    try {
      // 先解码Base64
      const binaryString = atob(base64String);
      // 将二进制字符串转换为UTF-8字符串
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      // 使用TextDecoder解码UTF-8字节
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(bytes);
    } catch (error) {
      return base64String; // 如果解码失败，返回原始字符串
    }
  }

  // 获取完整的菜谱数据
  async getFullRecipeData(): Promise<RecipeCategory[]> {
    const categories = await this.getRecipeCategories();
    
    if (categories.length === 0) {
      return [];
    }
    
    const categoryPromises = categories.map(async category => {
      const recipes = await this.getRecipesByCategory(category);
      return { ...category, recipes };
    });
    
    return Promise.all(categoryPromises);
  }

  // 判断是否为中文目录
  private isChineseDirectory(path: string): boolean {
    return /[\u4e00-\u9fa5]/.test(path);
  }

  // 获取图片目录内容
  async getImages(): Promise<string[]> {
    try {
      const response = await this.api.get<any>(
        `/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/images`
      );
      
      // 检查响应是否为数组
      const items = Array.isArray(response.data) ? response.data : [];
      
      return items
        .filter((item: any) => item.type === 'file' && this.isImageFile(item.name))
        .map((item: any) => item.name);
    } catch (error) {
      console.error('Error loading images:', error);
      return [];
    }
  }

  // 判断是否为图片文件
  private isImageFile(path: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
  }

  // 规范化路径，处理各种相对路径格式
  private normalizePath(path: string): string {
    // 如果已经是完整URL，直接返回
    if (path.startsWith('http') || path.startsWith('//')) {
      return path;
    }

    let cleanPath = path;
    
    // 移除开头的 ./ 或 /
    if (cleanPath.startsWith('./')) {
      cleanPath = cleanPath.substring(2);
    } else if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
    
    // 处理 ../ 的情况
    while (cleanPath.startsWith('../')) {
      cleanPath = cleanPath.substring(3);
    }
    
    return cleanPath;
  }

  // 生成图片的完整URL
  getImageUrl(imagePath: string): string {
    // 如果已经是完整URL，直接返回
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // 规范化路径
    const cleanPath = this.normalizePath(imagePath);
    
    // 确保路径以images/开头
    const finalPath = cleanPath.startsWith('images/') ? cleanPath : `images/${cleanPath}`;
    
    // 使用环境变量中的blobUrlPrefix
    return `${environment.blobUrlPrefix}/${finalPath}`;
  }

  // 获取图片的Base64数据URL
  async getImageDataUrl(imagePath: string): Promise<string> {
    try {
      let finalPath: string;
      
      // 如果是AtomGit的绝对URL，提取路径
      if (imagePath.includes(`${environment.rawUrlPrefix}/images/`)) {
        const urlParts = imagePath.split('/raw/main/');
        if (urlParts.length > 1) {
          finalPath = urlParts[1];
        } else {
          finalPath = imagePath;
        }
      } else {
        // 规范化路径
        const cleanPath = this.normalizePath(imagePath);
        finalPath = cleanPath.startsWith('images/') ? cleanPath : `images/${cleanPath}`;
      }
      
      // 使用contents API获取图片内容
      const response = await this.api.get<any>(
        `/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${finalPath}`
      );
      
      // 检查不同的响应格式
      let base64Content = '';
      if (response.data.content) {
        base64Content = response.data.content;
      } else if (response.data.data && response.data.data.content) {
        base64Content = response.data.data.content;
      } else if (typeof response.data === 'string') {
        base64Content = response.data;
      } else {
        throw new Error('No content found in response');
      }
      
      const mimeType = this.getMimeType(imagePath);
      return `data:${mimeType};base64,${base64Content}`;
    } catch (error) {
      console.error('Error loading image:', error);
      // 返回一个占位符图片
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
    }
  }

  // 根据文件扩展名获取MIME类型
  private getMimeType(filePath: string): string {
    const ext = filePath.toLowerCase().split('.').pop();
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml'
    };
    return mimeTypes[ext || ''] || 'image/jpeg';
  }

  // 生成链接的完整URL
  getLinkUrl(linkPath: string, categoryPath?: string): string {
    // 如果已经是完整URL，直接返回
    if (linkPath.startsWith('http') || linkPath.startsWith('//')) {
      return linkPath;
    }
    
    // 规范化路径
    let cleanPath = this.normalizePath(linkPath);
    
    // 如果提供了分类路径，且链接路径不包含分类，则添加分类路径
    if (categoryPath && !cleanPath.includes('/') && !cleanPath.startsWith(categoryPath)) {
      cleanPath = `${categoryPath}/${cleanPath}`;
    }

    // 生成 AtomGit raw URL
    const url = `${environment.rawUrlPrefix}/${cleanPath}`;
    if (url.includes('.md')) {
      return `${location.origin}/vue-cook-preview/#/recipe/${cleanPath.replace('.md', '')}`;;
    }
    return url;
  }
}

export const cookApiService = new CookApiService();

