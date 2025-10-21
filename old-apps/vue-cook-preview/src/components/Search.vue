<template>
  <div class="search-container">
    <div class="search-content">
      <el-input
        v-model="searchTerm"
        placeholder="搜索菜谱名称或分类..."
        clearable
        size="large"
        @input="handleSearchChange"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';

const searchTerm = ref('');

const emit = defineEmits<{
  searchChanged: [term: string];
}>();

function handleSearchChange() {
  emit('searchChanged', searchTerm.value);
}
</script>

<style scoped>
.search-container {
  position: sticky;
  top: 58px;
  z-index: 99;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  padding: 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.el-input {
  max-width: 500px;
}

@media (max-width: 768px) {
  .search-container {
    top: 56px;
    padding: 12px 0;
  }
  
  .el-input {
    max-width: 100%;
  }
}
</style>

