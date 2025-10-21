export type ThemeMode = 'light' | 'dark' | 'custom';

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

export interface ThemeConfig {
  mode: ThemeMode;
  customTheme?: CustomTheme;
}

export const PRESET_CUSTOM_THEMES: Record<string, CustomTheme> = {
  ocean: {
    primary: '#2196F3',
    secondary: '#03DAC6',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  forest: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    background: '#F1F8E9',
    surface: '#FFFFFF',
    text: '#1B5E20',
    textSecondary: '#558B2F',
    border: '#C8E6C9',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  sunset: {
    primary: '#FF5722',
    secondary: '#FF9800',
    background: '#FFF3E0',
    surface: '#FFFFFF',
    text: '#BF360C',
    textSecondary: '#E65100',
    border: '#FFCCBC',
    shadow: 'rgba(0, 0, 0, 0.1)'
  }
};
