import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TickComponent,
  ButtonComponent,
} from '@app/components/common-components';
import {
  ConstantService,
  GoalSettingService,
  LoggingService,
} from '@app/services';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-goal-setting',
  standalone: true,
  imports: [ButtonComponent, TickComponent, NgIf, TranslateModule],
  templateUrl: './goal-setting.component.html',
})
export class GoalSettingComponent {
  goalSet: boolean = false;
  checkStatus: boolean = false;
  constructor(
    private router: Router,
    private queryParams: ActivatedRoute,
    private goalSettingService: GoalSettingService,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public constantService: ConstantService
  ) {
    this.goalSet = this.queryParams.snapshot.queryParams['goal-set'];
    const userId = localStorage.getItem('userId')!;
    this.loggingService.info('Requesting pending goal data');

    this.goalSettingService.getGoalPending(userId).subscribe({
      next: (response) => {
        if (response.content && Object.keys(response.content).length === 0) {
          this.loggingService.info('Pending goal data retrieved successfully');
          this.checkStatus = true;
        }
      },
      error: (error) => {
        this.toastr.error('Failed to fetch pending goal data');
        this.loggingService.error(
          'Failed to fetch pending goal data',
          'src/app/components/goal-setting-components/goal-setting/goal-setting.component.ts',
          'GoalSettingComponent',
          error.message
        );
      },
    });
  }

  goalType: string = '';

  setGoalType(type: string) {
    this.goalType = type;
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.goalType) {
      if (this.goalType === 'pending') {
        this.router.navigateByUrl(`/investment-advisor/goal-setting/pending`);
        return;
      }
      this.router.navigateByUrl(
        `/investment-advisor/goal-setting/goal/${this.goalType}`
      );
    }
  }
}
