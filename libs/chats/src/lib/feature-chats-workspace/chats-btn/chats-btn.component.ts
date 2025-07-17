import {Component, input} from '@angular/core';
import {
  LastMessageResponse,
} from '../../data/interfaces/chat.interface';
import {AvatarCircleComponent} from '@tt/common-ui';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessageResponse>();
}
