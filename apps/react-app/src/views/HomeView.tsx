import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Spin, Alert, Space } from 'antd';
import { RecipeCategory } from '@cook/core';
import { cookApiService } from '../services/cook-api.service';
import RecipeCategoryComponent from '../components/RecipeCategory';
import Search from '../components/Search';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomeView: React.FC = () => {
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<RecipeCategory[]>([]);
  const [activeCategory] = useState<string | null>(null);

  useEffect(() => {
    loadRecipeData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, categories, activeCategory]);

  const loadRecipeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 统一在 base-cook-api.service.ts 中处理，前端只负责调用和显示
      const categoriesData = await cookApiService.getRecipeCategories();
      
      setCategories(categoriesData);
      setFilteredCategories([...categoriesData]);
      
    } catch (err) {
      // 使用模拟数据作为fallback
      const fallbackCategories: RecipeCategory[] = [
        { name: '热菜', path: '热菜', sha: '' },
        { name: '凉菜', path: '凉菜', sha: '' },
        { name: '汤品', path: '汤品', sha: '' },
        { name: '主食', path: '主食', sha: '' },
        { name: '蒸菜', path: '蒸菜', sha: '' },
        { name: '炒菜', path: '炒菜', sha: '' },
      ];
      setCategories(fallbackCategories);
      setFilteredCategories(fallbackCategories);
      setError('API连接失败，显示模拟数据');
    } finally {
      setLoading(false);
    }
  };


  const applyFilters = () => {
    if (activeCategory) {
      // 如果选择了特定分类，只在该分类内搜索
      const activeCat = categories.find(cat => cat.name === activeCategory);
      if (activeCat) {
        const filteredCat = filterRecipes(activeCat);
        setFilteredCategories(filteredCat.recipes && filteredCat.recipes.length > 0 ? [filteredCat] : []);
      }
    } else {
      // 在所有分类中搜索，过滤掉空的分类
      setFilteredCategories(categories
        .map(cat => filterRecipes(cat))
        .filter(cat => cat.recipes && cat.recipes.length > 0));
    }
  };

  const filterRecipes = (category: RecipeCategory): RecipeCategory => {
    if (!searchQuery.trim()) {
      return category;
    }

    const searchTermLower = searchQuery.toLowerCase();
    
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
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // 这些函数保留用于未来的导航功能
  // const onCategorySelected = (category: RecipeCategory) => {
  //   setActiveCategory(category.name);
  //   setFilteredCategories([category]);
  // };

  // const onShowAll = () => {
  //   setActiveCategory(null);
  //   setSearchQuery('');
  //   setFilteredCategories([...categories]);
  // };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Title level={3}>正在加载菜谱分类...</Title>
          <Paragraph type="secondary">请稍候，我们正在为您准备美味的菜谱</Paragraph>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="加载失败"
        description={error}
        type="error"
        showIcon
        style={{ margin: '16px' }}
      />
    );
  }

  return (
    <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>老乡鸡菜谱预览</Title>
        <Paragraph type="secondary" style={{ fontSize: '16px' }}>
          像老乡鸡那样做饭 - 传承经典，品味生活
        </Paragraph>
      </div>

      <Search
        onSearch={handleSearch}
        onClear={handleClearSearch}
        placeholder="搜索菜谱分类或菜谱名称..."
      />

      {searchQuery && (
        <Card style={{ marginBottom: '24px' }}>
          <Space>
            <span>搜索结果：</span>
            <strong>"{searchQuery}"</strong>
            <span>找到 {filteredCategories.length} 个分类</span>
          </Space>
        </Card>
      )}

              <Row gutter={[24, 24]}>
                {filteredCategories.map((category) => (
                  <Col xs={24} key={category.path}>
                    <RecipeCategoryComponent
                      categoryName={category.name}
                      categoryPath={category.path}
                      recipes={category.recipes || []}
                      loading={false}
                      error={null}
                      searchQuery={searchQuery}
                    />
                  </Col>
                ))}
              </Row>
    </Content>
  );
};

export default HomeView;
