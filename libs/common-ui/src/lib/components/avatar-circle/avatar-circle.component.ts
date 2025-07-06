import { Component, input, InputSignal } from '@angular/core';
import { ImgUrlPipe } from '../../pipes';

@Component({
  selector: 'app-avatar-circle',
  imports: [ImgUrlPipe],
  templateUrl: './avatar-circle.component.html',
  styleUrl: './avatar-circle.component.scss',
})
export class AvatarCircleComponent {
  avatarUrl: InputSignal<string | undefined | null> = input<string | null>();
}
