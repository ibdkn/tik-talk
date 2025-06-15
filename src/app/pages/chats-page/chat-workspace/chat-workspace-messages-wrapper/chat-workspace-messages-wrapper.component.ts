import {Component, inject, input, InputSignal, OnInit, signal, WritableSignal} from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {PostInputComponent} from '../../../profile-page/post-input/post-input.component';
import {ChatService} from '../../../../data/services/chat.service';
import {Chat, Message} from '../../../../data/interfaces/chat.interface';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatMessageComponent,
    PostInputComponent
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatService: ChatService = inject(ChatService);
  chat: InputSignal<Chat> = input.required<Chat>();

  messages: WritableSignal<Message[]> = this.chatService.activeChatMessages;

  async onSendMessage(messageText: string): Promise<void> {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText));

    await firstValueFrom(this.chatService.getChatById(this.chat().id));
  }
}
