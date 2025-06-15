import {Component, inject} from '@angular/core';
import {ChatsBtnComponent} from '../chats-btn/chats-btn.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ChatService} from '../../../data/services/chat.service';
import {AsyncPipe} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {map, Observable, startWith, switchMap} from 'rxjs';
import {LastMessageResponse} from '../../../data/interfaces/chat.interface';

@Component({
  selector: 'app-chats-list',
  imports: [
    ChatsBtnComponent,
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss'
})
export class ChatsListComponent {
  chatsService: ChatService = inject(ChatService);
  filterChatsControl = new FormControl('');
  chats$: Observable<LastMessageResponse[]> = this.chatsService.getMyChats()
    .pipe(
      switchMap(chats => {
        return this.filterChatsControl.valueChanges
          .pipe(
            startWith(''),
            map(inputValue => {
              return chats.filter(chat => {
                return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`.toLowerCase()
              })
            })
          )
      })
    )

}
