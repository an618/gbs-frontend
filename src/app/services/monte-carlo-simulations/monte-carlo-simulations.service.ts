import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonteCarloSimulationsData } from '@app/interface/interface';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MonteCarloSimulationsService {
  constructor(private http: HttpClient) {}

  monteCarloSimulations(data:MonteCarloSimulationsData): Observable<Blob> {
    return this.http.post(
      `${environment.BASE_URL}/monte-carlo/generate/simulation`,
      {
        data: data,
      },
      { responseType: 'blob' }
    );
  }
}
