import {
  ChangeDetectionStrategy,
  Component, computed,
  inject,
  input,
  signal,
  ViewChild
} from '@angular/core';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import {
  postActions,
  PostService,
  ProfileService,
  selectPosts,
} from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  router: Router = inject(Router);
  profileService: ProfileService = inject(ProfileService);
  postService: PostService = inject(PostService);
  store = inject(Store);

  subscribers$ = this.profileService.getSubscribersShortList(6);
  me$ = toObservable(this.profileService.me);

  isMyPage = signal(false);
  allPosts = this.store.selectSignal(selectPosts);
  id = input.required<string>();

  @ViewChild('postFeed') postFeed!: PostFeedComponent;

  profile$ = toObservable(this.id).pipe(
    switchMap((id) => {
      const meId = this.profileService.me()?.id;
      this.isMyPage.set(id === 'me' || (!!meId && +id === meId));

      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    }),
    tap((profile) => {
      if (!profile) return;

      this.store.dispatch(
        postActions.filterEvents({ filters: { user_id: profile.id } })
      );
    })
  );

  posts = computed(() =>
    this.allPosts().filter(p => p.communityId === null)
  );

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId } });
  }

  async onCreatePost(postText: string, profileId: number): Promise<void> {
    if (!postText) return;

    this.store.dispatch(
      postActions.createPost({
        post: {
          title: 'Пост для профиля',
          content: postText,
          authorId: profileId,
        },
      })
    );
  }

  onDeletePost(id: number): void {
    this.store.dispatch(postActions.deletePost({ id }));
  }

  onUpdatePost(event: { id: number; content: string }): void {
    this.store.dispatch(
      postActions.updatePost({ id: event.id, post: { content: event.content } })
    );
  }

  async onCreateComment(
    event: { postId: number; commentText: string },
    profileId: number
  ) {
    if (!event.commentText) return;

    await firstValueFrom(
      this.postService.createComment({
        text: event.commentText,
        authorId: profileId,
        postId: event.postId,
      })
    );

    this.postFeed.updatePostComments(event.postId);
  }
}
