import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchFilter } from '@tt/data-access';
import { ListInputControlComponent } from '../list-input-control/list-input-control.component';
import { TextInputControlComponent } from '../text-input-control/text-input-control.component';
import { SelectControlComponent } from '../select-control/select-control.component';

@Component({
  selector: 'tt-search-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ListInputControlComponent,
    TextInputControlComponent,
    SelectControlComponent,
  ],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent {
  @Input() formGroupData!: FormGroup;
  @Input() searchFilterData!: SearchFilter[];
}
