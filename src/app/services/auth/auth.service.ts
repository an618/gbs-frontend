import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.BASE_URL}/auth/login`,
      {
        username: username,
        password: password,
      }
    );
  }
  logout(): Observable<string> {
    return this.http.post<string>(`${environment.BASE_URL}/auth/logout`, {});
  }
}
