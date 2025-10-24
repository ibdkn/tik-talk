import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Community,
  CommunityCreateDto,
} from '../interfaces/community.interface';
import { Pageable } from '../../shared/interfaces/pageable.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  http = inject(HttpClient);
  baseApiUrl = '/yt-course';

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
