import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdownLinks',
  standalone: true,
})
export class MarkdownLinksPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string): SafeHtml {
    if (!text) return '';

    const html = text.replace(
      /\[([^\]]+)\]\((\/[^)]+)\)/g,
      '<a href="$2" class="community-link">$1</a>'
    );

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
