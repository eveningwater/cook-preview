/**
 * 版本切换工具类
 * 提供统一的版本URL生成和切换逻辑
 */

export interface VersionConfig {
  react: {
    development: string;
    production: string;
  };
  angular: {
    development: string;
    production: string;
  };
  vue: {
    development: string;
    production: string;
  };
}

export interface VersionOption {
  key: string;
  name: string;
  icon?: string;
  disabled?: boolean;
}

/**
 * 默认版本配置
 */
export const DEFAULT_VERSION_CONFIG: VersionConfig = {
  react: {
    development: 'http://localhost:3002/',
    production: '/react/'
  },
  angular: {
    development: 'http://localhost:4200/',
    production: '/angular/'
  },
  vue: {
    development: 'http://localhost:3001/#/',
    production: '/vue/'
  }
};

/**
 * 默认版本选项
 */
export const DEFAULT_VERSION_OPTIONS: VersionOption[] = [
  {
    key: 'react',
    name: 'React版本',
    icon: 'thunderbolt'
  },
  {
    key: 'angular', 
    name: 'Angular版本',
    icon: 'code'
  },
  {
    key: 'vue',
    name: 'Vue版本',
    icon: 'rocket'
  }
];

/**
 * 版本切换工具类
 */
export class VersionSwitcherUtils {
  private config: VersionConfig;
  private isDevelopment: boolean;

  constructor(config: VersionConfig = DEFAULT_VERSION_CONFIG, isDevelopment?: boolean) {
    this.config = config;
    // 如果没有传入isDevelopment，尝试自动检测
    this.isDevelopment = isDevelopment ?? this.detectDevelopment();
  }

  /**
   * 自动检测是否为开发环境
   */
  private detectDevelopment(): boolean {
    // 在浏览器环境中检测
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname.includes('localhost');
    }
    // 在Node.js环境中，默认返回false
    return false;
  }

  /**
   * 获取指定版本的URL
   */
  getVersionUrl(version: string): string {
    const versionKey = version as keyof VersionConfig;
    const versionConfig = this.config[versionKey];
    
    if (!versionConfig) {
      console.warn(`Unknown version: ${version}, falling back to react`);
      return this.config.react[this.isDevelopment ? 'development' : 'production'];
    }

    if (this.isDevelopment) {
      return versionConfig.development;
    } else {
      // 生产环境：构建完整的URL
      const baseUrl = versionConfig.production;
      
      // 如果当前在浏览器环境中，使用当前域名
      if (typeof window !== 'undefined') {
        const currentOrigin = window.location.origin;
        const currentPath = window.location.pathname;
        
        // 提取构建目录名（cook-preview-v2）
        const buildDirMatch = currentPath.match(/^\/([^\/]+)/);
        const buildDir = buildDirMatch ? buildDirMatch[1] : 'cook-preview-v2';
        
        // 构建完整URL: origin + buildDir + versionPath + hash
        const fullUrl = `${currentOrigin}/${buildDir}${baseUrl}`;   
        console.log('fullUrl', fullUrl);
        return fullUrl + '#/';
      }
      
      // 非浏览器环境，返回相对路径
      return baseUrl;
    }
  }

  /**
   * 切换到指定版本
   */
  switchToVersion(version: string): void {
    const url = this.getVersionUrl(version);
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }

  /**
   * 获取所有版本选项（带URL）
   */
  getVersionOptions(baseOptions: VersionOption[] = DEFAULT_VERSION_OPTIONS): (VersionOption & { url: string })[] {
    return baseOptions.map(option => ({
      ...option,
      url: this.getVersionUrl(option.key)
    }));
  }

  /**
   * 检查是否为当前版本
   */
  isCurrentVersion(version: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const currentUrl = window.location.href;
    const versionUrl = this.getVersionUrl(version);
    
    // 移除末尾的斜杠进行比较
    const normalizedCurrent = currentUrl.replace(/\/$/, '');
    const normalizedVersion = versionUrl.replace(/\/$/, '');
    
    return normalizedCurrent.includes(normalizedVersion.replace(/^https?:\/\//, ''));
  }

  /**
   * 获取当前版本
   */
  getCurrentVersion(): string {
    for (const version of Object.keys(this.config)) {
      if (this.isCurrentVersion(version)) {
        return version;
      }
    }
    return 'react'; // 默认返回react
  }
}

/**
 * 创建版本切换工具实例
 */
export function createVersionSwitcher(
  config?: Partial<VersionConfig>, 
  isDevelopment?: boolean
): VersionSwitcherUtils {
  const mergedConfig = { ...DEFAULT_VERSION_CONFIG, ...config };
  return new VersionSwitcherUtils(mergedConfig, isDevelopment);
}
