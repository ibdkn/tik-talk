import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListInputComponent,
  ModalBaseComponent, ModalService,
  SelectComponent, SvgIconComponent,
  InputComponent, TextareaComponent,
  ModalConfirmComponent
} from '@tt/common-ui';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Community,
  communityActions,
  CommunityForm,
} from '@tt/data-access';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'tt-community-settings-modal',
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
  templateUrl: './community-settings-modal.component.html',
  styleUrl: './community-settings-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySettingsModalComponent implements OnInit {
  store = inject(Store);
  #modalService = inject(ModalService);
  router = inject(Router);
  community: InputSignal<Community | null> = input<Community | null>(null);

  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;

  communityForm = new FormGroup<CommunityForm>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    themes: new FormControl<string[] | null>(null),
    tags: new FormControl<string[] | null>(null),
    description: new FormControl<string | null>(null),
  });

  ngOnInit() {
    const community = this.community();
    if (community) {
      this.communityForm.patchValue({
        name: community.name,
        themes: community.themes,
        tags: community.tags,
        description: community.description,
      });
    }
  }

  hide() {
    this.#modalService.hide();
  }

  onSubmit() {
    this.communityForm.markAllAsTouched();
    this.inputs.forEach(c => c['cdr'].markForCheck());

    if (this.communityForm.valid) {
      const community = this.community();

      if (community) {
        this.store.dispatch(communityActions.updateCommunity({ id: community.id, community: this.communityForm.getRawValue() }));
      } else {
        this.store.dispatch(communityActions.createCommunity({ community: this.communityForm.getRawValue() }));
      }

      this.hide();
    }
  }

  async openDeleteModal() {
    const res = await firstValueFrom(this.#modalService.show(ModalConfirmComponent));
    if (!res) return;

    this.store.dispatch(communityActions.deleteCommunity({ id: this.community()!.id }));

    await this.router.navigate(['/community']);

    this.hide();
  }
}
