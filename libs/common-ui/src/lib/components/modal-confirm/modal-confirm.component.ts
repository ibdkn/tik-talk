import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBaseComponent, SvgIconComponent } from '@tt/common-ui';

@Component({
  selector: 'tt-modal-confirm',
  imports: [CommonModule, ModalBaseComponent, SvgIconComponent],
  templateUrl: './modal-confirm.component.html',
  styleUrl: './modal-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalConfirmComponent {
  result = output<boolean>();

  onConfirm() {
    this.result.emit(true);
  }

  onCancel() {
    this.result.emit(false);
  }
}
