import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Recipe } from '../../models/repo.models';

@Component({
  selector: 'app-recipe-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss'
})
export class RecipeCardComponent implements OnInit, OnChanges {
  @Input() recipe!: Recipe;
  @Input() categoryPath!: string;
  @Input() searchTerm = '';
  
  highlightedTitle = '';
  isSearchMatch = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateHighlight();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchTerm'] || changes['recipe']) {
      this.updateHighlight();
    }
  }

  private updateHighlight() {
    if (!this.recipe) {
      this.highlightedTitle = '';
      this.isSearchMatch = false;
      return;
    }

    this.highlightedTitle = this.recipe.name;
    this.isSearchMatch = false;

    if (this.searchTerm && this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      const recipeNameLower = this.recipe.name.toLowerCase();
      
      if (recipeNameLower.includes(searchTermLower)) {
        this.isSearchMatch = true;
        // 高亮匹配的文本
        const regex = new RegExp(`(${this.escapeRegExp(this.searchTerm)})`, 'gi');
        this.highlightedTitle = this.recipe.name.replace(regex, '<mark>$1</mark>');
      }
    }
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  viewRecipeDetail() {
    // 跳转到详情页面
    const categoryPath = this.categoryPath || this.recipe.path.split('/')[0];
    this.router.navigate(['/recipe', categoryPath, this.recipe.name]);
  }
}
