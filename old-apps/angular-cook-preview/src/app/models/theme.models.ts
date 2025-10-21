// 主题类型
export type ThemeMode = 'light' | 'dark' | 'custom';

// 自定义主题配置
export interface CustomTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

// 主题配置
export interface ThemeConfig {
  mode: ThemeMode;
  customTheme?: CustomTheme;
}

// 预设的自定义主题
export const PRESET_CUSTOM_THEMES: Record<string, CustomTheme> = {
  ocean: {
    primary: '#0077be',
    secondary: '#00a8e8',
    background: '#f0f8ff',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    border: '#e0e0e0',
    shadow: 'rgba(0, 119, 190, 0.1)'
  },
  forest: {
    primary: '#2d6a4f',
    secondary: '#52b788',
    background: '#f1faee',
    surface: '#ffffff',
    text: '#1b4332',
    textSecondary: '#52796f',
    border: '#d8f3dc',
    shadow: 'rgba(45, 106, 79, 0.1)'
  },
  sunset: {
    primary: '#e76f51',
    secondary: '#f4a261',
    background: '#fef6e4',
    surface: '#ffffff',
    text: '#264653',
    textSecondary: '#2a9d8f',
    border: '#f8edeb',
    shadow: 'rgba(231, 111, 81, 0.1)'
  }
};
