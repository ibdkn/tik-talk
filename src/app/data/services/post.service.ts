import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Comment, CommentCreateDto, Post, PostCreateDto, PostUpdateDto} from '../interfaces/post.interface';
import {map, Observable, switchMap, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl: string = 'https://icherniakov.ru/yt-course';

  posts = signal<Post[]>([])

  createPost(payload: PostCreateDto): Observable<Post[]> {
    return this.http.post<Post>(`${this.baseApiUrl}/post/`, payload)
      .pipe(
        switchMap(() => {
          return this.fetchPosts()
        })
      )
  }

  updatePost(id: number, payload: PostUpdateDto): Observable<Post[]> {
    return this.http.patch<Post>(`${this.baseApiUrl}/post/${id}`, payload)
      .pipe(
        switchMap(() => {
          return this.fetchPosts()
        })
      )
  }

  fetchPosts() {
    return this.http.get<Post[]>(`${this.baseApiUrl}/post/`)
      .pipe(
        tap((res: Post[]) => this.posts.set(res))
      )
  }

  deletePost(id: number): Observable<Post[]> {
    return this.http.delete<Post>(`${this.baseApiUrl}/post/${id}`)
      .pipe(
        switchMap(() => {
          return this.fetchPosts()
        })
      )
  }

  createComments(payload: CommentCreateDto): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseApiUrl}/comment/`, payload);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Post>(`${this.baseApiUrl}/post/${postId}`)
      .pipe(
        map((res: Post) => res.comments)
      )
  }
}
