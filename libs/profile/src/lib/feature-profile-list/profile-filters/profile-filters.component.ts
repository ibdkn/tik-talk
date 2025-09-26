import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import {profileActions, selectProfileFilters} from '@tt/data-access';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-profile-filters',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFiltersComponent implements OnInit {
  fd = inject(FormBuilder);
  store: Store = inject(Store);

  searchForm = this.fd.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
      )
      .subscribe(formValue => {
        this.store.dispatch(profileActions.filterEvents({filters: formValue}))
      });
  }

  ngOnInit() {
    const filters = this.store.selectSignal(selectProfileFilters)();
    this.searchForm.patchValue(filters);

    this.searchForm.valueChanges
      .pipe(
        startWith(this.searchForm.value),
        debounceTime(300),
      )
      .subscribe(formValue => {
        this.store.dispatch(profileActions.filterEvents({ filters: formValue }));
      });
  }
}
