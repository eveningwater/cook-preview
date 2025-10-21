import { Pipe, PipeTransform, inject } from '@angular/core';
import { AngularMarkdownService } from '../services/markdown.service';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  private markdownService = inject(AngularMarkdownService);

  transform(value: string, categoryPath?: string): string {
    return this.markdownService.toHtml(value, categoryPath);
  }

  async transformWithBase64Images(markdown: string, categoryPath?: string): Promise<string> {
    return await this.markdownService.transformWithBase64Images(markdown, categoryPath || '');
  }
}
