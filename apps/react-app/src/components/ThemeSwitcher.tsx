import React, { useState, useRef, useEffect } from 'react';
import { ThemeType } from '../services/theme.service';
import { themeService } from '../services/theme.service';
import { PRESET_CUSTOM_THEMES } from '@cook/core';
import './ThemeSwitcher.css';

interface ThemeSwitcherProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  const [showCustomThemes, setShowCustomThemes] = useState(false);
  const themeSwitcherRef = useRef<HTMLDivElement>(null);

  const switchTheme = (theme: ThemeType) => {
    onThemeChange(theme);
    if (theme === 'custom') {
      setShowCustomThemes(true);
    } else {
      setShowCustomThemes(false);
    }
  };

  const applyPresetTheme = (presetName: string) => {
    themeService.applyPresetTheme(presetName);
  };

  const getPresetName = (key: string): string => {
    const names: Record<string, string> = {
      ocean: '海洋',
      forest: '森林',
      sunset: '日落'
    };
    return names[key] || key;
  };

  // 点击外部关闭自定义主题面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeSwitcherRef.current && !themeSwitcherRef.current.contains(event.target as Node)) {
        setShowCustomThemes(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 监听主题变化
  useEffect(() => {
    if (currentTheme === 'custom') {
      setShowCustomThemes(true);
    } else {
      setShowCustomThemes(false);
    }
  }, [currentTheme]);

  // 初始化时检查当前主题
  useEffect(() => {
    if (currentTheme === 'custom') {
      setShowCustomThemes(true);
    }
  }, []);

  const presetThemes = Object.keys(PRESET_CUSTOM_THEMES);

  return (
    <div ref={themeSwitcherRef} className="theme-switcher">
      <div className="theme-buttons">
        <button
          className={`theme-button ${currentTheme === 'light' ? 'active' : ''}`}
          onClick={() => switchTheme('light')}
          title="明亮模式"
        >
          <span className="theme-icon">☀️</span>
          <span className="theme-label">明亮</span>
        </button>
        <button
          className={`theme-button ${currentTheme === 'dark' ? 'active' : ''}`}
          onClick={() => switchTheme('dark')}
          title="暗黑模式"
        >
          <span className="theme-icon">🌙</span>
          <span className="theme-label">暗黑</span>
        </button>
        <button
          className={`theme-button ${currentTheme === 'custom' ? 'active' : ''}`}
          onClick={() => switchTheme('custom')}
          title="自定义模式"
        >
          <span className="theme-icon">🎨</span>
          <span className="theme-label">自定义</span>
        </button>
      </div>

      {/* 自定义主题选择器 */}
      {showCustomThemes && currentTheme === 'custom' && (
        <div className="custom-themes">
          <div className="custom-themes-header">
            <span className="custom-themes-title">预设主题</span>
          </div>
          <div className="preset-themes">
            {presetThemes.map((preset) => (
              <button
                key={preset}
                className="preset-theme-button"
                onClick={() => applyPresetTheme(preset)}
                title={getPresetName(preset)}
              >
                <div className="preset-theme-preview" data-theme={preset}>
                  <div className="preview-dot"></div>
                  <div className="preview-dot"></div>
                  <div className="preview-dot"></div>
                </div>
                <span className="preset-theme-name">{getPresetName(preset)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
