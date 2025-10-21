import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { 
  BaseCookApiService, 
  HttpAdapter,
  createEnvironmentConfig
} from '@cook/core';
import { environment } from '../../environments/environment';
import { isProduction } from '../app.config';

/**
 * Angular 的 HTTP 适配器
 */
class AngularHttpAdapter implements HttpAdapter {
  constructor(private http: HttpClient) {}

  async get<T>(url: string, config?: any): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(url, config)
    );
  }
}

/**
 * Angular 版本的 CookApiService
 * 继承核心业务逻辑，实现框架特定的 HTTP 调用
 */
@Injectable({
  providedIn: 'root'
})
export class CookApiService extends BaseCookApiService {
  constructor(private httpClient: HttpClient) {
    const envConfig = createEnvironmentConfig(environment);
    const httpAdapter = new AngularHttpAdapter(httpClient);
    super(httpAdapter, envConfig);
  }

  /**
   * 重写 getLinkUrl 以支持 Angular 路由
   */
  override getLinkUrl(linkPath: string, categoryPath?: string): string {
    const baseUrl = `${location.origin}/cook-preview/${isProduction ? '#/' : ''}`;
    return super.getLinkUrl(linkPath, categoryPath, baseUrl);
  }
}

