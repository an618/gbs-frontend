import { CurrencyPipe, NgStyle, PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@app/components/common-components/button/button.component';
import { StrategyModelPorfolio } from '@app/interface/interface';
import {
  AssessmentService,
  ConstantService,
  LoaderService,
  LoggingService,
} from '@app/services';
import { StrategyService } from '@app/services/strategy/strategy.service';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '@app/components/common-components/loader/loader.component';

@Component({
  selector: 'app-financial-calculator',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    NgStyle,
    CurrencyPipe,
    TranslateModule,
    PercentPipe,
    LoaderComponent,
  ],
  templateUrl: './financial-calculator.component.html',
})
export class FinancialCalculatorComponent {
  step!: number;
  riskProfileScore: number = 0;
  strategyModelPorfolio: StrategyModelPorfolio[] = [];
  questionnaireSkip: boolean = JSON.parse(
    localStorage.getItem('questionnaireSkip') || 'false'
  );
  saveData: {
    corpus?: string;
    expectedInflation?: number;
    timeHorizon?: string;
    initialInvestment?: string;
    monthlyInvestment?: string;
    expectedAnnualROI?: number;
  } = {
    corpus: this.keepCodeFormatted(
      JSON.parse(localStorage.getItem('strategyFinancialCalculator') || '{}')
        ?.corpus || '1,000,000'
    ),
    expectedInflation:
      JSON.parse(localStorage.getItem('strategyFinancialCalculator') || '{}')
        ?.expectedInflation || 2,
    timeHorizon:
      JSON.parse(localStorage.getItem('strategyFinancialCalculator') || '{}')
        ?.timeHorizon || '10',
    initialInvestment: this.keepCodeFormatted(
      JSON.parse(localStorage.getItem('strategyFinancialCalculatorROI') || '{}')
        ?.initialInvestment || '5,000'
    ),
    monthlyInvestment: this.keepCodeFormatted(
      JSON.parse(localStorage.getItem('strategyFinancialCalculatorROI') || '{}')
        ?.monthlyInvestment || '1,000'
    ),
    expectedAnnualROI:
      JSON.parse(localStorage.getItem('strategyFinancialCalculatorROI') || '{}')
        ?.expectedAnnualROI || 2,
  };
  defaultSavaData: {
    initialInvestment?: string;
    monthlyInvestment?: string;
    timeHorizon?: string;
    expectedAnnualROI?: number;
  } = {
    timeHorizon:
      JSON.parse(localStorage.getItem('strategyFinancialCalculatorROI')!)
        ?.timeHorizon || '10',
    initialInvestment: this.keepCodeFormatted(
      JSON.parse(localStorage.getItem('strategyFinancialCalculatorROI')!)
        ?.initialInvestment || '5,000'
    ),
    monthlyInvestment: this.keepCodeFormatted(
      JSON.parse(localStorage.getItem('strategyFinancialCalculatorROI')!)
        ?.monthlyInvestment || '1,000'
    ),
    expectedAnnualROI:
      JSON.parse(localStorage.getItem('strategyFinancialCalculatorROI')!)
        ?.expectedAnnualROI || 0,
  };
  roiLowerLimit: string = '';
  roiUpperLimit: string = '';

  constructor(
    private router: Router,
    private queryParams: ActivatedRoute,
    private strategyServices: StrategyService,
    private assessmentService: AssessmentService,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public loaderService: LoaderService,
    public constantService: ConstantService
  ) {
    this.queryParams.queryParams.subscribe((params) => {
      this.step = parseInt(params['step'] || '1');
      if (this.step === 3) {
        this.toLoad();
      }
    });
  }

  toLoad() {
    const assessmentId = localStorage.getItem('assessmentId')!;
    this.loggingService.info('Fetching assessment score');
    this.loaderService.setLoader(true);
    this.assessmentService.getAssessmentScore(assessmentId).subscribe({
      next: (response) => {
        if (response) {
          this.riskProfileScore = response.riskScore;
          this.roiLowerLimit = response?.toleranceRangeDto?.lower;
          this.roiUpperLimit = response?.toleranceRangeDto?.upper;
          this.loggingService.info('Assessment score retrieved successfully');
          this.loggingService.info('Fetching strategy for risk score');
          this.strategyServices
            .getStrategy(
              this.riskProfileScore,
              this.expectedAnnualRateOfReturnPercentage
            )
            .subscribe({
              next: (strategyResponse) => {
                this.loaderService.setLoader(false);
                if (strategyResponse) {
                  this.strategyModelPorfolio = strategyResponse.content;
                }
              },
              error: (error) => {
                this.loaderService.setLoader(true);
                this.toastr.error('Failed to fetch strategy data');
                this.loggingService.error(
                  'Failed to fetch strategy data',
                  'src/app/components/strategy-components/financial-calculator/financial-calculator.component.ts',
                  'FinancialCalculatorComponent',
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
          'src/app/components/strategy-components/financial-calculator/financial-calculator.component.ts',
          'FinancialCalculatorComponent',
          error.message
        );
      },
    });
  }

  defaultFinancialCalculator: FormGroup = new FormGroup({
    initialInvestment: new FormControl(this.saveData.initialInvestment, [
      Validators.required,
    ]),
    monthlyInvestment: new FormControl(this.saveData.monthlyInvestment, [
      Validators.required,
    ]),
    expectedAnnualROI: new FormControl(this.saveData.expectedAnnualROI, [
      Validators.required,
    ]),
    timeHorizon: new FormControl(this.saveData.timeHorizon, [
      Validators.required,
    ]),
    corpus: new FormControl(this.saveData.corpus, [Validators.required]),
  });

  strategyFinancialCalculator: FormGroup = new FormGroup({
    corpus: new FormControl(this.saveData.corpus, [Validators.required]),
    expectedInflation: new FormControl(this.saveData.expectedInflation, [
      Validators.required,
      Validators.max(9999999999),
    ]),
    timeHorizon: new FormControl(this.saveData.timeHorizon, [
      Validators.required,
    ]),
  });

  strategyFinancialCalculatorROI: FormGroup = new FormGroup({
    initialInvestment: new FormControl(this.saveData.initialInvestment, [
      Validators.required,
    ]),
    monthlyInvestment: new FormControl(this.saveData.monthlyInvestment, [
      Validators.required,
    ]),
  });

  get expectedFutureValue() {
    this.saveData = {
      corpus: this.strategyFinancialCalculator.value?.corpus.replace(
        /[, ]+/g,
        ''
      ),
      expectedInflation:
        this.strategyFinancialCalculator.value?.expectedInflation,
      timeHorizon: this.strategyFinancialCalculator.value?.timeHorizon,
    };
    localStorage.setItem(
      'strategyFinancialCalculator',
      JSON.stringify(this.saveData)
    );
    const strategyFinancialCalculatorData = JSON.parse(
      localStorage.getItem('strategyFinancialCalculator')!
    );
    const result = Math.round(
      Number(strategyFinancialCalculatorData?.corpus.replace(/[, ]+/g, '')) *
        Math.pow(
          1 + Number(strategyFinancialCalculatorData?.expectedInflation) / 100,
          Number(strategyFinancialCalculatorData?.timeHorizon)
        )
    );
    localStorage.setItem('expectedFutureValue', JSON.stringify(result));
    return result;
  }

  get expectedAnnualRateOfReturnPercentage() {
    this.saveData = {
      initialInvestment:
        this.strategyFinancialCalculatorROI.value.initialInvestment.replace(
          /[, ]+/g,
          ''
        ),
      monthlyInvestment:
        this.strategyFinancialCalculatorROI.value.monthlyInvestment.replace(
          /[, ]+/g,
          ''
        ),
      timeHorizon: this.strategyFinancialCalculator.value.timeHorizon,
      expectedAnnualROI:
        this.defaultFinancialCalculator.value?.expectedAnnualROI,
    };
    localStorage.setItem(
      'strategyFinancialCalculatorROI',
      JSON.stringify(this.saveData)
    );
    const strategyFinancialCalculatorROIData = JSON.parse(
      localStorage.getItem('strategyFinancialCalculatorROI')!
    );
    const months = Number(strategyFinancialCalculatorROIData.timeHorizon) * 12;
    const monthlyRateOfReturn = (rate: number) => {
      let futureValue =
        Number(
          strategyFinancialCalculatorROIData.initialInvestment.replace(
            /[, ]+/g,
            ''
          )
        ) * Math.pow(1 + rate, months);
      for (let i = 1; i <= months; i++) {
        futureValue +=
          Number(
            strategyFinancialCalculatorROIData.monthlyInvestment.replace(
              /[, ]+/g,
              ''
            )
          ) * Math.pow(1 + rate, months - i);
      }
      return futureValue - this.expectedFutureValue;
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
    return result;
  }

  get expectedResultBasedOnInputs(): string {
    const strategyFinancialCalculatorROIData = JSON.parse(
      localStorage.getItem('strategyFinancialCalculatorROI')!
    );
    console.log(strategyFinancialCalculatorROIData, 'sadvfsdfsdfsf');

    const r = strategyFinancialCalculatorROIData.expectedAnnualROI / 100 / 12;
    const n = strategyFinancialCalculatorROIData.timeHorizon * 12;

    const futureValueOfInitial =
      strategyFinancialCalculatorROIData.initialInvestment * Math.pow(1 + r, n);
    const futureValueOfMonthly =
      strategyFinancialCalculatorROIData.monthlyInvestment *
      ((Math.pow(1 + r, n) - 1) / r);

    const totalFutureValue = futureValueOfInitial + futureValueOfMonthly;
    this.defaultFinancialCalculator
      .get('corpus')
      ?.setValue(String(Math.round(totalFutureValue)));
    return String(Math.round(totalFutureValue));
  }

  get strategyModelPorfolios() {
    return this.strategyModelPorfolio.length !== 0;
  }

  keepCodeFormatted(code: string | number): string {
    const currencyPipe = new CurrencyPipe('en-US');
    const formattedCode = code.toString().replace(/,/g, '');
    let formattedCurrency: string =
      currencyPipe.transform(Number(formattedCode), 'USD', '', '1.0-0') || '';
    return formattedCurrency;
  }

  backStep() {
    this.step -= 1;
    this.router.navigateByUrl(
      `/investment-advisor/financial-calculation?step=${this.step}`
    );
  }

  proceedToInvestmentStrategies() {
    this.router.navigateByUrl(`/investment-advisor/strategy`);
  }

  reCalculate() {
    this.router.navigateByUrl(
      `/investment-advisor/financial-calculation?step=1`
    );
  }

  skipOnSubmit(event: Event) {
    event.preventDefault();
    if (this.step === 1) {
      this.defaultSavaData = {
        initialInvestment:
          this.defaultFinancialCalculator.value.initialInvestment.replace(
            /[, ]+/g,
            ''
          ),
        monthlyInvestment:
          this.defaultFinancialCalculator.value.monthlyInvestment.replace(
            /[, ]+/g,
            ''
          ),
        timeHorizon: this.defaultFinancialCalculator.value.timeHorizon,
        expectedAnnualROI:
          this.defaultFinancialCalculator.value.expectedAnnualROI,
      };
      localStorage.setItem(
        'strategyFinancialCalculatorROI',
        JSON.stringify(this.defaultSavaData)
      );
      this.step += 1;
      this.router.navigateByUrl(
        `/investment-advisor/financial-calculation?step=${this.step}`
      );
    } else {
      this.strategyServices
        .financialCalculator({
          currentCorpusRequired: '',
          corpusCurrency: 'USD',
          expectedAnnualRateOfReturnSystemGenerated:
            this.expectedAnnualRateOfReturnPercentage,
          expectedInflation: 0,
          initialInvestment:
            this.defaultFinancialCalculator.value.initialInvestment?.replace(
              /[, ]+/g,
              ''
            ),
          initialInvestmentCurrency: 'USD',
          monthlyInvestment:
            this.defaultFinancialCalculator.value.monthlyInvestment?.replace(
              /[, ]+/g,
              ''
            ),
          monthlyInvestmentCurrency: 'USD',
          timeHorizon: this.defaultFinancialCalculator.value.timeHorizon,
          userGoalId: localStorage.getItem('userGoalId')!,
          userId: localStorage.getItem('userId')!,
          assessmentId: localStorage.getItem('assessmentId')!,
          corpusWithInflation:
            this.defaultFinancialCalculator.value.corpus?.replace(/[, ]+/g, ''),
          isFinancialCalculatorSkipped: true,
        })
        .subscribe({
          next: () => {
            this.toastr.success(
              'Financial calculator data submitted successfully'
            );
            this.loggingService.info(
              'Financial calculator data submitted successfully'
            );
          },
          error: (error) => {
            this.toastr.error('Failed to submit financial calculator data');
            this.loggingService.error(
              'Failed to submit financial calculator data',
              'src/app/components/strategy-components/financial-calculator/financial-calculator.component.ts',
              'FinancialCalculatorComponent',
              error.message
            );
          },
        });
      this.router.navigateByUrl(`/investment-advisor/strategy`);
    }
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.step === 2) {
      this.strategyServices
        .financialCalculator({
          currentCorpusRequired:
            this.strategyFinancialCalculator.value.corpus?.replace(
              /[, ]+/g,
              ''
            ),
          corpusCurrency: 'USD',
          expectedAnnualRateOfReturnSystemGenerated:
            this.expectedAnnualRateOfReturnPercentage,
          expectedInflation:
            this.strategyFinancialCalculator.value.expectedInflation,
          initialInvestment:
            this.strategyFinancialCalculatorROI.value.initialInvestment?.replace(
              /[, ]+/g,
              ''
            ),
          initialInvestmentCurrency: 'USD',
          monthlyInvestment:
            this.strategyFinancialCalculatorROI.value.monthlyInvestment?.replace(
              /[, ]+/g,
              ''
            ),
          monthlyInvestmentCurrency: 'USD',
          timeHorizon: this.strategyFinancialCalculator.value.timeHorizon,
          userGoalId: localStorage.getItem('userGoalId')!,
          userId: localStorage.getItem('userId')!,
          assessmentId: localStorage.getItem('assessmentId')!,
          corpusWithInflation: String(this.expectedFutureValue!),
          isFinancialCalculatorSkipped: false,
        })
        .subscribe({
          next: () => {
            this.toastr.success(
              'Financial calculator data submitted successfully'
            );
            this.loggingService.info(
              'Financial calculator data submitted successfully'
            );
          },
          error: (error) => {
            this.toastr.error('Failed to submit financial calculator data');
            this.loggingService.error(
              'Failed to submit financial calculator data',
              'src/app/components/strategy-components/financial-calculator/financial-calculator.component.ts',
              'FinancialCalculatorComponent',
              error.message
            );
          },
        });
      this.step += 1;
      this.router.navigateByUrl(
        `/investment-advisor/financial-calculation?step=${this.step}`
      );
    } else {
      this.step += 1;
      this.router.navigateByUrl(
        `/investment-advisor/financial-calculation?step=${this.step}`
      );
    }
  }
}
