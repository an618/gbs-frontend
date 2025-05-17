import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AssessmentService,
  ConstantService,
  GoalSettingService,
  LoaderService,
  LoggingService,
  QuestionnaireTemplateService,
} from '@app/services';
import { ButtonComponent } from '@app/components/common-components';
import { Answer, QuestionnaireTemplate } from '@app/interface/interface';
import { QuestionType, State, Status } from '@app/enum/enum';
import { QuestionnaireMeansComponent } from '@app/components/questionnaire-components/questionnaire-means/questionnaire-means.component';
import { QuestionnaireOptionBasedComponent } from '@app/components/questionnaire-components/questionnaire-option-based/questionnaire-option-based.component';
import { QuestionRangeInputBasedComponent } from '@app/components/questionnaire-components/questionnaire-range-input-based/questionnaire-range-input-based.component';
import { QuestionCheckboxBasedComponent } from '@app/components/questionnaire-components/questionnaire-checkbox-based/questionnaire-checkbox-based.component';
import { SutaibilityQuestionnaireTable1Component } from '@app/components/questionnaire-components/sutaibility-questionnaire-table-1/sutaibility-questionnaire-table-1.component';
import { SutaibilityQuestionnaireTable6Component } from '@app/components/questionnaire-components/sutaibility-questionnaire-table-6/sutaibility-questionnaire-table-6.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '@app/components/common-components/loader/loader.component';

@Component({
  selector: 'app-suitability',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    QuestionnaireMeansComponent,
    QuestionnaireOptionBasedComponent,
    QuestionRangeInputBasedComponent,
    QuestionCheckboxBasedComponent,
    SutaibilityQuestionnaireTable1Component,
    SutaibilityQuestionnaireTable6Component,
    TranslateModule,
    LoaderComponent,
  ],
  templateUrl: './suitability.component.html',
})
export class SuitabilityComponent {
  questionCount!: number;
  count!: number;
  savedAnswer: Answer[] = [];
  questionnaireTemplateSuitability!: QuestionnaireTemplate[];
  QuestionTypeEnum = QuestionType;
  type: string = localStorage.getItem('type') || '';
  suitabilityForm: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private params: ActivatedRoute,
    private questionnaireTemplateService: QuestionnaireTemplateService,
    private assessmentService: AssessmentService,
    private goalSettingService: GoalSettingService,
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
      this.savedAnswer = [];
    });
  }

  toLoadQuestion(): void {
    this.loaderService.setLoader(true);
    const questionnaireTemplateId = localStorage.getItem('suitability')!;
    this.questionnaireTemplateService
      .getQuestionnaireTemplateByID(questionnaireTemplateId)
      .subscribe({
        next: (response: QuestionnaireTemplate[]) => {
          this.questionnaireTemplateSuitability = response;
          localStorage.setItem('question', JSON.stringify(response));
          this.suitabilityForm = new FormGroup(this.getFormControlsFields());
          this.seedBackData();
          this.loggingService.info('Questionnaire template data fetched by ID');
          this.loaderService.setLoader(false);
        },
        error: (error) => {
          this.loaderService.setLoader(true);
          this.toastr.error('Failed to fetch questionnaire template data');
          this.loggingService.error(
            'Failed to fetch questionnaire template data by ID',
            'src/app/components/questionnaire-components/suitability/suitability.component.ts',
            'SuitabilityComponent',
            error.message
          );
        },
      });
    this.loaderService.setLoader(false);
  }

  toLoad() {
    if (JSON.parse(localStorage.getItem('question') || 'null') != null) {
      this.questionnaireTemplateSuitability = JSON.parse(
        localStorage.getItem('question')!
      );
      this.suitabilityForm = new FormGroup(this.getFormControlsFields());
      this.seedBackData();
    } else {
      this.toLoadQuestion();
    }
  }

  sanitizeKey = (key: string): string => {
    return key.replace(/\./g, '');
  };

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
            'src/app/components/questionnaire-components/suitability/suitability.component.ts',
            'SuitabilityComponent',
            error.message
          );
        },
      });
  }

  getFormControlsFields() {
    const formGroupFields: Record<
      string,
      FormControl | FormGroup | FormArray<never>
    > = {};

    for (let field in this.questionnaireTemplateSuitability[this.count]) {
      if (
        this.questionCount !== 3 &&
        this.questionCount !== 4 &&
        this.questionCount !== 6 &&
        this.questionCount !== 7
      ) {
        formGroupFields[
          this.sanitizeKey(
            this.questionnaireTemplateSuitability[this.count]['questionText']
          )
        ] = new FormControl('');
      }
      if (field === 'nestedQuestions') {
        for (const key1 in this.questionnaireTemplateSuitability[this.count][
          'nestedQuestions'
        ]) {
          if (
            this.questionnaireTemplateSuitability[this.count][
              'nestedQuestions'
            ]!.at(Number(key1))!['questionText'] !== 'Sr. No.' &&
            this.questionnaireTemplateSuitability[this.count][
              'nestedQuestions'
            ]!.at(Number(key1))!['questionText'] !== 'Title'
          ) {
            if (
              this.questionnaireTemplateSuitability[this.count][
                'nestedQuestions'
              ]!.at(Number(key1))!['questionType'] === 'CHECKBOX_BUTTON_TEXT' ||
              this.questionCount === 1
            ) {
              formGroupFields[
                this.sanitizeKey(
                  this.questionnaireTemplateSuitability[this.count][
                    'nestedQuestions'
                  ]!.at(Number(key1))!['questionText']
                )
              ] = new FormArray([]);
            } else {
              formGroupFields[
                this.sanitizeKey(
                  this.questionnaireTemplateSuitability[this.count][
                    'nestedQuestions'
                  ]!.at(Number(key1))!['questionText']
                )
              ] = new FormControl('');
            }
          }
          if (field === 'nestedQuestions') {
            for (const key2 in this.questionnaireTemplateSuitability[
              this.count
            ]['nestedQuestions']!.at(Number(key1))!['nestedQuestions']) {
              if (this.questionCount === 6) {
                const nestedFormGroupFields: Record<string, FormControl> = {};
                for (const key3 in this.questionnaireTemplateSuitability[
                  this.count
                ]
                  ['nestedQuestions']!.at(Number(key1))!
                  ['nestedQuestions']!.at(Number(key2))!['nestedQuestions']) {
                  nestedFormGroupFields[
                    this.sanitizeKey(
                      this.questionnaireTemplateSuitability[this.count]
                        ['nestedQuestions']!.at(Number(key1))!
                        ['nestedQuestions']!.at(Number(key2))!
                        ['nestedQuestions']!.at(Number(key3))!['questionText']
                    )
                  ] = new FormControl('');
                }
                formGroupFields[
                  this.sanitizeKey(
                    this.questionnaireTemplateSuitability[this.count]
                      ['nestedQuestions']!.at(Number(key1))!
                      ['nestedQuestions']!.at(Number(key2))!['questionText']
                  )
                ] = new FormGroup(nestedFormGroupFields);
              } else {
                formGroupFields[
                  this.sanitizeKey(
                    this.questionnaireTemplateSuitability[this.count]
                      ['nestedQuestions']!.at(Number(key1))!
                      ['nestedQuestions']!.at(Number(key2))!['questionText']
                  )
                ] = new FormControl('');
              }
            }
          }
        }
      }
    }

    return formGroupFields;
  }

  setSelectedAnswer(event: Event) {
    const target = event.target as HTMLInputElement;
    const answerId = target.id;
    const questionText = target.name;
    const answerText = target.value;
    const questionId = target.accept;
    const ariaLabel = target.ariaLabel;
    const type = target.type;

    if (this.questionCount === 1 && type === 'radio') {
      localStorage.setItem('type', answerText);
      this.type = answerText;
    }

    switch (type) {
      case 'radio':
        if (this.questionCount === 6) {
          this.suitabilityForm
            .get(ariaLabel!)
            ?.get(questionText.split('_')[0])
            ?.setValue(answerId);
        } else {
          this.suitabilityForm.get(questionText)?.setValue(answerId);
        }
        this.updateSavedAnswer(
          questionId,
          answerId,
          answerText,
          questionText,
          ariaLabel!,
          type
        );
        break;
      case 'checkbox':
        const formArray = this.suitabilityForm.get(questionText) as FormArray;
        if (target.checked) {
          formArray.push(new FormControl(answerId));
          this.addCheckboxAnswer(questionId, answerId, questionText, type);
        } else {
          const index = formArray.controls.findIndex(
            (control) => control.value === answerId
          );
          if (index !== -1) {
            formArray.removeAt(index);
            this.removeCheckboxAnswer(questionId, answerId);
          }
        }
        break;
      case 'select-one':
        if (this.questionCount === 1) {
          const formArray = this.suitabilityForm.get(questionText) as FormArray;
          let index: number;
          if (answerId.split('_')[1] === 'table1') {
            index = 0;
          } else {
            index = 1;
          }
          if (formArray.at(index)) {
            formArray.at(index).setValue(answerText);
          } else {
            formArray.insert(index, new FormControl(answerText));
          }
          this.addInputAnswer(
            questionId,
            answerText,
            questionText,
            answerId,
            type,
            index
          );
        } else {
          this.suitabilityForm.get(questionText)?.setValue(answerText);
          this.updateSavedAnswer(
            questionId,
            answerId,
            answerText,
            questionText,
            ariaLabel!,
            type
          );
        }
        break;
      default:
        if (this.questionCount === 1) {
          const formArray = this.suitabilityForm.get(questionText) as FormArray;
          let index: number;
          if (questionId.split('_')[1] === 'table1') {
            index = 0;
          } else {
            index = 1;
          }
          if (formArray.at(index)) {
            formArray.at(index).setValue(answerText);
          } else {
            formArray.insert(index, new FormControl(answerText));
          }
          this.addInputAnswer(
            questionId,
            answerText,
            questionText,
            answerId,
            type,
            index
          );
        } else {
          this.suitabilityForm.get(questionText)?.setValue(answerText);
          if (this.questionCount === 4) {
            this.suitabilityForm
              .get('Free Cash Flow (c) = (a) - (b)')
              ?.setValue(
                Number(
                  this.suitabilityForm.value['Total Annual Income (a)'] || 0
                ) -
                  Number(
                    this.suitabilityForm.value['Total Annual Expenses (b)'] || 0
                  )
              );
            this.suitabilityForm
              .get('Net Asset Value (f) = (d) - (e)')
              ?.setValue(
                Number(this.suitabilityForm.value['Total Asset (d)']) -
                  Number(this.suitabilityForm.value['Total Liabilities (e)'])
              );
          }
          this.updateSavedAnswer(
            questionId,
            answerId,
            answerText,
            questionText,
            ariaLabel!,
            type
          );
        }
        break;
    }
  }

  addCheckboxAnswer(
    questionId: string,
    answerId: string,
    questionText: string,
    type: string
  ) {
    const existingAnswerIndex = this.savedAnswer.findIndex(
      (question) => question.questionId === questionId
    );
    if (existingAnswerIndex !== -1) {
      const existingAnswer = this.savedAnswer[existingAnswerIndex];
      const existingAnswerIds = existingAnswer?.selectedAnswers?.map(
        (answer) => answer.answerId
      );
      if (!existingAnswerIds?.includes(answerId)) {
        existingAnswer?.selectedAnswers?.push({
          answerId: answerId,
          answered: true,
        });
      }
    } else {
      this.savedAnswer.push({
        questionId: questionId,
        selectedAnswers: [
          {
            answerId: answerId,
            answered: true,
          },
        ],
      });
    }
    const selectedAnswer = JSON.parse(
      localStorage.getItem('savedAnswer') || '[]'
    );
    if (!selectedAnswer[this.count]) {
      selectedAnswer[this.count] = {};
    }
    if (!selectedAnswer[this.count][questionId]) {
      selectedAnswer[this.count][questionId] = [];
    }
    selectedAnswer[this.count][questionId].push({
      answerId: answerId,
      questionText: questionText,
      type: type,
    });
    localStorage.setItem('savedAnswer', JSON.stringify(selectedAnswer));
  }

  addInputAnswer(
    questionId: string,
    answerText: string,
    questionText: string,
    answerId: string,
    type: string,
    index: number
  ) {
    const questionIds = questionId?.split('_')[0];
    const answerIds = answerId?.split('_')[0];
    const existingAnswerIndex = this.savedAnswer.findIndex((question) => {
      if (type === 'select-one') {
        return question.questionId === answerIds;
      } else {
        return question.questionId === questionIds;
      }
    });
    if (existingAnswerIndex !== -1) {
      const existingAnswer =
        this.savedAnswer[existingAnswerIndex].selectedAnswers;
      if (existingAnswer?.at(index)) {
        existingAnswer[index] = {
          answerText: answerText,
          answered: true,
        };
      } else {
        existingAnswer?.push({
          answerText: answerText,
          answered: true,
        });
      }
    } else {
      if (type === 'select-one') {
        this.savedAnswer.push({
          questionId: answerIds,
          selectedAnswers: [
            {
              answerText: answerText,
              answered: true,
            },
          ],
        });
      } else {
        this.savedAnswer.push({
          questionId: questionIds,
          selectedAnswers: [
            {
              answerText: answerText,
              answered: true,
            },
          ],
        });
      }
    }
    const selectedAnswer = JSON.parse(
      localStorage.getItem('savedAnswer') || '{}'
    );

    if (!selectedAnswer[this.count]) {
      selectedAnswer[this.count] = {};
    }

    if (type === 'select-one') {
      selectedAnswer[this.count][answerId] = {
        questionId: answerId,
        answerText: answerText,
        questionText: questionText,
        type: type,
      };
    } else {
      selectedAnswer[this.count][questionId] = {
        questionId: questionId,
        answerText: answerText,
        questionText: questionText,
        type: type,
      };
    }

    localStorage.setItem('savedAnswer', JSON.stringify(selectedAnswer));
  }

  removeCheckboxAnswer(questionId: string, answerId: string) {
    const existingAnswerIndex = this.savedAnswer.findIndex(
      (question) => question.questionId === questionId
    );
    if (existingAnswerIndex !== -1) {
      const existingAnswer = this.savedAnswer[existingAnswerIndex];
      existingAnswer.selectedAnswers = existingAnswer?.selectedAnswers?.filter(
        (answer) => answer.answerId !== answerId
      );
      if (existingAnswer?.selectedAnswers?.length === 0) {
        this.savedAnswer.splice(existingAnswerIndex, 1);
      }
    }
    const selectedAnswer = JSON.parse(
      localStorage.getItem('savedAnswer') || '[]'
    );
    if (!selectedAnswer[this.count]) {
      selectedAnswer[this.count] = {};
    }
    if (selectedAnswer[this.count][questionId]) {
      selectedAnswer[this.count][questionId] = selectedAnswer[this.count][
        questionId
      ].filter((answer: { answerId: string }) => answer.answerId !== answerId);

      if (selectedAnswer[this.count][questionId].length === 0) {
        delete selectedAnswer[this.count][questionId];
      }
    }
    localStorage.setItem('savedAnswer', JSON.stringify(selectedAnswer));
  }

  updateSavedAnswer(
    questionId: string,
    answerId: string,
    answerText: string,
    questionText: string,
    ariaLabel: string,
    type: string
  ) {
    const existingAnswerIndex = this.savedAnswer.findIndex(
      (question) => question.questionId === questionId
    );

    if (existingAnswerIndex !== -1) {
      if (type === 'select-one') {
        this.savedAnswer[existingAnswerIndex].questionId = answerId;
      } else {
        this.savedAnswer[existingAnswerIndex].answerId = answerId;
        this.savedAnswer[existingAnswerIndex].answerText = answerText;
      }
    } else {
      if (type === 'select-one') {
        this.savedAnswer.push({
          questionId: answerId,
          answerId: '',
          answered: true,
          answerText: answerText,
        });
      } else {
        this.savedAnswer.push({
          questionId: questionId,
          answerId: answerId,
          answered: true,
          answerText: answerText,
        });
      }
    }
    const selectedAnswer = JSON.parse(
      localStorage.getItem('savedAnswer') || '[]'
    );
    if (!selectedAnswer[this.count]) {
      selectedAnswer[this.count] = {};
    }
    if (type === 'select-one') {
      selectedAnswer[this.count][answerId] = {
        answerId: answerId,
        questionId: questionId,
        answerText: answerText,
        questionText: questionText,
        type: type,
      };
    } else {
      selectedAnswer[this.count][questionId] = {
        answerId: answerId,
        questionId: questionId,
        answerText: answerText,
        questionText: questionText,
        type: type,
        ariaLabel: ariaLabel,
      };
    }
    localStorage.setItem('savedAnswer', JSON.stringify(selectedAnswer));
  }

  seedBackData() {
    this.loaderService.setLoader(true);
    const selectedAnswer = JSON.parse(
      localStorage.getItem('savedAnswer') || '[]'
    );
    if (selectedAnswer && selectedAnswer[this.count]) {
      const answers = selectedAnswer[this.count];
      for (const key in answers) {
        const answer = answers[key];
        if (Array.isArray(answers[key])) {
          for (const element of answers[key]) {
            (this.suitabilityForm.get(element.questionText) as FormArray).push(
              new FormControl(element.answerId)
            );
          }
        }
        if (answer && answer.answerText) {
          switch (answer.type) {
            case 'radio':
              if (this.questionCount === 6) {
                this.suitabilityForm
                  .get(answer.ariaLabel!)
                  ?.get(answer.questionText.split('_')[0])
                  ?.setValue(answer.answerId);
              } else {
                this.suitabilityForm
                  .get(answer.questionText)
                  ?.setValue(answer.answerId);
              }
              break;
            case 'select-one':
              if (this.questionCount === 1) {
                (
                  this.suitabilityForm.get(
                    answers[key].questionText
                  ) as FormArray
                ).push(new FormControl(answers[key].answerText));
              } else {
                this.suitabilityForm
                  .get(answer.questionText)
                  ?.setValue(answer.answerText);
              }
              break;
            case 'text':
              if (this.questionCount === 1) {
                (
                  this.suitabilityForm.get(
                    answers[key].questionText
                  ) as FormArray
                ).push(new FormControl(answers[key].answerText));
              } else {
                this.suitabilityForm
                  .get(answer.questionText)
                  ?.setValue(answer.answerText);
              }
              break;
            case 'range':
              this.suitabilityForm
                .get(answer.questionText)
                ?.setValue(answer.answerText);
              break;
          }
        }
      }
    }
    this.loaderService.setLoader(false);
  }

  backQuestion() {
    if (this.count > 0) {
      this.count -= 1;
      this.questionCount =
        this.questionnaireTemplateSuitability[this.count].order;
      this.router.navigate([`/investment-advisor/suitability`], {
        queryParams: { question: this.questionCount, count: this.count },
      });
    }
  }

  skipAnswers(
    questionnaireTemplateSuitability: QuestionnaireTemplate,
    unAnswered: Answer[] = []
  ) {
    for (const level1key in questionnaireTemplateSuitability) {
      if (level1key === 'questionId') {
        if (this.questionCount === 1 || this.questionCount === 5) {
          unAnswered.push({
            questionId: questionnaireTemplateSuitability.questionId,
            answered: false,
            answerText: '',
            answerId: '',
          });
        }
        if (questionnaireTemplateSuitability.nestedQuestions) {
          for (const level2Element of questionnaireTemplateSuitability.nestedQuestions) {
            if (level2Element.questionText !== 'Title') {
              if (
                level2Element.questionType === QuestionType.CHECKBOX_BUTTON_TEXT
              ) {
                unAnswered.push({
                  questionId: level2Element.questionId,
                  selectedAnswers: [
                    // {
                    //   answerText: '',
                    //   answered: false,
                    //   answerId: '',
                    // },
                  ],
                });
              } else {
                unAnswered.push({
                  questionId: level2Element.questionId,
                  answered: false,
                  answerText: '',
                  answerId: '',
                });
              }
            }
            if (level2Element.nestedQuestions) {
              for (const level3Element of level2Element.nestedQuestions) {
                unAnswered.push({
                  questionId: level3Element.questionId,
                  answered: false,
                  answerText: '',
                  answerId: '',
                });
              }
            }
          }
        }
      }
    }
  }

  skipQuestion() {
    const unAnswered: Answer[] = [];
    if (this.questionCount === this.questionnaireTemplateSuitability.length) {
      this.skipAnswers(
        this.questionnaireTemplateSuitability[this.count],
        unAnswered
      );
      this.finanlSubmit(unAnswered);
      const userGoalId = localStorage.getItem('userGoalId');
      const userId = localStorage.getItem('userId');
      if (userGoalId && userId) {
        this.loggingService.info('Requesting goal status update');
        this.goalSettingService
          .goalStatus({
            goalId: userGoalId,
            userId: userId,
            state: State.FINANCIAL_SUITABILITY,
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
                'src/app/components/questionnaire-components/suitability/suitability.component.ts',
                'SuitabilityComponent',
                error.message
              );
            },
          });
      }
      localStorage.setItem('suitabilityStatus', 'true');
      localStorage.removeItem('savedAnswer');
      localStorage.removeItem('question');
      localStorage.removeItem('type');
      this.router.navigateByUrl(`/investment-advisor/financial-calculation`);
    } else {
      this.skipAnswers(
        this.questionnaireTemplateSuitability[this.count],
        unAnswered
      );
      this.finanlSubmit(unAnswered);
      this.count += 1;
      this.questionCount =
        this.questionnaireTemplateSuitability[this.count].order;
      this.router.navigate([`/investment-advisor/suitability`], {
        queryParams: { question: this.questionCount, count: this.count },
      });
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
    if (this.questionCount === this.questionnaireTemplateSuitability.length) {
      this.questionCount =
        this.questionnaireTemplateSuitability[this.count].order;
      this.finanlSubmit(this.savedAnswer);
      const userGoalId = localStorage.getItem('userGoalId');
      const userId = localStorage.getItem('userId');
      if (userGoalId && userId) {
        this.loggingService.info('Requesting goal status update');
        this.goalSettingService
          .goalStatus({
            goalId: userGoalId,
            userId: userId,
            state: State.FINANCIAL_SUITABILITY,
            status: Status.SKIPPED,
          })
          .subscribe({
            next: () => {
              this.toastr.success('Your response has recorded successfully');
              this.loggingService.info('Goal status updated successfully');
            },
            error: (error) => {
              this.toastr.error('Failed to update goal status');
              this.loggingService.error(
                'Failed to update goal status',
                'src/app/components/questionnaire-components/suitability/suitability.component.ts',
                'SuitabilityComponent',
                error.message
              );
            },
          });
      }
      this.toastr.success('Your response has recorded successfully');
      localStorage.setItem('suitabilityStatus', 'true');
      this.router.navigateByUrl(`/investment-advisor/financial-calculation`);
      localStorage.removeItem('savedAnswer');
      localStorage.removeItem('question');
      localStorage.removeItem('type');
      this.suitabilityForm.reset();
    } else {
      this.count += 1;
      this.questionCount =
        this.questionnaireTemplateSuitability[this.count].order;
      this.finanlSubmit(this.savedAnswer);
      this.router.navigate([`/investment-advisor/suitability`], {
        queryParams: { question: this.questionCount, count: this.count },
      });
      this.suitabilityForm.reset();
    }
  }

  hasFormValue(): boolean {
    const formValue = this.suitabilityForm.value;
    return Object.values(formValue).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== undefined && value !== '';
    });
  }
}
