<template>
  <div class="recipe-detail-view">
    <!-- 顶部返回按钮 -->
    <div class="detail-header">
      <div class="header-content">
        <el-button type="primary" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回菜谱列表
        </el-button>
      </div>
    </div>

    <main class="detail-main">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <CookingLoader 
          text="正在烹饪美味菜谱..."
          sub-text="请稍候，我们正在为您准备详细的制作步骤"
        />
      </div>

      <!-- 错误状态 -->
      <div v-if="error" class="error-container">
        <el-result icon="error" title="加载失败" :sub-title="error">
          <template #extra>
            <el-button type="primary" @click="goBack">返回首页</el-button>
          </template>
        </el-result>
      </div>

      <!-- 菜谱内容 -->
      <div v-if="!loading && !error && recipe" class="recipe-content">
        <el-card shadow="hover">
          <template #header>
            <div class="recipe-header">
              <h1 class="recipe-title">{{ recipe.name }}</h1>
              <el-tag type="primary" size="large">
                <el-icon class="category-icon"><component :is="getCategoryIcon(recipe.path.split('/')[0])" /></el-icon>
                {{ currentCategory }}
              </el-tag>
            </div>
          </template>

          <div class="markdown-content" v-html="renderedContent"></div>

          <template #footer>
            <div class="recipe-footer">
              <div class="navigation-buttons">
                <el-button
                  :disabled="!hasPrevious"
                  @click="goToPrevious"
                >
                  <el-icon><ArrowLeft /></el-icon>
                  上一个菜谱
                </el-button>
                
                <el-button @click="goBack">
                  <el-icon><ArrowLeft /></el-icon>
                  返回菜谱列表
                </el-button>
                
                <el-button
                  :disabled="!hasNext"
                  @click="goToNext"
                >
                  下一个菜谱
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </template>
        </el-card>
      </div>
    </main>

    <!-- 回到顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { RecipeUtils } from '@cook/core';
import { recipeDetailService } from '../services/recipe-detail.service';
import CookingLoader from '../components/CookingLoader.vue';
import BackToTop from '../components/BackToTop.vue';

const route = useRoute();
const router = useRouter();

// 使用服务中的响应式状态
const recipe = recipeDetailService.recipeRef;
const loading = recipeDetailService.loadingRef;
const error = recipeDetailService.errorRef;
const currentCategory = recipeDetailService.currentCategoryRef;
const hasPrevious = recipeDetailService.hasPreviousRef;
const hasNext = recipeDetailService.hasNextRef;

const renderedContent = computed(() => {
  if (!recipe.value?.content) return '';
  return recipe.value.content; // 内容已经在服务中处理过了
});

onMounted(() => {
  loadRecipe();
});

watch(() => route.params, () => {
  if (route.name === 'recipe-detail') {
    loadRecipe();
  }
});

async function loadRecipe() {
  const categoryPath = route.params.category as string;
  const recipeName = route.params.recipe as string;
  
  if (categoryPath && recipeName) {
    await recipeDetailService.loadRecipeDetail(categoryPath, recipeName);
  }
}

function goBack() {
  router.push('/');
}

function goToPrevious() {
  if (hasPrevious.value) {
    const previousRecipe = recipeDetailService.getPreviousRecipe();
    if (previousRecipe) {
      router.push(`/recipe/${currentCategory.value}/${previousRecipe.name}`);
    }
  }
}

function goToNext() {
  if (hasNext.value) {
    const nextRecipe = recipeDetailService.getNextRecipe();
    if (nextRecipe) {
      router.push(`/recipe/${currentCategory.value}/${nextRecipe.name}`);
    }
  }
}

function getCategoryIcon(categoryPath: string): string {
  return RecipeUtils.getCategoryIcon(categoryPath);
}
</script>

<style scoped>
.recipe-detail-view {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
}

.detail-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  padding: 12px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.recipe-footer {
  padding: 16px 0 0 0;
  border-top: 1px solid var(--el-border-color-lighter);
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.detail-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}


.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 60px 20px;
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-large);
  box-shadow: 0 2px 8px var(--el-box-shadow-light);
  margin: 20px;
  transition: var(--el-transition-all);
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

.recipe-content {
  margin-top: 20px;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.recipe-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.category-icon {
  margin-right: 4px;
}

.markdown-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--el-text-color-regular);
}

.markdown-content :deep(h1) {
  font-size: 28px;
  margin: 24px 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--el-border-color);
}

.markdown-content :deep(h2) {
  font-size: 24px;
  margin: 20px 0 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.markdown-content :deep(h3) {
  font-size: 20px;
  margin: 16px 0 8px;
}

.markdown-content :deep(h4) {
  font-size: 18px;
  margin: 12px 0 6px;
}

.markdown-content :deep(p) {
  margin: 12px 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 12px 0;
  padding-left: 28px;
}

.markdown-content :deep(li) {
  margin: 6px 0;
}

.markdown-content :deep(code) {
  background-color: var(--el-fill-color-light);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.markdown-content :deep(pre) {
  background-color: var(--el-fill-color);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid var(--el-color-primary);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--el-text-color-secondary);
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid var(--el-border-color);
  padding: 8px 12px;
  text-align: left;
}

.markdown-content :deep(th) {
  background-color: var(--el-fill-color-light);
  font-weight: 600;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.markdown-content :deep(a) {
  color: var(--el-color-primary);
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--el-border-color);
  margin: 24px 0;
}

@media (max-width: 768px) {
  .detail-main {
    padding: 16px;
  }
  
  .navigation-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .navigation-buttons .el-button {
    width: 100%;
  }
  
  .recipe-title {
    font-size: 22px;
  }
  
  .markdown-content {
    font-size: 15px;
  }
  
  .markdown-content :deep(h1) {
    font-size: 24px;
  }
  
  .markdown-content :deep(h2) {
    font-size: 20px;
  }
  
  .markdown-content :deep(h3) {
    font-size: 18px;
  }

  .cooking-loader {
    width: 100px;
    height: 100px;
  }

  .pan {
    width: 60px;
    height: 30px;
    border-radius: 0 0 30px 30px;
  }

  .ingredients {
    width: 50px;
    height: 50px;
  }

  .ingredient.ingredient-1 {
    width: 10px;
    height: 10px;
  }

  .ingredient.ingredient-2 {
    width: 8px;
    height: 8px;
  }

  .ingredient.ingredient-3 {
    width: 6px;
    height: 6px;
  }

  .ingredient.ingredient-4 {
    width: 12px;
    height: 12px;
  }

  .loading-text h3 {
    font-size: 1.25rem;
  }

  .loading-text p {
    font-size: 0.9rem;
  }
}
</style>