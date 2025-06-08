import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Profile} from '../interfaces/profile.interface';
import {map, Observable, tap} from 'rxjs';
import {Pageable} from '../interfaces/pageable.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl: string = 'https://icherniakov.ru/yt-course';

  me = signal<Profile | null>(null);

  constructor() { }

  getTestAccounts(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseApiUrl}/account/test_accounts`)
  }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}/account/me`)
      .pipe(
        tap(res => this.me.set(res))
      )
  }

  getSubscribersShortList() {
    return this.http.get<Pageable<Profile>>(`${this.baseApiUrl}/account/subscribers/`)
      .pipe(
        map(res => res.items.slice(0, 3))
      )
  }
}
