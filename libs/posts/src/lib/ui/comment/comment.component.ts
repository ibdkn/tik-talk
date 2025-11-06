import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import { AvatarCircleComponent, TimeAgoPipe } from '@tt/common-ui';
import { PostComment } from '../../../../../data-access/src/lib/posts';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, TimeAgoPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  comment: InputSignal<PostComment | undefined> = input<PostComment>();
}
