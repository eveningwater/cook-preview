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
          <div class="cooking-loader">
            <div class="pan">
              <div class="handle"></div>
            </div>
            <div class="ingredients">
              <div class="ingredient ingredient-1"></div>
              <div class="ingredient ingredient-2"></div>
              <div class="ingredient ingredient-3"></div>
              <div class="ingredient ingredient-4"></div>
            </div>
            <div class="steam">
              <div class="steam-line"></div>
              <div class="steam-line"></div>
              <div class="steam-line"></div>
            </div>
          </div>
          <div class="loading-text">
            <h3>正在烹饪美味菜谱...</h3>
            <p>请稍候，我们正在为您准备详细的制作步骤</p>
          </div>
        </div>
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

    <!-- 回到顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RefreshRight, Search as SearchIcon } from '@element-plus/icons-vue';
import Navigation from '../components/Navigation.vue';
import Search from '../components/Search.vue';
import RecipeCategory from '../components/RecipeCategory.vue';
import BackToTop from '../components/BackToTop.vue';
import type { RecipeCategory as RecipeCategoryType } from '../models/repo.models';
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
    // 统一在 base-cook-api.service.ts 中处理，前端只负责调用和显示
    const loadedCategories = await cookApiService.getRecipeCategories();
    
    categories.value = loadedCategories;
    filteredCategories.value = [...loadedCategories];
    loading.value = false;
  } catch (err) {
    error.value = '加载菜谱数据失败，请稍后重试';
    loading.value = false;
    console.error('Error loading recipe data:', err);
  }
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

/* 烹饪加载动画 */
.cooking-loader {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pan {
  width: 80px;
  height: 40px;
  background: var(--el-border-color);
  border-radius: 0 0 40px 40px;
  position: relative;
  box-shadow: 0 2px 4px var(--el-box-shadow-light);
  animation: panShake 2s ease-in-out infinite;
}

.pan::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--el-text-color-secondary);
  border-radius: 2px;
}

.handle {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 8px;
  background: var(--el-text-color-secondary);
  border-radius: 4px;
}

.ingredients {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
}

.ingredient {
  position: absolute;
  border-radius: 50%;
  animation: ingredientBounce 1.5s ease-in-out infinite;
}

.ingredient.ingredient-1 {
  width: 12px;
  height: 12px;
  background: var(--el-color-primary);
  top: 10px;
  left: 10px;
  animation-delay: 0s;
}

.ingredient.ingredient-2 {
  width: 10px;
  height: 10px;
  background: #4caf50;
  top: 15px;
  right: 10px;
  animation-delay: 0.2s;
}

.ingredient.ingredient-3 {
  width: 8px;
  height: 8px;
  background: #ffc107;
  bottom: 15px;
  left: 15px;
  animation-delay: 0.4s;
}

.ingredient.ingredient-4 {
  width: 14px;
  height: 14px;
  background: #e91e63;
  bottom: 10px;
  right: 15px;
  animation-delay: 0.6s;
}

.steam {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 30px;
}

.steam-line {
  position: absolute;
  width: 2px;
  height: 20px;
  background: var(--el-color-primary);
  border-radius: 1px;
  animation: steamRise 2s ease-in-out infinite;
  opacity: 0.7;
}

.steam-line:nth-child(1) {
  left: 8px;
  animation-delay: 0s;
}

.steam-line:nth-child(2) {
  left: 19px;
  animation-delay: 0.3s;
}

.steam-line:nth-child(3) {
  right: 8px;
  animation-delay: 0.6s;
}

@keyframes panShake {
  0%, 100% {
    transform: rotate(0deg) translateY(0px);
  }
  25% {
    transform: rotate(-2deg) translateY(-2px);
  }
  75% {
    transform: rotate(2deg) translateY(2px);
  }
}

@keyframes ingredientBounce {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-8px) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes steamRise {
  0% {
    transform: translateY(0px) scaleY(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-10px) scaleY(1.2);
    opacity: 0.4;
  }
  100% {
    transform: translateY(-20px) scaleY(0.8);
    opacity: 0;
  }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.loading-text {
  text-align: center;
}

.loading-text h3 {
  margin: 0 0 8px 0;
  color: var(--el-text-color-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.loading-text p {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 1rem;
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