import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

   return combineLatest([authService.isLoaded$, authService.user$]).pipe(
    filter(([isLoaded, _]) => isLoaded), // Halt execution here if Clerk isn't ready
    map(([_, user]) => {
      if (user) {
        return true; // Authenticated, allow access
      } else {
        router.navigate(['/login']); // Not authenticated, send to login
        return false;
      }
    })
  );
};
