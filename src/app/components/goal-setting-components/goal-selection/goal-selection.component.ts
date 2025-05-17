import { Component } from '@angular/core';
import {
  TickComponent,
  ButtonComponent,
} from '@app/components/common-components/';
import { NgIf, NgStyle } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalCardComponent } from '@app/components/goal-setting-components/goal-card/goal-card.component';
import {
  ConstantService,
  GoalSettingService,
  LoggingService,
} from '@app/services';
import { GoalType } from '@app/interface/interface';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-goal-selection',
  standalone: true,
  imports: [
    TickComponent,
    ButtonComponent,
    GoalCardComponent,
    NgStyle,
    NgIf,
    TranslateModule,
  ],
  templateUrl: './goal-selection.component.html',
})
export class GoalSelectionComponent {
  selectGoal!: string;
  GoalType!: GoalType[];
  constructor(
    private router: Router,
    private params: ActivatedRoute,
    private goalSettingService: GoalSettingService,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public constantService: ConstantService
  ) {}

  setGoalType(type: string, id: string) {
    this.selectGoal = type;
    localStorage.setItem('goalTypeId', id);
  }

  goBack() {
    this.router.navigateByUrl(`/investment-advisor/goal-setting`);
  }

  ngOnInit() {
    this.loggingService.info('Requesting goal selection data');
    this.goalSettingService.getGoalSelection().subscribe({
      next: (data: GoalType[]) => {
        this.GoalType = data;
        this.loggingService.info('Goal selection data retrieved successfully');
      },
      error: (error) => {
        this.toastr.error('Failed to fetch goal selection data');
        this.loggingService.error(
          'Failed to fetch goal selection data',
          'src/app/components/goal-setting-components/goal-selection/goal-selection.component.ts',
          'GoalSelectionComponent',
          error.message
        );
      },
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const goalTypeParams = this.params.snapshot.params['goal-type'];
    if (this.selectGoal) {
      this.router.navigateByUrl(
        `/investment-advisor/goal-setting/${goalTypeParams}/goal-name`
      );
    }
  }
}
