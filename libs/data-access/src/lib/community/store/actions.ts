import { createActionGroup, props } from '@ngrx/store';
import { Community, CommunityCreateDto } from '../interfaces/community.interface';

export const communityActions = createActionGroup({
  source: 'community',
  events: {
    'filter events': props<{filters: Record<string, any>}>(),
    'communities loaded': props<{communities: Community[]}>(),
    'join community': props<{id: number}>(),
    'community joined': props<{id: number}>(),
    'leave community': props<{id: number}>(),
    'community left': props<{id: number}>(),
    'set page':  props<{page?: number}>(),
    'create community': props<{community: CommunityCreateDto}>(),
    'community created': props<{community: Community}>(),
  }
})
