import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterComponent } from '@tt/common-ui';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { communityActions, SearchFilter, selectCommunityFilters } from '@tt/data-access';
import { debounceTime, startWith, Subscription } from 'rxjs';

@Component({
  selector: 'tt-community-filter',
  imports: [CommonModule, SearchFilterComponent],
  templateUrl: './community-filter.component.html',
  styleUrl: './community-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityFilterComponent implements OnInit, OnDestroy {
  private sub = new Subscription();
  fd: FormBuilder = inject(FormBuilder);
  store: Store = inject(Store);

  searchFilterData: SearchFilter[] = [
    {
      labelText: 'Название сообщества',
      formControlName: 'name',
      placeholder: 'Введите',
      icon: 'search',
    },
    {
      labelText: 'Тема',
      formControlName: 'themes',
      placeholder: 'Выберите',
      icon: 'search',
    },
    {
      labelText: 'Теги',
      formControlName: 'tags',
      placeholder: 'Введите',
      icon: 'search',
    },
  ];

  searchForm = this.fd.group({
    name: [''],
    themes: [''],
    tags: [''],
  });

  ngOnInit() {
    const filters = this.store.selectSignal(selectCommunityFilters)();
    this.searchForm.patchValue(filters);

    this.sub.add(
      this.searchForm.valueChanges
        .pipe(startWith(this.searchForm.value), debounceTime(300))
        .subscribe((formValue) => {
          this.store.dispatch(
            communityActions.filterEvents({ filters: formValue })
          );
        })
    )
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
