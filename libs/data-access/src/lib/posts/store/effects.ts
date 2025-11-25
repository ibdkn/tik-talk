import { inject, Injectable } from '@angular/core';
import { communityActions, PostService } from '@tt/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { postActions } from './actions';
import { from, map, mergeMap, switchMap } from 'rxjs';
import { Action, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class PostEffects {
  store = inject(Store);
  postService = inject(PostService);
  actions$ = inject(Actions);

  filterPosts = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.filterEvents),
      switchMap(({ filters }) =>
        this.postService
          .fetchPosts(filters)
          .pipe(map((posts) => postActions.postsLoaded({ posts })))
      )
    );
  });

  createPost = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.createPost),
      switchMap(({ post }) =>
        this.postService.createPost(post).pipe(
          mergeMap((createdPost) => {
            const actions: Action[] = [
              postActions.postCreated({ post: createdPost }),
            ];

            if (createdPost.communityId) {
              actions.push(
                communityActions.filterCommunityPostsEvent({
                  communityId: createdPost.communityId,
                  filters: {},
                })
              );
            }

            return from(actions);
          }),
        )
      )
    )
  );

  deletePost = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.deletePost),
      switchMap(({ id }) =>
        this.postService.deletePost(id).pipe(
          map(() => postActions.postDeleted({ id }))
        )
      )
    )
  );

  updatePost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.updatePost),
      switchMap(({ id, post }) =>
        this.postService.updatePost(id, post).pipe(
          map((updatedPost) => postActions.postUpdated({ post: updatedPost }))
        )
      )
    );
  });
}
