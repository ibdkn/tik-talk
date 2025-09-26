import {Post} from '@tt/data-access';
import {createFeature, createReducer, on} from '@ngrx/store';
import {postActions} from './actions';

export interface PostState {
  posts: Post[],
  postFilters: Record<string, any>
}

export const initialState: PostState = {
  posts: [],
  postFilters: {}
}

export const postFeature = createFeature({
  name: 'postFeature',
  reducer: createReducer(
    initialState,
    on(postActions.postsLoaded, (state, payload) => {
      return {
        ...state,
        posts: payload.posts
      }
    }),
    on(postActions.filterEvents, (state, payload) => ({
      ...state,
      postFilters: payload.filters
    })),
    on(postActions.postCreated, (state, payload) => ({
      ...state,
      posts: [payload.post, ...state.posts]
    })),
    on(postActions.postUpdated, (state, payload) => ({
      ...state,
      posts: state.posts.map(p => p.id === payload.post.id ? payload.post : p)
    }))
  )
})
