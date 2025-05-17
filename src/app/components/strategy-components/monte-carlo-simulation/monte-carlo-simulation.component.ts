import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  LoaderComponent,
} from '@app/components/common-components';
import { MonteCarloSimulationsData } from '@app/interface/interface';
import {
  ConstantService,
  LoaderService,
  LoggingService,
  MonteCarloSimulationsService,
} from '@app/services';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-monte-carlo-simulation',
  standalone: true,
  imports: [ButtonComponent, TranslateModule, LoaderComponent, NgIf],
  templateUrl: './monte-carlo-simulation.component.html',
})
export class MonteCarloSimulationComponent {
  public imgSrc: string | null = null;
  showPopUp: boolean = false;

  constructor(
    private router: Router,
    private monteCarloSimulationService: MonteCarloSimulationsService,
    public constantService: ConstantService,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public loaderService: LoaderService
  ) {
    const dummyData: MonteCarloSimulationsData = {
      portfolio: [
        {
          symbol: 'SPY',
          exchange: 'NYSE',
          initial_investment: 10000,
          monthly_investment: 500,
          investment_duration_months: 120,
          asset_type: 'ETF',
        },
        {
          symbol: 'AAPL',
          exchange: 'NASDAQ',
          initial_investment: 5000,
          monthly_investment: 300,
          investment_duration_months: 120,
          asset_type: 'Stock',
        },
        {
          symbol: 'VTI',
          exchange: 'NYSE',
          initial_investment: 15000,
          monthly_investment: 1000,
          investment_duration_months: 120,
          asset_type: 'ETF',
        },
      ],
      simulation_parameters: {
        num_simulations: 10000,
        num_years: 1,
      },
    };
    this.loaderService.setLoader(true);
    this.monteCarloSimulationService
      .monteCarloSimulations(dummyData)
      .subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'image/png' });
          this.imgSrc = window.URL.createObjectURL(blob);
          this.loaderService.setLoader(false);
          this.toastr.success(
            'Monte Carlo simulation result fetched successfully'
          );
          this.loggingService.info(
            'Monte Carlo simulation result fetched successfully'
          );
        },
        error: (error) => {
          this.loaderService.setLoader(true);
          this.toastr.error('Failed to fetch Monte Carlo simulation result');
          this.loggingService.error(
            'Failed to fetch Monte Carlo simulation result',
            'src/app/components/strategy-components/monte-carlo-simulation/monte-carlo-simulation.component.ts',
            'MonteCarloSimulationComponent',
            error.message
          );
        },
      });
  }

  setShowPopUp() {
    this.showPopUp = !this.showPopUp;
  }

  viewSavingProbability() {
    this.router.navigateByUrl(
      `/investment-advisor/investment/portfolio-export`
    );
  }
}
