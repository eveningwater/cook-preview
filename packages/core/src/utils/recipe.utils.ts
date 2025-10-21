import { Recipe, RecipeCategory } from '../models/repo.models';

/**
 * 菜谱相关工具函数
 */
export class RecipeUtils {
  /**
   * 过滤掉README文件的菜谱
   */
  static filterNonReadmeRecipes(recipes: Recipe[]): Recipe[] {
    return recipes.filter(recipe => !recipe.name.includes('README'));
  }

  /**
   * 按名称排序菜谱（中文排序）
   */
  static sortRecipesByName(recipes: Recipe[]): Recipe[] {
    return recipes.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  }

  /**
   * 查找菜谱索引
   */
  static findRecipeIndex(recipes: Recipe[], recipeName: string): number {
    // 先尝试精确匹配
    let index = recipes.findIndex(recipe => recipe.name === recipeName);
    
    // 如果找不到精确匹配，尝试模糊匹配
    if (index === -1) {
      index = recipes.findIndex(recipe => 
        recipe.name.includes(recipeName) || recipeName.includes(recipe.name)
      );
    }
    
    return index;
  }

  /**
   * 创建临时菜谱对象
   */
  static createTempRecipe(categoryPath: string, recipeName: string): Recipe {
    const recipePath = `${categoryPath}/${recipeName}.md`;
    return {
      name: recipeName,
      path: recipePath,
      sha: ''
    };
  }

  /**
   * 创建临时分类对象
   */
  static createTempCategory(categoryPath: string): RecipeCategory {
    return {
      name: categoryPath,
      path: categoryPath,
      sha: ''
    };
  }

  /**
   * 获取分类图标映射
   */
  static getCategoryIconMap(): { [key: string]: string } {
    return {
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
  }

  /**
   * 根据分类路径获取图标
   */
  static getCategoryIcon(categoryPath: string): string {
    const iconMap = this.getCategoryIconMap();
    return iconMap[categoryPath] || 'restaurant';
  }

  /**
   * 检查是否有上一个菜谱
   */
  static hasPreviousRecipe(currentIndex: number): boolean {
    return currentIndex > 0;
  }

  /**
   * 检查是否有下一个菜谱
   */
  static hasNextRecipe(currentIndex: number, totalCount: number): boolean {
    return currentIndex < totalCount - 1;
  }

  /**
   * 获取上一个菜谱
   */
  static getPreviousRecipe(recipes: Recipe[], currentIndex: number): Recipe | null {
    if (this.hasPreviousRecipe(currentIndex)) {
      return recipes[currentIndex - 1];
    }
    return null;
  }

  /**
   * 获取下一个菜谱
   */
  static getNextRecipe(recipes: Recipe[], currentIndex: number): Recipe | null {
    if (this.hasNextRecipe(currentIndex, recipes.length)) {
      return recipes[currentIndex + 1];
    }
    return null;
  }
}
