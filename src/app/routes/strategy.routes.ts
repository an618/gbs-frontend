import { Routes } from '@angular/router';
import {
  StrategyComponent,
  StrategyPorfolioComponent,
} from '@app/components/strategy-components';

export const strategyRoutes: Routes = [
  {
    path: '',
    component: StrategyComponent,
  },
  {
    path: 'porfolio/:id',
    component: StrategyPorfolioComponent,
  },
  {
    path: '',
    redirectTo: 'startegy',
    pathMatch: 'full',
  },
];
