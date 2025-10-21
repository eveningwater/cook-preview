<template>
  <nav class="navigation">
    <div class="nav-content">
      <div class="nav-categories">
        <el-button
          :type="!activeCategory ? 'primary' : ''"
          size="small"
          @click="$emit('showAll')"
        >
          全部分类
        </el-button>
        <el-button
          v-for="category in categories"
          :key="category.name"
          :type="activeCategory === category.name ? 'primary' : ''"
          size="small"
          @click="$emit('categorySelected', category)"
        >
          {{ category.name }}
        </el-button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { RecipeCategory } from '../models/repo.models';

interface Props {
  categories: RecipeCategory[];
  activeCategory: string | null;
}

defineProps<Props>();

defineEmits<{
  categorySelected: [category: RecipeCategory];
  showAll: [];
}>();
</script>

<style scoped>
.navigation {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  padding: 12px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

@media (max-width: 768px) {
  .nav-categories {
    gap: 6px;
  }
  
  .nav-categories .el-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>