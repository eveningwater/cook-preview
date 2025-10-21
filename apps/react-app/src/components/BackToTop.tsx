import React, { useEffect, useRef } from 'react';
import { generateBackToTop, type BackToTopConfig } from '@cook/core-ui';
import '@cook/core-ui/dist/components/back-to-top/back-to-top.css';

interface BackToTopProps extends BackToTopConfig {
  className?: string;
}

const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 300,
  position = { bottom: '2rem', right: '2rem' },
  size = 'medium',
  className = '',
  text = '回到顶部',
  showText = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // 清理之前的实例
      if (cleanupRef.current) {
        cleanupRef.current();
      }

      // 创建新的回到顶部组件
      const { element, cleanup } = generateBackToTop({
        threshold,
        position,
        size,
        className,
        text,
        showText
      });

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
  }, [threshold, position, size, className, text, showText]);

  return <div ref={containerRef} />;
};

export default BackToTop;
