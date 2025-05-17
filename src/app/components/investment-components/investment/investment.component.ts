import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@app/components/common-components';
import { InvestmentTableBody } from '@app/interface/interface';
import { ConstantService } from '@app/services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-investment',
  standalone: true,
  imports: [ButtonComponent, CurrencyPipe, TranslateModule, PercentPipe],
  templateUrl: './investment.component.html',
})
export class InvestmentComponent {
  constructor(
    private router: Router,
    public constantService: ConstantService
  ) {}

  proceed() {
    this.router.navigateByUrl(
      `/investment-advisor/investment/portfolio-allocation`
    );
  }

  convertStringToNumber(value: string): number {
    return Number(value);
  }

  investmentTableBody: InvestmentTableBody[] = [
    {
      id: 1,
      heading: $localize`:@@InitialInvestmentAmount:InitialInvestmentAmount`,
      financial:
        JSON.parse(
          localStorage.getItem('strategyFinancialCalculatorROI') || '{}'
        )?.initialInvestment || '0',
    },
    {
      id: 2,
      heading: $localize`:@@CustomerEstimatedExpectedROI:CustomerEstimatedExpectedROI`,
      financial: `${localStorage.getItem('roi') || '0'}`,
    },
    {
      id: 3,
      heading: $localize`:@@InvestmentTimeHorizon:InvestmentTimeHorizon`,
      financial: `${
        JSON.parse(
          localStorage.getItem('strategyFinancialCalculatorROI') || '{}'
        ).timeHorizon || '0'
      } years`,
    },
    {
      id: 4,
      heading: $localize`:@@MonthlyContribution:MonthlyContribution`,
      financial:
        JSON.parse(
          localStorage.getItem('strategyFinancialCalculatorROI') || '{}'
        ).monthlyInvestment || '0',
    },
  ];

  reCalculate() {
    localStorage.removeItem('strategyStatus');
    this.router.navigateByUrl(`/investment-advisor/financial-calculation`);
  }
}
