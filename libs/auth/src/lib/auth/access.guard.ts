import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../data-access/src/lib/auth/services/auth.service';

export const canActivateAuth = () => {
  const isLoggedIn: boolean = inject(AuthService).isAuth;

  if (isLoggedIn) {
    return true;
  }

  return inject(Router).createUrlTree(['/login']);
};
