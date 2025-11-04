import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListInputComponent,
  ModalBaseComponent, ModalService,
  SelectComponent, SvgIconComponent,
  InputComponent, TextareaComponent
} from '@tt/common-ui';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { communityActions, CommunityForm } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tt-create-community-modal',
  imports: [
    CommonModule,
    ModalBaseComponent,
    ListInputComponent,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    SvgIconComponent,
    TextareaComponent,
  ],
  templateUrl: './create-community-modal.component.html',
  styleUrl: './create-community-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCommunityModalComponent {
  store = inject(Store);
  #modalService = inject(ModalService);

  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;

  createCommunityForm = new FormGroup<CommunityForm>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    themes: new FormControl<string[] | null>(null),
    tags: new FormControl<string[] | null>(null),
    description: new FormControl<string | null>(null),
  });

  hide() {
    this.#modalService.hide();
  }

  createCommunity() {
    this.createCommunityForm.markAllAsTouched();
    this.inputs.forEach(c => c['cdr'].markForCheck());

    if (this.createCommunityForm.valid) {
      this.store.dispatch(communityActions.createCommunity({ community: this.createCommunityForm.getRawValue() }));
      this.hide();
    }
  }
}
