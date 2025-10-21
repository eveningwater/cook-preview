import { Component, ElementRef, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateBackToTop, type BackToTopConfig } from '@cook/core-ui';
import '@cook/core-ui/dist/components/back-to-top/back-to-top.css';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #containerRef></div>
  `,
  styles: []
})
export class BackToTopComponent implements OnInit, OnDestroy, BackToTopConfig {
  @ViewChild('containerRef', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  
  @Input() threshold: number = 300;
  @Input() position: { bottom?: string; right?: string } = { bottom: '2rem', right: '2rem' };
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() className: string = '';
  @Input() text: string = '回到顶部';
  @Input() showText: boolean = false;

  private cleanup: (() => void) | null = null;

  ngOnInit() {
    if (this.containerRef?.nativeElement) {
      // 创建新的回到顶部组件
      const { element, cleanup } = generateBackToTop({
        threshold: this.threshold,
        position: this.position,
        size: this.size,
        className: this.className,
        text: this.text,
        showText: this.showText
      });

      // 添加到容器
      this.containerRef.nativeElement.innerHTML = '';
      this.containerRef.nativeElement.appendChild(element);
      
      // 保存清理函数
      this.cleanup = cleanup;
    }
  }

  ngOnDestroy() {
    // 组件卸载时清理
    if (this.cleanup) {
      this.cleanup();
    }
  }
}
