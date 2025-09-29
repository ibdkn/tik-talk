import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarNameComponent, SvgIconComponent } from '@tt/common-ui';
import { PreviewCardData } from '@tt/data-access';
import { RouterLink } from '@angular/router';

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
}
