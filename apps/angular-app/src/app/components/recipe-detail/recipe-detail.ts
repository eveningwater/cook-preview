import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RecipeUtils } from '@cook/core';
import { AngularRecipeDetailService } from '../../../services/recipe-detail.service';
import { CookingLoaderComponent } from '../cooking-loader/cooking-loader.component';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, CookingLoaderComponent],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss'
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeDetailService = inject(AngularRecipeDetailService);

  // 使用服务中的响应式状态
  get recipe() { return this.recipeDetailService.recipeSignal(); }
  get loading() { return this.recipeDetailService.loadingSignal(); }
  get error() { return this.recipeDetailService.errorSignal(); }
  get currentCategory() { return this.recipeDetailService.currentCategorySignal(); }
  get hasPrevious() { return this.recipeDetailService.hasPreviousSignal(); }
  get hasNext() { return this.recipeDetailService.hasNextSignal(); }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryPath = params['category'];
      const recipeName = params['recipe'];
      
      if (categoryPath && recipeName) {
        this.recipeDetailService.loadRecipeDetail(categoryPath, recipeName);
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  goToPrevious() {
    if (this.hasPrevious) {
      const previousRecipe = this.recipeDetailService.getPreviousRecipe();
      if (previousRecipe) {
        this.router.navigate(['/recipe', this.currentCategory, previousRecipe.name]);
      }
    }
  }

  goToNext() {
    if (this.hasNext) {
      const nextRecipe = this.recipeDetailService.getNextRecipe();
      if (nextRecipe) {
        this.router.navigate(['/recipe', this.currentCategory, nextRecipe.name]);
      }
    }
  }

  getCategoryIcon(categoryPath: string): string {
    return RecipeUtils.getCategoryIcon(categoryPath);
  }
}