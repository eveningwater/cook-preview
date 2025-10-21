import React from 'react';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import { HomeOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

interface NavigationProps {
  onSearchClick?: () => void;
  onSettingsClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSearchClick, onSettingsClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      background: 'var(--ant-color-bg-container)',
      borderBottom: '1px solid var(--ant-color-border)',
      padding: '0 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title 
          level={3} 
          style={{ 
            margin: 0, 
            color: 'var(--ant-color-primary)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          老乡鸡菜谱预览
        </Title>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            background: 'transparent',
            border: 'none',
            minWidth: '200px'
          }}
        />
        
        <Space>
          <Button 
            icon={<SearchOutlined />} 
            onClick={onSearchClick}
            type="text"
          >
            搜索
          </Button>
          <Button 
            icon={<SettingOutlined />} 
            onClick={onSettingsClick}
            type="text"
          >
            设置
          </Button>
        </Space>
      </div>
    </Header>
  );
};

export default Navigation;
