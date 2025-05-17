import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '@app/components/common-components/button/button.component';
import {
  ConstantService,
  InvestmentService,
  LoggingService,
} from '@app/services';
import { Router } from '@angular/router';
import { ModelPortfolios, PorfolioConstitute } from '@app/interface/interface';
import { StrategyService } from '@app/services/strategy/strategy.service';
import { CurrencyPipe, NgFor, NgStyle, PercentPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-portfolio-allocation',
  standalone: true,
  imports: [
    ButtonComponent,
    CurrencyPipe,
    NgStyle,
    TranslateModule,
    ReactiveFormsModule,
    PercentPipe,
    NgFor,
  ],
  templateUrl: './portfolio-allocation.component.html',
})
export class PortfolioAllocationComponent implements OnInit {
  modelPortfolio: ModelPortfolios[] = [];
  initialInvestment: number = Number(
    JSON.parse(localStorage.getItem('strategyFinancialCalculatorROI') || '{}')
      ?.initialInvestment || 0
  );
  monthlyInvestment: number = Number(
    JSON.parse(localStorage.getItem('strategyFinancialCalculatorROI') || '{}')
      ?.monthlyInvestment || 0
  );
  questionnaireSkip: boolean = JSON.parse(
    localStorage.getItem('questionnaireSkip') || 'false'
  );
  showInitialOrMonthlyInvestment: boolean = false;
  porfolioAllocationForm: FormGroup = new FormGroup({});
  savedPorfolioConstitue!: PorfolioConstitute[];
  editMode: boolean = false;

  constructor(
    private strategyService: StrategyService,
    private investmentService: InvestmentService,
    private router: Router,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public constantService: ConstantService
  ) {}

  ngOnInit() {
    if (this.questionnaireSkip) {
      this.strategyService.getStrategy().subscribe({
        next: (response) => {
          if (response) {
            this.modelPortfolio = response.content[0].modelPortfolios;
            this.seedPorfolioConstitue();
            this.porfolioAllocationForm = new FormGroup(
              this.getFormControlsFields()
            );
            localStorage.setItem(
              'modelPortfolio',
              JSON.stringify(response.content[0].modelPortfolios)
            );
            this.loggingService.info(
              'Model portfolio fetched for skipped questionnaire'
            );
          }
        },
        error: (error) => {
          this.toastr.error(
            'Failed to fetch model portfolio for skipped questionnaire'
          );
          this.loggingService.error(
            'Failed to fetch model portfolio for skipped questionnaire',
            'src/app/components/investment-components/portfolio-allocation/portfolio-allocation.component.ts',
            'PortfolioAllocationComponent',
            error.message
          );
        },
      });
    } else {
      const strategyId = localStorage.getItem('strategyId');
      if (strategyId) {
        this.strategyService.getStrategyById(strategyId).subscribe({
          next: (response) => {
            if (response) {
              this.modelPortfolio = response.modelPortfolios;
              this.seedPorfolioConstitue();
              this.porfolioAllocationForm = new FormGroup(
                this.getFormControlsFields()
              );
              localStorage.setItem(
                'modelPortfolio',
                JSON.stringify(response.modelPortfolios)
              );
              this.loggingService.info(
                'Model portfolio fetched by strategy ID'
              );
            }
          },
          error: (error) => {
            this.toastr.error('Failed to fetch model portfolio by strategy ID');
            this.loggingService.error(
              'Failed to fetch model portfolio by strategy ID',
              'src/app/components/investment-components/portfolio-allocation/portfolio-allocation.component.ts',
              'PortfolioAllocationComponent',
              error.message
            );
          },
        });
      }
    }
  }

  setEditMode() {
    this.editMode = !this.editMode;
  }
  toLoadStrategy() {
    this.modelPortfolio = JSON.parse(localStorage.getItem('modelPortfolio')!);
    this.porfolioAllocationForm = new FormGroup(this.getFormControlsFields());
  }

  convertStringToNumber(number: string) {
    return Number(number.split('%')[0]);
  }

  goBack() {
    this.router.navigateByUrl(`/investment-advisor/investment`);
  }

  setMonthlyInvestment() {
    this.showInitialOrMonthlyInvestment = !this.showInitialOrMonthlyInvestment;
    this.toLoadStrategy();
  }
  sanitizeKey = (key: string): string => {
    return key.replace(/\./g, '');
  };

  createAssetClassSumValidator(expectedSum: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup) {
        const sum = Object.values(control.controls).reduce(
          (acc, c) => acc + (c.value.Amount || 0),
          0
        );
        if (sum !== expectedSum) {
          return { assetClassSumMismatch: true };
        }
      }
      return null;
    };
  }

  getFormControlsFields() {
    const selectedPortfolioConstitue: PorfolioConstitute[] = JSON.parse(
      localStorage.getItem('savedPorfolioConstitue') || '[]'
    );
    const formGroupFields: Record<string, FormControl | FormGroup> = {};
    for (
      let strategyIndex = 0;
      strategyIndex < this.modelPortfolio.length;
      strategyIndex++
    ) {
      const modelPortfolioFrom: Record<string, FormGroup> = {};
      const expectedSum =
        (this.initialInvestment === 0
          ? this.monthlyInvestment
          : this.showInitialOrMonthlyInvestment
          ? this.initialInvestment
          : this.monthlyInvestment) *
        (this.convertStringToNumber(
          this.modelPortfolio[strategyIndex].assetClassAllocationPercentage
        ) /
          100);
      for (
        let constitueIndex = 0;
        constitueIndex < this.modelPortfolio[strategyIndex].constitutes.length;
        constitueIndex++
      ) {
        const constituteForm: Record<string, FormControl> = {};
        const investmentValue =
          (this.showInitialOrMonthlyInvestment
            ? selectedPortfolioConstitue[strategyIndex]
                .userPortfolioConstitutesDto[constitueIndex].initialInvestment
            : selectedPortfolioConstitue[strategyIndex]
                .userPortfolioConstitutesDto[constitueIndex]
                .monthlyInvestment) ||
          expectedSum *
            (this.modelPortfolio[strategyIndex].constitutes[constitueIndex]
              .assetAllocation /
              this.convertStringToNumber(
                this.modelPortfolio[strategyIndex]
                  .assetClassAllocationPercentage
              ));

        constituteForm['Amount'] = new FormControl(investmentValue, [
          Validators.required,
        ]);
        constituteForm['Percentage'] = new FormControl(
          this.modelPortfolio[strategyIndex].constitutes[
            constitueIndex
          ].assetAllocation,
          [Validators.required]
        );
        modelPortfolioFrom[
          this.sanitizeKey(
            this.modelPortfolio[strategyIndex].constitutes[constitueIndex]
              .securityExchangeCode
          )
        ] = new FormGroup(constituteForm, [Validators.required]);
      }
      formGroupFields[
        this.sanitizeKey(this.modelPortfolio[strategyIndex].assetClassName)
      ] = new FormGroup(modelPortfolioFrom, {
        validators: this.createAssetClassSumValidator(expectedSum),
      });
    }
    return formGroupFields;
  }

  seedPorfolioConstitue() {
    const selectedPortfolioConstitue: PorfolioConstitute[] = JSON.parse(
      localStorage.getItem('savedPorfolioConstitue') || '[]'
    );
    if (!localStorage.getItem('savedPorfolioConstitue')) {
      for (const strategy of this.modelPortfolio) {
        selectedPortfolioConstitue.push({
          modelPortfolioId: strategy.portfolioId,
          userPortfolioConstitutesDto: [],
        });
        for (const constitute of strategy.constitutes) {
          selectedPortfolioConstitue[
            selectedPortfolioConstitue.length - 1
          ].userPortfolioConstitutesDto.push({
            userPortfolioConstituteId: constitute.constituteId,
            assetAllocation: constitute.assetAllocation,
            assetCurrency: constitute.assetCurrency,
            assetName: constitute.assetName,
            securityExchangeCode: constitute.securityExchangeCode,
            initialInvestment:
              this.initialInvestment *
              (this.convertStringToNumber(
                strategy.assetClassAllocationPercentage
              ) /
                100) *
              (constitute.assetAllocation /
                this.convertStringToNumber(
                  strategy.assetClassAllocationPercentage
                )),
            monthlyInvestment:
              this.monthlyInvestment *
              (this.convertStringToNumber(
                strategy.assetClassAllocationPercentage
              ) /
                100) *
              (constitute.assetAllocation /
                this.convertStringToNumber(
                  strategy.assetClassAllocationPercentage
                )),
          });
          const constituteForm: Record<string, FormControl> = {};
        }
      }
      this.savedPorfolioConstitue = selectedPortfolioConstitue;
      localStorage.setItem(
        'savedPorfolioConstitue',
        JSON.stringify(selectedPortfolioConstitue)
      );
    } else {
      this.savedPorfolioConstitue = selectedPortfolioConstitue;
    }
  }

  setAmountPercentage(event: Event) {
    const target = event.target as HTMLInputElement;
    const {
      accessKey: modelPortfolioId,
      name: assetName,
      id: userPortfolioConstituteId,
      value,
      accept,
      ariaDescription,
      ariaLabel,
    } = target;

    const initialORMonthlyInvestment = this.convertStringToNumber(value)!;
    const [securityExchangeCode, assetCurrency] =
      ariaDescription?.split('-') || [];
    const assetAllocation =
      (initialORMonthlyInvestment * this.convertStringToNumber(ariaLabel!)) /
      ((this.initialInvestment === 0
        ? this.monthlyInvestment
        : this.showInitialOrMonthlyInvestment
        ? this.initialInvestment
        : this.monthlyInvestment) *
        (this.convertStringToNumber(ariaLabel!) / 100));

    const portfolioData = this.porfolioAllocationForm
      .get(accept)
      ?.get(securityExchangeCode);
    portfolioData?.get('Amount')?.setValue(initialORMonthlyInvestment);
    portfolioData?.get('Percentage')?.setValue(assetAllocation);

    const selectedPortfolioConstitue: PorfolioConstitute[] = JSON.parse(
      localStorage.getItem('savedPorfolioConstitue') || '[]'
    );
    const portfolioIndex = selectedPortfolioConstitue.findIndex(
      (portfolio: { modelPortfolioId: string }) =>
        portfolio.modelPortfolioId === modelPortfolioId
    );
    if (portfolioIndex !== -1) {
      const userPortfolioIndex = selectedPortfolioConstitue[
        portfolioIndex
      ].userPortfolioConstitutesDto.findIndex(
        (item: { userPortfolioConstituteId: string }) =>
          item.userPortfolioConstituteId === userPortfolioConstituteId
      );
      if (userPortfolioIndex !== -1) {
        selectedPortfolioConstitue[portfolioIndex].userPortfolioConstitutesDto[
          userPortfolioIndex
        ] = {
          userPortfolioConstituteId,
          assetAllocation,
          assetCurrency,
          assetName,
          securityExchangeCode,
          initialInvestment: this.showInitialOrMonthlyInvestment
            ? initialORMonthlyInvestment
            : selectedPortfolioConstitue[portfolioIndex]
                .userPortfolioConstitutesDto[userPortfolioIndex]
                .initialInvestment,
          monthlyInvestment: !this.showInitialOrMonthlyInvestment
            ? initialORMonthlyInvestment
            : selectedPortfolioConstitue[portfolioIndex]
                .userPortfolioConstitutesDto[userPortfolioIndex]
                .monthlyInvestment,
        };
      } else {
        selectedPortfolioConstitue[
          portfolioIndex
        ].userPortfolioConstitutesDto.push({
          userPortfolioConstituteId,
          assetAllocation,
          assetCurrency,
          assetName,
          securityExchangeCode,
          initialInvestment: this.showInitialOrMonthlyInvestment
            ? initialORMonthlyInvestment
            : 0,
          monthlyInvestment: !this.showInitialOrMonthlyInvestment
            ? initialORMonthlyInvestment
            : 0,
        });
      }
    } else {
      selectedPortfolioConstitue.push({
        userPortfolioConstitutesDto: [
          {
            userPortfolioConstituteId,
            assetAllocation,
            assetCurrency,
            assetName,
            securityExchangeCode,
            initialInvestment: this.showInitialOrMonthlyInvestment
              ? initialORMonthlyInvestment
              : 0,
            monthlyInvestment: !this.showInitialOrMonthlyInvestment
              ? initialORMonthlyInvestment
              : 0,
          },
        ],
        modelPortfolioId: modelPortfolioId,
      });
    }
    this.savedPorfolioConstitue = selectedPortfolioConstitue;
    localStorage.setItem(
      'savedPorfolioConstitue',
      JSON.stringify(selectedPortfolioConstitue)
    );
  }

  runPortfolioAllocation() {
    if (this.porfolioAllocationForm.valid) {
      const userId = localStorage.getItem('userId')!;
      const userGoalId = localStorage.getItem('userGoalId')!;
      const strategyId = localStorage.getItem('strategyId')!;
      this.investmentService
        .updateUserPortfolio({
          goalId: userGoalId,
          userId: userId,
          strategyId: strategyId,
          user_portfolio_id: '',
          configInvestmentStrategy: strategyId,
          portfolioConstituteDto: this.savedPorfolioConstitue,
        })
        .subscribe({
          next: (response) => {
            if (response) {
              this.toastr.success('User portfolio Update successfully');
              this.loggingService.info('User portfolio Update successfully');
              localStorage.setItem(
                'userPorfolioId',
                response.userPortfolioDTO.user_portfolio_id
              );
              this.router.navigateByUrl(
                '/investment-advisor/investment/monte-carlo'
              );
              localStorage.removeItem('modelPortfolio');
            }
          },
          error: (error) => {
            this.toastr.error('Failed to create update portfolio');
            this.loggingService.error(
              'Failed to create update portfolio',
              'src/app/components/investment-components/portfolio-allocation/portfolio-allocation.component.ts',
              'PortfolioAllocationComponent',
              error.message
            );
          },
        });
    }
  }
}
