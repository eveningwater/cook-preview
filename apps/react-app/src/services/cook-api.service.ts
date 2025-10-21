import { BaseCookApiService } from '@cook/core';
import { httpAdapter } from '../adapters/http.adapter';
import { environment } from '../environments/environment';

/**
 * React版本的Cook API服务
 */
export class ReactCookApiService extends BaseCookApiService {
  constructor() {
    super(environment);
  }

  /**
   * 获取HTTP适配器
   */
  getHttpAdapter() {
    return httpAdapter;
  }


  /**
   * 获取图片的base64数据URL
   * 直接使用父类的实现，core包已经处理了相对路径
   */
  async getImageDataUrl(imagePath: string): Promise<string> {
    return super.getImageDataUrl(imagePath);
  }
}

export const cookApiService = new ReactCookApiService();
