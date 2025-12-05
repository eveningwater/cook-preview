import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookApiService } from '../../../services/cook-api.service';
import { RecipeCategory } from '@cook/core';
import { RecipeCategoryComponent } from '../recipe-category/recipe-category';
import { NavigationComponent } from '../navigation/navigation';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RecipeCategoryComponent, NavigationComponent, SearchComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private cookApiService = inject(CookApiService);

  categories = signal<RecipeCategory[]>([]);
  filteredCategories = signal<RecipeCategory[]>([]);
  loading = signal(true);
  error = signal('');
  activeCategory = signal<string | null>(null);
  searchTerm = signal('');

  ngOnInit() {
    this.loadRecipeData();
  }

  private async loadRecipeData() {
    this.loading.set(true);
    this.error.set('');

    try {
      // 统一在 base-cook-api.service.ts 中处理，前端只负责调用和显示
      const categories = await this.cookApiService.getRecipeCategories();
      
      this.categories.set(categories);
      this.filteredCategories.set([...categories]);
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error loading recipe data:', err);
      this.error.set('加载菜谱数据失败，请稍后重试');
      this.loading.set(false);
    }
  }

  retryLoad() {
    this.loadRecipeData();
  }

  onCategorySelected(category: RecipeCategory) {
    this.activeCategory.set(category.name);
    this.filteredCategories.set([category]);
  }

  onShowAll() {
    this.activeCategory.set(null);
    this.filteredCategories.set([...this.categories()]);
  }

  onSearchChanged(term: string) {
    this.searchTerm.set(term);
    this.applyFilters();
  }

  private applyFilters() {
    if (this.activeCategory()) {
      // 如果选择了特定分类，只在该分类内搜索
      const activeCat = this.categories().find(cat => cat.name === this.activeCategory());
      if (activeCat) {
        const filteredCat = this.filterRecipes(activeCat);
        this.filteredCategories.set(filteredCat.recipes && filteredCat.recipes.length > 0 ? [filteredCat] : []);
      }
    } else {
      // 在所有分类中搜索，过滤掉空的分类
      this.filteredCategories.set(this.categories()
        .map(cat => this.filterRecipes(cat))
        .filter(cat => cat.recipes && cat.recipes.length > 0));
    }
  }

  private filterRecipes(category: RecipeCategory): RecipeCategory {
    if (!this.searchTerm().trim()) {
      return category;
    }

    const searchTermLower = this.searchTerm().toLowerCase();
    
    // 检查分类名称是否匹配
    const categoryMatches = category.name.toLowerCase().includes(searchTermLower);
    
    // 按菜谱名称搜索
    const filteredRecipes = category.recipes?.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTermLower)
    ) || [];

    // 如果分类名称匹配，显示该分类下的所有菜谱
    if (categoryMatches) {
      return {
        ...category,
        recipes: category.recipes || [],
        isExpanded: true, // 展开匹配的分类
        hasSearchMatch: true
      };
    }

    // 如果分类名称不匹配，但该分类下有匹配的菜谱，则显示过滤后的菜谱
    if (filteredRecipes.length > 0) {
      return {
        ...category,
        recipes: filteredRecipes,
        isExpanded: true, // 展开有匹配菜谱的分类
        hasSearchMatch: true
      };
    }

    // 如果都不匹配，返回空分类
    return {
      ...category,
      recipes: [],
      isExpanded: false,
      hasSearchMatch: false
    };
  }

  getTotalRecipes(): number {
    return this.filteredCategories().reduce((total, category) => {
      return total + (category.recipes?.length || 0);
    }, 0);
  }
}