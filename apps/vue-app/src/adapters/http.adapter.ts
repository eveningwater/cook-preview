import { HttpAdapter, HttpResponse } from '@cook/core';

export class VueHttpAdapter implements HttpAdapter {
  async get<T>(url: string, config?: any): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      ...config
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getWithHeaders<T>(url: string, config?: any): Promise<HttpResponse<T>> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      ...config
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      ...config
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}