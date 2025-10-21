<template>
  <div class="home-view">
    <!-- 导航栏 -->
    <Navigation
      v-if="!loading && !error"
      :categories="categories"
      :active-category="activeCategory"
      @category-selected="onCategorySelected"
      @show-all="onShowAll"
    />

    <!-- 搜索栏 -->
    <Search
      v-if="!loading && !error"
      @search-changed="onSearchChanged"
    />

    <main class="app-main">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-animation">
          <el-icon class="is-loading" :size="48"><Loading /></el-icon>
        </div>
        <p class="loading-text">正在加载菜谱数据...</p>
      </div>

      <!-- 错误状态 -->
      <div v-if="error" class="error-container">
        <el-result icon="error" title="加载失败" :sub-title="error">
          <template #extra>
            <el-button type="primary" @click="retryLoad">
              <el-icon><RefreshRight /></el-icon>
              重试
            </el-button>
          </template>
        </el-result>
      </div>

      <!-- 搜索结果提示 -->
      <div v-if="!loading && !error && searchTerm" class="search-results-info">
        <el-alert
          :title="`搜索 '${searchTerm}' 的结果 (${getTotalRecipes()} 个菜谱)`"
          type="info"
          :closable="false"
        >
          <template #icon>
            <el-icon><SearchIcon /></el-icon>
          </template>
        </el-alert>
      </div>

      <!-- 菜谱分类列表 -->
      <div v-if="!loading && !error" class="categories-container">
        <RecipeCategory
          v-for="category in filteredCategories"
          :key="category.name"
          :category="category"
          :search-term="searchTerm"
        />

        <!-- 无结果提示 -->
        <div v-if="filteredCategories.length === 0 && searchTerm" class="no-results">
          <el-empty description="未找到相关菜谱">
            <template #image>
              <el-icon :size="80"><SearchIcon /></el-icon>
            </template>
            <el-button type="primary" @click="onShowAll">查看所有菜谱</el-button>
          </el-empty>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loading, RefreshRight, Search as SearchIcon } from '@element-plus/icons-vue';
import Navigation from '../components/Navigation.vue';
import Search from '../components/Search.vue';
import RecipeCategory from '../components/RecipeCategory.vue';
import type { RecipeCategory as RecipeCategoryType, Recipe } from '../models/repo.models';
import { cookApiService } from '../services/cook-api.service';

const categories = ref<RecipeCategoryType[]>([]);
const filteredCategories = ref<RecipeCategoryType[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const activeCategory = ref<string | null>(null);
const searchTerm = ref('');

onMounted(() => {
  loadRecipeData();
});

async function loadRecipeData() {
  loading.value = true;
  error.value = null;

  try {
    // 完全按照 Angular 版本的方式：先调用 trees/main?recursive=true 获取完整目录结构
    const items = await cookApiService.getRepoTree();
    
    // 从 recursive 结果中提取中文分类目录
    const categoryMap = new Map<string, any[]>();
    
    items.forEach(item => {
      if (
        item.type === 'blob' &&
        item.path.endsWith('.md') &&
        !item.path.startsWith('.') &&
        !item.path.startsWith('images/') &&
        !item.path.endsWith('/README.md')
      ) {
        // 提取分类名（路径的第一部分）
        const pathParts = item.path.split('/');
        if (pathParts.length >= 2) {
          const categoryName = pathParts[0];
          
          // 检查是否为中文分类
          if (isChineseDirectory(categoryName)) {
            if (!categoryMap.has(categoryName)) {
              categoryMap.set(categoryName, []);
            }
            categoryMap.get(categoryName)!.push(item);
          }
        }
      }
    });
    
    // 转换为分类数组
    const loadedCategories = Array.from(categoryMap.entries()).map(([categoryName, files]) => ({
      name: categoryName,
      path: categoryName,
      sha: '',
      recipes: files
        .filter(file => !file.path.endsWith('/README.md'))
        .map(file => ({
          name: file.path.replace('.md', '').replace(`${categoryName}/`, ''),
          path: file.path,
          sha: file.sha
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    }));
    
    categories.value = loadedCategories;
    filteredCategories.value = [...loadedCategories];
    loading.value = false;
  } catch (err) {
    error.value = '加载菜谱数据失败，请稍后重试';
    loading.value = false;
    console.error('Error loading recipe data:', err);
  }
}

function isChineseDirectory(path: string): boolean {
  return /[\u4e00-\u9fa5]/.test(path);
}

function retryLoad() {
  loadRecipeData();
}

function onCategorySelected(category: RecipeCategoryType) {
  activeCategory.value = category.name;
  filteredCategories.value = [category];
}

function onShowAll() {
  activeCategory.value = null;
  searchTerm.value = '';
  filteredCategories.value = [...categories.value];
}

function onSearchChanged(term: string) {
  searchTerm.value = term;
  applyFilters();
}

function applyFilters() {
  if (activeCategory.value) {
    // 如果选择了特定分类，只在该分类内搜索
    const activeCat = categories.value.find(cat => cat.name === activeCategory.value);
    if (activeCat) {
      const filteredCat = filterRecipes(activeCat);
      filteredCategories.value = filteredCat.recipes && filteredCat.recipes.length > 0 ? [filteredCat] : [];
    }
  } else {
    // 在所有分类中搜索，过滤掉空的分类
    filteredCategories.value = categories.value
      .map(cat => filterRecipes(cat))
      .filter(cat => cat.recipes && cat.recipes.length > 0);
  }
}

function filterRecipes(category: RecipeCategoryType): RecipeCategoryType {
  if (!searchTerm.value.trim()) {
    return category;
  }

  const searchTermLower = searchTerm.value.toLowerCase();
  
  // 检查分类名称是否匹配
  const categoryMatches = category.name.toLowerCase().includes(searchTermLower);
  
  // 按菜谱名称搜索
  const filteredRecipes = category.recipes?.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTermLower)
  ) || [];

  // 如果分类名称匹配，显示该分类下的所有菜谱
  if (categoryMatches) {
    return {
      ...category,
      recipes: category.recipes || [],
      isExpanded: true,
      hasSearchMatch: true
    };
  }

  // 如果分类名称不匹配，但该分类下有匹配的菜谱，则显示过滤后的菜谱
  if (filteredRecipes.length > 0) {
    return {
      ...category,
      recipes: filteredRecipes,
      isExpanded: true,
      hasSearchMatch: true
    };
  }

  // 如果都不匹配，返回空分类
  return {
    ...category,
    recipes: [],
    isExpanded: false,
    hasSearchMatch: false
  };
}

function getTotalRecipes(): number {
  return filteredCategories.value.reduce((total, category) => {
    return total + (category.recipes?.length || 0);
  }, 0);
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 60px 20px;
}

.loading-animation {
  margin-bottom: 20px;
  color: var(--el-color-primary);
}

.loading-text {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 60px 20px;
}

.search-results-info {
  margin-bottom: 20px;
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

@media (max-width: 768px) {
  .app-main {
    padding: 16px;
  }
  
  .categories-container {
    gap: 16px;
  }
}
</style>

