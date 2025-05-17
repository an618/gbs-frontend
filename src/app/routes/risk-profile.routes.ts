import { Routes } from '@angular/router';
import { RiskProfileComponent, RiskProfileResultComponent } from '@app/components/questionnaire-components';

export const riskProfileRoutes: Routes = [
  {
    path: '',
    component: RiskProfileComponent,
  },
  {
    path: 'result',
    component: RiskProfileResultComponent,
  },
  {
    path: '',
    redirectTo: 'risk-profile',
    pathMatch: 'full',
  },
];
