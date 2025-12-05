import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Typography, Button, Card, Alert, Space } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Recipe } from '@cook/core';
import { recipeDetailService } from '../services/recipe-detail.service';
import CookingLoader from '../components/CookingLoader';

const { Content } = Layout;
const { Title } = Typography;

const RecipeDetailView: React.FC = () => {
  const { category, recipe: recipeName } = useParams<{ category: string; recipe: string }>();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState('');
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    if (category && recipeName) {
      loadRecipeDetail(category, recipeName);
    }
  }, [category, recipeName]);

  const loadRecipeDetail = async (categoryPath: string, recipeName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await recipeDetailService.loadRecipeDetail(categoryPath, recipeName);
      const state = recipeDetailService.getState();
      
      setRecipe(state.recipe);
      setCurrentCategory(categoryPath);
      setHasPrevious(state.hasPrevious);
      setHasNext(state.hasNext);
    } catch (err) {
      setError('加载菜谱详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const goToPrevious = () => {
    if (hasPrevious) {
      const previousRecipe = recipeDetailService.getPreviousRecipe();
      if (previousRecipe) {
        navigate(`/recipe/${currentCategory}/${previousRecipe.name}`);
      }
    }
  };

  const goToNext = () => {
    if (hasNext) {
      const nextRecipe = recipeDetailService.getNextRecipe();
      if (nextRecipe) {
        navigate(`/recipe/${currentCategory}/${nextRecipe.name}`);
      }
    }
  };

  if (loading) {
    return (
      <Content className="recipe-detail-content recipe-loading">
        <CookingLoader />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="recipe-detail-content">
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
        />
        <div className="error-actions">
          <Button type="primary" onClick={goBack}>
            返回首页
          </Button>
        </div>
      </Content>
    );
  }

  if (!recipe) {
    return (
      <Content className="recipe-detail-content">
        <Alert
          message="菜谱不存在"
          description="您访问的菜谱不存在或已被删除"
          type="warning"
          showIcon
        />
        <div className="error-actions">
          <Button type="primary" onClick={goBack}>
            返回首页
          </Button>
        </div>
      </Content>
    );
  }

  return (
    <Content className="recipe-detail-content recipe-detail-main">
      {/* 返回按钮 */}
      <div className="back-button-container">
        <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
          返回菜谱列表
        </Button>
      </div>

      {/* 菜谱内容 */}
      <Card>
        <div className="recipe-header">
          <Title level={1}>{recipe.name}</Title>
          <Space>
            <span>分类：</span>
            <strong>{currentCategory}</strong>
          </Space>
        </div>

        <div 
          className="markdown-content recipe-content"
          dangerouslySetInnerHTML={{ __html: recipe.content || '' }}
        />

        {/* 导航按钮 */}
        <div className="recipe-navigation">
          <Button
            disabled={!hasPrevious}
            icon={<ArrowLeftOutlined />}
            onClick={goToPrevious}
            className="nav-button"
          >
            上一个菜谱
          </Button>
          
          <Button onClick={goBack} className="nav-button">
            返回菜谱列表
          </Button>
          
          <Button
            disabled={!hasNext}
            icon={<ArrowRightOutlined />}
            onClick={goToNext}
            className="nav-button"
          >
            下一个菜谱
          </Button>
        </div>
      </Card>
    </Content>
  );
};

export default RecipeDetailView;
