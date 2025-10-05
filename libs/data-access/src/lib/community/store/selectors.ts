import { createSelector } from '@ngrx/store';
import { communityFeature } from './reducer';

export const selectFilteredCommunities = createSelector(
  communityFeature.selectCommunities,
  (communities) => communities
);

export const selectCommunityFilters = createSelector(
  communityFeature.selectCommunityFilters,
  (filters) => filters
);

export const selectCommunityPageable = createSelector(
  communityFeature.selectCommunityFeatureState,
  (state) => {
    return {
      page: state.page,
      size: state.size
    }
  }
);

export const selectJoiningIds = createSelector(
  communityFeature.selectJoiningIds,
  (ids) => ids
);

export const selectCommunityById = (id: number) =>
  createSelector(
    communityFeature.selectCommunities,
    (list) => list.find((c) => c.id === id) ?? null
  );

export const selectIsJoining = (id: number) =>
  createSelector(selectJoiningIds, (ids) => ids.includes(id));
