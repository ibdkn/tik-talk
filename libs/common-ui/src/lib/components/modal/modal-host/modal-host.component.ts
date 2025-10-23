import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../service/modal.service';

@Component({
  selector: 'tt-modal-host',
  imports: [CommonModule],
  templateUrl: './modal-host.component.html',
  styleUrl: './modal-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ModalHostComponent implements AfterViewInit {
  #modalService = inject(ModalService);

  container = viewChild('container', { read: ViewContainerRef });

  ngAfterViewInit() {
    const container = this.container();

    if (!container) return;
    this.#modalService.registerContainer(container);
  }
}
