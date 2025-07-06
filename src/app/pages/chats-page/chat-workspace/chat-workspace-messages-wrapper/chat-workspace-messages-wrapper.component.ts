import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnInit, Renderer2,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {PostInputComponent} from '../../../profile-page/post-input/post-input.component';
import {ChatService} from '../../../../data/services/chat.service';
import {Chat, Message} from '../../../../data/interfaces/chat.interface';
import {debounceTime, firstValueFrom, fromEvent} from 'rxjs';
import {AvatarCircleComponent} from '../../../../common-ui/avatar-circle/avatar-circle.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatMessageComponent,
    PostInputComponent,
    AvatarCircleComponent
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent implements AfterViewInit {
  chatService: ChatService = inject(ChatService);
  chat: InputSignal<Chat> = input.required<Chat>();
  r2: Renderer2 = inject(Renderer2);
  messages: WritableSignal<Message[]> = this.chatService.activeChatMessages;

  @ViewChild('chatWrapper', { static: true, read: ElementRef<HTMLDivElement> })
  chatWrapper!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.resizeChatWorkspaceWrapper();

    fromEvent(window, 'resize')
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe(() => {
        this.resizeChatWorkspaceWrapper();
      })
  }

  resizeChatWorkspaceWrapper(): void {
    const {top} = this.chatWrapper.nativeElement.getBoundingClientRect();
    console.log(window.innerHeight)
    const height: number = window.innerHeight - top - 24;
    this.r2.setStyle(this.chatWrapper.nativeElement, 'height', `${height}px`);
  }

  async onSendMessage(messageText: string): Promise<void> {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText));

    await firstValueFrom(this.chatService.getChatById(this.chat().id));
  }
}
