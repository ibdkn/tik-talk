import {
  AfterViewInit, ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject, Input,
  input,
  InputSignal, OnChanges,
  Renderer2, signal, SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Chat, Message } from '../../../../../data-access/src/lib/chats/interfaces/chat.interface';
import {debounceTime, firstValueFrom, fromEvent} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {PostInputComponent} from '@tt/posts';
import { ChatService } from '../../../../../data-access/src/lib/chats';
import { MessageDateGroupComponent } from '../message-date-group/message-date-group.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [ChatMessageComponent, PostInputComponent, MessageDateGroupComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent implements AfterViewInit, OnChanges {
  chatService: ChatService = inject(ChatService);
  chat: InputSignal<Chat> = input.required<Chat>();
  r2: Renderer2 = inject(Renderer2);
  // messages: WritableSignal<Message[]> = this.chatService.activeChatMessages;
  dateAndMessages = signal<{ date: string; messages: Message[] }[]>([]);

  @Input() messages: Message[] = [];

  @ViewChild('chatWrapper', { static: true, read: ElementRef<HTMLDivElement> })
  chatWrapper!: ElementRef<HTMLDivElement>;

  @ViewChild('scrollToBottom')
  scrollToBottom!: ElementRef;

  ngAfterViewInit(): void {
    this.resizeChatWorkspaceWrapper();

    fromEvent(window, 'resize')
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe(() => {
        this.resizeChatWorkspaceWrapper();
      });

    this.scrollBottom();
    this.chatService.deleteUnreadMessage(this.chat().id)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) {
      this.dateAndMessages.set(this.groupMessage(this.messages));
    }
    Promise.resolve().then(() => this.scrollBottom());
  }

  resizeChatWorkspaceWrapper(): void {
    const { top } = this.chatWrapper.nativeElement.getBoundingClientRect();
    const height: number = window.innerHeight - top - 130;
    this.r2.setStyle(this.chatWrapper.nativeElement, 'height', `${height}px`);
  }

  async onSendMessage(messageText: string): Promise<void> {
    this.chatService.wsAdapter.sendMessage(messageText, this.chat().id);
    await firstValueFrom(this.chatService.getChatById(this.chat().id));
    this.scrollBottom();
  }

  private scrollBottom() {
    if (this.scrollToBottom) {
      this.scrollToBottom.nativeElement.scrollTop =
        this.scrollToBottom.nativeElement.scrollHeight;
    }
  }

  groupMessage( messagesAll: Message[] ): { date: string; messages: Message[] }[] {
    const result: { date: string; messages: Message[] }[] = [];

    for (const message of messagesAll) {
      const date = message.createdAt.slice(0, 10);
      const existingGroup = result.find((group) => group.date === date);
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        result.push({
          date,
          messages: [message],
        });
      }
    }
    return result;
  }
}
