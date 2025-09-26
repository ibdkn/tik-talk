import {inject, Injectable} from '@angular/core';
import {Post, PostService} from '@tt/data-access';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {postActions} from './actions';
import {concatMap, map, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostEffects {
  postService = inject(PostService);
  actions$ = inject(Actions);

  filterPosts = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.filterEvents),
      switchMap(({filters}) =>
        this.postService.fetchPosts().pipe(
          map(posts => postActions.postsLoaded({posts}))
        )
      )
    )
  });

  createPost = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.createPost),
      switchMap(({ post }) =>
        this.postService.createPost(post).pipe(
          concatMap(() => this.postService.fetchPosts()),
          map(posts => postActions.postsLoaded({ posts }))
        )
      )
    )
  );

  deletePost = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.deletePost),
      switchMap(({ id }) =>
        this.postService.deletePost(id).pipe(
          concatMap(() => this.postService.fetchPosts()),
          map(posts => postActions.postsLoaded({ posts }))
        )
      )
    )
  );

  updatePost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.updatePost),
      switchMap(({id, post}) =>
        this.postService.updatePost(id, post).pipe(
          map((updatedPost: Post) => postActions.postUpdated({ post: updatedPost }))
        )
      )
    )
  })
}
