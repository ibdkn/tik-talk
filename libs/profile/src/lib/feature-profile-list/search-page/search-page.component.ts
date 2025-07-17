import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import {Store} from '@ngrx/store';
import {selectFilteredProfiles, selectProfileFilters} from '../../data';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
  store: Store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);
  filters = this.store.selectSignal(selectProfileFilters);
}
