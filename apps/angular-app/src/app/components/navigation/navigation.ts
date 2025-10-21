import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RecipeCategory } from '@cook/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class NavigationComponent {
  @Input() categories: RecipeCategory[] = [];
  @Input() activeCategory: string | null = null;
  @Output() categorySelected = new EventEmitter<RecipeCategory>();
  @Output() showAll = new EventEmitter<void>();

  selectCategory(category: RecipeCategory) {
    this.categorySelected.emit(category);
  }

  selectAll() {
    this.showAll.emit();
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      '主食': 'restaurant',
      '汤品': 'soup_kitchen',
      '饮品': 'local_cafe',
      '配料': 'spa',
      '甜品': 'cake',
      '小食': 'fastfood',
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
      '蒸菜': 'kitchen'
    };
    return iconMap[categoryName] || 'restaurant';
  }
}
