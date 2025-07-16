import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  Chat,
  LastMessageResponse,
  Message,
} from '../interfaces/chat.interface';
import {ProfileService} from '@tt/profile';
import {ChatWsService} from '../interfaces/chat-ws-service';
import {AuthService} from '@tt/auth';
import {isNewMessage, isUnreadMessage} from '../interfaces/type-guards';
import {ChatWsRxjsService} from '../interfaces/chat-ws-rxjs.service';
import {ChatWSMessage} from '../interfaces/chat-ws-message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);
  baseApiUrl: string = 'https://icherniakov.ru/yt-course';
  me = inject(ProfileService).me;

  wsAdapter: ChatWsService = new ChatWsRxjsService();

  activeChatMessages = signal<Message[]>([]);
  unreadMessage = signal<number>(0);

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}/chat/ws`,
      token: this.authService.token ?? '',
      handleMessage: this.handleWSMessage
    }) as Observable<ChatWSMessage>
  }

  handleWSMessage = (message: ChatWSMessage) => {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.unreadMessage.set(message.data.count);
      console.log('непрочитанных ' + this.unreadMessage())
    }

    if (isNewMessage(message)) {
      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine: message.data.author === this.me()?.id,
        }
      ])
    }
  }

  createChat(userId: number): Observable<Chat> {
    return this.http.post<Chat>(`${this.baseApiUrl}/chat/${userId}`, {});
  }

  getMyChats(): Observable<LastMessageResponse[]> {
    return this.http.get<LastMessageResponse[]>(
      `${this.baseApiUrl}/chat/get_my_chats/`
    );
  }

  getChatById(chatId: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.baseApiUrl}/chat/${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()?.id,
          };
        });
        this.activeChatMessages.set(patchedMessages);
        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  sendMessage(chatId: number, message: string): Observable<Message> {
    return this.http.post<Message>(
      `${this.baseApiUrl}/message/send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }
}
