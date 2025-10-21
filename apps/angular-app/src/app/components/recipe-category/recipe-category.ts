import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeCategory } from '@cook/core';
import { RecipeCardComponent } from '../recipe-card/recipe-card';

@Component({
  selector: 'app-recipe-category',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './recipe-category.html',
  styleUrl: './recipe-category.scss'
})
export class RecipeCategoryComponent implements OnInit {
  @Input() category!: RecipeCategory;
  @Input() searchTerm = '';
  
  isExpanded = true;

  ngOnInit() {
    // 如果有搜索词，默认展开
    if (this.searchTerm) {
      this.isExpanded = true;
    }
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
