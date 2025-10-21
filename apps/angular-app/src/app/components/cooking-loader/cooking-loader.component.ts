import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateCookingLoaderHTML, type CookingLoaderConfig } from '@cook/core-ui';
import '@cook/core-ui/dist/components/loading/cooking-loader.css';

@Component({
  selector: 'app-cooking-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="cooking-loader-container"
      [class]="className"
      [innerHTML]="loaderHTML"
    ></div>
  `,
  styles: [`
    .cooking-loader-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      padding: 40px 20px;
    }
  `]
})
export class CookingLoaderComponent implements CookingLoaderConfig {
  @Input() text: string = '正在烹饪美味菜谱...';
  @Input() subText: string = '请稍候，我们正在为您准备详细的制作步骤';
  @Input() className: string = '';

  get loaderHTML(): string {
    return generateCookingLoaderHTML({
      text: this.text,
      subText: this.subText,
      className: this.className
    });
  }
}
