/**
 * 回到顶部组件工具函数
 */

export interface BackToTopConfig {
  /** 滚动阈值，超过此值显示按钮 */
  threshold?: number;
  /** 按钮位置 */
  position?: {
    bottom?: string;
    right?: string;
  };
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large';
  /** 自定义类名 */
  className?: string;
  /** 按钮文本 */
  text?: string;
  /** 是否显示文本 */
  showText?: boolean;
}

export interface BackToTopState {
  visible: boolean;
}

/**
 * 默认配置
 */
export const DEFAULT_BACK_TO_TOP_CONFIG: Required<BackToTopConfig> = {
  threshold: 300,
  position: {
    bottom: '2rem',
    right: '2rem'
  },
  size: 'medium',
  className: '',
  text: '回到顶部',
  showText: false
};

/**
 * 创建回到顶部按钮的HTML
 */
export function generateBackToTopHTML(config: BackToTopConfig = {}): string {
  const finalConfig = { ...DEFAULT_BACK_TO_TOP_CONFIG, ...config };
  
  const sizeClass = `back-to-top-${finalConfig.size}`;
  const visibilityClass = 'back-to-top-hidden'; // 初始状态为隐藏，由JS控制显示
  
  return `
    <button 
      class="back-to-top ${sizeClass} ${visibilityClass} ${finalConfig.className}"
      title="${finalConfig.text}"
      aria-label="${finalConfig.text}"
      style="bottom: ${finalConfig.position.bottom}; right: ${finalConfig.position.right};"
    >
      <span class="back-to-top-icon">↑</span>
      ${finalConfig.showText ? `<span class="back-to-top-text">${finalConfig.text}</span>` : ''}
    </button>
  `;
}

/**
 * 创建回到顶部按钮的DOM元素
 */
export function createBackToTopElement(config: BackToTopConfig = {}): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = generateBackToTopHTML(config);
  return div.firstElementChild as HTMLElement;
}

/**
 * 初始化回到顶部功能
 */
export function initBackToTop(
  element: HTMLElement, 
  config: BackToTopConfig = {}
): () => void {
  const finalConfig = { ...DEFAULT_BACK_TO_TOP_CONFIG, ...config };
  let isVisible = false;

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
    const shouldShow = scrolled > finalConfig.threshold;
    
    if (shouldShow !== isVisible) {
      isVisible = shouldShow;
      if (isVisible) {
        element.classList.remove('back-to-top-hidden');
        element.classList.add('back-to-top-visible');
      } else {
        element.classList.remove('back-to-top-visible');
        element.classList.add('back-to-top-hidden');
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 添加点击事件
  element.addEventListener('click', scrollToTop);
  
  // 添加滚动监听
  window.addEventListener('scroll', toggleVisible);
  
  // 初始检查
  toggleVisible();

  // 返回清理函数
  return () => {
    element.removeEventListener('click', scrollToTop);
    window.removeEventListener('scroll', toggleVisible);
  };
}

/**
 * 生成完整的回到顶部组件（HTML + 初始化）
 */
export function generateBackToTop(config: BackToTopConfig = {}): {
  element: HTMLElement;
  cleanup: () => void;
} {
  const element = createBackToTopElement(config);
  const cleanup = initBackToTop(element, config);
  
  return { element, cleanup };
}
