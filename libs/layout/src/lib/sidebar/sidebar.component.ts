import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, WritableSignal} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { AsyncPipe } from '@angular/common';
import {firstValueFrom, Subscription, timer} from 'rxjs';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {ProfileService} from '@tt/data-access';
import {ChatService} from '@tt/data-access';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {isErrorMessage} from '../../../../data-access/src/lib/chats/interfaces/type-guards';

@Component({
  selector: 'app-sidebar',
  imports: [
    SvgIconComponent,
    RouterLink,
    SubscriberCardComponent,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
  ],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  chatService: ChatService = inject(ChatService);
  profileService: ProfileService = inject(ProfileService);
  destroyRef = inject(DestroyRef);

  wsSubscribe!: Subscription;
  subscribers$ = this.profileService.getSubscribersShortList();

  unreadMessageCount: WritableSignal<number> = this.chatService.unreadMessageCount;

  me = this.profileService.me;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  async reconnect() {
    console.log('reconnecting...');
    await firstValueFrom(this.profileService.getMe());
    await firstValueFrom(timer(2000))
    this.connectWs();
  }

  connectWs() {
    this.wsSubscribe?.unsubscribe();
    this.wsSubscribe = this.chatService
      .connectWs()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((message) => {
        if(isErrorMessage(message)) {
          console.log('Неверный токен')
          this.reconnect();
        }
      })
  }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
    this.connectWs();
  }
}
