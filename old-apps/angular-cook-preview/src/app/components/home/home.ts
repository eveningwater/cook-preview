import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, forkJoin, catchError, of } from 'rxjs';
import { CookApiService } from '../../services/cook-api.service';
import { RecipeCategoryComponent } from '../recipe-category/recipe-category';
import { NavigationComponent } from '../navigation/navigation';
import { SearchComponent } from '../search/search';
import { RecipeCategory, Recipe } from '../../models/repo.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RecipeCategoryComponent, NavigationComponent, SearchComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  categories: RecipeCategory[] = [];
  filteredCategories: RecipeCategory[] = [];
  loading = true;
  error: string | null = null;
  activeCategory: string | null = null;
  searchTerm = '';

  constructor(private cookApiService: CookApiService) {}

  ngOnInit() {
    this.loadRecipeData();
  }

  private loadRecipeData() {
    this.loading = true;
    this.error = null;

    // 完全按照您的index.html方式：先调用trees/main?recursive=true获取完整目录结构
    this.cookApiService.getRepoTree().subscribe({
      next: (items) => {
        
        // 从recursive结果中提取中文分类目录
        const categoryMap = new Map<string, any[]>();
        
        items.forEach(item => {
          if (item.type === 'blob' && 
              item.path.endsWith('.md') && 
              !item.path.startsWith('.') &&
              !item.path.startsWith('images/') &&
              !item.path.endsWith('/README.md')) {
            
            // 提取分类名（路径的第一部分）
            const pathParts = item.path.split('/');
            if (pathParts.length >= 2) {
              const categoryName = pathParts[0];
              
              // 检查是否为中文分类
              if (this.isChineseDirectory(categoryName)) {
                if (!categoryMap.has(categoryName)) {
                  categoryMap.set(categoryName, []);
                }
                categoryMap.get(categoryName)!.push(item);
              }
            }
          }
        });
        
        
        // 转换为分类数组
        const categories = Array.from(categoryMap.entries()).map(([categoryName, files]) => ({
          name: categoryName,
          path: categoryName,
          sha: '', // 在recursive模式下不需要SHA
          recipes: files
            .filter(file => !file.path.endsWith('/README.md')) // 过滤掉README.md文件
            .map(file => ({
              name: file.path.replace('.md', '').replace(`${categoryName}/`, ''),
              path: file.path,
              sha: file.sha
            }))
            .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')) // 按名称排序，与详情页保持一致
        }));
        
        
        // 直接设置分类数据，不预加载菜谱内容
        this.categories = categories;
        this.filteredCategories = [...categories];
        this.loading = false;
      },
      error: (err) => {
        this.error = '加载菜谱数据失败，请稍后重试';
        this.loading = false;
      }
    });
  }

  private isChineseDirectory(path: string): boolean {
    return /[\u4e00-\u9fa5]/.test(path);
  }


  retryLoad() {
    this.loadRecipeData();
  }

  onCategorySelected(category: RecipeCategory) {
    this.activeCategory = category.name;
    this.filteredCategories = [category];
  }

  onShowAll() {
    this.activeCategory = null;
    this.filteredCategories = [...this.categories];
  }

  onSearchChanged(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  private applyFilters() {
    
    if (this.activeCategory) {
      // 如果选择了特定分类，只在该分类内搜索
      const activeCat = this.categories.find(cat => cat.name === this.activeCategory);
      if (activeCat) {
        const filteredCat = this.filterRecipes(activeCat);
        this.filteredCategories = filteredCat.recipes && filteredCat.recipes.length > 0 ? [filteredCat] : [];
      }
    } else {
      // 在所有分类中搜索，过滤掉空的分类
      this.filteredCategories = this.categories
        .map(cat => this.filterRecipes(cat))
        .filter(cat => cat.recipes && cat.recipes.length > 0);
    }
    
  }

  private filterRecipes(category: RecipeCategory): RecipeCategory {
    if (!this.searchTerm.trim()) {
      return category;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    
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
    return this.filteredCategories.reduce((total, category) => {
      return total + (category.recipes?.length || 0);
    }, 0);
  }
}
