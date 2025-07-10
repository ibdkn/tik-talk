import {
  AfterViewInit,
  Component,
  ElementRef,
  inject, OnInit,
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
import {Profile} from '@tt/interfaces/profile';
import {GlobalStoreService} from '@tt/shared';
import {Store} from '@ngrx/store';
import {postActions} from '../../data/store/actions';
import {selectPosts} from '../../data/store/selectors';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit, OnInit {
  store = inject(Store);
  profile: WritableSignal<Profile | null> = inject(GlobalStoreService).me;
  postService: PostService = inject(PostService);
  r2: Renderer2 = inject(Renderer2);
  feed = this.store.selectSignal(selectPosts);

  @ViewChild('feedWrapper', { static: true, read: ElementRef<HTMLDivElement> })
  feedWrapperRef!: ElementRef<HTMLDivElement>;

  @ViewChildren('postComp') postComponents!: QueryList<PostComponent>;

  ngOnInit() {
    this.store.dispatch(postActions.filterEvents({ filters: {} }));
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

    this.store.dispatch(postActions.createPost({
      post: {
        title: 'Клевый пост',
        content: postText,
        authorId: this.profile()!.id,
      }
    }));
  }

  async onDeletePost(id: number): Promise<void> {
    this.store.dispatch(postActions.deletePost({id}))
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
