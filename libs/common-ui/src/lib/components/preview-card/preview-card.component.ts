import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewCardData } from '@tt/data-access';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { AvatarNameComponent } from '../avatar-name/avatar-name.component';

@Component({
  selector: 'tt-preview-card',
  imports: [
    CommonModule,
    SvgIconComponent,
    RouterLink,
    AvatarNameComponent,
  ],
  templateUrl: './preview-card.component.html',
  styleUrl: './preview-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewCardComponent {
  @Input() data!: PreviewCardData;
  @Output() subscribed = new EventEmitter<{ id: number }>();

  subscribeHandler(id: number) {
    this.subscribed.emit({ id });
    console.log(this.data);
  }
}
