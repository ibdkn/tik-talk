import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs';
import { communityActions } from './actions';
import { CommunityService } from '../services/community.service';
import {
  selectCommunityById,
  selectCommunityFilters,
  selectCommunityPageable,
} from './selectors';

@Injectable({
  providedIn: 'root',
})
export class CommunityEffects {
  communityService = inject(CommunityService);
  actions$ = inject(Actions);
  store = inject(Store);

  filterCommunities = createEffect(() => {
    return this.actions$.pipe(
      ofType(communityActions.filterEvents, communityActions.setPage),
      withLatestFrom(
        this.store.select(selectCommunityFilters),
        this.store.select(selectCommunityPageable)
      ),
      switchMap(([_, filters, pageable]) => {
        return this.communityService.filterCommunities({
          ...pageable,
          ...filters,
        });
      }),
      map((res) =>
        communityActions.communitiesLoaded({ communities: res.items })
      )
    );
  });
  joinCommunity = createEffect(() =>
    this.actions$.pipe(
      ofType(communityActions.joinCommunity),
      switchMap((action) =>
        this.store.select(selectCommunityById(action.id)).pipe(
          take(1),
          filter((entity) => !!entity && !entity.isJoined),
          switchMap(() =>
            this.communityService
              .joinCommunity(action.id)
              .pipe(
                map(() => communityActions.communityJoined({ id: action.id }))
              )
          )
        )
      )
    )
  );
  leaveCommunity = createEffect(() =>
    this.actions$.pipe(
      ofType(communityActions.leaveCommunity),
      switchMap(({ id }) =>
        this.store.select(selectCommunityById(id)).pipe(
          take(1),
          filter((entity) => !!entity && !!entity.isJoined),
          switchMap(() =>
            this.communityService
              .leaveCommunity(id)
              .pipe(map(() => communityActions.communityLeft({ id })))
          )
        )
      )
    )
  );
  createCommunity = createEffect(() =>
    this.actions$.pipe(
      ofType(communityActions.createCommunity),
      switchMap(({ community }) =>
        this.communityService.createCommunity(community).pipe(
          withLatestFrom(this.store.select(selectCommunityFilters)),
          map(([_, filters]) => communityActions.filterEvents({ filters }))
        )
      )
    )
  );
  getCommunity = createEffect(() =>
    this.actions$.pipe(
      ofType(communityActions.getCommunity),
      switchMap(({ id }) =>
        this.communityService.getCommunity(id).pipe(
          map((community) =>
            communityActions.communityLoaded({ community })
          )
        )
      )
    )
  );
}
