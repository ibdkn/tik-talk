import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollTriggerComponent, PreviewCardComponent, SvgIconComponent } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import {
  Community, communityActions,
  PreviewCardData,
  ProfileService,
  selectCommunityFilters,
  selectFilteredCommunities
} from '@tt/data-access';
import { CommunityFilterComponent } from '../community-filter/community-filter.component';

@Component({
  selector: 'tt-community-search-page',
  imports: [
    CommonModule,
    CommunityFilterComponent,
    SvgIconComponent,
    PreviewCardComponent,
    InfiniteScrollTriggerComponent,
  ],
  templateUrl: './community-search-page.component.html',
  styleUrl: './community-search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitySearchPageComponent {
  store: Store = inject(Store);
  profileService: ProfileService = inject(ProfileService);
  communities = this.store.selectSignal(selectFilteredCommunities);
  filters = this.store.selectSignal(selectCommunityFilters);
  me = this.profileService.me;
  meId = computed(() => this.me()?.id ?? null);

  private mapCommunity = (c: Community, myId: number): PreviewCardData => ({
    id: c.id,
    avatarUrl: c.avatarUrl,
    title: c.name || 'Без названия',
    subtitle: c.description,
    tags: c.tags ?? [],
    primaryLabel: c.isJoined ? 'Отписаться' : 'Подписаться',
    icon: c.isJoined ? 'unsubscribe' : 'subscribe',
    secondaryLink: `/community/${c.id}`,
    isJoined: c.isJoined,
    isMine: c.admin.id === myId,
  });

  previewCommunities = computed(() => {
    const myId = this.meId();
    if (myId == null) return [];
    return this.communities().map((c) => this.mapCommunity(c, myId));
  });

  toggleSubscribe({ id }: { id: number }, isJoined: boolean) {
    this.store.dispatch(
      isJoined
        ? communityActions.leaveCommunity({ id })
        : communityActions.joinCommunity({ id })
    );
  }

  timeToFetch(): void {
    this.store.dispatch(communityActions.setPage({}));
  }
}
