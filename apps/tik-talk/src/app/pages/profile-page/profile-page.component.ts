import { Component, inject, signal } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ChatService } from '../../data/services/chat.service';
import {ProfileService} from '@tt/profile';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {PostFeedComponent} from '@tt/posts';

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
  chatService: ChatService = inject(ChatService);
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
    firstValueFrom(this.chatService.createChat(userId)).then((res) =>
      this.router.navigate(['/chats', res.id])
    );
  }
}
