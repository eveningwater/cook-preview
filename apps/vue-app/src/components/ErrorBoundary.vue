<template>
  <div ref="containerRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { generateErrorBoundary, type ErrorBoundaryConfig, type ErrorBoundaryActions } from '@cook/core-ui';
import '@cook/core-ui/dist/components/error-boundary/error-boundary.css';

interface ErrorBoundaryProps extends ErrorBoundaryConfig {
  className?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

const props = withDefaults(defineProps<ErrorBoundaryProps>(), {
  title: '加载失败',
  description: '抱歉，页面加载出现问题，请稍后重试',
  retryText: '重试',
  backText: '返回首页',
  showRetry: true,
  showBack: true,
  className: '',
  iconType: 'error'
});

const emit = defineEmits<{
  retry: [];
  back: [];
}>();

const containerRef = ref<HTMLDivElement>();
let cleanup: (() => void) | null = null;

onMounted(() => {
  if (containerRef.value) {
    // 创建新的错误边界组件
    const actions: ErrorBoundaryActions = {
      onRetry: () => {
        props.onRetry?.();
        emit('retry');
      },
      onBack: () => {
        props.onBack?.();
        emit('back');
      }
    };

    const { element, cleanup: cleanupFn } = generateErrorBoundary({
      title: props.title,
      description: props.description,
      retryText: props.retryText,
      backText: props.backText,
      showRetry: props.showRetry,
      showBack: props.showBack,
      className: props.className,
      iconType: props.iconType
    }, actions);

    // 添加到容器
    containerRef.value.innerHTML = '';
    containerRef.value.appendChild(element);
    
    // 保存清理函数
    cleanup = cleanupFn;
  }
});

onUnmounted(() => {
  // 组件卸载时清理
  if (cleanup) {
    cleanup();
  }
});
</script>
