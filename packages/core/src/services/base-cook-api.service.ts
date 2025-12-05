import { RepoItem, RepoContent, RecipeCategory, Recipe } from '../models/repo.models';
import { Environment } from '../config/environment';
import { decodeBase64UTF8, isChineseDirectory, isImageFile, getMimeType } from '../utils/text.utils';
import { normalizePath, getImageUrl, getLinkUrl } from '../utils/path.utils';
import { parseReadmeContent, extractImagesFromMarkdown } from '../utils/markdown.utils';
import { RecipeUtils } from '../utils/recipe.utils';

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
      `${this.environment.apiBase}/api/v5/repos/${this.environment.repoOwner}/${this.environment.repoName}?access_token=${this.environment.token}`,
      { 'Accept': 'application/json' }
    );
    return response;
  }

  // 接口2: 获取文件内容（统一处理返回格式）
  async getFileContent(path: string): Promise<RepoContent> {
    const response = await this.getHttpAdapter().get<any>(
      `${this.environment.apiBase}/api/v5/repos/${this.environment.repoOwner}/${this.environment.repoName}/contents/${path}?access_token=${this.environment.token}`,
      { 'Accept': 'application/json' }
    );
    
    // 统一处理返回格式，确保字段完整
    return {
      type: response.type || '',
      encoding: response.encoding,
      size: response.size || 0,
      name: response.name || '',
      path: response.path || path,
      content: response.content, // Base64 编码的内容
      sha: response.sha || '',
      url: response.url,
      html_url: response.html_url,
      download_url: response.download_url,
      _links: response._links
    };
  }

  // 接口3: 获取目录树
  async getRepoTree(): Promise<RepoItem[]> {
    // 构建查询参数
    const params = new URLSearchParams({
      access_token: this.environment.token,
      recursive: '1', // API 要求 integer 类型，1 表示递归
      per_page: '10000' // 每页最大数量，确保获取完整数据
    });
    
    const response = await this.getHttpAdapter().get<any>(
      `${this.environment.apiBase}/api/v5/repos/${this.environment.repoOwner}/${this.environment.repoName}/git/trees/main?${params.toString()}`,
      { 'Accept': 'application/json' }
    );

    // 新 API 返回格式：{ tree: [...] }
    if (response.tree && Array.isArray(response.tree)) {
      return response.tree;
    }
    // 兼容：如果直接返回数组
    if (Array.isArray(response)) {
      return response;
    }
    // 兼容其他可能的响应格式
    return response.items || response.entries || [];
  }

  // 获取所有菜谱分类（统一处理，返回排序后的数据）
  async getRecipeCategories(): Promise<RecipeCategory[]> {
    const items = await this.getRepoTree();
    
    // 从 tree 结果中提取中文分类目录（type === 'tree'）
    // 新 API 的递归树接口只返回目录结构，不包含子目录中的文件
    const chineseDirectories = items
      .filter((item: RepoItem) => 
        item.type === 'tree' && 
        item.path && 
        !item.path.startsWith('.') &&
        item.path !== 'images' &&
        isChineseDirectory(item.path)
      )
      .map((item: RepoItem) => item.path);
    
    // 为每个目录获取菜谱列表
    const categoriesWithRecipes = await Promise.all(
      chineseDirectories.map(async (dirName: string) => {
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
            recipes: RecipeUtils.sortRecipesByName(recipes)
          };
        } catch (error) {
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

  // 获取指定分类下的菜谱列表（统一处理返回格式）
  async getRecipesByCategory(category: RecipeCategory): Promise<Recipe[]> {
    try {
      const url = `${this.environment.apiBase}/api/v5/repos/${this.environment.repoOwner}/${this.environment.repoName}/contents/${category.path}?access_token=${this.environment.token}`;
      const response = await this.getHttpAdapter().get<any>(
        url,
        { 'Accept': 'application/json' }
      );
      
      // 新 API 返回格式：目录内容返回数组，文件返回单个对象
      // 检查响应是否为数组，如果不是则从entries字段获取（兼容旧格式）
      const items = Array.isArray(response) ? response : (response.entries || []);
      
      // 查找README.md文件
      const readmeFile = items.find((item: any) => 
        item.name === 'README.md' && (item.type === 'file' || item.type === 'blob')
      );
      
      if (readmeFile) {
        // 如果有README.md文件，获取其内容并解析
        const readmeContent = await this.getFileContent(readmeFile.path);
        const content = readmeContent.content ? decodeBase64UTF8(readmeContent.content) : '';
        return parseReadmeContent(content, category.path);
      } else {
        // 如果没有README.md，返回其他.md文件（排除README.md）
        return items
          .filter((item: any) => 
            (item.type === 'file' || item.type === 'blob') && 
            item.name && 
            item.name.endsWith('.md') && 
            item.name !== 'README.md'
          )
          .map((item: any) => ({
            name: item.name.replace('.md', ''),
            path: item.path || `${category.path}/${item.name}`,
            sha: item.sha || ''
          }));
      }
    } catch (error) {
      return [];
    }
  }

  // 获取菜谱详细内容（统一处理，返回完整的菜谱数据）
  async getRecipeDetail(recipe: Recipe): Promise<Recipe> {
    try {
      const fileContent = await this.getFileContent(recipe.path);
      
      // 解码 Base64 内容
      const markdownContent = fileContent.content ? decodeBase64UTF8(fileContent.content) : '';
      
      // 提取图片
      const images = extractImagesFromMarkdown(markdownContent);
      
      // 返回完整的菜谱数据
      return {
        name: recipe.name,
        path: recipe.path,
        sha: fileContent.sha || recipe.sha, // 使用文件内容中的 sha，如果没有则使用原来的
        content: markdownContent,
        images
      };
    } catch (error) {
      throw error;
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

  // 获取图片目录内容
  async getImages(): Promise<string[]> {
    try {
      const response = await this.getHttpAdapter().get<any>(
        `${this.environment.apiBase}/api/v5/repos/${this.environment.repoOwner}/${this.environment.repoName}/contents/images?access_token=${this.environment.token}`,
        { 'Accept': 'application/json' }
      );
      
      // 检查响应是否为数组
      const items = Array.isArray(response) ? response : [];
      
      return items
        .filter((item: any) => item.type === 'file' && isImageFile(item.name))
        .map((item: any) => item.name);
    } catch (error) {
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
        `${this.environment.apiBase}/api/v5/repos/${this.environment.repoOwner}/${this.environment.repoName}/contents/${finalPath}?access_token=${this.environment.token}`,
        { 'Accept': 'application/json' }
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
