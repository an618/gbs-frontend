import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '@app/components/common-components';
import {
  AssessmentService,
  ConstantService,
  LoaderService,
  LoggingService,
  QuestionnaireTemplateService,
} from '@app/services';
import { Answer, QuestionnaireTemplate } from '@app/interface/interface';
import { QuestionnaireMeansComponent } from '@app/components/questionnaire-components/questionnaire-means/questionnaire-means.component';
import { QuestionnaireOptionBasedComponent } from '@app/components/questionnaire-components/questionnaire-option-based/questionnaire-option-based.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '@app/components/common-components/loader/loader.component';

@Component({
  selector: 'app-risk-profile',
  standalone: true,
  imports: [
    QuestionnaireMeansComponent,
    ButtonComponent,
    ReactiveFormsModule,
    QuestionnaireOptionBasedComponent,
    TranslateModule,
    LoaderComponent,
  ],
  templateUrl: './risk-profile.component.html',
})
export class RiskProfileComponent {
  questionCount!: number;
  count!: number;
  answerValue!: string;
  questionnaireTemplateRiskProfile!: QuestionnaireTemplate[];
  questionId!: string;
  selectedQuestionnaireTemplateRiskProfile: string[] = [];

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
    this.params.queryParams.subscribe((params) => {
      this.questionCount = parseInt(params['question'] || '1');
      this.count = parseInt(params['count'] || '0');
      if (this.questionCount == 1) {
        this.toLoadQuestion();
      } else {
        this.toLoad();
      }
    });
  }
  toLoadQuestion() {
    this.loaderService.setLoader(true);
    const questionnaireTemplateId = localStorage.getItem('risk')!;
    this.questionnaireTemplateService
      .getQuestionnaireTemplateByID(questionnaireTemplateId)
      .subscribe({
        next: (response: QuestionnaireTemplate[]) => {
          this.questionnaireTemplateRiskProfile = response;
          localStorage.setItem('question', JSON.stringify(response));
          this.seedBackData();
          this.loggingService.info('Questionnaire template data fetched by ID');
          this.loaderService.setLoader(false);
        },
        error: (error) => {
          this.loaderService.setLoader(true);
          this.toastr.error('Failed to fetch questionnaire template data');
          this.loggingService.error(
            'Failed to fetch questionnaire template data by ID',
            'src/app/components/questionnaire-components/risk-profile/risk-profile.component.ts',
            'RiskProfileComponent',
            error.message
          );
        },
      });
    this.loaderService.setLoader(false);
  }

  toLoad() {
    if (JSON.parse(localStorage.getItem('question') || 'null') != null) {
      this.questionnaireTemplateRiskProfile = JSON.parse(
        localStorage.getItem('question')!
      );
      this.seedBackData();
    } else {
      this.toLoadQuestion();
    }
  }

  seedBackData() {
    this.loaderService.setLoader(true);
    const selectedAnswer = JSON.parse(
      localStorage.getItem('savedAnswer') || '[]'
    );
    if (selectedAnswer[this.count]) {
      this.questionId =
        this.questionnaireTemplateRiskProfile[this.count].questionId;
      this.riskProfileForm.patchValue({
        riskProfileSelectOption:
          selectedAnswer[this.count][this.questionId].answerId,
      });
    } else {
      this.riskProfileForm.reset();
    }
    this.loaderService.setLoader(false);
  }

  riskProfileForm: FormGroup = new FormGroup({
    riskProfileSelectOption: new FormControl('', [Validators.required]),
  });

  setSelectedOption(event: Event) {
    const target = event.target as HTMLInputElement;
    const answerId = target.id;
    const answerText = target.value;
    const questionId = target.accept;
    this.riskProfileForm.patchValue({
      riskProfileSelectOption: answerId,
    });
    this.answerValue = answerText;
    const selectedAnswer = JSON.parse(
      localStorage.getItem('savedAnswer') || '[]'
    );
    if (!selectedAnswer[this.count]) {
      selectedAnswer[this.count] = {};
    }
    selectedAnswer[this.count][questionId] = { answerId: answerId };
    localStorage.setItem('savedAnswer', JSON.stringify(selectedAnswer));
  }

  finanlSubmit(answer: Answer[]) {
    const userId = localStorage.getItem('userId')!;
    const assessmentId = localStorage.getItem('assessmentId')!;
    this.loggingService.info('Assessment submission attempt');
    this.assessmentService
      .submitAssessment({
        assessmentId: assessmentId,
        userId: userId,
        answers: answer,
      })
      .subscribe({
        next: () => {
          this.loggingService.info('Assessment submitted successfully');
        },
        error: (error) => {
          this.toastr.error('Fail to submission assessment');
          this.loggingService.error(
            'Assessment submission failed',
            'src/app/components/questionnaire-components/risk-profile/risk-profile.component.ts',
            'RiskProfileComponent',
            error.message
          );
        },
      });
  }

  backQuestion() {
    if (this.count > 0) {
      this.count -= 1;
      this.questionCount =
        this.questionnaireTemplateRiskProfile[this.count].order;
      this.router.navigate([`/investment-advisor/risk-profile`], {
        queryParams: { question: this.questionCount, count: this.count },
      });
    }
  }

  skipQuestion() {
    if (this.questionCount === this.questionnaireTemplateRiskProfile.length) {
      this.questionCount =
        this.questionnaireTemplateRiskProfile[this.count].order;

      this.finanlSubmit([
        {
          answerId: '',
          answerText: '',
          answered: false,
          questionId:
            this.questionnaireTemplateRiskProfile[this.count].questionId,
        },
      ]);
      this.router.navigateByUrl(`/investment-advisor/risk-profile/result`);
      this.riskProfileForm.reset();
    } else {
      this.count += 1;
      this.questionCount =
        this.questionnaireTemplateRiskProfile[this.count].order;
      this.finanlSubmit([
        {
          answerId: '',
          answerText: '',
          answered: false,
          questionId:
            this.questionnaireTemplateRiskProfile[this.count - 1].questionId,
        },
      ]);
      this.router.navigate([`/investment-advisor/risk-profile`], {
        queryParams: { question: this.questionCount, count: this.count },
      });
      this.riskProfileForm.reset();
    }
  }

  sendToFinanicalCalculator() {
    localStorage.setItem('riskProfileStatus', 'true');
    localStorage.setItem('suitabilityStatus', 'true');
    localStorage.setItem('questionnaireSkip', JSON.stringify(true));
    this.router.navigateByUrl(`/investment-advisor/financial-calculation`);
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.questionCount === this.questionnaireTemplateRiskProfile.length) {
      this.questionCount =
        this.questionnaireTemplateRiskProfile[this.count].order;
      this.finanlSubmit([
        {
          answerId: this.riskProfileForm?.value?.riskProfileSelectOption,
          answerText: this.answerValue,
          answered: true,
          questionId:
            this.questionnaireTemplateRiskProfile[this.count].questionId,
        },
      ]);
      this.toastr.success('Your response has recorded successfully');
      this.router.navigateByUrl(`/investment-advisor/risk-profile/result`);
      this.riskProfileForm.reset();
    } else {
      this.count += 1;
      this.questionCount =
        this.questionnaireTemplateRiskProfile[this.count].order;
      this.finanlSubmit([
        {
          answerId: this.riskProfileForm?.value?.riskProfileSelectOption,
          answerText: this.answerValue,
          answered: true,
          questionId:
            this.questionnaireTemplateRiskProfile[this.count - 1].questionId,
        },
      ]);

      this.router.navigate([`/investment-advisor/risk-profile`], {
        queryParams: { question: this.questionCount, count: this.count },
      });
    }
  }
}
