/**
 * 错误边界组件工具函数
 */

export interface ErrorBoundaryConfig {
  /** 错误标题 */
  title?: string;
  /** 错误描述 */
  description?: string;
  /** 重试按钮文本 */
  retryText?: string;
  /** 返回按钮文本 */
  backText?: string;
  /** 是否显示重试按钮 */
  showRetry?: boolean;
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 图标类型 */
  iconType?: 'error' | 'warning' | 'info';
}

export interface ErrorBoundaryActions {
  onRetry?: () => void;
  onBack?: () => void;
}

/**
 * 默认配置
 */
export const DEFAULT_ERROR_BOUNDARY_CONFIG: Required<ErrorBoundaryConfig> = {
  title: '加载失败',
  description: '抱歉，页面加载出现问题，请稍后重试',
  retryText: '重试',
  backText: '返回首页',
  showRetry: true,
  showBack: true,
  className: '',
  iconType: 'error'
};

/**
 * 创建错误边界组件的HTML
 */
export function generateErrorBoundaryHTML(
  config: ErrorBoundaryConfig = {}
): string {
  const finalConfig = { ...DEFAULT_ERROR_BOUNDARY_CONFIG, ...config };
  
  const iconMap = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const icon = iconMap[finalConfig.iconType];
  
  return `
    <div class="error-boundary ${finalConfig.className}">
      <div class="error-boundary-content">
        <div class="error-boundary-icon">${icon}</div>
        <h3 class="error-boundary-title">${finalConfig.title}</h3>
        <p class="error-boundary-description">${finalConfig.description}</p>
        <div class="error-boundary-actions">
          ${finalConfig.showRetry ? `
            <button class="error-boundary-btn error-boundary-retry" data-action="retry">
              <span class="error-boundary-btn-icon">🔄</span>
              ${finalConfig.retryText}
            </button>
          ` : ''}
          ${finalConfig.showBack ? `
            <button class="error-boundary-btn error-boundary-back" data-action="back">
              <span class="error-boundary-btn-icon">←</span>
              ${finalConfig.backText}
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * 创建错误边界组件的DOM元素
 */
export function createErrorBoundaryElement(
  config: ErrorBoundaryConfig = {}
): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = generateErrorBoundaryHTML(config);
  return div.firstElementChild as HTMLElement;
}

/**
 * 初始化错误边界功能
 */
export function initErrorBoundary(
  element: HTMLElement,
  actions: ErrorBoundaryActions = {}
): () => void {
  const retryBtn = element.querySelector('[data-action="retry"]') as HTMLButtonElement;
  const backBtn = element.querySelector('[data-action="back"]') as HTMLButtonElement;

  const handleRetry = () => {
    if (actions.onRetry) {
      actions.onRetry();
    }
  };

  const handleBack = () => {
    if (actions.onBack) {
      actions.onBack();
    }
  };

  if (retryBtn) {
    retryBtn.addEventListener('click', handleRetry);
  }

  if (backBtn) {
    backBtn.addEventListener('click', handleBack);
  }

  // 返回清理函数
  return () => {
    if (retryBtn) {
      retryBtn.removeEventListener('click', handleRetry);
    }
    if (backBtn) {
      backBtn.removeEventListener('click', handleBack);
    }
  };
}

/**
 * 生成完整的错误边界组件
 */
export function generateErrorBoundary(
  config: ErrorBoundaryConfig = {},
  actions: ErrorBoundaryActions = {}
): {
  element: HTMLElement;
  cleanup: () => void;
} {
  const element = createErrorBoundaryElement(config);
  const cleanup = initErrorBoundary(element, actions);
  
  return { element, cleanup };
}
