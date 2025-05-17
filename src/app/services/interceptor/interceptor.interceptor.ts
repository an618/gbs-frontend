import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Router } from '@angular/router';

export function InterceptorService(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  const newReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
    : req.clone({ withCredentials: true });

  return next(newReq).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        localStorage.clear();
        router.navigate(['/sign-in']);
      }
      throw error;
    })
  );
}
