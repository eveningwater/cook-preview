import axios, { AxiosInstance } from 'axios';
import { 
  BaseCookApiService, 
  HttpAdapter
} from '@cook/core';
import { environment } from '../environments/environment';

/**
 * Vue/Axios 的 HTTP 适配器
 * 注意：认证已改为使用 access_token 查询参数，不再使用 Authorization 头部
 */
class AxiosHttpAdapter implements HttpAdapter {
  private api: AxiosInstance;

  constructor(_token: string) {
    // 不再添加 Authorization 头部，认证通过 access_token 查询参数处理
    this.api = axios.create();
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

/**
 * Vue 版本的 CookApiService
 * 继承核心业务逻辑，使用 Axios 实现 HTTP 调用
 */
class CookApiService extends BaseCookApiService {
  constructor() {
    const httpAdapter = new AxiosHttpAdapter(environment.token);
    super(environment);
    this.httpAdapter = httpAdapter;
  }

  public getHttpAdapter() {
    return this.httpAdapter;
  }

  private httpAdapter: HttpAdapter;
}

export const cookApiService = new CookApiService();