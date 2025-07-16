import {Component, Input, input, Signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unread-message-badge',
  imports: [CommonModule],
  templateUrl: './unread-message-badge.component.html',
  styleUrl: './unread-message-badge.component.scss',
})
export class UnreadMessageBadgeComponent {
  @Input() unreadMessageCount!: WritableSignal<number>;

}
