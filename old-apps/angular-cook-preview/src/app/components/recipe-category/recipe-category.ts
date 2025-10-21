import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeCardComponent } from '../recipe-card/recipe-card';
import { RecipeCategory as RecipeCategoryModel } from '../../models/repo.models';

@Component({
  selector: 'app-recipe-category',
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './recipe-category.html',
  styleUrl: './recipe-category.scss'
})
export class RecipeCategoryComponent implements OnInit {
  @Input() category!: RecipeCategoryModel;
  @Input() isExpanded = false;
  @Input() searchTerm = '';

  ngOnInit() {
    // 如果有搜索匹配，自动展开
    if (this.category.hasSearchMatch) {
      this.isExpanded = true;
    }
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
