import { Recipe, RecipeCategory } from '../models/repo.models';

export interface RecipeDetailState {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
  currentCategory: string;
  currentRecipeIndex: number;
  allRecipes: Recipe[];
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface RecipeDetailCallbacks {
  onRecipeLoaded?: (recipe: Recipe) => void;
  onError?: (error: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * 菜谱详情服务基类
 * 提供菜谱详情页面的通用业务逻辑
 */
export abstract class BaseRecipeDetailService {
  protected state: RecipeDetailState;
  protected callbacks: RecipeDetailCallbacks;

  constructor(callbacks: RecipeDetailCallbacks = {}) {
    this.callbacks = callbacks;
    this.state = {
      recipe: null,
      loading: true,
      error: null,
      currentCategory: '',
      currentRecipeIndex: -1,
      allRecipes: [],
      hasPrevious: false,
      hasNext: false
    };
  }

  /**
   * 获取当前状态
   */
  getState(): RecipeDetailState {
    return { ...this.state };
  }

  /**
   * 加载菜谱详情
   */
  async loadRecipeDetail(categoryPath: string, recipeName: string): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      // 先加载分类的所有菜谱
      await this.loadCategoryRecipes(categoryPath, recipeName);
      
      // 然后加载当前菜谱详情
      await this.loadSingleRecipe(categoryPath, recipeName);
    } catch (error) {
      this.setError('加载菜谱详情失败，请稍后重试');
      console.error('Error loading recipe detail:', error);
    }
  }

  /**
   * 加载分类的所有菜谱
   */
  protected async loadCategoryRecipes(categoryPath: string, recipeName: string): Promise<void> {
    try {
      const category: RecipeCategory = {
        name: categoryPath,
        path: categoryPath,
        sha: ''
      };

      const recipes = await this.getRecipesByCategory(category);
      
      // 过滤掉README.md文件并按名称排序
      this.state.allRecipes = recipes
        .filter(recipe => !recipe.name.includes('README'))
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
      
      this.state.currentRecipeIndex = this.state.allRecipes.findIndex(recipe => recipe.name === recipeName);
      
      // 如果找不到精确匹配，尝试模糊匹配
      if (this.state.currentRecipeIndex === -1) {
        this.state.currentRecipeIndex = this.state.allRecipes.findIndex(recipe => 
          recipe.name.includes(recipeName) || recipeName.includes(recipe.name)
        );
      }
      
      this.updateNavigationState();
    } catch (error) {
      throw new Error('加载分类失败，请稍后重试');
    }
  }

  /**
   * 加载单个菜谱
   */
  protected async loadSingleRecipe(categoryPath: string, recipeName: string): Promise<void> {
    const recipePath = `${categoryPath}/${recipeName}.md`;
    
    const tempRecipe: Recipe = {
      name: recipeName,
      path: recipePath,
      sha: ''
    };

    try {
      this.state.recipe = await this.getRecipeDetail(tempRecipe);
      this.state.currentCategory = categoryPath;
      
      // 处理markdown内容
      if (this.state.recipe && this.state.recipe.content) {
        this.state.recipe.content = await this.processRecipeContent(
          this.state.recipe.content, 
          categoryPath
        );
      }
      
      this.setLoading(false);
      this.callbacks.onRecipeLoaded?.(this.state.recipe);
    } catch (error) {
      throw new Error('加载菜谱详情失败，请稍后重试');
    }
  }

  /**
   * 处理菜谱内容（markdown转换等）
   */
  protected async processRecipeContent(content: string, _categoryPath: string): Promise<string> {
    // 默认实现，子类可以重写
    return content;
  }

  /**
   * 更新导航状态
   */
  protected updateNavigationState(): void {
    this.state.hasPrevious = this.state.currentRecipeIndex > 0;
    this.state.hasNext = this.state.currentRecipeIndex < this.state.allRecipes.length - 1;
  }

  /**
   * 获取分类图标
   */
  getCategoryIcon(categoryPath: string): string {
    const iconMap: { [key: string]: string } = {
      '主食': 'restaurant',
      '凉拌': 'eco',
      '卤菜': 'local_dining',
      '早餐': 'wb_sunny',
      '汤': 'soup_kitchen',
      '炒菜': 'restaurant_menu',
      '炖菜': 'local_pizza',
      '炸品': 'fastfood',
      '烤类': 'local_fire_department',
      '烫菜': 'hot_tub',
      '煮锅': 'kitchen',
      '砂锅菜': 'ramen_dining',
      '蒸菜': 'kitchen',
      '配料': 'spa',
      '饮品': 'local_cafe'
    };
    return iconMap[categoryPath] || 'restaurant';
  }

  /**
   * 获取上一个菜谱
   */
  getPreviousRecipe(): Recipe | null {
    if (this.state.hasPrevious) {
      return this.state.allRecipes[this.state.currentRecipeIndex - 1];
    }
    return null;
  }

  /**
   * 获取下一个菜谱
   */
  getNextRecipe(): Recipe | null {
    if (this.state.hasNext) {
      return this.state.allRecipes[this.state.currentRecipeIndex + 1];
    }
    return null;
  }

  /**
   * 设置加载状态
   */
  protected setLoading(loading: boolean): void {
    this.state.loading = loading;
    this.callbacks.onLoadingChange?.(loading);
  }

  /**
   * 设置错误状态
   */
  protected setError(error: string | null): void {
    this.state.error = error;
    if (error) {
      this.callbacks.onError?.(error);
    }
  }

  /**
   * 抽象方法：获取分类菜谱列表
   */
  protected abstract getRecipesByCategory(category: RecipeCategory): Promise<Recipe[]>;

  /**
   * 抽象方法：获取菜谱详情
   */
  protected abstract getRecipeDetail(recipe: Recipe): Promise<Recipe>;
}
