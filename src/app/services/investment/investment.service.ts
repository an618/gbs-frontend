import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  UpdatePorfolio,
  UpdatePorfolioResponse,
} from '@app/interface/interface';
import { LoggingService } from '@app/services/logging/logging.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private loggingService: LoggingService
  ) {}

  updateUserPortfolio(
    updatePorfolio: UpdatePorfolio
  ): Observable<UpdatePorfolioResponse> {
    return this.http.post<UpdatePorfolioResponse>(
      `${environment.BASE_URL}/user/goal/portfolio`,
      updatePorfolio
    );
  }

  exportUserPortfolio(userPortfolioId: string): Observable<HttpResponse<Blob>> {
    return this.http
      .get(`${environment.BASE_URL}/user/portfolio/${userPortfolioId}/export`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        tap((response: HttpResponse<Blob>) => {
          if (response.body && response.body.size !== 0) {
            let fileName = `Portfolio_${userPortfolioId}.xlsx`;
            const contentDisposition = response?.headers?.get(
              'Content-Disposition'
            );
            if (contentDisposition) {
              fileName = contentDisposition.replace(
                /.*filename=["']?([^"';]+)["']?.*/,
                '$1'
              )!;
            }

            const blob = response.body;
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            this.loggingService.info('User portfolio exported successfully');
          } else {
            this.toastr.error('No file content found.');
            this.loggingService.warn(
              'No content found for user portfolio export'
            );
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.toastr.error('An error occurred while downloading the file.');
          this.loggingService.error(
            'Failed to export user portfolio',
            'src/app/services/investment/investment.service.ts',
            'InvestmentService',
            error.message
          );
          return throwError(() => error);
        })
      );
  }
}
