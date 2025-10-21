import React, { useEffect, useRef } from 'react';
import { generateErrorBoundary, type ErrorBoundaryConfig, type ErrorBoundaryActions } from '@cook/core-ui';
import '@cook/core-ui/dist/components/error-boundary/error-boundary.css';

interface ErrorBoundaryProps extends ErrorBoundaryConfig {
  className?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  title = '加载失败',
  description = '抱歉，页面加载出现问题，请稍后重试',
  retryText = '重试',
  backText = '返回首页',
  showRetry = true,
  showBack = true,
  className = '',
  iconType = 'error',
  onRetry,
  onBack
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // 清理之前的实例
      if (cleanupRef.current) {
        cleanupRef.current();
      }

      // 创建新的错误边界组件
      const actions: ErrorBoundaryActions = {
        onRetry,
        onBack
      };

      const { element, cleanup } = generateErrorBoundary({
        title,
        description,
        retryText,
        backText,
        showRetry,
        showBack,
        className,
        iconType
      }, actions);

      // 添加到容器
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(element);
      
      // 保存清理函数
      cleanupRef.current = cleanup;
    }

    // 组件卸载时清理
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [title, description, retryText, backText, showRetry, showBack, className, iconType, onRetry, onBack]);

  return <div ref={containerRef} />;
};

export default ErrorBoundary;
