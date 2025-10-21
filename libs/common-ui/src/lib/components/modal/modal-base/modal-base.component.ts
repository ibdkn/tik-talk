import {
  ChangeDetectionStrategy,
  Component, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../service/modal.service';

@Component({
  selector: 'tt-modal-base',
  imports: [CommonModule],
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ModalBaseComponent {
  #modalService = inject(ModalService);
  isOpen$ = this.#modalService.isOpen$;
}
