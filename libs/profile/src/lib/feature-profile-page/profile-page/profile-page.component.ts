import { Component, inject, signal } from '@angular/core';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {PostFeedComponent} from '@tt/posts';
import { ProfileService } from '../../data';

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
})
export class ProfilePageComponent {
  router: Router = inject(Router);
  profileService: ProfileService = inject(ProfileService);
  route: ActivatedRoute = inject(ActivatedRoute);
  subscribers$ = this.profileService.getSubscribersShortList(5);

  me$ = toObservable(this.profileService.me);

  isMyPage = signal(false);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], {queryParams: {userId}})
  }
}
