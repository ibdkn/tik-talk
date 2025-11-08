import { inject, Injectable } from '@angular/core';
import { PostService, selectFilteredPosts } from '@tt/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { postActions } from './actions';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

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
          withLatestFrom(this.store.select(selectFilteredPosts)),
          map(([_, filters]) => postActions.filterEvents({ filters }))
        )
      )
    )
  );

  deletePost = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.deletePost),
      switchMap(({ id }) =>
        this.postService.deletePost(id).pipe(
          withLatestFrom(this.store.select(selectFilteredPosts)),
          map(([_, filters]) => postActions.filterEvents({ filters }))
        )
      )
    )
  );

  updatePost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.updatePost),
      switchMap(({ id, post }) =>
        this.postService.updatePost(id, post).pipe(
          withLatestFrom(this.store.select(selectFilteredPosts)),
          map(([_, filters]) => postActions.filterEvents({ filters }))
        )
      )
    );
  });
}
