import { Component, input, InputSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {AvatarCircleComponent} from '@tt/common-ui';
import { PostComment } from '../../data';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment: InputSignal<PostComment | undefined> = input<PostComment>();
}
