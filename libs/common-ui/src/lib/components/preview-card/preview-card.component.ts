import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewCard } from '@tt/data-access';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { AvatarNameComponent } from '../avatar-name/avatar-name.component';

@Component({
  selector: 'tt-preview-card',
  imports: [CommonModule, SvgIconComponent, RouterLink, AvatarNameComponent],
  templateUrl: './preview-card.component.html',
  styleUrl: './preview-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PreviewCardComponent {
  card = input.required<PreviewCard>();
  subscribed = output<{ id: number }>();

  subscribeHandler(id: number) {
    this.subscribed.emit({ id });
  }
}
