import { CurrencyPipe, KeyValuePipe, PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardData } from '@app/interface/interface';
import {
  ConstantService,
  DashboardService,
  LoaderService,
  LoggingService,
} from '@app/services';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../../common-components/loader/loader.component';
import { ButtonComponent } from '../../common-components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workbook',
  standalone: true,
  imports: [
    TranslateModule,
    CurrencyPipe,
    PercentPipe,
    LoaderComponent,
    ButtonComponent,
    KeyValuePipe,
  ],
  templateUrl: './dashboard.component.html',
})
export class WorkbookComponent {
  dashboard: DashboardData[] = [];
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public constantService: ConstantService,
    public loaderService: LoaderService
  ) {
    this.loaderService.setLoader(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const app_logs = localStorage.getItem('app_logs');
    localStorage.clear();
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId!);
      localStorage.setItem('app_logs', app_logs!);
      this.dashboardService.getDashboardData(userId!).subscribe({
        next: (response) => {
          this.loggingService.info('Dashboard data fetched successfully');
          this.dashboard = response;
          console.log(response);
          this.loaderService.setLoader(false);
        },
        error: (error) => {
          this.loaderService.setLoader(true);
          this.loggingService.error(
            'Failed to fetch dashboard data',
            'src/app/components/dashboard-components/dashboard/dashboard.component.ts',
            'DashboardComponent',
            error.message
          );
          this.toastr.error('Failed to fetch dashboard data');
        },
      });
    }
    this.loaderService.setLoader(false);
  }

  sendToGoalSetting() {
    this.router.navigateByUrl('/investment-advisor/goal-setting');
  }
}
