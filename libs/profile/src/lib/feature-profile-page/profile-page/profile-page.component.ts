import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import { ProfileService } from '../../../../../data-access/src/lib/profile';
import { ChatService, postActions, selectPosts } from '@tt/data-access';
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
  chatService: ChatService = inject(ChatService);
  route: ActivatedRoute = inject(ActivatedRoute);
  store = inject(Store);

  subscribers$ = this.profileService.getSubscribersShortList(6);

  me$ = toObservable(this.profileService.me);

  isMyPage = signal(false);
  posts = this.store.selectSignal(selectPosts);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    }),
    tap((profile) => {
      this.store.dispatch(
        postActions.filterEvents({ filters: { user_id: profile?.id } })
      );
    })
  );

  async sendMessage(userId: number) {
    firstValueFrom(this.chatService.createChat(userId))
      .then((res) => {
        this.router.navigate(['/chats', 'new'], { queryParams: { id: res.id } });
      })
  }
}
