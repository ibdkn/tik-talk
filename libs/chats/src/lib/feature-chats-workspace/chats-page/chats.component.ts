import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import {ChatService} from '@tt/data-access';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats',
  imports: [RouterOutlet, ChatsListComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsPageComponent implements OnInit {
  #chatService: ChatService = inject(ChatService);

  constructor() {
    this.#chatService.connectWs()
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  ngOnInit() {
    // this.#chatService.connectWs()
  }
}
