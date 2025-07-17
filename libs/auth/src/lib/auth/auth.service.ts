import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { TokenResponse } from '../data/interfaces/auth.interface';
import { Login } from '../data/interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  cookieService: CookieService = inject(CookieService);
  baseApiUrl: string = 'https://icherniakov.ru/yt-course/auth';

  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth(): boolean {
    if (!this.token) {
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }
    return !!this.token;
  }

  login(payload: Login): Observable<TokenResponse> {
    const fd = new FormData();
    fd.append('username', payload.username);
    fd.append('password', payload.password);

    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}/token`, fd)
      .pipe(tap((val: TokenResponse): void => this.saveTokens(val)));
  }

  refreshAuthToken() {
    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}/refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((val: TokenResponse): void => this.saveTokens(val)),
        catchError((err) => {
          this.logout();
          return throwError(err);
        })
      );
  }

  logout() {
    this.cookieService.deleteAll();
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }

  saveTokens(res: TokenResponse): void {
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;

    this.cookieService.set('token', this.token);
    this.cookieService.set('refreshToken', this.refreshToken);
    // this.cookieService.set('token', this.token, {path: '/'});
    // this.cookieService.set('refreshToken', this.refreshToken, {path: '/'});
  }
}
