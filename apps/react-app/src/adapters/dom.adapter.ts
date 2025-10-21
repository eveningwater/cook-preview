import { DomAdapter } from '@cook/core';

/**
 * React版本的DOM适配器
 */
export class ReactDomAdapter implements DomAdapter {
  setTitle(title: string): void {
    document.title = title;
  }

  setMetaDescription(description: string): void {
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
  }

  setMetaKeywords(keywords: string): void {
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

export const domAdapter = new ReactDomAdapter();
