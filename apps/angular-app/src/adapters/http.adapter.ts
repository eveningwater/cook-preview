import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpAdapter } from '@cook/core';

@Injectable({
  providedIn: 'root'
})
export class AngularHttpAdapter implements HttpAdapter {
  constructor(private http: HttpClient) {}

  get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const httpHeaders = new HttpHeaders(headers);
    return this.http.get<T>(url, { headers: httpHeaders }).toPromise() as Promise<T>;
  }
}
