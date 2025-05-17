import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const AuthorizedGuard: CanActivateFn = () => {
  const router = new Router();
  const isAuthorized = localStorage.getItem('token');
  if (isAuthorized) {
    const decoded = jwtDecode(isAuthorized!);
    if (decoded) {
      localStorage.setItem('userId', (decoded as any).userId);
      // localStorage.setItem('userId', '63aae36e-98ff-45e0-a1b8-2a5f46b128b0');
      return true;
    } else {
      router.navigateByUrl('/sign-in');
      return false;
    }
  }
  router.navigateByUrl('/sign-in');
  return false;
};

export const UnAuthorizedGuard: CanActivateFn = () => {
  const isAuthorized = localStorage.getItem('token');
  const router = new Router();
  if (!isAuthorized) {
    return true;
  }
  router.navigateByUrl('/dashboard');
  return false;
};
