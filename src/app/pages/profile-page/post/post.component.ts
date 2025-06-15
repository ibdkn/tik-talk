import {
  Component,
  EventEmitter,
  inject,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import {Comment, Post} from '../../../data/interfaces/post.interface';
import {AvatarCircleComponent} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {PostInputComponent} from '../post-input/post-input.component';
import {CommentComponent} from './comment/comment.component';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom} from 'rxjs';
import {TimeAgoPipe} from '../../../helpers/pipes/time-ago.pipe';
import {Profile} from '../../../data/interfaces/profile.interface';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimeAgoPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  //@ts-ignore
  profile: InputSignal<Profile | null> = input<Profile>();
  post: InputSignal<Post | undefined> = input<Post>();

  comments: WritableSignal<Comment[]> = signal<Comment[]>([]);

  postService: PostService = inject(PostService);

  @Output() commentCreated = new EventEmitter<{ postId: number, commentText: string }>()

  async ngOnInit(): Promise<void> {
    this.comments.set(this.post()!.comments);
  }

  async updateComments(): Promise<void> {
    const comments: Comment[] = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id));
    this.comments.set(comments);
  }

  onCreateComment(commentText: string): void {
    this.commentCreated.emit({ postId: this.post()!.id, commentText });
  }
}
