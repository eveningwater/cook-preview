import { HttpAdapter, HttpResponse } from '@cook/core';
import { environment } from '../environments/environment';

/**
 * React版本的HTTP适配器
 */
export class ReactHttpAdapter implements HttpAdapter {
  private baseUrl: string;

  constructor() {
    this.baseUrl = environment.apiBase;
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // 不再添加 Authorization 头部，认证通过 access_token 查询参数处理
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  async getWithHeaders<T>(url: string, headers?: Record<string, string>): Promise<HttpResponse<T>> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // 不再添加 Authorization 头部，认证通过 access_token 查询参数处理
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    // 提取所有响应头
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key.toLowerCase()] = value;
    });

    return {
      data: await response.json(),
      headers: responseHeaders
    };
  }

  async post<T>(url: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(url.startsWith('http') ? url : `${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 不再添加 Authorization 头部，认证通过 access_token 查询参数处理
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async put<T>(url: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(url.startsWith('http') ? url : `${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 不再添加 Authorization 头部，认证通过 access_token 查询参数处理
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(url.startsWith('http') ? url : `${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        // 不再添加 Authorization 头部，认证通过 access_token 查询参数处理
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const httpAdapter = new ReactHttpAdapter();
