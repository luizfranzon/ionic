import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isUserAuthenticated = authService.isUserAuthenticated();

  if (!isUserAuthenticated) {
    return router.navigate(['/auth']);
  }

  return isUserAuthenticated;
};
