import { LogLevel, State, Status } from '@app/enum/enum';

export interface NavbarMenu {
  id: number;
  name: string;
  link: string;
  disable?: boolean;
}

export interface Language {
  id: number;
  name: string;
  link: string;
}

export interface Dashboard {
  goalName: string;
  riskProfileMatrixType: string;
  currentBalance: number;
  goalTarget: number;
  monthlyInvestment: number;
  initialInvestment: number;
  currentPortfolioReturn: number;
  expectedReturnInvestment: number;
  goalProcess: number;
}

export interface TableHeader {
  id: number;
  heading: string;
  colspan?: string;
}

export interface InvestmentTableBody {
  id: number;
  heading: string;
  financial: string;
}

export interface GoalType {
  goalTypeId: string;
  goalName: string;
  isActive: boolean;
  imagePath: string;
}

export interface UserGoal {
  userId: {
    userId: string;
  };
  goalName: string;
  goalType: GoalType;
  userAssessment: {
    userId: {
      userId: string;
    };
    status: Status;
    riskScore: number | null;
    userGoalFinancialCals: [];
  };
}

export interface GoalPendingContent extends PaginationPageable {
  content: GoalPending[];
}

export interface GoalPending {
  goalId: string;
  userId: string;
  goalName: string;
  assessmentId: string | null;
  state: State;
  status: Status;
  strategyId: string | null;
  isFinancialCalculatorSkipped: boolean;
}

export interface GoalName {
  goalName: string;
  userId: string;
  configGoalTypeId?: string;
  active?: boolean;
}

export interface GoalNameResponse {
  userGoalId: string;
  goalName: string;
  goalType: GoalName;
  assessmentId: string;
}

export interface GoalList {
  id: number;
  title: string;
  disable: boolean;
}

export interface GoalStatus {
  goalId: string;
  userId: string;
  state: State;
  status: Status;
}

export interface QuestionnaireTemplates {
  id: string;
  name: string;
  configValue: {
    total_screens: number;
    total_questions: number;
  };
  order: number;
}

export interface QuestionnaireTemplateAnswer {
  answerId: string;
  questionId: string;
  order: number;
  description: string;
  answerText: string;
  score: number;
  active: boolean;
}

export interface QuestionnaireTemplate {
  parentQuestionId: string | null;
  questionId: string;
  templateId: string;
  description: string;
  configValue: { total_screens: number; total_questions: number };
  questionText: string;
  order: number;
  screenOrder: number;
  questionType: string;
  answers: QuestionnaireTemplateAnswer[];
  nestedQuestions: QuestionnaireTemplate[] | null;
}

export interface Answer {
  questionId: string;
  answerId?: string | string[];
  answerText?: string;
  selectedAnswers?: {
    answerId?: string;
    answerText?: string;
    answered: boolean;
  }[];
  answered?: boolean;
}

export interface SubmitAssessment {
  assessmentId: string;
  userId: string;
  answers?: Answer[];
}

export interface AssessmentSubmitStatus {
  assessmentId: string;
  status: Status;
}

export interface AssessmentScore {
  assessmentId: string;
  riskScore: number;
  status: Status;
  toleranceRangeDto: {
    lower: string;
    upper: string;
  };
}

export interface Matrix {
  id: string;
  risk_score_lower: number;
  risk_score_upper: number;
  risk_profile: string;
  definition: string;
  color: string;
}

export interface FinancialCalculator {
  userGoalId: string;
  userId: string;
  corpusCurrency: string;
  expectedInflation: number;
  timeHorizon: number;
  initialInvestment: number;
  initialInvestmentCurrency: string;
  monthlyInvestment: number;
  monthlyInvestmentCurrency: string;
  currentCorpusRequired: string;
  corpusWithInflation: string;
  expectedAnnualRateOfReturnSystemGenerated: number;
  assessmentId: string;
  isFinancialCalculatorSkipped: boolean;
}

export interface Constitutes {
  assetName: string;
  securityExchangeCode: string;
  assetAllocation: number;
  assetPrice: number;
  assetCurrency: string;
  constituteId: string;
  portfolioId: string;
}

export interface ModelPortfolios {
  portfolioId: string;
  assetClassName: string;
  assetClassAllocationPercentage: string;
  investmentStrategyId: string;
  constitutes: Constitutes[];
}

export interface StrategyModelPorfolio {
  modelPortfolios: ModelPortfolios[];
  strategyId: string;
  name: string;
  riskScoreLower: number;
  riskScoreUpper: number;
  riskProfile: string;
  riskMetricId: string;
  roiLowerLimit: number;
  roiUpperLimit: number;
}

export interface PaginationPageable {
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: [];
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: [];
  numberOfElements: number;
  empty: boolean;
}

export interface StrategyModelPorfolioContent extends PaginationPageable {
  content: StrategyModelPorfolio[];
}

export interface UserPortfolio {
  userId: string;
  userGoalId: string;
  configInvestmentStrategy: string;
}

export interface UserPortfolioResponse {
  configInvestmentStrategy: string;
  portfolioId: string;
  userGoalId: string;
  userId: string;
  user_portfolio_id: string;
}

export interface UserPortfolioConstitute {
  userPortfolioConstituteId: string;
  assetName: string;
  securityExchangeCode: string;
  assetCurrency: string;
  assetAllocation: number;
  initialInvestment: number;
  monthlyInvestment: number;
}
export interface PorfolioConstitute {
  modelPortfolioId: string;
  userPortfolioConstitutesDto: UserPortfolioConstitute[];
}

export interface userPortfolio {
  user_portfolio_id: string;
  userId: string;
  userGoalId: string;
  configInvestmentStrategy: string;
  portfolioId: string;
}

export interface UpdatePorfolioResponse {
  userPortfolioConstitutes: UserPortfolioConstitute[];
  userPortfolioDTO: userPortfolio;
}

export interface UpdatePorfolio {
  strategyId: string;
  goalId: string;
  userId: string;
  user_portfolio_id: string;
  configInvestmentStrategy: string;
  portfolioConstituteDto: PorfolioConstitute[];
}

export interface LogEntry {
  logLevel: LogLevel;
  message: string;
  timestamp?: string;
  fileName?: string;
  functionName?: string;
  stackTrace?: string;
  error?: string;
  // argument: string|null;
}

export interface MonteCarloSimulationsData {
  portfolio: {
    symbol: string;
    exchange: string;
    initial_investment: number;
    monthly_investment: number;
    investment_duration_months: number;
    asset_type: string;
  }[];
  simulation_parameters: {
    num_simulations: number;
    num_years: number;
  };
}

export interface Pagination {
  page: number;
  page_size: number;
  total_pages: number;
  total_rows: number;
  start_page_count: number;
  end_page_count: number;
}

export interface DashboardData {
  id: string;
  goalName: string;
  riskProfile: string;
  currentBalance: number;
  goalTarget: string;
  progressPercent: number;
  timeline: number;
  monthlyInvestment: number;
  initialInvestment: number;
  currentPortfolioReturn: number;
  expectedReturnOnInvestment: number;
  assetAllocation: Record<string, number>;
}
