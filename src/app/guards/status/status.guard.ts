import { CanActivateChildFn, Router } from '@angular/router';

// export const StatusGoalSettingGuard: CanActivateChildFn = () => {
//   const router = new Router();
//   const goalSettingStatus: boolean = JSON.parse(
//     localStorage.getItem('goalStatus') || 'false'
//   );

//   if (!goalSettingStatus) {
//     return true;
//   }
//   router.navigateByUrl(`/investment-advisor/risk-profile`);
//   return false;
// };

export const StatusRiskProfileGuard: CanActivateChildFn = () => {
  const router = new Router();
  const goalRiskProfileStatus: boolean = JSON.parse(
    localStorage.getItem('riskProfileStatus') || 'false'
  );
  if (!goalRiskProfileStatus) {
    return true;
  }
  router.navigateByUrl(`/investment-advisor/suitability`);
  return false;
};

export const StatusSuitabilityGuard: CanActivateChildFn = () => {
  const router = new Router();
  const goalRiskProfileStatus: boolean = JSON.parse(
    localStorage.getItem('suitabilityStatus') || 'false'
  );
  if (!goalRiskProfileStatus) {
    return true;
  }
  router.navigateByUrl(`/investment-advisor/financial-calculation`);
  return false;
};

export const StatusStrategyGuard: CanActivateChildFn = () => {
  const router = new Router();
  const goalRiskProfileStatus: boolean = JSON.parse(
    localStorage.getItem('strategyStatus') || 'false'
  );
  const questionnaireSkip: boolean = JSON.parse(
    localStorage.getItem('questionnaireSkip') || 'false'
  );
  if (!goalRiskProfileStatus) {
    return true;
  }
  if (questionnaireSkip) {
    router.navigateByUrl(`/investment-advisor/investment/portfolio-allocation`);
    return false;
  } else {
    router.navigateByUrl(`/investment-advisor/investment`);
  }
  return false;
};
