import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {debounceTime, fromEvent, map, Observable, startWith, switchMap} from 'rxjs';
import { LastMessageResponse } from '../../../../../data-access/src/lib/chats/interfaces/chat.interface';
import { ChatService } from '../../../../../data-access/src/lib/chats';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats-list',
  imports: [
    ChatsBtnComponent,
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent implements AfterViewInit {
  chatsService: ChatService = inject(ChatService);
  r2: Renderer2 = inject(Renderer2);
  filterChatsControl = new FormControl('');
  chats$: Observable<LastMessageResponse[]> = this.chatsService
    .getMyChats()
    .pipe(
      switchMap((chats) => {
        return this.filterChatsControl.valueChanges.pipe(
          startWith(''),
          map((inputValue) => {
            return chats.filter((chat) => {
              return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`.toLowerCase();
            });
          })
        );
      })
    );

  @ViewChild('chatListWrapper', { static: true, read: ElementRef<HTMLDivElement> })
  chatListWrapper!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.resizeChatWorkspaceWrapper();

    fromEvent(window, 'resize')
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe(() => {
        this.resizeChatWorkspaceWrapper();
      });
  }

  resizeChatWorkspaceWrapper(): void {
    const { top } = this.chatListWrapper.nativeElement.getBoundingClientRect();
    const height: number = window.innerHeight - top - 24;
    this.r2.setStyle(this.chatListWrapper.nativeElement, 'height', `${height}px`);
  }
}
