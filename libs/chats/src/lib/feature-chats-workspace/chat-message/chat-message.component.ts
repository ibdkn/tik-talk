import { Component, HostBinding, input, InputSignal } from '@angular/core';
import { Message } from '../../data/interfaces/chat.interface';
import { DatePipe } from '@angular/common';
import {AvatarCircleComponent} from '@tt/common-ui';

@Component({
  selector: 'app-chat-message',
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  message: InputSignal<Message> = input.required<Message>();

  @HostBinding('class.is-mine')
  get isMine(): boolean | undefined {
    return this.message().isMine;
  }
}
