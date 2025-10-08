import {ChangeDetectionStrategy, Component, HostBinding, input, InputSignal} from '@angular/core';
import { DatePipe } from '@angular/common';
import {AvatarCircleComponent} from '@tt/common-ui';
import { Message } from '@tt/data-access';

@Component({
  selector: 'app-chat-message',
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {
  message: InputSignal<Message> = input.required<Message>();

  @HostBinding('class.owned')
  get isOwnedByCurrentUser(): boolean | undefined {
    return this.message().isOwnedByCurrentUser;
  }
}
