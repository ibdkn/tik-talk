import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  formatCount,
  InfiniteScrollTriggerComponent,
  ModalService,
  PreviewCardComponent,
  SvgIconComponent,
} from '@tt/common-ui';
import { Store } from '@ngrx/store';
import {
  Community,
  COMMUNITY_PAGE_SIZE,
  communityActions,
  PreviewCard,
  ProfileService,
  selectCommunityFilters,
  selectFilteredCommunities,
} from '@tt/data-access';
import { CommunityFilterComponent } from '../community-filter/community-filter.component';
import { CreateCommunityModalComponent } from '../../ui/create-community-modal/create-community-modal.component';

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
  standalone: true,
})
export class CommunitySearchPageComponent {
  store: Store = inject(Store);
  profileService: ProfileService = inject(ProfileService);
  #modalService = inject(ModalService);

  communities = this.store.selectSignal(selectFilteredCommunities);
  filters = this.store.selectSignal(selectCommunityFilters);
  me = this.profileService.me;
  meId = computed(() => this.me()?.id ?? null);

  private mapCommunity = (c: Community, myId: number): PreviewCard => ({
    id: c.id,
    avatarUrl: c.avatarUrl,
    title: c.name || 'Без названия',
    subtitle: formatCount(c.subscribersAmount, [
      'подписчик',
      'подписчика',
      'подписчиков',
    ]),
    tags: c.tags ?? [],
    primaryLabel: c.isJoined ? 'Отписаться' : 'Подписаться',
    icon: c.isJoined ? 'unsubscribe' : 'subscribe',
    secondaryLink: `/community/${c.id}`,
    isJoined: c.isJoined,
    isOwnedByCurrentUser: c.admin.id === myId,
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
    if (this.previewCommunities().length % COMMUNITY_PAGE_SIZE === 0) {
      this.store.dispatch(communityActions.setPage({}));
    }
  }

  showCreateCommunity() {
    this.#modalService.show(CreateCommunityModalComponent);
  }
}
