import {Component, inject, input, WritableSignal} from '@angular/core';
import {
  LastMessageResponse,
} from '../../data/interfaces/chat.interface';
import {AvatarCircleComponent, UnreadMessageBadgeComponent} from '@tt/common-ui';
import {DatePipe} from '@angular/common';
import {ChatService} from '@tt/chats';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, DatePipe, UnreadMessageBadgeComponent, UnreadMessageBadgeComponent],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  unreadMessageCount: WritableSignal<number> = inject(ChatService).unreadMessage;
  chat = input<LastMessageResponse>();
}
