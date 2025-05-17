import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@app/components/common-components';
import { Status } from '@app/enum/enum';
import { Matrix } from '@app/interface/interface';
import {
  AssessmentService,
  ConstantService,
  LoaderService,
  LoggingService,
  QuestionnaireTemplateService,
} from '@app/services';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '@app/components/common-components/loader/loader.component';

@Component({
  selector: 'app-risk-profile-result',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    TranslateModule,
    LoaderComponent,
  ],
  templateUrl: './risk-profile-result.component.html',
})
export class RiskProfileResultComponent implements OnInit {
  goalTypeParams: string = '';
  riskProfileResultBody!: Matrix[];
  score!: number;
  status!: string;
  maxDate: string = '';
  latestRiskProfileDate: string = new Date().toISOString().slice(0, 10);
  checkStatus = Status;

  constructor(
    private router: Router,
    private params: ActivatedRoute,
    private questionnaireTemplateService: QuestionnaireTemplateService,
    private assessmentService: AssessmentService,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public loaderService: LoaderService,
    public constantService: ConstantService
  ) {
    this.params.parent?.parent?.params.subscribe((params) => {
      this.goalTypeParams = params['goal-type'];
    });
  }

  riskProfileResultForm: FormGroup = new FormGroup({
    date: new FormControl(this.latestRiskProfileDate, [Validators.required]),
    check: new FormControl(false, [Validators.required]),
  });

  ngOnInit(): void {
    this.loaderService.setLoader(true);
    const assessmentId = localStorage.getItem('assessmentId')!;
    const currentDate = new Date();
    this.maxDate = currentDate.toISOString().slice(0, 10);
    this.questionnaireTemplateService.getMetrix().subscribe({
      next: (response) => {
        this.riskProfileResultBody = response;
        this.loggingService.info(
          'Risk profile matrix data fetched successfully'
        );
      },
      error: (error) => {
        this.toastr.error('Failed to fetch risk profile matrix data');
        this.loggingService.error(
          'Failed to fetch risk profile matrix data',
          'src/app/components/questionnaire-components/risk-profile-result/risk-profile-result.component.ts',
          'RiskProfileResultComponent',
          error.message
        );
      },
    });
    this.loggingService.info('Fetching assessment score');
    setTimeout(() => {
      this.assessmentService.getAssessmentScore(assessmentId).subscribe({
        next: (response) => {
          this.loaderService.setLoader(false);
          this.score = response.riskScore;
          this.status = response.status;
          this.loggingService.info('Assessment score retrieved successfully');
        },
        error: (error) => {
          this.loaderService.setLoader(true);
          this.toastr.error('Failed to fetch assessment score');
          this.loggingService.error(
            'Failed to fetch assessment score',
            'src/app/components/questionnaire-components/risk-profile-result/risk-profile-result.component.ts',
            'RiskProfileResultComponent',
            error.message
          );
        },
      });
    }, 2000);
  }

  goBack() {
    this.router.navigateByUrl(
      `/investment-advisor/risk-profile?question=8&count=7`
    );
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (
      this.riskProfileResultForm.controls['check'].value &&
      !this.riskProfileResultForm.controls['date'].errors?.['required']
    ) {
      localStorage.setItem('riskProfileStatus', 'true');
      localStorage.removeItem('savedAnswer');
      localStorage.removeItem('question');
      this.router.navigateByUrl(`/investment-advisor/suitability`);
    }
  }
}
