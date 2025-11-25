import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  Signal,
  signal,
  viewChild,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  Community,
  communityActions,
  CommunityService,
  Post,
  postActions,
  PostService,
  Profile,
  ProfileService, selectCommunityPostsById,
} from '@tt/data-access';
import { firstValueFrom } from 'rxjs';
import {
  AvatarCircleComponent,
  ImgUrlPipe,
  SvgIconComponent,
} from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import { Store } from '@ngrx/store';

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
  communityService = inject(CommunityService);
  profileService = inject(ProfileService);
  postService: PostService = inject(PostService);
  store = inject(Store);
  subscribers: WritableSignal<Profile[] | null> = signal(null);
  community: WritableSignal<Community | null> = signal(null);
  posts: Signal<Post[]> = signal([]);
  id = input.required<string>();
  postFeed = viewChild.required<PostFeedComponent>('postFeed');

  constructor() {
    effect(() => {
      const id = +this.id();
      if (!id) return;

      this.posts = this.store.selectSignal(selectCommunityPostsById(id));

      firstValueFrom(this.communityService.getSubscribersShortList(id, 5))
        .then((res) => this.subscribers.set(res));

      firstValueFrom(this.communityService.getCommunity(id))
        .then((res) => this.community.set(res));

      this.store.dispatch(communityActions.filterCommunityPostsEvent({ communityId: id, filters: {} }))
    })
  }

  isMyCommunity = computed(() => {
    const community = this.community();
    const me = this.profileService.me();

    return !!community && community.admin.id === me?.id;
  });

  async onCreatePost(
    postText: string,
    communityId: number
  ): Promise<void> {
    if (!postText) return;

    this.store.dispatch(
      postActions.createPost({
        post: {
          title: 'Пост для комьюнити',
          content: postText,
          communityId,
        },
      })
    );
  }

  async onCreateComment(
    event: { postId: number; commentText: string },
    adminId: number
  ) {
    await firstValueFrom(
      this.postService.createComment({
        text: event.commentText,
        authorId: adminId,
        postId: event.postId,
      })
    );

    this.postFeed().updatePostComments(event.postId);
  }
}
