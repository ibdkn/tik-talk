import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import { Post, postActions, PostService, Profile } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFeedComponent implements AfterViewInit {
  store = inject(Store);
  postService: PostService = inject(PostService);
  r2: Renderer2 = inject(Renderer2);

  profile = input.required<Profile>();
  feed = input.required<Post[]>();
  isMyPage = input.required<boolean>();

  @ViewChild('feedWrapper', { static: true, read: ElementRef<HTMLDivElement> })
  feedWrapperRef!: ElementRef<HTMLDivElement>;

  @ViewChildren('postComp') postComponents!: QueryList<PostComponent>;

  ngAfterViewInit(): void {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  resizeFeed(): void {
    const { top } = this.feedWrapperRef.nativeElement.getBoundingClientRect();
    const height: number = window.innerHeight - top - 24;
    this.r2.setStyle(
      this.feedWrapperRef.nativeElement,
      'height',
      `${height}px`
    );
  }

  async onCreatePost(postText: string): Promise<void> {
    if (!postText) return;

    this.store.dispatch(
      postActions.createPost({
        post: {
          title: 'Клевый пост',
          content: postText,
          authorId: this.profile()!.id,
        },
      })
    );
  }

  async onDeletePost(id: number): Promise<void> {
    this.store.dispatch(postActions.deletePost({ id }));
  }

  async updatePost(id: number, content: string): Promise<void> {
    this.store.dispatch(postActions.updatePost({ id, post: { content } }));
  }

  async onCreateComment(postId: number, commentText: string): Promise<void> {
    if (!commentText) return;

    await firstValueFrom(
      this.postService.createComments({
        text: commentText,
        authorId: this.profile()!.id,
        postId: postId,
      })
    );

    const postComp = this.postComponents.find(
      (comp) => comp.post()?.id === postId
    );
    postComp?.updateComments();
  }
}
