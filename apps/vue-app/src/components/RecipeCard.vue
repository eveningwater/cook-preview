<template>
  <el-card class="recipe-card" shadow="hover" @click="navigateToDetail">
    <div class="card-content">
      <div class="recipe-icon">
        <el-icon><Document /></el-icon>
      </div>
      <div class="recipe-info">
        <h4 class="recipe-name" v-html="highlightedName"></h4>
        <p class="recipe-category" v-html="highlightedCategory"></p>
      </div>
      <div class="arrow-icon">
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Document, ArrowRight } from '@element-plus/icons-vue';
import type { Recipe } from '../models/repo.models';

interface Props {
  recipe: Recipe;
  category: string;
  searchTerm?: string;
}

const props = defineProps<Props>();
const router = useRouter();

// 高亮搜索关键词
const highlightedName = computed(() => {
  return highlightText(props.recipe.name, props.searchTerm);
});

const highlightedCategory = computed(() => {
  return highlightText(props.category, props.searchTerm);
});

function highlightText(text: string, searchTerm?: string): string {
  if (!searchTerm || !searchTerm.trim()) {
    return text;
  }
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function navigateToDetail() {
  router.push(`/recipe/${props.category}/${props.recipe.name}`);
}
</script>

<style scoped>
.recipe-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--el-border-color-lighter);
}

.recipe-card:hover {
  transform: translateY(-4px);
  border-color: var(--el-color-primary);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
}

.recipe-icon {
  font-size: 32px;
  color: var(--el-color-primary);
  flex-shrink: 0;
}

.recipe-info {
  flex: 1;
  min-width: 0;
}

.recipe-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recipe-category {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  font-size: 18px;
  color: var(--el-text-color-placeholder);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.recipe-card:hover .arrow-icon {
  transform: translateX(4px);
  color: var(--el-color-primary);
}

/* 搜索高亮样式 */
.recipe-name :deep(mark.search-highlight),
.recipe-category :deep(mark.search-highlight) {
  background-color: #fff176;
  color: #000;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}

.theme-dark .recipe-name :deep(mark.search-highlight),
.theme-dark .recipe-category :deep(mark.search-highlight) {
  background-color: #ffd54f;
  color: #000;
}

@media (max-width: 768px) {
  .card-content {
    padding: 6px;
  }
  
  .recipe-icon {
    font-size: 28px;
  }
  
  .recipe-name {
    font-size: 15px;
  }
  
  .recipe-category {
    font-size: 12px;
  }
}
</style>