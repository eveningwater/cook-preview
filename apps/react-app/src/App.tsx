import React, { useEffect, useState } from 'react';
import { ConfigProvider, Layout, Space, Typography } from 'antd';
import { HomeOutlined, MenuOutlined, CoffeeOutlined, ShopOutlined } from '@ant-design/icons';
import AppRouter from './router';
import ThemeSwitcher from './components/ThemeSwitcher';
import VersionSwitcher from './components/VersionSwitcher';
import BackToTop from './components/BackToTop';
import { themeService, ThemeType } from './services/theme.service';
import { environment } from './environments/environment';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Link } = Typography;

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
  const [currentVersion, setCurrentVersion] = useState<string>('react');

  useEffect(() => {
    // 初始化主题
    const theme = themeService.getCurrentTheme();
    setCurrentTheme(theme);
    themeService.applyTheme(theme);
  }, []);

  const handleThemeChange = (theme: ThemeType) => {
    setCurrentTheme(theme);
    themeService.setTheme(theme);
    // 强制重新应用主题
    themeService.applyTheme(theme);
  };

  const handleVersionChange = (version: string) => {
    setCurrentVersion(version);
    // 版本切换逻辑由VersionSwitcher组件自己处理
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#409eff',
          colorBgBase: 'var(--ant-color-bg-base)',
          colorBgContainer: 'var(--ant-color-bg-container)',
          colorText: 'var(--ant-color-text)',
          colorTextSecondary: 'var(--ant-color-text-secondary)',
          colorBorder: 'var(--ant-color-border)',
          colorFillSecondary: 'var(--ant-color-fill-secondary)',
          colorBgElevated: 'var(--ant-color-bg-container)',
        },
        components: {
          Select: {
            optionSelectedBg: 'var(--ant-color-primary-bg)',
            optionActiveBg: 'var(--ant-color-fill)',
          },
        },
      }}
    >
      <Layout className="app-layout">
        {/* 头部 */}
        <Header className="app-header">
          <div className="header-left">
            <Space>
              <HomeOutlined className="header-icon" />
              <Typography.Title level={3} className="header-title">
                老乡鸡菜谱预览
              </Typography.Title>
            </Space>
            <Typography.Text type="secondary" className="header-subtitle">
              像老乡鸡那样做饭 - 菜谱预览
            </Typography.Text>
          </div>
          
          <div className="header-right">
            <Space className="header-icons">
              <MenuOutlined className="header-icon" />
              <CoffeeOutlined className="header-icon" />
              <ShopOutlined className="header-icon" />
            </Space>
            
            <Space className="header-controls">
              <VersionSwitcher 
                currentVersion={currentVersion}
                onVersionChange={handleVersionChange}
              />
              <ThemeSwitcher 
                currentTheme={currentTheme}
                onThemeChange={handleThemeChange}
              />
            </Space>
          </div>
        </Header>

        {/* 主要内容 */}
        <Content className="main-content">
          <AppRouter />
        </Content>

        {/* 回到顶部按钮 */}
        <BackToTop />

        {/* 页脚 */}
        <Footer className="app-footer">
          <div className="footer-item">
            数据来源：
            <Link href={environment.repoUrl} target="_blank" rel="noopener noreferrer">
              CookLikeHOC
            </Link>
          </div>
          <div className="footer-item">
            Inspired by: 
            <Link href="https://github.com/Gar-b-age/CookLikeHOC" target="_blank" rel="noopener noreferrer">
              @Gar-b-age/CookLikeHOC
            </Link>
            - 感谢提供数据来源
          </div>
          <div className="footer-slogan">
            像老乡鸡那样做饭 - 传承经典，品味生活
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
