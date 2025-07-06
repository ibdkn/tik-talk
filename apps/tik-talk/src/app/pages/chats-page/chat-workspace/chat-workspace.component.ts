import { Component, inject } from '@angular/core';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessagesWrapperComponent } from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component';
import { MessageInputComponent } from '../../../common-ui/message-input/message-input.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../data/services/chat.service';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PostInputComponent } from '../../../../../../../libs/posts/src/lib/ui/post-input/post-input.component';

@Component({
  selector: 'app-chat-workspace',
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessagesWrapperComponent,
    AsyncPipe,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  chatService: ChatService = inject(ChatService);

  activeChat$ = this.route.params.pipe(
    switchMap(({ id }) => this.chatService.getChatById(id))
  );
}
