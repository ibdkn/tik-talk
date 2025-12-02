import { Community } from '../interfaces/community.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { communityActions } from './actions';
import { Post, postActions } from '../../posts';

export interface CommunityState {
  communities: Community[];
  communityFilters: Record<string, any>;
  joiningIds: number[];
  page: number;
  size: number;
  communityPostsById: Record<number, Post[]>;
  community: Community | null;
}

export const initialCommunityState: CommunityState = {
  communities: [],
  communityFilters: {},
  joiningIds: [],
  page: 1,
  size: 10,
  communityPostsById: {},
  community: null
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
        page: 1,
      };
    }),
    on(communityActions.setPage, (state, payload) => {
      let page = payload.page;
      if (!page) page = state.page + 1;

      return {
        ...state,
        page,
      };
    }),
    on(communityActions.joinCommunity, (state, payload) => ({
      ...state,
      joiningIds: state.joiningIds.includes(payload.id)
        ? state.joiningIds
        : [...state.joiningIds, payload.id],
    })),
    on(communityActions.communityJoined, (state, payload) => ({
      ...state,
      communities: state.communities.map((c) =>
        c.id === payload.id
          ? {
              ...c,
              isJoined: true,
              subscribersAmount: (c.subscribersAmount ?? 0) + 1,
            }
          : c
      ),
    })),
    on(communityActions.leaveCommunity, (state) => ({
      ...state,
    })),
    on(communityActions.communityLeft, (state, payload) => ({
      ...state,
      communities: state.communities.map((c) =>
        c.id === payload.id
          ? {
              ...c,
              isJoined: false,
              subscribersAmount: Math.max(0, (c.subscribersAmount ?? 0) - 1),
            }
          : c
      ),
    })),
    on(communityActions.communityPostsLoaded, (state, payload) => {
      return {
        ...state,
        communityPostsById: {
          ...state.communityPostsById,
          [payload.communityId]: payload.posts,
        },
      };
    }),
    on(communityActions.communityPostAdded, (state, { communityId, post }) => {
      const prev = state.communityPostsById[communityId] ?? [];
      return {
        ...state,
        communityPostsById: {
          ...state.communityPostsById,
          [communityId]: [post, ...prev],
        },
      };
    }),
    on(postActions.postDeleted, (state, { id }) => ({
      ...state,
      communityPostsById: Object.fromEntries(
        Object.entries(state.communityPostsById).map(([communityId, posts]) => [
          communityId,
          posts.filter((p) => p.id !== id),
        ])
      ),
    })),
    on(postActions.postUpdated, (state, { post }) => ({
      ...state,
      communityPostsById: Object.fromEntries(
        Object.entries(state.communityPostsById).map(([communityId, posts]) => [
          communityId,
          posts.map((p) => p.id === post.id ? { ...p, content: post.content } : p),
        ])
      ),
    })),
    on(communityActions.communityLoaded, (state, { community }) => ({
      ...state,
      community,
    }))
  ),
});
