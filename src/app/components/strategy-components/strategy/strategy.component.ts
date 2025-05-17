import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Pagination, StrategyModelPorfolio } from '@app/interface/interface';
import {
  AssessmentService,
  ConstantService,
  GoalSettingService,
  LoaderService,
  LoggingService,
} from '@app/services';
import { StrategyService } from '@app/services/strategy/strategy.service';
import { ButtonComponent } from '@app/components/common-components/button/button.component';
import { ModelPorfolioComponent } from '../model-porfolio/model-porfolio.component';
import { State, Status } from '@app/enum/enum';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '@app/components/common-components/pagination/pagination.component';
import { LoaderComponent } from '@app/components/common-components/loader/loader.component';

@Component({
  selector: 'app-strategy',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    ModelPorfolioComponent,
    TranslateModule,
    PaginationComponent,
    LoaderComponent,
  ],
  templateUrl: './strategy.component.html',
})
export class StrategyComponent implements OnInit {
  strategyModelPorfolio: StrategyModelPorfolio[] = [];
  showModelPortfolio: string = localStorage.getItem('model') || 'hide';
  questionnaireSkip = JSON.parse(
    localStorage.getItem('questionnaireSkip') || 'false'
  );
  pagination: Pagination = {
    page: 0,
    page_size: 10,
    total_pages: 0,
    total_rows: 0,
    start_page_count: 0,
    end_page_count: 0,
  };
  pageSizes: number[] = [10, 20, 30, 40, 50];
  pageSize: number = 10;
  page: number = 0;

  constructor(
    private strategyService: StrategyService,
    private assessmentService: AssessmentService,
    private goalSettingService: GoalSettingService,
    private router: Router,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public loaderService: LoaderService,
    public constantService: ConstantService
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoader(true);
    if (this.questionnaireSkip) {
      this.loggingService.info(
        'Fetching strategy without risk score (questionnaire skipped)'
      );
      this.strategyService.getStrategy().subscribe({
        next: (response) => {
          if (response) {
            this.strategyModelPorfolio = response.content;
            this.loggingService.info('Strategy data retrieved successfully');
          }
          this.loaderService.setLoader(false);
        },
        error: (error) => {
          this.loaderService.setLoader(true);
          this.toastr.error('Failed to fetch strategy');
          this.loggingService.error(
            'Failed to fetch strategy',
            'src/app/components/strategy-components/strategy/strategy.component.ts',
            'StrategyComponent',
            error.message
          );
        },
      });
    } else {
      const assessmentId = localStorage.getItem('assessmentId')!;
      const roi = JSON.parse(localStorage.getItem('roi')!);
      this.loggingService.info('Fetching assessment score for assessmentId');
      this.assessmentService.getAssessmentScore(assessmentId).subscribe({
        next: (response) => {
          if (response) {
            this.loggingService.info('Assessment score retrieved successfully');
            this.strategyService
              .getStrategy(response.riskScore, roi, this.page, this.pageSize)
              .subscribe({
                next: (strategyResponse) => {
                  if (strategyResponse) {
                    this.strategyModelPorfolio = strategyResponse.content;
                    this.pageSize = strategyResponse.pageable.pageSize;
                    this.page = strategyResponse.pageable.pageNumber;
                    this.pagination.page = strategyResponse.pageable.pageNumber;
                    this.pagination.page_size =
                      strategyResponse.pageable.pageSize;
                    this.pagination.total_rows = strategyResponse.totalElements;
                    this.pagination.total_pages =
                      strategyResponse.numberOfElements;
                    const currentPage = this.pagination.page + 1;
                    const pageSize = this.pagination.page_size;
                    this.pagination.start_page_count =
                      (currentPage - 1) * pageSize + 1;
                    this.pagination.end_page_count = Math.min(
                      currentPage * pageSize,
                      this.pagination.total_rows
                    );

                    this.loggingService.info(
                      'Strategy data retrieved successfully for riskScore'
                    );
                  }
                  this.loaderService.setLoader(false);
                },
                error: (error) => {
                  this.loaderService.setLoader(true);
                  this.toastr.error(
                    'Failed to fetch strategy based on risk score'
                  );
                  this.loggingService.error(
                    'Failed to fetch strategy based on risk score',
                    'src/app/components/strategy-components/strategy/strategy.component.ts',
                    'StrategyComponent',
                    error.message
                  );
                },
              });
          }
        },
        error: (error) => {
          this.toastr.error('Failed to fetch assessment score');
          this.loggingService.error(
            'Failed to fetch assessment score',
            'src/app/components/strategy-components/strategy/strategy.component.ts',
            'StrategyComponent',
            error.message
          );
        },
      });
    }
    this.loaderService.setLoader(false);
  }

  goBack() {
    this.router.navigateByUrl(`/investment-advisor/financial-calculation`);
  }

  setShowModelPortfolio(strategyId: string) {
    this.router.navigateByUrl(
      `/investment-advisor/strategy/porfolio/${strategyId}`
    );
  }

  proceed() {
    localStorage.setItem(
      'strategyId',
      this.strategyModelPorfolio[0].strategyId
    );
    const userGoalId = localStorage.getItem('userGoalId');
    const userId = localStorage.getItem('userId');

    if (userGoalId && userId) {
      this.loggingService.info('Updating goal strategy');
      this.strategyService
        .updateGoalStrategy(
          userGoalId,
          this.strategyModelPorfolio[0].strategyId
        )
        .subscribe({
          next: () => {
            this.toastr.success('Goal strategy updated successfully');
            this.loggingService.info('Goal strategy updated successfully');
          },
          error: (error) => {
            this.toastr.error('Failed to update goal strategy');
            this.toastr.error('Failed to update goal strategy');
            this.loggingService.error(
              'Failed to update goal strategy',
              'src/app/components/strategy-components/strategy/strategy.component.ts',
              'StrategyComponent',
              error.message
            );
          },
        });
      this.loggingService.info('Requesting goal status update');
      this.goalSettingService
        .goalStatus({
          goalId: userGoalId,
          userId: userId,
          state: State.INVESTMENTS_STRATEGY,
          status: Status.COMPLETED,
        })
        .subscribe({
          next: () => {
            this.toastr.success('Goal status updated successfully');
            this.loggingService.info('Goal status updated successfully');
          },
          error: (error) => {
            this.toastr.error('Failed to update goal status');
            this.loggingService.error(
              'Failed to update goal status',
              'src/app/components/strategy-components/strategy/strategy.component.ts',
              'StrategyComponent',
              error.message
            );
          },
        });
    }
    localStorage.setItem('strategyStatus', JSON.stringify(true));
    localStorage.removeItem('model');
    this.router.navigateByUrl(`/investment-advisor/investment`);
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.ngOnInit();
  }

  setIncrementPage() {
    this.page = this.page + 1;
    this.ngOnInit();
  }

  setDecrementPage() {
    this.page = this.page - 1;
    this.ngOnInit();
  }
}
