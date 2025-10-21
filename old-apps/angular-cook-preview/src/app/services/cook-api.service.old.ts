import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, forkJoin, of, switchMap, catchError } from 'rxjs';
import { RepoItem, RepoContent, RecipeCategory, Recipe } from '../models/repo.models';
import { isProduction } from '../app.config';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookApiService {
  private readonly API_BASE = environment.apiBase;
  private readonly TOKEN = environment.token;
  private readonly REPO_OWNER = environment.repoOwner;
  private readonly REPO_NAME = environment.repoName;

  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.TOKEN}`
  });

  constructor(private http: HttpClient) {}

  // 接口1: 获取仓库信息 - 完全按照您的index.html
  getRepoInfo(): Observable<any> {
    return this.http.get(
      `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}`,
      { headers: this.headers }
    );
  }

  // 接口2: 获取文件内容 - 完全按照您的index.html
  getFileContent(path: string): Observable<RepoContent> {
    return this.http.get<RepoContent>(
      `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${path}`,
      { headers: this.headers }
    );
  }

  // 接口3: 获取目录树 - 使用您index.html中的recursive参数
  getRepoTree(): Observable<RepoItem[]> {
    const params = new URLSearchParams({
      recursive: 'true'
    });
    
    return this.http.get<RepoItem[]>(
      `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/trees/main?${params}`,
      { headers: this.headers }
    );
  }

  // 获取所有菜谱分类 - 基于接口3的结果
  getRecipeCategories(): Observable<RecipeCategory[]> {
    return this.getRepoTree().pipe(
      map(items => {
        // 过滤出中文菜名目录，完全按照您777的结果
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
      })
    );
  }

  // 获取指定分类下的菜谱列表 - 使用contents API，参照您的index.html
  getRecipesByCategory(category: RecipeCategory): Observable<Recipe[]> {
    return this.http.get<any>(
      `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${category.path}`,
      { headers: this.headers }
    ).pipe(
      switchMap(response => {
        // 检查响应是否为数组，如果不是则从entries字段获取
        const items = Array.isArray(response) ? response : (response.entries || []);
        
        // 查找README.md文件
        const readmeFile = items.find((item: { name: string; }) => item.name === 'README.md');
        
        if (readmeFile) {
          // 如果有README.md文件，获取其内容并解析
          return this.getFileContent(readmeFile.path).pipe(
            map(readmeContent => {
              // 正确解码Base64编码的UTF-8内容
              const content = readmeContent.content ? this.decodeBase64UTF8(readmeContent.content) : '';
              return this.parseReadmeContent(content, category.path);
            })
          );
        } else {
          // 如果没有README.md，返回其他.md文件（排除README.md）
          return of(items
            .filter((item: { type: string; name: string; }) => item.type === 'file' && item.name.endsWith('.md') && item.name !== 'README.md')
            .map((item: { name: string; path: string; sha: string; }) => ({
              name: item.name.replace('.md', ''),
              path: item.path,
              sha: item.sha
            }))
          );
        }
      })
    );
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
    
    // 按名称排序，与其他地方保持一致
    return recipes.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  }

  // 获取菜谱详细内容 - 使用接口2
  getRecipeDetail(recipe: Recipe): Observable<Recipe> {
    return this.getFileContent(recipe.path).pipe(
      map(content => ({
        ...recipe,
        content: content.content ? this.decodeBase64UTF8(content.content) : ''
      }))
    );
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
  getFullRecipeData(): Observable<RecipeCategory[]> {
    return this.getRecipeCategories().pipe(
      switchMap(categories => {
        if (categories.length === 0) {
          return of([]);
        }
        
        const categoryRequests = categories.map(category =>
          this.getRecipesByCategory(category).pipe(
            map(recipes => ({ ...category, recipes }))
          )
        );
        
        return forkJoin(categoryRequests);
      })
    );
  }

  // 判断是否为中文目录
  private isChineseDirectory(path: string): boolean {
    return /[\u4e00-\u9fa5]/.test(path);
  }

  // 获取图片目录内容 - 使用contents API，参照您的index.html
  getImages(): Observable<string[]> {
    return this.http.get<any>(
      `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/images`,
      { headers: this.headers }
    ).pipe(
      map(response => {
        
        // 检查响应是否为数组
        const items = Array.isArray(response) ? response : [];
        
        return items
          .filter(item => item.type === 'file' && this.isImageFile(item.name))
          .map(item => item.name);
      })
    );
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
    // 这里假设所有相对路径都是相对于仓库根目录的
    // 如果有 ../ 需要根据当前文件位置进行解析
    // 为了简化，我们直接移除 ../ 前缀
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
    const blobUrl = `${environment.blobUrlPrefix}/${finalPath}`;
    
    return blobUrl;
  }

  // 获取图片的Base64数据URL
  getImageDataUrl(imagePath: string): Observable<string> {
    let finalPath: string;
    
    // 如果是AtomGit的绝对URL，提取路径
    if (imagePath.includes(`${environment.rawUrlPrefix}/images/`)) {
      // 从绝对URL中提取相对路径
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
    const apiUrl = `${this.API_BASE}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${finalPath}`;
    
    return this.http.get<any>(apiUrl, { headers: this.headers }).pipe(
      map(response => {
        
        // 检查不同的响应格式
        let base64Content = '';
        if (response.content) {
          base64Content = response.content;
        } else if (response.data && response.data.content) {
          base64Content = response.data.content;
        } else if (typeof response === 'string') {
          // 如果响应直接是Base64字符串
          base64Content = response;
        } else {
          throw new Error('No content found in response');
        }
        
        const mimeType = this.getMimeType(imagePath);
        const dataUrl = `data:${mimeType};base64,${base64Content}`;
        return dataUrl;
      }),
      catchError((error: any) => {
        // 返回一个占位符图片
        return of('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==');
      })
    );
  }

  // 直接下载图片并转换为base64
  private downloadImageAsBase64(imagePath: string): Observable<string> {
    let rawUrl: string;
    
    // 如果是AtomGit的绝对URL，直接使用
    if (imagePath.includes(`${environment.rawUrlPrefix}/images/`)) {
      rawUrl = imagePath;
    } else {
      // 否则构建URL
      const cleanPath = this.normalizePath(imagePath);
      const finalPath = cleanPath.startsWith('images/') ? cleanPath : `images/${cleanPath}`;
      rawUrl = `${environment.rawUrlPrefix}/${finalPath}`;
    }
    
    
    return this.http.get(rawUrl, { 
      responseType: 'blob',
      headers: {
        'Accept': 'image/*'
      }
    }).pipe(
      map(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
          };
          reader.onerror = () => reject(new Error('Failed to convert blob to base64'));
          reader.readAsDataURL(blob);
        });
      }),
      switchMap(promise => promise),
      catchError((error: any) => {
        // 返回一个占位符图片
        return of('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==');
      })
    );
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
    if(url.includes('.md')){
       return `${location.origin}/cook-preview/${isProduction ? '#/' : '' }recipe/${cleanPath.replace('.md', '')}`;
    }
    return url;
  }
}