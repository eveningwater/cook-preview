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
        <el-icon class="is-loading" :size="48"><Loading /></el-icon>
        <p class="loading-text">正在加载菜谱...</p>
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
              <el-tag type="primary" size="large">{{ currentCategory }}</el-tag>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight, Loading } from '@element-plus/icons-vue';
import type { Recipe } from '../models/repo.models';
import { cookApiService } from '../services/cook-api.service';
import { markdownService } from '../services/markdown.service';

const route = useRoute();
const router = useRouter();

const recipe = ref<Recipe | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const currentCategory = ref('');
const currentRecipeIndex = ref(-1);
const allRecipes = ref<Recipe[]>([]);

const hasPrevious = computed(() => currentRecipeIndex.value > 0);
const hasNext = computed(() => currentRecipeIndex.value < allRecipes.value.length - 1);

const renderedContent = computed(() => {
  if (!recipe.value?.content) return '';
  return markdownService.toHtml(recipe.value.content);
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
    currentCategory.value = categoryPath;
    await loadCategoryRecipes(categoryPath, recipeName);
  }
}

async function loadCategoryRecipes(categoryPath: string, recipeName: string) {
  loading.value = true;
  error.value = null;

  try {
    // 先加载分类的所有菜谱
    const recipes = await cookApiService.getRecipesByCategory({
      name: categoryPath,
      path: categoryPath,
      sha: ''
    });
    
    // 过滤掉README.md文件并按名称排序
    allRecipes.value = recipes
      .filter(r => !r.name.includes('README'))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    
    currentRecipeIndex.value = allRecipes.value.findIndex(r => r.name === recipeName);
    
    // 如果找不到精确匹配，尝试模糊匹配
    if (currentRecipeIndex.value === -1) {
      currentRecipeIndex.value = allRecipes.value.findIndex(r =>
        r.name.includes(recipeName) || recipeName.includes(r.name)
      );
    }
    
    // 然后加载当前菜谱详情
    await loadRecipeDetail(categoryPath, recipeName);
  } catch (err) {
    error.value = '加载分类失败，请稍后重试';
    loading.value = false;
    console.error('Error loading category recipes:', err);
  }
}

async function loadRecipeDetail(categoryPath: string, recipeName: string) {
  loading.value = true;
  error.value = null;

  const recipePath = `${categoryPath}/${recipeName}.md`;
  
  // 创建临时的recipe对象
  const tempRecipe: Recipe = {
    name: recipeName,
    path: recipePath,
    sha: ''
  };

  try {
    const loadedRecipe = await cookApiService.getRecipeDetail(tempRecipe);
    recipe.value = loadedRecipe;
    
    // 异步转换图片为base64
    if (loadedRecipe.content) {
      try {
        const processedContent = await markdownService.transformWithBase64Images(
          loadedRecipe.content,
          categoryPath
        );
        recipe.value = { ...loadedRecipe, content: processedContent };
      } catch (err) {
        console.error('Error processing images:', err);
        // 如果转换失败，保持原始内容
      }
    }
    
    loading.value = false;
  } catch (err) {
    error.value = '加载菜谱详情失败，请稍后重试';
    loading.value = false;
    console.error('Error loading recipe detail:', err);
  }
}

function goBack() {
  router.push('/');
}

function goToPrevious() {
  if (hasPrevious.value) {
    const previousRecipe = allRecipes.value[currentRecipeIndex.value - 1];
    router.push(`/recipe/${currentCategory.value}/${previousRecipe.name}`);
  }
}

function goToNext() {
  if (hasNext.value) {
    const nextRecipe = allRecipes.value[currentRecipeIndex.value + 1];
    router.push(`/recipe/${currentCategory.value}/${nextRecipe.name}`);
  }
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

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 60px 20px;
}

.loading-text {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin-top: 20px;
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
}
</style>

