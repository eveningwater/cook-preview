import { DomAdapter } from '@cook/core';

export class VueDomAdapter implements DomAdapter {
  addClass(element: HTMLElement, className: string): void {
    element.classList.add(className);
  }

  removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className);
  }

  hasClass(element: HTMLElement, className: string): boolean {
    return element.classList.contains(className);
  }

  setStyle(element: HTMLElement, property: string, value: string): void {
    element.style.setProperty(property, value);
  }

  getStyle(element: HTMLElement, property: string): string {
    return element.style.getPropertyValue(property);
  }

  removeStyle(element: HTMLElement, property: string): void {
    element.style.removeProperty(property);
  }

  getDocument(): Document {
    return document;
  }

  getBody(): HTMLElement {
    return document.body;
  }

  getHtmlElement(): HTMLElement {
    return document.documentElement;
  }

  getRootElement(): HTMLElement {
    return document.documentElement;
  }
}