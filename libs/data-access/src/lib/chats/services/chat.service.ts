import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  Chat,
  LastMessageResponse,
  Message,
} from '../interfaces/chat.interface';
import { ProfileService } from '@tt/data-access';
import { ChatWsService } from '../interfaces/chat-ws-service';
import { AuthService } from '@tt/data-access';
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { ChatWsRxjsService } from '../interfaces/chat-ws-rxjs.service';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);
  me = inject(ProfileService).me;
  baseApiUrl: string = '/yt-course';
  chatsUrl: string = `${this.baseApiUrl}/chat`;
  messageUrl: string = `${this.baseApiUrl}/message`;
  wsAdapter: ChatWsService = new ChatWsRxjsService();

  activeChatMessages = signal<Message[]>([]);
  unreadMessageCount = signal<number>(0);
  unreadMessagesOneUserCount = signal(new Map<number, number>());

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.chatsUrl}/ws`,
      token: this.authService.token ?? '',
      handleMessage: this.handleWSMessage,
    }) as Observable<ChatWSMessage>;
  }

  handleWSMessage = (message: ChatWSMessage) => {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.unreadMessageCount.set(message.data.count);
    }

    if (isNewMessage(message)) {
      if (!(message.data.author === this.me()?.id)) {
        const map = this.unreadMessagesOneUserCount();
        let chatsId = message.data.chat_id;

        if (!map.has(chatsId)) {
          map.set(chatsId, 1);
        } else {
          map.set(chatsId, map.get(chatsId)! + 1);
        }
        this.unreadMessagesOneUserCount.set(map);
      }

      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isOwnedByCurrentUser: message.data.author === this.me()?.id,
        },
      ]);
    }
  };

  createChat(userId: number): Observable<Chat> {
    return this.http.post<Chat>(`${this.chatsUrl}/${userId}`, {});
  }

  getMyChats(): Observable<LastMessageResponse[]> {
    return this.http.get<LastMessageResponse[]>(
      `${this.chatsUrl}/get_my_chats/`
    );
  }

  getChatById(chatId: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.chatsUrl}/${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isOwnedByCurrentUser: message.userFromId === this.me()?.id,
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

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(`${this.messageUrl}/send/${chatId}`, {}, {
      params: { message },
    });
  }

  deleteUnreadMessage(chatId: number) {
    const map = this.unreadMessagesOneUserCount();

    if (map.has(chatId)) {
      map.set(chatId, 0);
    }

    this.unreadMessagesOneUserCount.set(map);
  }
}
