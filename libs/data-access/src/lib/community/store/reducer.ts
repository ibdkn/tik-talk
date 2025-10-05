import { Community } from '../interfaces/community.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { communityActions } from './actions';

export interface CommunityState {
  communities: Community[];
  communityFilters: Record<string, any>;
  joiningIds: number[];
  page: number,
  size: number
}

export const initialCommunityState: CommunityState = {
  communities: [],
  communityFilters: {},
  joiningIds: [],
  page: 1,
  size: 10
};

export const communityFeature = createFeature({
  name: 'communityFeature',
  reducer: createReducer(
    initialCommunityState,
    on(communityActions.communitiesLoaded, (state, payload) => {
      return {
        ...state,
        communities: state.communities.concat(payload.communities),
      };
    }),
    on(communityActions.filterEvents, (state, payload) => {
      return {
        ...state,
        communities: [],
        communityFilters: payload.filters,
        page: 1
      };
    }),
    on(communityActions.setPage, (state, payload) => {
      let page = payload.page;
      if (!page) page = state.page + 1;

      return {
        ...state,
        page
      }
    }),
    on(communityActions.joinCommunity, (state, payload) => ({
      ...state,
      joiningIds: state.joiningIds.includes(payload.id) ? state.joiningIds : [...state.joiningIds, payload.id],
    })),
    on(communityActions.communityJoined, (state, payload) => ({
      ...state,
      joiningIds: state.joiningIds.filter((x) => x !== payload.id),
      communities: state.communities.map((c) =>
        c.id === payload.id ? { ...c, isJoined: true } : c
      ),
    })),
    on(communityActions.leaveCommunity, (state) => ({
      ...state,
    })),
    on(communityActions.communityLeft, (state, payload) => ({
      ...state,
      communities: state.communities.map((c) =>
        c.id === payload.id ? { ...c, isJoined: false } : c
      ),
    })),
  ),
});
