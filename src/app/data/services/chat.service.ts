import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Chat, LastMessageResponse, Message} from '../interfaces/chat.interface';
import {ProfileService} from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl: string = 'https://icherniakov.ru/yt-course';
  me = inject(ProfileService).me;

  activeChatMessages = signal<Message[]>([]);

  createChat(userId: number): Observable<Chat> {
    return this.http.post<Chat>(`${this.baseApiUrl}/chat/${userId}`, {});
  }

  getMyChats(): Observable<LastMessageResponse[]> {
    return this.http.get<LastMessageResponse[]>(`${this.baseApiUrl}/chat/get_my_chats/`);
  }

  getChatById(chatId: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.baseApiUrl}/chat/${chatId}`)
      .pipe(
        map(chat => {
          const patchedMessages = chat.messages.map(message => {
            return {
              ...message,
              user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
              isMine: message.userFromId === this.me()?.id
            }
          });
          this.activeChatMessages.set(patchedMessages);
          return {
            ...chat,
            companion: chat.userFirst.id === this.me()?.id ? chat.userSecond : chat.userFirst,
            messages: patchedMessages
          }
        })
      )
  }

  sendMessage(chatId: number, message: string): Observable<Message> {
    return this.http.post<Message>(`${this.baseApiUrl}/message/send/${chatId}`, {}, {
      params: {
        message
      }
    });
  }
}
