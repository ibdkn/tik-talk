import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {Store} from '@ngrx/store';

import {
  InfiniteScrollTriggerComponent, PreviewCardComponent
} from '@tt/common-ui';
import { ProfileFilterComponent } from '../profile-filter/profile-filter.component';
import {
  PreviewCard,
  Profile,
  profileActions, ProfileService,
  selectFilteredProfiles,
  selectProfileFilters
} from '@tt/data-access';

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
  profileService: ProfileService = inject(ProfileService);
  profiles = this.store.selectSignal(selectFilteredProfiles);
  filters = this.store.selectSignal(selectProfileFilters);
  me = this.profileService.me;
  meId = computed(() => this.me()?.id ?? null);

  private mapProfile = (p: Profile, myId: number): PreviewCard => ({
    id: p.id,
    avatarUrl: p.avatarUrl,
    title: `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || '',
    subtitle: p.username,
    description: p.description ?? '',
    tags: p.stack ?? [],
    primaryLabel: 'Подписаться', // todo реализовать тернарник (подписаться или отписаться)
    icon: 'subscribe', // todo аналогично реализовать тернарник
    secondaryLink: `/profile/${p.id}`,
    isJoined: false,
    isOwnedByCurrentUser: p.id === myId
  });

  previewProfiles = computed(() => {
    const myId = this.meId();
    if (myId == null) return [];
    return this.profiles().map(c => this.mapProfile(c, myId));
  });

  timeToFetch(): void {
    this.store.dispatch(profileActions.setPage({}));
  }
}
