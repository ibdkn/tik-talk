import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgUrlPipe } from '../../pipes';

@Component({
  selector: 'tt-avatar-name',
  imports: [CommonModule, ImgUrlPipe],
  templateUrl: './avatar-name.component.html',
  styleUrl: './avatar-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarNameComponent {
  @Input() avatarUrl?: string;
  @Input() title!: string;
  @Input() subtitle?: string;
}
