import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { profileActions, SearchFilter, selectProfileFilters } from '@tt/data-access';
import {Store} from '@ngrx/store';
import { SearchFilterComponent } from '@tt/common-ui';


@Component({
  selector: 'app-profile-filter',
  imports: [FormsModule, ReactiveFormsModule, SearchFilterComponent],
  templateUrl: './profile-filter.component.html',
  styleUrl: './profile-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFilterComponent implements OnInit {
  fd: FormBuilder = inject(FormBuilder);
  store: Store = inject(Store);

  searchFilterData: SearchFilter[] = [
    {
      labelText: 'Имя пользователя',
      formControlName: 'firstName',
      placeholder: 'Выберите',
      icon: 'search',
    },
    {
      labelText: 'Фамилия пользователя',
      formControlName: 'lastName',
      placeholder: 'Выберите',
      icon: 'search',
    },
    {
      labelText: 'Навыки',
      formControlName: 'stack',
      placeholder: 'Выберите',
      icon: 'search',
    },
  ];

  searchForm = this.fd.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  ngOnInit() {
    const filters = this.store.selectSignal(selectProfileFilters)();
    this.searchForm.patchValue(filters);

    this.searchForm.valueChanges
      .pipe(startWith(this.searchForm.value), debounceTime(300))
      .subscribe((formValue) => {
        this.store.dispatch(
          profileActions.filterEvents({ filters: formValue })
        );
      });
  }

  onFilterChanged(event: Record<string, any>) {
    this.store.dispatch(profileActions.filterEvents({ filters: event }));
  }
}
