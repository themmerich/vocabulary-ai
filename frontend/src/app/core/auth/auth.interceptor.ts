import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * On a 401 from a protected endpoint, clears the cached user and routes to login.
 * Calls under /api/auth/ are excluded so login/register errors surface to the form.
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.startsWith('/api/auth/')) {
        auth.clear();
        void router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
