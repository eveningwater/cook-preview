<template>
  <div class="recipe-category">
    <el-card shadow="hover">
      <template #header>
        <div class="category-header" @click="toggleExpand">
          <h3>
            <el-icon class="category-icon"><Folder /></el-icon>
            {{ category.name }}
          </h3>
          <div class="category-info">
            <span class="recipe-count">{{ category.recipes?.length || 0 }} 个菜谱</span>
            <el-icon class="expand-icon" :class="{ expanded: isExpanded }">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </template>
      
      <el-collapse-transition>
        <div v-show="isExpanded" class="recipes-grid">
          <RecipeCard
            v-for="recipe in category.recipes"
            :key="recipe.path"
            :recipe="recipe"
            :category="category.name"
            :search-term="searchTerm"
          />
        </div>
      </el-collapse-transition>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Folder, ArrowRight } from '@element-plus/icons-vue';
import type { RecipeCategory } from '../models/repo.models';
import RecipeCard from './RecipeCard.vue';

interface Props {
  category: RecipeCategory;
  searchTerm?: string;
}

const props = defineProps<Props>();

const isExpanded = ref(props.category.isExpanded || false);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

// 当搜索词变化时，自动展开有匹配结果的分类
watch(() => props.searchTerm, (newTerm) => {
  if (newTerm && props.category.hasSearchMatch) {
    isExpanded.value = true;
  }
});

// 当分类的 isExpanded 属性变化时，同步更新
watch(() => props.category.isExpanded, (newValue) => {
  if (newValue !== undefined) {
    isExpanded.value = newValue;
  }
});
</script>

<style scoped>
.recipe-category {
  margin-bottom: 20px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.category-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
}

.category-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recipe-count {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.expand-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding-top: 16px;
}

@media (max-width: 768px) {
  .recipes-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .category-header h3 {
    font-size: 18px;
  }
}
</style>