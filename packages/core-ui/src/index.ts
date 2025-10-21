// 烹饪加载动画工具
export {
  generateCookingLoaderHTML,
  getCookingLoaderCSS,
  generateCookingLoader,
  injectCookingLoaderCSS,
  createCookingLoaderElement,
  type CookingLoaderConfig,
  type CookingLoaderResult
} from './components/loading/cooking-loader';

// 回到顶部组件工具
export {
  generateBackToTopHTML,
  createBackToTopElement,
  initBackToTop,
  generateBackToTop,
  type BackToTopConfig,
  type BackToTopState
} from './components/back-to-top/back-to-top';

// 错误边界组件工具
export {
  generateErrorBoundaryHTML,
  createErrorBoundaryElement,
  initErrorBoundary,
  generateErrorBoundary,
  type ErrorBoundaryConfig,
  type ErrorBoundaryActions
} from './components/error-boundary/error-boundary';

// 导出CSS文件路径（供应用导入使用）
export const cookingLoaderCSSPath = './components/loading/cooking-loader.css';
export const backToTopCSSPath = './components/back-to-top/back-to-top.css';
export const errorBoundaryCSSPath = './components/error-boundary/error-boundary.css';
