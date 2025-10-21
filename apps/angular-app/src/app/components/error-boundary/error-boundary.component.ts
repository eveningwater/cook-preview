import { Component, ElementRef, OnDestroy, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateErrorBoundary, type ErrorBoundaryConfig, type ErrorBoundaryActions } from '@cook/core-ui';
import '@cook/core-ui/dist/components/error-boundary/error-boundary.css';

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #containerRef></div>
  `,
  styles: []
})
export class ErrorBoundaryComponent implements OnInit, OnDestroy, ErrorBoundaryConfig {
  @ViewChild('containerRef', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  
  @Input() title: string = '加载失败';
  @Input() description: string = '抱歉，页面加载出现问题，请稍后重试';
  @Input() retryText: string = '重试';
  @Input() backText: string = '返回首页';
  @Input() showRetry: boolean = true;
  @Input() showBack: boolean = true;
  @Input() className: string = '';
  @Input() iconType: 'error' | 'warning' | 'info' = 'error';

  @Output() retry = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  private cleanup: (() => void) | null = null;

  ngOnInit() {
    if (this.containerRef?.nativeElement) {
      // 创建新的错误边界组件
      const actions: ErrorBoundaryActions = {
        onRetry: () => {
          this.retry.emit();
        },
        onBack: () => {
          this.back.emit();
        }
      };

      const { element, cleanup } = generateErrorBoundary({
        title: this.title,
        description: this.description,
        retryText: this.retryText,
        backText: this.backText,
        showRetry: this.showRetry,
        showBack: this.showBack,
        className: this.className,
        iconType: this.iconType
      }, actions);

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
