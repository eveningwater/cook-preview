import axios, { AxiosInstance } from 'axios';
import { 
  BaseCookApiService, 
  HttpAdapter,
  createEnvironmentConfig
} from '@cook/core';
import { environment } from '../environments/environment';

/**
 * Vue/Axios 的 HTTP 适配器
 */
class AxiosHttpAdapter implements HttpAdapter {
  private api: AxiosInstance;

  constructor(token: string) {
    this.api = axios.create({
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }
}

/**
 * Vue 版本的 CookApiService
 * 继承核心业务逻辑，使用 Axios 实现 HTTP 调用
 */
class CookApiService extends BaseCookApiService {
  constructor() {
    const envConfig = createEnvironmentConfig(environment);
    const httpAdapter = new AxiosHttpAdapter(envConfig.token);
    super(httpAdapter, envConfig);
  }

  /**
   * 重写 getLinkUrl 以支持 Vue 路由
   */
  override getLinkUrl(linkPath: string, categoryPath?: string): string {
    const baseUrl = `${location.origin}/vue-cook-preview/#`;
    return super.getLinkUrl(linkPath, categoryPath, baseUrl);
  }
}

export const cookApiService = new CookApiService();

