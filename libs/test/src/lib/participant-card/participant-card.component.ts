import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tt-participant-card',
  imports: [CommonModule],
  templateUrl: './participant-card.component.html',
  styleUrl: './participant-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantCardComponent {
  participant = input.required<{
    name: string;
    role: string;
    about: string,
    isProgrammer: boolean
  }>();
}
