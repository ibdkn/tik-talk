import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Community } from '../interfaces/community.interface';
import { Pageable } from '../../shared/interfaces/pageable.interface';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl = '/yt-course';
  filteredCommunities = signal<Community[]>([]);

  filterCommunities(params: Record<string, any>) {
    return this.http
      .get<Pageable<Community>>(`${this.baseApiUrl}/community/`, {
        params,
      }).pipe(
        tap((res) => this.filteredCommunities.set(res.items))
      )
  }

  joinCommunity(id: number): Observable<string> {
    return this.http.post<string>(`${this.baseApiUrl}/community/${id}/join`, {});
  }

  leaveCommunity(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseApiUrl}/community/${id}/join`);
  }
}
