import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  Community,
  CommunityCreateDto,
} from '../interfaces/community.interface';
import { Pageable } from '../../shared/interfaces/pageable.interface';
import { Profile } from '@tt/data-access';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  http = inject(HttpClient);
  baseApiUrl = '/yt-course';

  getCommunity(id: number): Observable<Community> {
    return this.http.get<Community>(`${this.baseApiUrl}/community/${id}`);
  }

  getSubscribersShortList(id: number, subsAmount = 3) {
    return this.http
      .get<Pageable<Profile>>(`${this.baseApiUrl}/community/subscribers/${id}`)
      .pipe(map((res) => res.items.slice(0, subsAmount)));
  }

  filterCommunities(params: Record<string, any>) {
    return this.http.get<Pageable<Community>>(`${this.baseApiUrl}/community/`, {
      params,
    });
  }

  joinCommunity(id: number): Observable<string> {
    return this.http.post<string>(
      `${this.baseApiUrl}/community/${id}/join`,
      {}
    );
  }

  leaveCommunity(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseApiUrl}/community/${id}/join`);
  }

  createCommunity(payload: CommunityCreateDto): Observable<Community> {
    return this.http.post<Community>(`${this.baseApiUrl}/community/`, payload);
  }
}
