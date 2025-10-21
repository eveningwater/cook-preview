import { BaseRecipeDetailService, Recipe, RecipeCategory } from '@cook/core';
import { cookApiService } from './cook-api.service';
import { markdownService } from './markdown.service';

/**
 * React版本的菜谱详情服务
 */
export class ReactRecipeDetailService extends BaseRecipeDetailService {
  constructor() {
    super({
      onRecipeLoaded: () => {
        // React中通过状态管理来处理
      },
      onError: () => {
        // React中通过状态管理来处理
      },
      onLoadingChange: () => {
        // React中通过状态管理来处理
      }
    });
  }

  /**
   * 实现抽象方法：获取分类菜谱列表
   */
  protected async getRecipesByCategory(category: RecipeCategory): Promise<Recipe[]> {
    return await cookApiService.getRecipesByCategory(category);
  }

  /**
   * 实现抽象方法：获取菜谱详情
   */
  protected async getRecipeDetail(recipe: Recipe): Promise<Recipe> {
    return await cookApiService.getRecipeDetail(recipe);
  }

  /**
   * 重写处理菜谱内容方法，使用React的markdown服务
   */
  protected async processRecipeContent(content: string, categoryPath: string): Promise<string> {
    const result = await markdownService.transformWithBase64Images(content, categoryPath);
    return result;
  }
}

export const recipeDetailService = new ReactRecipeDetailService();
