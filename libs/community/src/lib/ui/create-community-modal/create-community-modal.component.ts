import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBaseComponent } from '@tt/common-ui';

@Component({
  selector: 'tt-create-community-modal',
  imports: [CommonModule, ModalBaseComponent],
  templateUrl: './create-community-modal.component.html',
  styleUrl: './create-community-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCommunityModalComponent {}
