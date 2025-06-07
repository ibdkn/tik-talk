import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {catchError, switchMap, throwError} from 'rxjs';

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const token: string | null = authService.token;

  // Если токена нет - пропускаем запрос "как есть"
  if (!token) return next(req);

  // Если уже идёт обновление - сразу "пришпандориваем" текущий запрос к новому токену
  if (isRefreshing) {
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
  if (!isRefreshing) {
    isRefreshing = true;

    return authService.refreshAuthToken()
      .pipe(
        switchMap((res) => {
          // получили новые токены → повторяем исходный запрос
          return next(addToken(req, res.access_token));
        })
      )
  }

  // если уже обновляемся - сразу повторяем с тем, что есть в authService.token
  return next(addToken(req, authService.token!));
}

// Функция клонирует запрос и ставит заголовок Authorization
const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
