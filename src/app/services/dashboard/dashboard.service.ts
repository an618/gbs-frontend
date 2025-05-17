import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardData } from '@app/interface/interface';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardData(userId: string): Observable<DashboardData[]> {
    return this.http.get<DashboardData[]>(
      `${environment.BASE_URL}/dashboard/${userId}`
    );
  }
}
