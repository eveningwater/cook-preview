import React from 'react';
import { Typography, Row, Col, Spin, Alert } from 'antd';
import { Recipe } from '@cook/core';
import RecipeCard from './RecipeCard';

const { Title } = Typography;

interface RecipeCategoryProps {
  categoryName: string;
  categoryPath: string;
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  searchQuery?: string;
}

const RecipeCategory: React.FC<RecipeCategoryProps> = ({
  categoryName,
  recipes,
  loading,
  error,
  searchQuery = '',
}) => {
  // 高亮搜索关键字
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ 
          backgroundColor: 'var(--ant-color-warning-bg)', 
          color: 'var(--ant-color-warning-text)',
          padding: '0 2px',
          borderRadius: '2px'
        }}>
          {part}
        </mark>
      ) : part
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
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
        style={{ margin: '16px 0' }}
      />
    );
  }

  if (recipes.length === 0) {
    return (
      <Alert
        message="暂无菜谱"
        description="该分类下暂时没有菜谱"
        type="info"
        showIcon
        style={{ margin: '16px 0' }}
      />
    );
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: '24px' }}>
        {highlightText(categoryName, searchQuery)}
      </Title>
      <Row gutter={[16, 16]}>
        {recipes.map((recipe) => (
          <Col xs={24} sm={12} md={8} lg={6} key={recipe.path}>
            <RecipeCard 
              recipe={recipe} 
              categoryPath={categoryName} 
              searchQuery={searchQuery}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RecipeCategory;
