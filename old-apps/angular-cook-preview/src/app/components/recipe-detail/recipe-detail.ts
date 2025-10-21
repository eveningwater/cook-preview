import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { CookApiService } from '../../services/cook-api.service';
import { Recipe, RecipeCategory } from '../../models/repo.models';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss'
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  loading = true;
  error: string | null = null;
  currentCategory: string = '';
  currentRecipeIndex: number = -1;
  allRecipes: Recipe[] = [];
  hasPrevious: boolean = false;
  hasNext: boolean = false;
  private markdownPipe = new MarkdownPipe();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookApiService: CookApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryPath = params['category'];
      const recipeName = params['recipe'];
      
      if (categoryPath && recipeName) {
        this.currentCategory = categoryPath;
        this.loadCategoryRecipes(categoryPath, recipeName);
      }
    });
  }

  private loadCategoryRecipes(categoryPath: string, recipeName: string) {
    this.loading = true;
    this.error = null;

    // 先加载分类的所有菜谱
    this.cookApiService.getRecipesByCategory({ name: categoryPath, path: categoryPath, sha: '' }).subscribe({
      next: (recipes) => {
        // 过滤掉README.md文件并按名称排序
        this.allRecipes = recipes
          .filter(recipe => !recipe.name.includes('README'))
          .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
        
        this.currentRecipeIndex = this.allRecipes.findIndex(recipe => recipe.name === recipeName);
        
        // 如果找不到精确匹配，尝试模糊匹配
        if (this.currentRecipeIndex === -1) {
          this.currentRecipeIndex = this.allRecipes.findIndex(recipe => 
            recipe.name.includes(recipeName) || recipeName.includes(recipe.name)
          );
        }
        
        this.updateNavigationState();
        
        // 然后加载当前菜谱详情
        this.loadRecipeDetail(categoryPath, recipeName);
      },
      error: (err) => {
        this.error = '加载分类失败，请稍后重试';
        this.loading = false;
      }
    });
  }

  private loadRecipeDetail(categoryPath: string, recipeName: string) {
    this.loading = true;
    this.error = null;

    const recipePath = `${categoryPath}/${recipeName}.md`;
    
    // 创建临时的recipe对象
    const tempRecipe: Recipe = {
      name: recipeName,
      path: recipePath,
      sha: ''
    };

    this.cookApiService.getRecipeDetail(tempRecipe).subscribe({
      next: async (recipe) => {
        this.recipe = recipe;
        
        // 异步转换图片为base64
        if (recipe.content) {
          try {
            const processedContent = await this.markdownPipe.transformWithBase64Images(recipe.content, categoryPath);
            this.recipe = { ...recipe, content: processedContent };
          } catch (error) {
            // 如果转换失败，保持原始内容
          }
        }
        
        this.loading = false;
      },
      error: (err) => {
        this.error = '加载菜谱详情失败，请稍后重试';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }


  private updateNavigationState() {
    this.hasPrevious = this.currentRecipeIndex > 0;
    this.hasNext = this.currentRecipeIndex < this.allRecipes.length - 1;
  }

  goToPrevious() {
    if (this.hasPrevious) {
      const previousRecipe = this.allRecipes[this.currentRecipeIndex - 1];
      this.router.navigate(['/recipe', this.currentCategory, previousRecipe.name]);
    }
  }

  goToNext() {
    if (this.hasNext) {
      const nextRecipe = this.allRecipes[this.currentRecipeIndex + 1];
      this.router.navigate(['/recipe', this.currentCategory, nextRecipe.name]);
    }
  }


  formatRecipeContent(content: string): string {
    if (!content) return '';
    
    // 简单的markdown格式化
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 粗体
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // 斜体
      .replace(/\n\n/g, '</p><p>') // 段落
      .replace(/\n/g, '<br>') // 换行
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

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
}
