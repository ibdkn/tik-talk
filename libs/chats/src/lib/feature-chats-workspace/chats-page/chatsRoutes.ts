import { ChatsPageComponent } from './chats.component';
import { Routes } from '@angular/router';
import { ChatWorkspaceComponent } from '../chat-workspace/chat-workspace.component';

export const chatsRoutes: Routes = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [
      {
        path: ':id',
        component: ChatWorkspaceComponent,
      },
    ],
  },
];
