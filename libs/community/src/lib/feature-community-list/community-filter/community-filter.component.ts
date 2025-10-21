import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListInputControlComponent,
  SelectControlComponent,
  TextInputControlComponent
} from '@tt/common-ui';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { communityActions, selectCommunityFilters } from '@tt/data-access';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tt-community-filter',
  imports: [
    CommonModule,
    FormsModule,
    ListInputControlComponent,
    SelectControlComponent,
    TextInputControlComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './community-filter.component.html',
  styleUrl: './community-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class CommunityFilterComponent {
  fd = inject(FormBuilder);
  store = inject(Store);
  destroyRef = inject(DestroyRef);

  searchForm = this.fd.group({
    name: [''],
    themes: [''],
    tags: [''],
  });

  constructor() {
    const filters = this.store.selectSignal(selectCommunityFilters)();
    this.searchForm.patchValue(filters);

    this.searchForm.valueChanges
      .pipe(
        startWith(this.searchForm.value),
        debounceTime(300),
        map(value => ({
          ...value,
          tags: Array.isArray(value.tags)
            ? [...new Set(value.tags.map((t: string) => t.trim().toLowerCase()))]
            : [],
        })),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((formValue) => {
        this.store.dispatch(
          communityActions.filterEvents({ filters: formValue })
        );
      });
  }
}
