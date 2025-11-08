import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  PostComment,
  CommentCreateDto,
  Post,
  PostCreateDto,
  PostUpdateDto,
} from '../interfaces/post.interface';
import { map, Observable } from 'rxjs';
import { Pageable } from '@tt/data-access';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl: string = '/yt-course';

  posts = signal<Post[]>([]);

  createPost(payload: PostCreateDto): Observable<Post> {
    return this.http.post<Post>(`${this.baseApiUrl}/post/`, payload);
  }

  updatePost(id: number, payload: PostUpdateDto): Observable<Post> {
    return this.http.patch<Post>(`${this.baseApiUrl}/post/${id}`, payload);
  }

  fetchPosts(params: Record<string, any>) {
    const { community_id } = params;

    if (community_id) {
      return this.http.get<Pageable<Post>>(
        `${this.baseApiUrl}/community/${community_id}/posts`,
      ).pipe(
        map((res) => res.items)
      );
    }

    return this.http.get<Post[]>(`${this.baseApiUrl}/post/`, { params });
  }

  deletePost(id: number): Observable<Post> {
    return this.http.delete<Post>(`${this.baseApiUrl}/post/${id}`);
  }

  createComment(payload: CommentCreateDto): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.baseApiUrl}/comment/`, payload);
  }

  getCommentsByPostId(postId: number): Observable<PostComment[]> {
    return this.http
      .get<Post>(`${this.baseApiUrl}/post/${postId}`)
      .pipe(map((res: Post) => res.comments));
  }
}
