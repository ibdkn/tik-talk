import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchFilter } from '@tt/data-access';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ListInputControlComponent } from '../list-input-control/list-input-control.component';
import { TextInputControlComponent } from '../text-input-control/text-input-control.component';

@Component({
  selector: 'tt-search-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ListInputControlComponent,
    TextInputControlComponent,
  ],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent implements OnChanges, OnDestroy {
  @Input() formGroupData!: FormGroup;
  @Input() searchFilterData!: SearchFilter[];
  @Output() filtersChanged = new EventEmitter<Record<string, any>>();

  private destroy$ = new Subject<void>();

  ngOnChanges() {
    if (!this.formGroupData) return;
    this.destroy$.next();
    this.formGroupData.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((v) => this.filtersChanged.emit(v));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
