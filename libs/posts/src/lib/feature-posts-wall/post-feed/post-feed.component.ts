import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input, output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  WritableSignal
} from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import { Community, GlobalStoreService, Post, postActions, Profile } from '@tt/data-access';
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
  r2: Renderer2 = inject(Renderer2);
  me: WritableSignal<Profile | null> = inject(GlobalStoreService).me;

  feed = input.required<Post[]>();
  community = input<Community | null>(null);
  profile = input<Profile | null>(null);
  currentAuthor = computed(() =>
    this.community() ? this.community() : this.profile()
  );

  canPost = computed(() => {
    const community = this.community();
    const profile = this.profile();

    if (community) {
      return community.admin.id === this.me()?.id;
    }

    return profile?.id === this.me()?.id;
  });

  createPost = output<string>();
  createComment = output<{ postId: number; commentText: string }>();

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

  onCreatePost(postText: string): void {
    if (!postText) return;
    this.createPost.emit(postText);
  }

  onDeletePost(id: number): void {
    this.store.dispatch(postActions.deletePost({ id }));
  }

  onUpdatePost(id: number, content: string): void {
    this.store.dispatch(postActions.updatePost({ id, post: { content } }));
  }

  onCreateComment(postId: number, commentText: string): void {
    if (!commentText) return;
    this.createComment.emit({ postId, commentText });
  }

  updatePostComments(postId: number) {
    const postComp = this.postComponents.find(
      (comp) => comp.post()?.id === postId
    );
    postComp?.updateComments();
  }
}
