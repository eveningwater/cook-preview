<template>
  <div ref="containerRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { generateBackToTop, type BackToTopConfig } from '@cook/core-ui';
import '@cook/core-ui/dist/components/back-to-top/back-to-top.css';

interface BackToTopProps extends BackToTopConfig {
  className?: string;
}

const props = withDefaults(defineProps<BackToTopProps>(), {
  threshold: 300,
  position: () => ({ bottom: '2rem', right: '2rem' }),
  size: 'medium',
  className: '',
  text: '回到顶部',
  showText: false
});

const containerRef = ref<HTMLDivElement>();
let cleanup: (() => void) | null = null;

onMounted(() => {
  if (containerRef.value) {
    // 创建新的回到顶部组件
    const { element, cleanup: cleanupFn } = generateBackToTop({
      threshold: props.threshold,
      position: props.position,
      size: props.size,
      className: props.className,
      text: props.text,
      showText: props.showText
    });

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