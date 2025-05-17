import { Routes } from '@angular/router';
import {
  AuthorizedLayoutComponent,
  DashboardLayoutComponent,
  UnAuthorizedLayoutComponent,
} from '@app/layouts';
import {
  InvestmentAdvisorComponent,
  WorkbookComponent,
} from '@app/components/dashboard-components';
import { SuitabilityComponent } from '@app/components/questionnaire-components';
import { FinancialCalculatorComponent } from '@app/components/strategy-components';
import {
  AuthorizedGuard,
  // StatusGoalSettingGuard,
  StatusRiskProfileGuard,
  StatusStrategyGuard,
  StatusSuitabilityGuard,
  UnAuthorizedGuard,
} from '@app/guards';
import {
  PageNotFoundComponent,
  ProfileComponent,
  SiginInComponent,
  SsoComponent,
} from '@app/components/common-components';
import {
  goalSettingRoutes,
  investmentRoutes,
  riskProfileRoutes,
  strategyRoutes,
} from '@app/routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthorizedLayoutComponent,
    canActivate: [AuthorizedGuard],
    children: [
      {
        path: '',
        component: DashboardLayoutComponent,
        children: [
          {
            path: 'dashboard',
            component: WorkbookComponent,
          },
          {
            path: 'investment-advisor',
            component: InvestmentAdvisorComponent,
            children: [
              {
                path: 'goal-setting',
                children: goalSettingRoutes,
              },
              {
                path: 'risk-profile',
                canActivateChild: [StatusRiskProfileGuard],
                children: riskProfileRoutes,
              },
              {
                path: 'suitability',
                canActivateChild: [StatusSuitabilityGuard],
                children: [
                  {
                    path: '',
                    component: SuitabilityComponent,
                  },
                  {
                    path: '',
                    redirectTo: 'suitability',
                    pathMatch: 'full',
                  },
                ],
              },
              {
                path: 'financial-calculation',
                canActivateChild: [StatusStrategyGuard],
                children: [
                  {
                    path: '',
                    component: FinancialCalculatorComponent,
                  },
                ],
              },
              {
                path: 'strategy',
                canActivateChild: [StatusStrategyGuard],
                children: strategyRoutes,
              },
              {
                path: 'investment',
                children: investmentRoutes,
              },
              {
                path: '',
                redirectTo: 'goal-setting',
                pathMatch: 'full',
              },
            ],
          },
          {
            path: 'profile',
            component: ProfileComponent,
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
  {
    path: '',
    component: UnAuthorizedLayoutComponent,
    children: [
      {
        path: 'sso-sign-in',
        component: SsoComponent,
      },
      {
        path: 'sign-in',
        component: SiginInComponent,
      },
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full',
      },
    ],
    canActivate: [UnAuthorizedGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
