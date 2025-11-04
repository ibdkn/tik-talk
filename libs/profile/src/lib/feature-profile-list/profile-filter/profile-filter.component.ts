import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { profileActions, selectProfileFilters } from '@tt/data-access';
import {Store} from '@ngrx/store';
import { ListInputComponent, InputComponent, SvgIconComponent } from '@tt/common-ui';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-profile-filter',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ListInputComponent,
    InputComponent,
    SvgIconComponent,
  ],
  templateUrl: './profile-filter.component.html',
  styleUrl: './profile-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFilterComponent {
  fd: FormBuilder = inject(FormBuilder);
  store: Store = inject(Store);
  destroyRef = inject(DestroyRef);

  searchForm = this.fd.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  constructor() {
    const filters = this.store.selectSignal(selectProfileFilters)();
    this.searchForm.patchValue(filters);

    this.searchForm.valueChanges
      .pipe(
        startWith(this.searchForm.value),
        debounceTime(300),
        map((value) => ({
          ...value,
          stack: Array.isArray(value.stack)
            ? [
                ...new Set(
                  value.stack.map((t: string) => t.trim().toLowerCase())
                ),
              ]
            : [],
        })),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((formValue) => {
        this.store.dispatch(
          profileActions.filterEvents({ filters: formValue })
        );
      });
  }
}
