import { RepoItem, RepoContent, RecipeCategory, Recipe } from '../models/repo.models';
import { Environment } from '../config/environment';
import { decodeBase64UTF8, isChineseDirectory, isImageFile, getMimeType } from '../utils/text.utils';
import { normalizePath, getImageUrl, getLinkUrl } from '../utils/path.utils';
import { parseReadmeContent, extractImagesFromMarkdown } from '../utils/markdown.utils';

/**
 * HTTP 请求适配器接口
 */
export interface HttpAdapter {
  get<T>(url: string, headers?: Record<string, string>): Promise<T>;
}

/**
 * Cook API 服务基类
 * 包含所有业务逻辑，框架无关
 */
export abstract class BaseCookApiService {
  protected environment: Environment;

  constructor(environment: Environment) {
    this.environment = environment;
  }

  // 子类需要实现的抽象方法
  abstract getHttpAdapter(): HttpAdapter;

  // 接口1: 获取仓库信息
  async getRepoInfo(): Promise<any> {
    const response = await this.getHttpAdapter().get(
      `${this.environment.apiBase}/repos/${this.environment.repoPath}`,
      { 'Authorization': `Bearer ${this.environment.token}` }
    );
    return response;
  }

  // 接口2: 获取文件内容
  async getFileContent(path: string): Promise<RepoContent> {
    const response = await this.getHttpAdapter().get<RepoContent>(
      `${this.environment.apiBase}/repos/${this.environment.repoPath}/contents/${path}`,
      { 'Authorization': `Bearer ${this.environment.token}` }
    );
    return response;
  }

  // 接口3: 获取目录树
  async getRepoTree(): Promise<RepoItem[]> {
    const response = await this.getHttpAdapter().get<RepoItem[]>(
      `${this.environment.apiBase}/repos/${this.environment.repoPath}/trees/main?recursive=true`,
      { 'Authorization': `Bearer ${this.environment.token}` }
    );
    return response;
  }

  // 获取所有菜谱分类
  async getRecipeCategories(): Promise<RecipeCategory[]> {
    const items = await this.getRepoTree();
    
    // 从文件路径中提取目录名
    const directoryNames = new Set<string>();
    items.forEach(item => {
      if (item.path.includes('/')) {
        const dirName = item.path.split('/')[0];
        directoryNames.add(dirName);
      }
    });
    
    // 过滤出中文菜名目录
    const chineseCategories = Array.from(directoryNames).filter(dirName => 
      isChineseDirectory(dirName) &&
      !dirName.startsWith('.') &&
      dirName !== 'images'
    );
    
    // 为每个分类获取菜谱列表
    const categoriesWithRecipes = await Promise.all(
      chineseCategories.map(async (dirName) => {
        try {
          const recipes = await this.getRecipesByCategory({
            name: dirName,
            path: dirName,
            sha: ''
          });
          return {
            name: dirName,
            path: dirName,
            sha: '',
            recipes
          };
        } catch (error) {
          console.warn(`Failed to load recipes for category ${dirName}:`, error);
          return {
            name: dirName,
            path: dirName,
            sha: '',
            recipes: []
          };
        }
      })
    );
    
    return categoriesWithRecipes;
  }

  // 获取指定分类下的菜谱列表
  async getRecipesByCategory(category: RecipeCategory): Promise<Recipe[]> {
    try {
      const response = await this.getHttpAdapter().get<any>(
        `${this.environment.apiBase}/repos/${this.environment.repoPath}/contents/${category.path}`,
        { 'Authorization': `Bearer ${this.environment.token}` }
      );
      
      // 检查响应是否为数组，如果不是则从entries字段获取
      const items = Array.isArray(response) ? response : (response.entries || []);
      
      // 查找README.md文件
      const readmeFile = items.find((item: { name: string }) => item.name === 'README.md');
      
      if (readmeFile) {
        // 如果有README.md文件，获取其内容并解析
        const readmeContent = await this.getFileContent(readmeFile.path);
        const content = readmeContent.content ? decodeBase64UTF8(readmeContent.content) : '';
        return parseReadmeContent(content, category.path);
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

  // 获取菜谱详细内容
  async getRecipeDetail(recipe: Recipe): Promise<Recipe> {
    const content = await this.getFileContent(recipe.path);
    const markdownContent = content.content ? decodeBase64UTF8(content.content) : '';
    
    return {
      ...recipe,
      content: markdownContent,
      images: extractImagesFromMarkdown(markdownContent)
    };
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

  // 获取图片目录内容
  async getImages(): Promise<string[]> {
    try {
      const response = await this.getHttpAdapter().get<any>(
        `${this.environment.apiBase}/repos/${this.environment.repoPath}/contents/images`,
        { 'Authorization': `Bearer ${this.environment.token}` }
      );
      
      // 检查响应是否为数组
      const items = Array.isArray(response) ? response : [];
      
      return items
        .filter((item: any) => item.type === 'file' && isImageFile(item.name))
        .map((item: any) => item.name);
    } catch (error) {
      console.error('Error loading images:', error);
      return [];
    }
  }

  // 生成图片的完整URL
  getImageUrl(imagePath: string): string {
    return getImageUrl(imagePath, this.environment.blobUrlPrefix);
  }

  // 获取图片的Base64数据URL
  async getImageDataUrl(imagePath: string): Promise<string> {
    try {
      let finalPath: string;
      
      // 如果是AtomGit的绝对URL，提取路径
      if (imagePath.includes(`${this.environment.rawUrlPrefix}/images/`)) {
        const urlParts = imagePath.split('/raw/main/');
        if (urlParts.length > 1) {
          finalPath = urlParts[1];
        } else {
          finalPath = imagePath;
        }
      } else {
        // 规范化路径
        const cleanPath = normalizePath(imagePath);
        finalPath = cleanPath.startsWith('images/') ? cleanPath : `images/${cleanPath}`;
      }
      
      // 使用contents API获取图片内容
      const response = await this.getHttpAdapter().get<any>(
        `${this.environment.apiBase}/repos/${this.environment.repoPath}/contents/${finalPath}`,
        { 'Authorization': `Bearer ${this.environment.token}` }
      );
      
      // 检查不同的响应格式
      let base64Content = '';
      if (response.content) {
        base64Content = response.content;
      } else if (response.data && response.data.content) {
        base64Content = response.data.content;
      } else if (typeof response === 'string') {
        base64Content = response;
      } else {
        throw new Error('No content found in response');
      }
      
      const mimeType = getMimeType(imagePath);
      return `data:${mimeType};base64,${base64Content}`;
    } catch (error) {
      console.error('Error loading image:', error);
      // 返回一个占位符图片
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
    }
  }

  // 生成链接的完整URL
  getLinkUrl(linkPath: string, categoryPath?: string): string {
    return getLinkUrl(
      linkPath, 
      this.environment.rawUrlPrefix, 
      categoryPath,
      typeof window !== 'undefined' ? window.location.origin : undefined
    );
  }
}
