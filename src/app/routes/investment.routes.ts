import { Routes } from '@angular/router';
import {
  InvestmentComponent,
  PortfolioAllocationComponent,
  PortfolioExportComponent,
} from '@app/components/investment-components';
import { MonteCarloSimulationComponent } from '@app/components/strategy-components';

export const investmentRoutes: Routes = [
  {
    path: '',
    component: InvestmentComponent,
  },
  {
    path: 'portfolio-allocation',
    component: PortfolioAllocationComponent,
  },
  {
    path: 'monte-carlo',
    component: MonteCarloSimulationComponent,
  },
  {
    path: 'portfolio-export',
    component: PortfolioExportComponent,
  },
  {
    path: '',
    redirectTo: 'investment',
    pathMatch: 'full',
  },
];
