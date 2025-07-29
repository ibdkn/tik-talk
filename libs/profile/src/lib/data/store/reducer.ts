import {Profile} from '@tt/interfaces/profile';
import {createFeature, createReducer, on} from '@ngrx/store';
import {profileActions} from './actions';

export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>,
  page: number,
  size: number
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  page: 1,
  size: 10
}

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileActions.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles
      }
    }),
    on(profileActions.filterEvents, (state, payload) => {
      return {
        ...state,
        profileFilters: payload.filters
      }
    })
  )
})
