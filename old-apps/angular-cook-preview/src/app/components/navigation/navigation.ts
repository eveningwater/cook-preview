import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RecipeCategory } from '../../models/repo.models';

@Component({
  selector: 'app-navigation',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class NavigationComponent {
  @Input() categories: RecipeCategory[] = [];
  @Input() activeCategory: string | null = null;
  @Output() categorySelected = new EventEmitter<RecipeCategory>();
  @Output() showAll = new EventEmitter<void>();

  selectCategory(category: RecipeCategory) {
    this.activeCategory = category.name;
    this.categorySelected.emit(category);
  }

  selectAll() {
    this.activeCategory = null;
    this.showAll.emit();
  }

  getCategoryIcon(categoryName: string): string {
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
    return iconMap[categoryName] || 'restaurant';
  }
}
