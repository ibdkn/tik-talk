import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListInputComponent,
  ModalBaseComponent, ModalService,
  SelectComponent, SvgIconComponent,
  InputComponent, TextareaComponent
} from '@tt/common-ui';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  communityActions,
  CommunityForm,
  selectCommunity,
} from '@tt/data-access';
import { Store } from '@ngrx/store';
import { DeleteCommunityModalComponent } from '../delete-community-modal/delete-community-modal.component';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'tt-update-community-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    SvgIconComponent,
    InputComponent,
    SelectComponent,
    ListInputComponent,
    TextareaComponent,
  ],
  templateUrl: './update-community-modal.component.html',
  styleUrl: './update-community-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateCommunityModalComponent implements OnInit {
  store = inject(Store);
  #modalService = inject(ModalService);
  community = this.store.selectSignal(selectCommunity);
  router = inject(Router);

  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;

  updateCommunityForm = new FormGroup<CommunityForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    themes: new FormControl<string[] | null>(null),
    tags: new FormControl<string[] | null>(null),
    description: new FormControl<string | null>(null),
  });

  ngOnInit() {
    const community = this.community();
    if (!community) return;

    if (community) {
      this.updateCommunityForm.patchValue({
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

  updateCommunity() {
    this.updateCommunityForm.markAllAsTouched();
    this.inputs.forEach((c) => c['cdr'].markForCheck());

    if (this.updateCommunityForm.valid) {
      const community = this.community();
      if (!community) return;

      this.store.dispatch(communityActions.updateCommunity({ id: community.id, community: this.updateCommunityForm.getRawValue() }));
      this.hide();
    }
  }

  async openDeleteModal() {
    const modal = this.#modalService.show(DeleteCommunityModalComponent);
    if (!modal) return;

    const res = await firstValueFrom(modal);
    if (!res) return;

    this.store.dispatch(communityActions.deleteCommunity({ id: this.community()!.id }));

    await this.router.navigate(['/community']);

    this.hide();
  }
}
