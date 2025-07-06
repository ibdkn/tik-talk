import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import {Post, PostService } from '../../data';
import {Profile, ProfileService} from '@tt/profile';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit {
  profile: WritableSignal<Profile | null> = inject(ProfileService).me;
  postService: PostService = inject(PostService);
  r2: Renderer2 = inject(Renderer2);
  feed: WritableSignal<Post[]> = this.postService.posts;

  @ViewChild('feedWrapper', { static: true, read: ElementRef<HTMLDivElement> })
  feedWrapperRef!: ElementRef<HTMLDivElement>;

  @ViewChildren('postComp') postComponents!: QueryList<PostComponent>;

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

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

    await firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: postText,
        authorId: this.profile()!.id,
      })
    );

    await firstValueFrom(this.postService.fetchPosts());
  }

  async onDeletePost(id: number): Promise<void> {
    await firstValueFrom(this.postService.deletePost(id));
    await firstValueFrom(this.postService.fetchPosts());
  }

  async updatePost(id: number, content: string): Promise<void> {
    await firstValueFrom(this.postService.updatePost(id, { content }));
    await firstValueFrom(this.postService.fetchPosts());
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
