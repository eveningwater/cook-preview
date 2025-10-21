import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '@cook/core';

const { Title, Text } = Typography;

interface RecipeCardProps {
  recipe: Recipe;
  categoryPath: string;
  searchQuery?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, categoryPath, searchQuery = '' }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${categoryPath}/${recipe.name}`);
  };

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

  return (
    <Card
      hoverable
      onClick={handleCardClick}
      style={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      styles={{
        body: {
          padding: '16px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }
      }}
    >
      <div>
        <Title level={4} style={{ margin: '0 0 8px 0' }}>
          {highlightText(recipe.name, searchQuery)}
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          点击查看详细制作步骤
        </Text>
      </div>
      
      <div style={{ marginTop: '12px' }}>
        <Space wrap>
          <Tag color="blue">{categoryPath}</Tag>
        </Space>
      </div>
    </Card>
  );
};

export default RecipeCard;
