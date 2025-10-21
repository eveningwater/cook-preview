import { Injectable } from '@angular/core';
import { StorageAdapter } from '@cook/core';

@Injectable({
  providedIn: 'root'
})
export class AngularStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}