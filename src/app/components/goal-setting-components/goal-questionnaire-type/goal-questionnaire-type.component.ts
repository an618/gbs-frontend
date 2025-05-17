import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConstantService,
  GoalSettingService,
  LoggingService,
  QuestionnaireTemplateService,
} from '@app/services';
import {
  TickComponent,
  ButtonComponent,
} from '@app/components/common-components';
import { State, Status } from '@app/enum/enum';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-goal-questionnaire-type',
  standalone: true,
  imports: [ButtonComponent, TickComponent, NgIf, TranslateModule],
  templateUrl: './goal-questionnaire-type.component.html',
})
export class GoalQuestionnaireTypeComponent {
  goalTypeParams: string = '';
  goalType: string = '';

  constructor(
    private router: Router,
    private params: ActivatedRoute,
    private questionnaireTemplateService: QuestionnaireTemplateService,
    private goalSettingService: GoalSettingService,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public constantService: ConstantService
  ) {
    this.goalTypeParams = this.params.snapshot.params['goal-type'];
    this.questionnaireTemplateService.getQuestionnaireTemplate().subscribe({
      next: (response) => {
        if (response) {
          localStorage.setItem('risk', response[0].id);
          localStorage.setItem('suitability', response[1].id);
          this.loggingService.info(
            'Questionnaire template data fetched successfully'
          );
        }
      },
      error: (error) => {
        this.toastr.error('Failed to fetch questionnaire template data');
        this.loggingService.error(
          'Failed to fetch questionnaire template data',
          'src/app/components/goal-setting-components/goal-questionnaire-type/goal-questionnaire-type.component.ts',
          'GoalQuestionnaireTypeComponent',
          error.message
        );
      },
    });
  }

  setGoalType(type: string) {
    this.goalType = type;
  }

  goBack() {
    this.goalTypeParams = this.params.snapshot.params['goal-type'];
    this.router.navigateByUrl(
      `/investment-advisor/goal-setting/${this.goalTypeParams}/goal-name`
    );
  }
  onSubmit(event: Event) {
    event.preventDefault();
    this.goalTypeParams = this.params.snapshot.params['goal-type'];
    const userId = localStorage.getItem('userId');
    const userGoalId = localStorage.getItem('userGoalId');
    if (this.goalType !== '' && userId && userGoalId) {
      localStorage.removeItem('questionnaireSkip');
      // localStorage.setItem('goalStatus', 'true');
      if (this.goalType === 'LetJump') {
        localStorage.setItem('riskProfileStatus', 'true');
        localStorage.setItem('suitabilityStatus', 'true');
        localStorage.setItem('questionnaireSkip', JSON.stringify(true));
        this.loggingService.info('Requesting goal status update');
        this.goalSettingService
          .goalStatus({
            goalId: userGoalId,
            userId: userId,
            state: State.RISK_PROFILE,
            status: Status.SKIPPED,
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
                'src/app/components/goal-setting-components/goal-questionnaire-type/goal-questionnaire-type.component.ts',
                'GoalQuestionnaireTypeComponent',
                error.message
              );
            },
          });
        this.router.navigateByUrl(`/investment-advisor/financial-calculation`);
      } else {
        this.router.navigateByUrl(
          `/investment-advisor/risk-profile?goal-type=${this.goalTypeParams}&question=1&count=0`
        );
      }
    }
  }
}
