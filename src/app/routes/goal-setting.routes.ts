import { Routes } from '@angular/router';
import {
  GoalNameComponent,
  GoalPendingComponent,
  GoalQuestionnaireTypeComponent,
  GoalSelectionComponent,
  GoalSettingComponent,
} from '@app/components/goal-setting-components';

export const goalSettingRoutes: Routes = [
  {
    path: '',
    component: GoalSettingComponent,
  },
  {
    path: 'goal/:goal-type',
    component: GoalSelectionComponent,
  },
  {
    path: 'pending',
    component: GoalPendingComponent,
  },
  {
    path: ':goal-type/goal-name',
    component: GoalNameComponent,
  },
  {
    path: ':goal-type/questionnaire',
    component: GoalQuestionnaireTypeComponent,
  },
  {
    path: '',
    redirectTo: 'goal-setting',
    pathMatch: 'full',
  },
];
