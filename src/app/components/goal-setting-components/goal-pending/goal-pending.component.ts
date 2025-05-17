import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { State, Status } from '@app/enum/enum';
import { GoalPending, Pagination } from '@app/interface/interface';
import {
  ConstantService,
  GoalSettingService,
  LoaderService,
  LoggingService,
  QuestionnaireTemplateService,
} from '@app/services';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@app/components/common-components';
import { StrategyService } from '@app/services/strategy/strategy.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '@app/components/common-components/pagination/pagination.component';
import { LoaderComponent } from '@app/components/common-components/loader/loader.component';

@Component({
  selector: 'app-goal-pending',
  standalone: true,
  imports: [
    TranslateModule,
    ButtonComponent,
    PaginationComponent,
    LoaderComponent,
  ],
  templateUrl: './goal-pending.component.html',
})
export class GoalPendingComponent implements OnInit {
  goalPending!: GoalPending[];
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
  maping = {
    GOAL_DEFINATION: 'Goal Setting',
    RISK_PROFILE: 'Risk Profile',
    FINANCIAL_SUITABILITY: 'Financial Suitability',
    FINANCIAL_CALCULATIONS: 'Financial Calculator',
    INVESTMENTS_STRATEGY: 'Investments Strategy',
    USER_INVESTMENTS: 'User Investments',
    USER_PORTFOLIO: 'User Portfolio',
  };
  constructor(
    private goalSettingService: GoalSettingService,
    private questionnaireTemplateService: QuestionnaireTemplateService,
    private router: Router,
    private loggingService: LoggingService,
    private strategyService: StrategyService,
    public constantService: ConstantService,
    private toastr: ToastrService,
    public loaderService: LoaderService
  ) {
    localStorage.removeItem('savedAnswer');
  }

  ngOnInit(): void {
    this.loaderService.setLoader(true);
    const userId = localStorage.getItem('userId')!;
    this.loggingService.info('Requesting pending goal data');
    this.goalSettingService
      .getGoalPending(userId, this.page, this.pageSize)
      .subscribe({
        next: (response) => {
          if (response) {
            this.goalPending = response.content;
            this.pageSize = response.pageable.pageSize;
            this.page = response.pageable.pageNumber;
            this.pagination.page = response.pageable.pageNumber;
            this.pagination.page_size = response.pageable.pageSize;
            this.pagination.total_rows = response.totalElements;
            this.pagination.total_pages = response.numberOfElements;
            const currentPage = this.pagination.page + 1;
            const pageSize = this.pagination.page_size;
            this.pagination.start_page_count = (currentPage - 1) * pageSize + 1;
            this.pagination.end_page_count = Math.min(
              currentPage * pageSize,
              this.pagination.total_rows
            );
            this.loggingService.info(
              'Pending goal data retrieved successfully'
            );
          }
          this.loaderService.setLoader(false);
        },
        error: (error) => {
          this.loaderService.setLoader(true);
          this.toastr.error('Failed to fetch pending goal data');
          this.loggingService.error(
            'Failed to fetch pending goal data',
            'src/app/components/goal-setting-components/goal-pending/goal-pending.component.ts',
            'GoalPendingComponent',
            error.message
          );
        },
      });
    this.loaderService.setLoader(false);
  }

  goBack() {
    this.router.navigateByUrl('investment-advisor/goal-setting');
  }

  toLoadQuestionnaireTemplateService(state?: State, status?: Status) {
    this.questionnaireTemplateService.getQuestionnaireTemplate().subscribe({
      next: (response) => {
        if (response) {
          localStorage.setItem('risk', response[0].id);
          localStorage.setItem('suitability', response[1].id);
          this.loggingService.info(
            'Questionnaire template data fetched successfully'
          );
          if (state === State.GOAL_DEFINATION && status === Status.COMPLETED) {
            this.router.navigateByUrl('investment-advisor/risk-profile');
          } else if (
            state === State.RISK_PROFILE &&
            (status === Status.INCOMPLETE || status === Status.SKIPPED)
          ) {
            this.router.navigateByUrl('investment-advisor/risk-profile');
          } else if (
            state === State.RISK_PROFILE &&
            status === Status.COMPLETED
          ) {
            this.router.navigateByUrl('investment-advisor/suitability');
          } else if (
            state === State.FINANCIAL_SUITABILITY &&
            (status === Status.INCOMPLETE || status === Status.SKIPPED)
          ) {
            this.router.navigateByUrl('investment-advisor/suitability');
          }
        }
      },
      error: (error) => {
        this.toastr.error('Failed to fetch questionnaire template data');
        this.loggingService.error(
          'Failed to fetch questionnaire template data',
          'src/app/components/goal-setting-components/goal-pending/goal-pending.component.ts',
          'GoalPendingComponent',
          error.message
        );
      },
    });
  }

  toLoadInvestmentFinancialCalculatorData(userGoalId: string) {
    this.strategyService.getFinancialCalculator(userGoalId).subscribe({
      next: (response) => {
        localStorage.setItem(
          'strategyFinancialCalculatorROI',
          JSON.stringify({
            expectedInflation: response.expectedInflation,
            timeHorizon: response.timeHorizon,
            initialInvestment: response.initialInvestment,
            monthlyInvestment: response.monthlyInvestment,
          })
        );
        const timeHorizonMonth12 = response.timeHorizon * 12;
        const monthlyRateOfReturn = (rate: number) => {
          let futureValue =
            response.initialInvestment * Math.pow(1 + rate, timeHorizonMonth12);
          for (let i = 1; i <= timeHorizonMonth12; i++) {
            futureValue +=
              response.monthlyInvestment *
              Math.pow(1 + rate, timeHorizonMonth12 - i);
          }
          return (
            futureValue -
            Math.round(
              Number(response?.corpusCurrency.replace(/[, ]+/g, '')) *
                Math.pow(
                  1 + response?.expectedInflation / 100,
                  response?.timeHorizon
                )
            )
          );
        };
        let lowerBound = 0;
        let upperBound = 1;
        let rate;
        while (upperBound - lowerBound > 0.00001) {
          rate = (lowerBound + upperBound) / 2;
          if (monthlyRateOfReturn(rate) > 0) {
            upperBound = rate;
          } else {
            lowerBound = rate;
          }
        }
        const result = Math.round(
          (Number((rate! * 12 * 100).toFixed(3)) * 10) / 10
        );
        localStorage.setItem('roi', JSON.stringify(result));
      },
      error: (error) => {
        this.loggingService.error(
          'Failed to fetch questionnaire template data',
          'src/app/components/goal-setting-components/goal-pending/goal-pending.component.ts',
          'GoalPendingComponent',
          error.message
        );
      },
    });
  }

  setLocalStorageData(
    assessmentId: string,
    userGoalId: string,
    isFinancialCalculatorSkipped: boolean
  ) {
    localStorage.setItem('assessmentId', assessmentId);
    localStorage.setItem('userGoalId', userGoalId);
    localStorage.setItem(
      'questionnaireSkip',
      JSON.stringify(isFinancialCalculatorSkipped)
    );
  }

  setPendingJourney(
    state: State,
    status: Status,
    assessmentId: string,
    userGoalId: string,
    strategyId: string,
    isFinancialCalculatorSkipped: boolean
  ) {
    switch (state) {
      case State.GOAL_DEFINATION:
        this.setLocalStorageData(
          assessmentId,
          userGoalId,
          isFinancialCalculatorSkipped
        );
        if (status === Status.COMPLETED) {
          this.toLoadQuestionnaireTemplateService(state, status);
        } else if (status === Status.INCOMPLETE || status === Status.SKIPPED) {
          this.router.navigateByUrl('investment-advisor/goal-setting');
        }
        break;
      case State.RISK_PROFILE:
        this.setLocalStorageData(
          assessmentId,
          userGoalId,
          isFinancialCalculatorSkipped
        );
        if (status === Status.COMPLETED) {
          this.toLoadQuestionnaireTemplateService(state, status);
        } else if (status === Status.INCOMPLETE || status === Status.SKIPPED) {
          this.toLoadQuestionnaireTemplateService(state, status);
        }
        break;
      case State.FINANCIAL_SUITABILITY:
        this.setLocalStorageData(
          assessmentId,
          userGoalId,
          isFinancialCalculatorSkipped
        );
        if (status === Status.COMPLETED) {
          this.router.navigateByUrl('investment-advisor/financial-calculation');
        } else if (status === Status.INCOMPLETE || status === Status.SKIPPED) {
          this.toLoadQuestionnaireTemplateService(state, status);
        }
        break;
      case State.FINANCIAL_CALCULATIONS:
        this.setLocalStorageData(
          assessmentId,
          userGoalId,
          isFinancialCalculatorSkipped
        );
        if (status === Status.COMPLETED) {
          this.router.navigateByUrl('investment-advisor/strategy');
        } else if (status === Status.INCOMPLETE || status === Status.SKIPPED) {
          this.router.navigateByUrl('investment-advisor/financial-calculation');
        }
        break;
      case State.INVESTMENTS_STRATEGY:
        this.setLocalStorageData(
          assessmentId,
          userGoalId,
          isFinancialCalculatorSkipped
        );
        if (status === Status.COMPLETED) {
          localStorage.setItem('strategyId', strategyId);
          this.toLoadInvestmentFinancialCalculatorData(userGoalId);
          setTimeout(() => {
            this.router.navigateByUrl('investment-advisor/investment');
          }, 300);
        } else if (status === Status.INCOMPLETE || status === Status.SKIPPED) {
          this.router.navigateByUrl('investment-advisor/strategy');
        }
        break;
      case State.USER_INVESTMENTS:
        this.setLocalStorageData(
          assessmentId,
          userGoalId,
          isFinancialCalculatorSkipped
        );
        if (status === Status.COMPLETED) {
          this.router.navigateByUrl(
            'investment-advisor/investment/portfolio-export'
          );
        } else if (status === Status.INCOMPLETE || status === Status.SKIPPED) {
          localStorage.setItem('strategyId', strategyId);
          this.toLoadInvestmentFinancialCalculatorData(userGoalId);
          this.router.navigateByUrl('investment-advisor/investment');
        }
        break;
      case State.USER_PORTFOLIO:
        this.setLocalStorageData(
          assessmentId,
          userGoalId,
          isFinancialCalculatorSkipped
        );
        this.router.navigateByUrl(
          'investment-advisor/investment/portfolio-export'
        );
        break;
      default:
        this.router.navigateByUrl('dashboard');
        break;
    }
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
