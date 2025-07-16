import {Component, inject, OnInit, WritableSignal} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {ImgUrlPipe, SvgIconComponent, UnreadMessageBadgeComponent} from '@tt/common-ui';
import {ProfileService} from '@tt/profile';
import {ChatService} from '@tt/chats';

@Component({
  selector: 'app-sidebar',
  imports: [
    SvgIconComponent,
    RouterLink,
    SubscriberCardComponent,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
    UnreadMessageBadgeComponent,
  ],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  profileService: ProfileService = inject(ProfileService);
  subscribers$ = this.profileService.getSubscribersShortList();
  unreadMessageCount: WritableSignal<number> = inject(ChatService).unreadMessage;

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

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }
}
