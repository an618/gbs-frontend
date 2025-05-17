import { Injectable } from '@angular/core';
import {
  Dashboard,
  GoalList,
  Language,
  NavbarMenu,
  TableHeader,
} from '@app/interface/interface';

@Injectable({
  providedIn: 'root',
})
export class ConstantService {
  // Text For Button
  public textForLogin = $localize`:@@Login:Login`;
  public textForConfirm = $localize`:@@Confirm:Confirm`;
  public textForCancel = $localize`:@@Cancel:Cancel`;
  public textForContiue = $localize`:@@Continue:Continue`;
  public textForSave = $localize`:@@Save:Save`;
  public textForBack = $localize`:@@Back:Back`;
  public textForNext = $localize`:@@Next:Next`;
  public textForDownload = $localize`:@@Download:Download`;
  public textForPlaceOrder = $localize`:@@PlaceOrder:PlaceOrder`;
  public textForSkip = $localize`:@@SkipThisPoint:SkipThisPoint`;
  public textForCheckSore = $localize`:@@CheckScore:CheckScore`;
  public textforSuitability = $localize`:@@StartSuitabilityQuestionnaire:StartSuitabilityQuestionnaire`;
  public textForProceedToInvestmentStrategies = $localize`:@@ProceedInvestmentStrategies:ProceedInvestmentStrategies`;
  public textForTryOrCalculator = $localize`:@@TryCalculator:Tryourcalculator`;
  public textForReCalucate = $localize`:@@Recalcuate:Recalcuate`;
  public textForProceed = $localize`:@@Proceed:Proceed`;
  public textForReCalculate = $localize`:@@ReCalculate:ReCalculate`;
  public textForAddGoal = $localize`:@@AddGoal:AddGoal`;
  public textForSaveDraft = $localize`:@@SaveDraft:Save as Draft`;
  public textForRunPortfolioAllocation = $localize`:@@RunPortfolioAllocation:RunPortfolioAllocation`;
  public textForMonthlyInvestment = $localize`:@@MonthlyInvestment:MonthlyInvestment`;
  public textForInitialInvestment = $localize`:@@InitialInvestment:InitialInvestment`;

  // Text For Label
  portFoliosTitle: string = $localize`:@@MyPortfolios:MyPortfolios`;
  monthlyAmountText: string = $localize`:@@MonthlyAmount:MonthlyAmount`;
  initialAmountText: string = $localize`:@@InitialAmount:InitialAmount`;

  // Text For Details
  navMenu: NavbarMenu[] = [
    {
      id: 1,
      name: $localize`:@@GoalSetting:GoalSetting`,
      link: './goal-setting',
      disable: true,
    },
    {
      id: 2,
      name: $localize`:@@RiskProfile:RiskProfile`,
      link: './risk-profile',
      disable: true,
    },
    {
      id: 3,
      name: $localize`:@@Suitability:Suitability`,
      link: './suitability',
      disable: true,
    },
    {
      id: 4,
      name: $localize`:@@FinancialCalculation:FinancialCalculation`,
      link: './financial-calculation',
      disable: true,
    },
    {
      id: 5,
      name: $localize`:@@Strategy:Strategy`,
      link: './strategy',
      disable: true,
    },
    {
      id: 6,
      name: $localize`:@@Investment:Investment`,
      link: './investment',
      disable: true,
    },
  ];

  overviewMenu: NavbarMenu[] = [
    {
      id: 1,
      name: $localize`:@@Dashboard:Dashboard`,
      link: 'dashboard',
    },
    {
      id: 2,
      name: $localize`:@@InvestmentAdvisor:InvestmentAdvisor`,
      link: 'investment-advisor',
    },
  ];

  languageMenu: Language[] = [
    {
      id: 1,
      name: $localize`:@@English:English`,

      link: 'en',
    },
    { id: 2, name: $localize`:@@Hindi:Hindi`, link: 'hi' },
    { id: 3, name: $localize`:@@Arabic:Arabic`, link: 'ar' },
  ];

  dashboardMenu: Dashboard[] = [
    {
      goalName: 'Mercerdes',
      riskProfileMatrixType: 'Moderate',
      currentBalance: 60000,
      goalTarget: 100000,
      monthlyInvestment: 700,
      initialInvestment: 2000,
      currentPortfolioReturn: 9,
      expectedReturnInvestment: 10,
      goalProcess: 60,
    },
    {
      goalName: 'BankHouse',
      riskProfileMatrixType: 'Secured',
      currentBalance: 90000,
      goalTarget: 110000,
      monthlyInvestment: 500,
      initialInvestment: 0,
      currentPortfolioReturn: 10,
      expectedReturnInvestment: 8,
      goalProcess: 30,
    },
    {
      goalName: 'Lamborghini yacht',
      riskProfileMatrixType: 'Speculative',
      currentBalance: 40000,
      goalTarget: 120000,
      monthlyInvestment: 200,
      initialInvestment: 4000,
      currentPortfolioReturn: 8,
      expectedReturnInvestment: 6,
      goalProcess: 40,
    },
  ];

  newGoalList: GoalList[] = [
    {
      id: 1,
      title: $localize`:@@NewQuestionnaire:NewQuestionnaire`,
      disable: false,
    },
    // {
    //   id: 2,
    //   title: $localize`:@@UseReviseExistingQuestionnaire:UseReviseExistingQuestionnaire`,
    //   disable: true,
    // },
    {
      id: 3,
      title: $localize`:@@LetJump:LetJump`,
      disable: false,
    },
  ];

  questionOption6TableHeading: TableHeader[] = [
    {
      id: 1,
      heading: $localize`:@@Title:Title`,
      colspan: '0',
    },
    {
      id: 2,
      heading: $localize`:@@Experience:Experience`,
      colspan: '4',
    },
    {
      id: 3,
      heading: $localize`:@@Knowledge:Knowledge`,
      colspan: '6',
    },
    {
      id: 4,
      heading: $localize`:@@UnderstandingProductRisk:UnderstandingProductRisk`,
      colspan: '4',
    },
  ];

  questionOption6TableSubHeading: TableHeader[] = [
    {
      id: 1,
      heading: '',
      colspan: '0',
    },
    {
      id: 2,
      heading: $localize`:@@No:no`,
      colspan: '2',
    },
    {
      id: 3,
      heading: $localize`:@@Yes:yes`,
      colspan: '2',
    },
    {
      id: 4,
      heading: $localize`:@@none:none`,
      colspan: '2',
    },
    {
      id: 5,
      heading: $localize`:@@LimitedLessThan:LimitedLessThan`,
      colspan: '2',
    },
    {
      id: 6,
      heading: $localize`:@@ExperienceGreaterThan:ExperienceGreaterThan`,
      colspan: '2',
    },
    {
      id: 7,
      heading: $localize`:@@Yes:yes`,
      colspan: '2',
    },
    {
      id: 8,
      heading: $localize`:@@No:no`,
      colspan: '2',
    },
  ];

  investmentTableHeader: TableHeader[] = [
    {
      id: 1,
      heading: '',
    },
    {
      id: 2,
      heading: $localize`:@@FinancialInfoProvided:FinancialInfoProvided`,
    },
  ];

  strategyListing: TableHeader[] = [
    {
      id: 1,
      heading: $localize`:@@SRNO:SRNO`,
    },
    {
      id: 2,
      heading: $localize`:@@StrategyName:StrategyName`,
    },
    {
      id: 3,
      heading: $localize`:@@StrategyRiskProfile:StrategyRiskProfile`,
    },
    {
      id: 4,
      heading: $localize`:@@StrategyView:StrategyView`,
    },
  ];

  pendingListing: TableHeader[] = [
    {
      id: 1,
      heading: $localize`:@@SRNO:SRNO`,
    },
    {
      id: 2,
      heading: $localize`:@@GoalName:GoalName`,
    },
    {
      id: 3,
      heading: $localize`:@@GoalState:GoalState`,
    },
    {
      id: 4,
      heading: $localize`:@@ViewPendingGoal:ViewPendingGoal`,
    },
  ];

  portfolioAllocation: TableHeader[] = [
    {
      id: 1,
      heading: $localize`:@@AssestClassName:AssestClassName`,
    },
    {
      id: 1,
      heading: $localize`:@@AssestName:AssestName`,
    },
    {
      id: 1,
      heading: $localize`:@@Distribution:Distribution`,
    },
  ];

  riskProfileResultHeader: TableHeader[] = [
    {
      id: 1,
      heading: $localize`:@@TotalPoints:TotalPoints`,
    },
    {
      id: 2,
      heading: $localize`:@@RiskProfile:RiskProfile`,
    },
    {
      id: 3,
      heading: $localize`:@@Definition:Definition`,
    },
  ];

  pendingGaolStatusEnumMapping = {
    GOAL_DEFINATION: $localize`:@@GoalSetting:GoalSetting`,
    RISK_PROFILE: $localize`:@@RiskProfile:RiskProfile`,
    FINANCIAL_SUITABILITY: $localize`:@@FinancialSuitability:FinancialSuitability`,
    FINANCIAL_CALCULATIONS: $localize`:@@FinancialCalculator:FinancialCalculator`,
    INVESTMENTS_STRATEGY: $localize`:@@InvestmentsStrategy:InvestmentsStrategy`,
    USER_INVESTMENTS: $localize`:@@UserInvestments:UserInvestments`,
    USER_PORTFOLIO: $localize`:@@UserPortfolio:UserPortfolio`,
  };
}
