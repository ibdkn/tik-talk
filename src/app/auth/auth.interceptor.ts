import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {BehaviorSubject, catchError, filter, switchMap, tap, throwError} from 'rxjs';

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const token: string | null = authService.token;

  // Если токена нет - пропускаем запрос "как есть"
  if (!token) return next(req);

  // Если уже идёт обновление - сразу "пришпандориваем" текущий запрос к новому токену
  if (isRefreshing$.value) {
    return refreshAndProceed(authService, req, next)
  }

  // Отправляем запрос с существующим токеном
  return next(addToken(req, token))
    .pipe(
      catchError(error => {
        // Если получен 403 - запускаем логику обновления
        if (error.status === 403) {
          return refreshAndProceed(authService, req, next)
        }

        // Во всех других случаях - прокидываем ошибку дальше
        return throwError(error);
      })
    )
}

const refreshAndProceed = (
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (!isRefreshing$.value) {
    isRefreshing$.next(true);

    return authService.refreshAuthToken()
      .pipe(
        switchMap((res) => {
          return next(addToken(req, res.access_token))
            .pipe (
              tap(() => isRefreshing$.next(false))
            )
        })
      )
  }

  if (req.url.includes('refresh')) return next(addToken(req, authService.token!));

  return isRefreshing$
    .pipe(
      filter(isRefreshing => !isRefreshing),
      switchMap(res => {
        return next(addToken(req, authService.token!));
      })
    )
}

// Функция клонирует запрос и ставит заголовок Authorization
const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
