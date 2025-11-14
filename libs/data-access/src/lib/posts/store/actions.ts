import { createActionGroup, props } from '@ngrx/store';
import { Post } from '@tt/data-access';
import { PostCreateDto, PostUpdateDto } from '../interfaces/post.interface';

export const postActions = createActionGroup({
  source: 'posts',
  events: {
    'filter events': props<{ filters: Record<string, any> }>(),
    'posts loaded': props<{ posts: Post[] }>(),
    'create post': props<{ post: PostCreateDto }>(),
    'post created': props<{ post: Post }>(),
    'delete post': props<{ id: number }>(),
    'post deleted': props<{ id: number }>(),
    'update post': props<{ id: number; post: PostUpdateDto }>(),
    'post updated': props<{ post: Post }>(),
  },
});
