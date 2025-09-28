import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {profileActions, selectFilteredProfiles, selectProfileFilters} from '../../../../../data-access/src/lib/profile';
import { InfiniteScrollTriggerComponent } from '@tt/common-ui';
import { ProfileFilterComponent } from '../profile-filter/profile-filter.component';
import { ProfileCardComponent } from '../../ui';

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCardComponent,
    InfiniteScrollTriggerComponent,
    ProfileFilterComponent,
  ],
  templateUrl: './profile-search-page.component.html',
  styleUrl: './profile-search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSearchPageComponent {
  store: Store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);
  filters = this.store.selectSignal(selectProfileFilters);

  timeToFetch() {
    this.store.dispatch(profileActions.setPage({}));
  }
}
