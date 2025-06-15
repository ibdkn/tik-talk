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
import {NgClass} from '@angular/common';
import {ClickOutsideDirective} from '../../../common-ui/directives/click-outside.directive';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimeAgoPipe,
    NgClass,
    ClickOutsideDirective,
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
  isShowPostModal: boolean = false;
  isEditable: boolean = false;

  @Output() commentCreated: EventEmitter<{ postId: number, commentText: string }> = new EventEmitter<{ postId: number, commentText: string }>();
  @Output() commentUpdated: EventEmitter<{ postId: number, commentText: string }> = new EventEmitter<{ postId: number, commentText: string }>();
  @Output() postDeleted: EventEmitter<{ postId: number }> = new EventEmitter<{ postId: number }>();
  @Output() postUpdated: EventEmitter<{ postId: number, text: string }> = new EventEmitter<{ postId: number, text: string }>();

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

  onUpdateComment(commentText: string): void {
    // this.commentUpdated.emit({ postId: this.post()!.id, commentText })
  }

  onDeleteComment(): void {
    // this.commentDeleted.emit({ postId: this.post()!.id })
  }

  onDeletePost(): void {
    this.postDeleted.emit({ postId: this.post()!.id });
  }

  onUpdatePost(text: string) {
    this.postUpdated.emit({ postId: this.post()!.id, text });
  }
}
