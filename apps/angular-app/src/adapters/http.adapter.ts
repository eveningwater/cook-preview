import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpAdapter, HttpResponse as CoreHttpResponse } from '@cook/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AngularHttpAdapter implements HttpAdapter {
  constructor(private http: HttpClient) {}

  get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const httpHeaders = new HttpHeaders(headers);
    return this.http.get<T>(url, { headers: httpHeaders }).toPromise() as Promise<T>;
  }

  async getWithHeaders<T>(url: string, headers?: Record<string, string>): Promise<CoreHttpResponse<T>> {
    const httpHeaders = new HttpHeaders(headers);
    const response = await this.http.get<T>(url, { 
      headers: httpHeaders,
      observe: 'response'
    }).toPromise() as HttpResponse<T>;

    // 提取所有响应头
    const responseHeaders: Record<string, string> = {};
    response.headers.keys().forEach(key => {
      const value = response.headers.get(key);
      if (value) {
        responseHeaders[key.toLowerCase()] = value;
      }
    });

    return {
      data: response.body as T,
      headers: responseHeaders
    };
  }
}
