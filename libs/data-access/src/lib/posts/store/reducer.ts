import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions } from './actions';
import { Post } from '../interfaces/post.interface';

export interface PostState {
  posts: Post[];
  postFilters: Record<string, any>;
}

export const initialPostState: PostState = {
  posts: [],
  postFilters: {},
};

export const postFeature = createFeature({
  name: 'postFeature',
  reducer: createReducer(
    initialPostState,
    on(postActions.postsLoaded, (state, payload) => {
      return {
        ...state,
        posts: payload.posts,
      };
    }),
    on(postActions.filterEvents, (state, payload) => ({
      ...state,
      postFilters: payload.filters,
    })),
    on(postActions.postDeleted, (state, { id }) => ({
      ...state,
      posts: state.posts.filter((p) => p.id !== id),
    }))
  ),
});
