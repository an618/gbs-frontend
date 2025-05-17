import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from '@app/services/auth/auth.service';
import { environment } from '@env/environment';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('LoginService', () => {
    it('should send login request and return a token', () => {
      const mockResponse = { token: 'mock-token' };
      const username = 'testUser';
      const password = 'testPassword123';

      authService.login(username, password).subscribe({
        next: (response) => {
          expect(response.token).toEqual(mockResponse.token);
        },
        error: () => {
          fail('Invalid credentials ');
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/auth/login`,
      });

      expect(mockRequest.request.body).toEqual({
        username: username,
        password: password,
      });

      mockRequest.flush(mockResponse);
    });

    it('should handle error if login fails', () => {
      const username = 'testUser';
      const password = 'wrongPassword123';
      const errorMessage = 'Invalid credentials';

      authService.login(username, password).subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/auth/login`,
      });

      mockRequest.flush(errorMessage, {
        status: 401,
        statusText: 'Unauthorized',
      });
    });
  });

  describe('LogoutService', () => {
    it('should be logout', () => {
      authService.logout().subscribe();

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/auth/logout`,
      });

      mockRequest.flush([]);
    });

    it('should handle error if logout fails', () => {
      const errorMessage = 'Bad Request';
      authService.logout().subscribe({
        error: () => {
          fail('Fail to logout');
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/auth/logout`,
      });

      mockRequest.flush([]);
    });
  });
});
