import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg[icon]',
  standalone: true,
  template: '<svg:use [attr.href]="href"></svg:use>',
  styleUrls: []
})
export class SvgIconComponent {
  @Input() icon: string = '';

  get href() {
    return `/assets/svg/${this.icon}.svg#${this.icon}`;
  }
}
