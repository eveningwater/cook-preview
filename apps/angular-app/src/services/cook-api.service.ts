import { Injectable } from '@angular/core';
import { BaseCookApiService, HttpAdapter } from '@cook/core';
import { environment } from '../environments/environment';
import { AngularHttpAdapter } from '../adapters/http.adapter';

@Injectable({
  providedIn: 'root'
})
export class CookApiService extends BaseCookApiService {
  constructor(private httpAdapter: AngularHttpAdapter) {
    super(environment);
  }

  getHttpAdapter(): HttpAdapter {
    return this.httpAdapter;
  }
}