<template>
  <div 
    class="cooking-loader-container"
    :class="className"
    v-html="loaderHTML"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { generateCookingLoaderHTML } from '@cook/core-ui';
import '@cook/core-ui/dist/components/loading/cooking-loader.css';

interface CookingLoaderProps {
  text?: string;
  subText?: string;
  className?: string;
}

const props = withDefaults(defineProps<CookingLoaderProps>(), {
  text: '正在烹饪美味菜谱...',
  subText: '请稍候，我们正在为您准备详细的制作步骤',
  className: ''
});

const loaderHTML = computed(() => {
  return generateCookingLoaderHTML({
    text: props.text,
    subText: props.subText,
    className: props.className
  });
});
</script>

<style scoped>
.cooking-loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 40px 20px;
}
</style>
