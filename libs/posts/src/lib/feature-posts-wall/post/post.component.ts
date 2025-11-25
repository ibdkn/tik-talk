import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NgClass } from '@angular/common';
import {AvatarCircleComponent, ClickOutsideDirective, SvgIconComponent, TimeAgoPipe} from '@tt/common-ui';
import {CommentComponent, PostInputComponent } from '../../ui';
import { Post, PostComment, PostService } from '../../../../../data-access/src/lib/posts';
import { Community, GlobalStoreService, Profile } from '@tt/data-access';

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
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
  // @ts-ignore
  currentAuthor: InputSignal<Profile | Community | null> = input<Profile>();
  post: InputSignal<Post | undefined> = input<Post>();
  myProfile: WritableSignal<Profile | null> = inject(GlobalStoreService).me;
  comments: WritableSignal<PostComment[]> = signal<PostComment[]>([]);

  get authorName(): string {
    const author = this.post()?.author;
    if (!author) return '';

    return 'firstName' in author ? `${author.firstName} ${author.lastName}` : author.name;
  }

  isMyPost = computed(() => {
    const post = this.post();
    const myProfile = this.myProfile();
    if (!post || !myProfile) return false;

    return 'admin' in post.author ? (post.author.admin.id === myProfile.id) : (post.author.id === myProfile.id);
  })

  postService: PostService = inject(PostService);
  isShowPostModal: boolean = false;
  isEditable: boolean = false;

  @Output() commentCreated: EventEmitter<{
    postId: number;
    commentText: string;
  }> = new EventEmitter<{ postId: number; commentText: string }>();
  @Output() commentUpdated: EventEmitter<{
    postId: number;
    commentText: string;
  }> = new EventEmitter<{ postId: number; commentText: string }>();
  @Output() postDeleted: EventEmitter<{ postId: number }> = new EventEmitter<{
    postId: number;
  }>();
  @Output() postUpdated: EventEmitter<{ postId: number; text: string }> =
    new EventEmitter<{ postId: number; text: string }>();

  async ngOnInit(): Promise<void> {
    this.comments.set(this.post()!.comments);
  }

  async updateComments(): Promise<void> {
    const comments: PostComment[] = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id)
    );
    this.comments.set(comments);
  }

  onCreateComment(commentText: string): void {
    this.commentCreated.emit({ postId: this.post()!.id, commentText });
  }

  onDeletePost(): void {
    this.postDeleted.emit({ postId: this.post()!.id });
  }

  onUpdatePost(text: string) {
    this.postUpdated.emit({ postId: this.post()!.id, text });
  }
}
