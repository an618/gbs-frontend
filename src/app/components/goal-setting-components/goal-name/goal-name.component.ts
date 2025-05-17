import { Component } from '@angular/core';
import { ButtonComponent } from '@app/components/common-components/button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConstantService,
  GoalSettingService,
  LoggingService,
} from '@app/services';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-goal-name',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, TranslateModule],
  templateUrl: './goal-name.component.html',
})
export class GoalNameComponent {
  goalTypeParams: string = '';
  configGoalTypeId: string = localStorage.getItem('goalTypeId')!;

  constructor(
    private router: Router,
    private params: ActivatedRoute,
    private goalSettingService: GoalSettingService,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public constantService: ConstantService
  ) {}

  goalNameForm: FormGroup = new FormGroup({
    goalName: new FormControl('', [Validators.required]),
  });

  goBack() {
    this.goalTypeParams = this.params.snapshot.params['goal-type'];
    this.router.navigateByUrl(
      `/investment-advisor/goal-setting/goal/${this.goalTypeParams}`
    );
  }
  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.goalTypeParams = this.params.snapshot.params['goal-type'];
    const userId = localStorage.getItem('userId');
    if (this.goalNameForm.valid && userId) {
      this.loggingService.info('Requesting goal creation/update');
      this.goalSettingService
        .goalName({
          goalName: this.goalNameForm.value?.goalName,
          configGoalTypeId: this.configGoalTypeId,
          userId: userId,
        })
        .subscribe({
          next: (response) => {
            if (response) {
              this.toastr.success('Goal creation/update successful');
              this.loggingService.info('Goal creation/update successful');
              localStorage.setItem('assessmentId', response.assessmentId);
              localStorage.setItem('userGoalId', response.userGoalId);
              this.router.navigateByUrl(
                `/investment-advisor/goal-setting/${this.goalTypeParams}/questionnaire`
              );
            }
          },
          error: (error) => {
            this.toastr.error(
              'Goal Name Already Exists or Failed to create goal '
            );
            this.loggingService.error(
              'Failed to create/update goal',
              'src/app/components/goal-setting-components/goal-name/goal-name.component.ts',
              'GoalNameComponent',
              error.message
            );
          },
        });
    }
  }
}
