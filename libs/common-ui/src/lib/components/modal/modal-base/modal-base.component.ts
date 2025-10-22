import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tt-modal-base',
  imports: [CommonModule],
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ModalBaseComponent {}
