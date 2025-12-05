import { Injectable, signal, computed, inject } from '@angular/core';
import { BaseRecipeDetailService, Recipe, RecipeCategory } from '@cook/core';
import { CookApiService } from './cook-api.service';
import { AngularMarkdownService } from './markdown.service';

/**
 * Angular版本的菜谱详情服务
 * 继承核心业务逻辑，使用Angular Signals
 */
@Injectable({
  providedIn: 'root'
})
export class AngularRecipeDetailService extends BaseRecipeDetailService {
  private cookApiService = inject(CookApiService);
  private markdownService = inject(AngularMarkdownService);

  // Angular Signals 响应式状态
  public recipeSignal = signal<Recipe | null>(null);
  public loadingSignal = signal<boolean>(true);
  public errorSignal = signal<string | null>(null);
  public currentCategorySignal = signal<string>('');
  public currentRecipeIndexSignal = signal<number>(-1);
  public allRecipesSignal = signal<Recipe[]>([]);
  
  // 计算属性
  public hasPreviousSignal = computed(() => this.currentRecipeIndexSignal() > 0);
  public hasNextSignal = computed(() => this.currentRecipeIndexSignal() < this.allRecipesSignal().length - 1);

  constructor() {
    super({
      onRecipeLoaded: (recipe) => {
        this.recipeSignal.set(recipe);
      },
      onError: (error) => {
        this.errorSignal.set(error);
      },
      onLoadingChange: (loading) => {
        this.loadingSignal.set(loading);
      }
    });
  }

  /**
   * 实现抽象方法：获取分类菜谱列表
   */
  protected async getRecipesByCategory(category: RecipeCategory): Promise<Recipe[]> {
    const response = await this.cookApiService.getRecipesByCategory(category);
    return response.recipes;
  }

  /**
   * 实现抽象方法：获取菜谱详情
   */
  protected async getRecipeDetail(recipe: Recipe): Promise<Recipe> {
    return await this.cookApiService.getRecipeDetail(recipe);
  }

  /**
   * 重写处理菜谱内容方法，使用Angular的markdown服务
   */
  protected override async processRecipeContent(content: string, categoryPath: string): Promise<string> {
    try {
      return await this.markdownService.transformWithBase64Images(content, categoryPath);
    } catch (error) {
      console.error('Error processing recipe content:', error);
      return this.markdownService.toHtml(content, categoryPath);
    }
  }

  /**
   * 重写状态更新方法，同步到Angular Signals
   */
  protected override setLoading(loading: boolean): void {
    super.setLoading(loading);
    this.loadingSignal.set(loading);
  }

  protected override setError(error: string | null): void {
    super.setError(error);
    this.errorSignal.set(error);
  }

  /**
   * 加载菜谱详情（重写以同步Angular状态）
   */
  override async loadRecipeDetail(categoryPath: string, recipeName: string): Promise<void> {
    this.currentCategorySignal.set(categoryPath);
    await super.loadRecipeDetail(categoryPath, recipeName);
    
    // 同步状态到Angular Signals
    const state = this.getState();
    this.recipeSignal.set(state.recipe);
    this.currentRecipeIndexSignal.set(state.currentRecipeIndex);
    this.allRecipesSignal.set(state.allRecipes);
  }

  /**
   * 获取上一个菜谱
   */
  override getPreviousRecipe(): Recipe | null {
    const currentIndex = this.currentRecipeIndexSignal();
    const recipes = this.allRecipesSignal();
    if (currentIndex > 0) {
      return recipes[currentIndex - 1];
    }
    return null;
  }

  /**
   * 获取下一个菜谱
   */
  override getNextRecipe(): Recipe | null {
    const currentIndex = this.currentRecipeIndexSignal();
    const recipes = this.allRecipesSignal();
    if (currentIndex < recipes.length - 1) {
      return recipes[currentIndex + 1];
    }
    return null;
  }
}
