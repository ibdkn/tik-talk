import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBaseComponent, SvgIconComponent } from '@tt/common-ui';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tt-update-community-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    SvgIconComponent,
  ],
  templateUrl: './delete-community-modal.component.html',
  styleUrl: './delete-community-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCommunityModalComponent {
  store = inject(Store);

  result = output<boolean>();

  onConfirm() {
    this.result.emit(true);
  }

  onCancel() {
    this.result.emit(false);
  }
}
