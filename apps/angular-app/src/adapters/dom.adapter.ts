import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomAdapter } from '@cook/core';

@Injectable({
  providedIn: 'root'
})
export class AngularDomAdapter implements DomAdapter {
  constructor(@Inject(DOCUMENT) private document: Document) {
    // 构造函数
  }

  addClass(element: Element, className: string): void {
    element.classList.add(className);
  }

  removeClass(element: Element, className: string): void {
    element.classList.remove(className);
  }

  setStyle(element: Element, property: string, value: string): void {
    (element as HTMLElement).style.setProperty(property, value);
  }

  removeStyle(element: Element, property: string): void {
    (element as HTMLElement).style.removeProperty(property);
  }
}