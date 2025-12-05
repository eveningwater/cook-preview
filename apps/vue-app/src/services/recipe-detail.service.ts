import { ref, computed } from 'vue';
import { BaseRecipeDetailService, Recipe, RecipeCategory } from '@cook/core';
import { cookApiService } from './cook-api.service';
import { markdownService } from './markdown.service';

/**
 * Vue版本的菜谱详情服务
 * 继承核心业务逻辑，使用Vue的响应式系统
 */
export class VueRecipeDetailService extends BaseRecipeDetailService {
  // Vue响应式状态
  public recipeRef = ref<Recipe | null>(null);
  public loadingRef = ref<boolean>(true);
  public errorRef = ref<string | null>(null);
  public currentCategoryRef = ref<string>('');
  public currentRecipeIndexRef = ref<number>(-1);
  public allRecipesRef = ref<Recipe[]>([]);
  
  // 计算属性
  public hasPreviousRef = computed(() => this.currentRecipeIndexRef.value > 0);
  public hasNextRef = computed(() => this.currentRecipeIndexRef.value < this.allRecipesRef.value.length - 1);

  constructor() {
    super({
      onRecipeLoaded: (recipe) => {
        this.recipeRef.value = recipe;
      },
      onError: (error) => {
        this.errorRef.value = error;
      },
      onLoadingChange: (loading) => {
        this.loadingRef.value = loading;
      }
    });
  }

  /**
   * 实现抽象方法：获取分类菜谱列表
   */
  protected async getRecipesByCategory(category: RecipeCategory): Promise<Recipe[]> {
    const response = await cookApiService.getRecipesByCategory(category);
    return response.recipes;
  }

  /**
   * 实现抽象方法：获取菜谱详情
   */
  protected async getRecipeDetail(recipe: Recipe): Promise<Recipe> {
    return await cookApiService.getRecipeDetail(recipe);
  }

  /**
   * 重写处理菜谱内容方法，使用Vue的markdown服务
   */
  protected async processRecipeContent(content: string, categoryPath: string): Promise<string> {
    try {
      return await markdownService.transformWithBase64Images(content, categoryPath);
    } catch (error) {
      console.error('Error processing recipe content:', error);
      return markdownService.toHtml(content, categoryPath);
    }
  }

  /**
   * 重写状态更新方法，同步到Vue响应式状态
   */
  protected setLoading(loading: boolean): void {
    super.setLoading(loading);
    this.loadingRef.value = loading;
  }

  protected setError(error: string | null): void {
    super.setError(error);
    this.errorRef.value = error;
  }

  /**
   * 加载菜谱详情（重写以同步Vue状态）
   */
  async loadRecipeDetail(categoryPath: string, recipeName: string): Promise<void> {
    this.currentCategoryRef.value = categoryPath;
    await super.loadRecipeDetail(categoryPath, recipeName);
    
    // 同步状态到Vue响应式变量
    const state = this.getState();
    this.recipeRef.value = state.recipe;
    this.currentRecipeIndexRef.value = state.currentRecipeIndex;
    this.allRecipesRef.value = state.allRecipes;
  }

  /**
   * 获取上一个菜谱
   */
  getPreviousRecipe(): Recipe | null {
    if (this.hasPreviousRef.value) {
      return this.allRecipesRef.value[this.currentRecipeIndexRef.value - 1];
    }
    return null;
  }

  /**
   * 获取下一个菜谱
   */
  getNextRecipe(): Recipe | null {
    if (this.hasNextRef.value) {
      return this.allRecipesRef.value[this.currentRecipeIndexRef.value + 1];
    }
    return null;
  }
}

export const recipeDetailService = new VueRecipeDetailService();
