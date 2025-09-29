import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {Store} from '@ngrx/store';
import {
  Profile,
  profileActions,
  selectFilteredProfiles,
  selectProfileFilters
} from '../../../../../data-access/src/lib/profile';
import {
  InfiniteScrollTriggerComponent, PreviewCardComponent
} from '@tt/common-ui';
import { ProfileFilterComponent } from '../profile-filter/profile-filter.component';
import { PreviewCardData } from '@tt/data-access';

@Component({
  selector: 'app-search-page',
  imports: [
    InfiniteScrollTriggerComponent,
    ProfileFilterComponent,
    PreviewCardComponent,
  ],
  templateUrl: './profile-search-page.component.html',
  styleUrl: './profile-search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSearchPageComponent {
  store: Store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);
  filters = this.store.selectSignal(selectProfileFilters);

  private mapProfile = (p: Profile): PreviewCardData => ({
    id: p.id,
    avatarUrl: p.avatarUrl,
    title: `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || '',
    subtitle: p.username,
    description: p.description ?? '',
    tags: p.stack ?? [],
    primaryLabel: 'Подписаться',
    secondaryLink: `/profile/${p.id}`,
  });

  previewProfiles = computed(() => this.profiles().map(this.mapProfile));

  timeToFetch(): void {
    this.store.dispatch(profileActions.setPage({}));
  }
}
