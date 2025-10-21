/**
 * 烹饪加载动画的纯TypeScript实现
 * 提供HTML字符串和CSS样式，供各框架应用使用
 */

export interface CookingLoaderConfig {
  text?: string;
  subText?: string;
  className?: string;
}

export interface CookingLoaderResult {
  html: string;
  css: string;
}

/**
 * 生成烹饪加载动画的HTML结构
 */
export function generateCookingLoaderHTML(config: CookingLoaderConfig = {}): string {
  const {
    text = '正在烹饪美味菜谱...',
    subText = '请稍候，我们正在为您准备详细的制作步骤',
    className = ''
  } = config;

  return `
    <div class="cooking-loader-container ${className}">
      <div class="cooking-loader-animation">
        <div class="cooking-loader">
          <div class="pan">
            <div class="handle"></div>
          </div>
          <div class="ingredients">
            <div class="ingredient ingredient-1"></div>
            <div class="ingredient ingredient-2"></div>
            <div class="ingredient ingredient-3"></div>
            <div class="ingredient ingredient-4"></div>
          </div>
          <div class="steam">
            <div class="steam-line"></div>
            <div class="steam-line"></div>
            <div class="steam-line"></div>
          </div>
        </div>
        <div class="loading-text">
          <h3>${text}</h3>
          <p>${subText}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * 获取烹饪加载动画的CSS样式
 * 注意：这个方法已废弃，请直接导入CSS文件
 * @deprecated 请使用 import './cooking-loader.css' 或直接引用CSS文件
 */
export function getCookingLoaderCSS(): string {
  console.warn('getCookingLoaderCSS() is deprecated. Please import the CSS file directly.');
  return '';
}

/**
 * 生成完整的烹饪加载动画（HTML + CSS）
 */
export function generateCookingLoader(config: CookingLoaderConfig = {}): CookingLoaderResult {
  return {
    html: generateCookingLoaderHTML(config),
    css: getCookingLoaderCSS()
  };
}

/**
 * 将CSS样式注入到页面中
 */
export function injectCookingLoaderCSS(): void {
  if (typeof document === 'undefined') return;
  
  const existingStyle = document.getElementById('cooking-loader-styles');
  if (existingStyle) return;
  
  const style = document.createElement('style');
  style.id = 'cooking-loader-styles';
  style.textContent = getCookingLoaderCSS();
  document.head.appendChild(style);
}

/**
 * 创建烹饪加载动画元素
 */
export function createCookingLoaderElement(config: CookingLoaderConfig = {}): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = generateCookingLoaderHTML(config);
  return div.firstElementChild as HTMLElement;
}
