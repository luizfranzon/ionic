import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isUserAuthenticated = authService.isUserAuthenticated();

  if (!isUserAuthenticated) {
    return router.navigate(['/auth']);
  }

  return isUserAuthenticated;
};
