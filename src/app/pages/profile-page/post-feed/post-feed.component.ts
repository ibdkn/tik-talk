import {
  AfterViewInit,
  Component,
  ElementRef,
  inject, QueryList,
  Renderer2,
  ViewChild, ViewChildren,
  WritableSignal
} from '@angular/core';
import {PostInputComponent} from '../post-input/post-input.component';
import {PostComponent} from '../post/post.component';
import {PostService} from '../../../data/services/post.service';
import {Post} from '../../../data/interfaces/post.interface';
import {debounceTime, firstValueFrom, fromEvent} from 'rxjs';
import {ProfileService} from '../../../data/services/profile.service';
import {Profile} from '../../../data/interfaces/profile.interface';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-feed',
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit {
  //@ts-ignore
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
        console.log(123)
      })
  }

  resizeFeed(): void {
    const {top} = this.feedWrapperRef.nativeElement.getBoundingClientRect();
    const height: number = window.innerHeight - top - 24;
    this.r2.setStyle(this.feedWrapperRef.nativeElement, 'height', `${height}px`);
  }

  async onCreatePost(postText: string): Promise<void> {
    if (!postText) return;

    await firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: postText,
        authorId: this.profile()!.id
      })
    );

    await firstValueFrom(this.postService.fetchPosts());
  }

  async onCreateComment(postId: number, commentText: string): Promise<void> {
    if (!commentText) return;

    await firstValueFrom(
      this.postService.createComments({
        text: commentText,
        authorId: this.profile()!.id,
        postId: postId
      })
    );

    const postComp: PostComponent | undefined = this.postComponents.find(
      comp => comp.post()?.id === postId
    );
    postComp?.updateComments();
  }
}
