import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StrategyService } from '@app/services/strategy/strategy.service';
import { ModelPorfolioComponent } from '@app/components/strategy-components/model-porfolio/model-porfolio.component';
import { ButtonComponent } from '@app/components/common-components/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConstantService,
  GoalSettingService,
  LoggingService,
} from '@app/services';
import { StrategyModelPorfolio } from '@app/interface/interface';
import { ToastrService } from 'ngx-toastr';
import { Status } from '@app/enum/enum';
import { State } from '@app/enum/enum';
import { LoaderService } from '@app/services/loader/loader.service';
import { LoaderComponent } from '@app/components/common-components/loader/loader.component';

@Component({
  selector: 'app-strategy-porfolio',
  standalone: true,
  imports: [
    ModelPorfolioComponent,
    ButtonComponent,
    TranslateModule,
    LoaderComponent,
  ],
  templateUrl: './strategy-porfolio.component.html',
})
export class StrategyPorfolioComponent {
  strategyId: string = '';
  singlestrategyModelPorfolio!: StrategyModelPorfolio;
  constructor(
    private params: ActivatedRoute,
    private router: Router,
    private strategyService: StrategyService,
    private toastr: ToastrService,
    private loggingService: LoggingService,
    private goalSettingService: GoalSettingService,
    public loaderService: LoaderService,
    public constantService: ConstantService
  ) {
    this.params.params.subscribe((params) => {
      this.strategyId = params['id'];
      localStorage.setItem('strategyId', this.strategyId);
    });
    this.loaderService.setLoader(true);
    this.strategyService.getStrategyById(this.strategyId).subscribe({
      next: (response) => {
        console.log(response);
        this.singlestrategyModelPorfolio = response;
        this.loggingService.info(
          'Strategy data retrieved successfully for riskScore'
        );
        this.loaderService.setLoader(false);
      },
      error: (error) => {
        this.loaderService.setLoader(true);
        this.toastr.error('Failed to fetch strategy based on risk score');
        this.loggingService.error(
          'Failed to fetch strategy based on risk score',
          'src/app/components/strategy-components/strategy/strategy-porfolio.component.ts',
          'StrategyComponent',
          error.message
        );
      },
    });
    this.loaderService.setLoader(false);
  }

  goBackStrategy() {
    this.router.navigateByUrl(`/investment-advisor/strategy`);
  }

  proceed() {
    localStorage.setItem(
      'strategyId',
      this.singlestrategyModelPorfolio.strategyId
    );
    const userGoalId = localStorage.getItem('userGoalId');
    const userId = localStorage.getItem('userId');
    if (userGoalId && userId) {
      this.loggingService.info('Updating goal strategy');
      this.strategyService
        .updateGoalStrategy(
          userGoalId,
          this.singlestrategyModelPorfolio.strategyId
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
              'src/app/components/strategy-components/strategy/strategy-porfolio.component.ts',
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
}
