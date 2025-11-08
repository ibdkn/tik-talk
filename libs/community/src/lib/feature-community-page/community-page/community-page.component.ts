import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  CommunityService,
  postActions,
  PostService,
  Profile,
  ProfileService,
  selectPosts,
} from '@tt/data-access';
import { firstValueFrom, Observable, of, switchMap, tap } from 'rxjs';
import {
  AvatarCircleComponent,
  ImgUrlPipe,
  SvgIconComponent,
} from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import { Store } from '@ngrx/store';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tt-community-page',
  imports: [
    CommonModule,
    SvgIconComponent,
    RouterLink,
    AvatarCircleComponent,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './community-page.component.html',
  styleUrl: './community-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityPageComponent {
  router = inject(Router);
  communityService = inject(CommunityService);
  profileService = inject(ProfileService);
  postService: PostService = inject(PostService);
  store = inject(Store);
  subscribers$: Observable<Profile[]> = of([]);

  isMyCommunity = signal(false);
  posts = this.store.selectSignal(selectPosts);
  id = input.required<string>();
  postFeed = viewChild.required<PostFeedComponent>('postFeed');

  community$ = toObservable(this.id).pipe(
    switchMap((id) => {
      this.subscribers$ = this.communityService.getSubscribersShortList(+id, 5);

      return this.communityService.getCommunity(+id).pipe(
        tap((res) => {
          this.isMyCommunity.set(res.admin.id === this.profileService.me()?.id);
          this.store.dispatch(
            postActions.filterEvents({ filters: { community_id: res.id } })
          );
        })
      );
    })
  );

  profile$ = this.community$.pipe(
    switchMap((community) =>
      this.profileService.getAccount(community.admin.id.toString())
    )
  );

  async onCreatePost(
    postText: string,
    profileId: number,
    communityId: number
  ): Promise<void> {
    if (!postText) return;

    this.store.dispatch(
      postActions.createPost({
        post: {
          title: 'Пост для комьюнити',
          content: postText,
          authorId: profileId,
          communityId,
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
    await firstValueFrom(
      this.postService.createComment({
        text: event.commentText,
        authorId: profileId,
        postId: event.postId,
      })
    );

    this.postFeed().updatePostComments(event.postId);
  }
}
