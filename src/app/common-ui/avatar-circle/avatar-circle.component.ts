import {Component, input, InputSignal} from '@angular/core';
import {ImgUrlPipe} from "../../helpers/pipes/img-url.pipe";
import {Profile} from '../../data/interfaces/profile.interface';

@Component({
  selector: 'app-avatar-circle',
    imports: [
        ImgUrlPipe
    ],
  templateUrl: './avatar-circle.component.html',
  styleUrl: './avatar-circle.component.scss'
})
export class AvatarCircleComponent {
  avatarUrl: InputSignal<string | undefined | null> = input<string | null>();
}
