import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { StrategyService } from '@app/services/strategy/strategy.service';
import { environment } from '@env/environment';
import {
  FinancialCalculator,
  StrategyModelPorfolio,
  StrategyModelPorfolioContent,
} from '@app/interface/interface';

describe('StrategyService', () => {
  let strategyService: StrategyService;
  let httpMock: HttpTestingController;
  const goalId = '5f9c98c5-f1ad-4b7f-b092-5301eb6466dd';
  const userId = 'df04d5e9-3868-4361-b185-4cc9d83a9754';
  const strategyId = '550e8400-e30b-41d4-a716-137655440002';
  const userGoalId = '550e8400-e30b-41d4-a716-137655440002';
  const riskScore = 10;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StrategyService],
    });
    strategyService = TestBed.inject(StrategyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('FinancialCalculator', () => {
    const mockRequestBodyFinancialCalculator: FinancialCalculator = {
      corpus: '1000000',
      corpusCurrency: '',
      expectedAnnualRateOfReturn: 1218994,
      expectedInflation: 2,
      initialInvestment: 5000,
      initialInvestmentCurrency: '',
      monthlyInvestment: 1000,
      monthlyInvestmentCurrency: '',
      timeHorizon: 10,
      userGoalId: goalId,
      userId: userId,
    };

    it('should post financial calculator ', () => {
      strategyService
        .financialCalculator(mockRequestBodyFinancialCalculator)
        .subscribe({
          next: (response) => {
            expect(response).toEqual(mockRequestBodyFinancialCalculator);
          },
          error: () => {
            fail('to submit financial calculator ');
          },
        });

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/financial-calc`,
      });

      expect(mockRequest.request.body).toEqual(
        mockRequestBodyFinancialCalculator
      );

      mockRequest.flush(mockRequestBodyFinancialCalculator);
    });

    it('should handle error if financial calculator fail', () => {
      const errorMessage = 'Bad Request';

      strategyService
        .financialCalculator(mockRequestBodyFinancialCalculator)
        .subscribe({
          next: () => fail('expected an error, not a successful response'),
          error: (error) => {
            expect(error.status).toBe(404);
            expect(error.error).toBe(errorMessage);
          },
        });

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/financial-calc`,
      });

      mockRequest.flush(errorMessage, {
        status: 404,
        statusText: errorMessage,
      });
    });
  });

  describe('GetFinancialCalculator', () => {
    const mockResponse: FinancialCalculator = {
      corpus: '1000000',
      corpusCurrency: '',
      expectedAnnualRateOfReturn: 1218994,
      expectedInflation: 2,
      initialInvestment: 5000,
      initialInvestmentCurrency: '',
      monthlyInvestment: 1000,
      monthlyInvestmentCurrency: '',
      timeHorizon: 10,
      userGoalId: goalId,
      userId: userId,
    };

    it('should post financial calculator ', () => {
      strategyService.getFinancialCalculator(userGoalId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
        },
        error: () => {
          fail('to get financial calculator ');
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/financial-calc/goal/${userGoalId}`,
      });
      mockRequest.flush(mockResponse);
    });

    it('should handle error if financial calculator get fail', () => {
      const errorMessage = 'Bad Request';

      strategyService.getFinancialCalculator(userGoalId).subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/financial-calc/goal/${userGoalId}`,
      });

      mockRequest.flush(errorMessage, {
        status: 404,
        statusText: errorMessage,
      });
    });
  });

  describe('GetStrategy', () => {
    it('should get list of strategy which has risk score greater than 0 ', () => {
      const mockResponse: StrategyModelPorfolioContent = {
        content: [
          {
            strategyId: '440e8400-e30b-41d4-a716-137655440002',
            name: 'HC-Harmony',
            riskScoreLower: 32,
            riskScoreUpper: 35,
            riskProfile: 'Speculative',
            riskMetricId: '8b2d5ed5-770d-431b-8f6d-f6c82f80310f',
            modelPortfolios: [
              {
                portfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
                assetClassName: 'Equity Funds',
                assetClassAllocationPercentage: '40',
                investmentStrategyId: '440e8400-e30b-41d4-a716-137655440002',
                constitutes: [
                  {
                    constituteId: '13996664-3774-4e5f-ca1b-443555555563',
                    assetName:
                      'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
                    securityExchangeCode: 'ARCX:AAXJ',
                    assetAllocation: 15.0,
                    assetCurrency: '',
                    portfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
                    assetPrice: 0,
                  },
                  {
                    constituteId: '13996664-3774-4e5f-ca1b-443555555563',
                    assetName:
                      'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
                    securityExchangeCode: 'ARCX:AAXJ',
                    assetAllocation: 15.0,
                    assetCurrency: '',
                    portfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
                    assetPrice: 0,
                  },
                ],
              },
              {
                portfolioId: 'a1b8c3d4-e5f6-772b-8c3d-3e4f5a6b7c8d',
                assetClassName: 'Balanced Funds',
                assetClassAllocationPercentage: '30',
                investmentStrategyId: '440e8400-e30b-41d4-a716-137655440002',
                constitutes: [
                  {
                    constituteId: '33996661-3774-4e5f-ca1b-443555555563',
                    assetName: 'WisdomTree India Earnings Fund (EPI)',
                    securityExchangeCode: 'ARCX:EPI',
                    assetAllocation: 10.0,
                    assetCurrency: '',
                    portfolioId: 'a1b8c3d4-e5f6-772b-8c3d-3e4f5a6b7c8d',
                    assetPrice: 0,
                  },
                  {
                    constituteId: '33396662-3774-4e5f-ca1b-443555555563',
                    assetName: 'BlackRock Global Allocation Fund',
                    securityExchangeCode: 'NASDAQ:MDLOX',
                    assetAllocation: 10.0,
                    assetCurrency: '',
                    portfolioId: 'a1b8c3d4-e5f6-772b-8c3d-3e4f5a6b7c8d',
                    assetPrice: 0,
                  },
                ],
              },
            ],
            roiLowerLimit: 0,
            roiUpperLimit: 0,
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 0,
          sort: [],
          offset: 0,
          paged: false,
          unpaged: false,
        },
        totalElements: 0,
        totalPages: 0,
        last: false,
        first: false,
        size: 0,
        number: 0,
        sort: [],
        numberOfElements: 0,
        empty: false,
      };

      strategyService.getStrategy(riskScore).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
        },
        error: () => {
          fail('to fetch strategy list ');
        },
      });

      expect(riskScore).toBe(10);

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/strategy?riskScore=${riskScore}`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should get list of strategy which has risk score 0', () => {
      const mockResponse: StrategyModelPorfolioContent = {
        content: [
          {
            strategyId: '440e8400-e30b-41d4-a716-137655440002',
            name: 'HC-Harmony',
            riskScoreLower: 32,
            riskScoreUpper: 35,
            riskProfile: 'Speculative',
            riskMetricId: '8b2d5ed5-770d-431b-8f6d-f6c82f80310f',
            modelPortfolios: [
              {
                portfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
                assetClassName: 'Equity Funds',
                assetClassAllocationPercentage: '40',
                investmentStrategyId: '440e8400-e30b-41d4-a716-137655440002',
                constitutes: [
                  {
                    constituteId: '13996664-3774-4e5f-ca1b-443555555563',
                    assetName:
                      'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
                    securityExchangeCode: 'ARCX:AAXJ',
                    assetAllocation: 15.0,
                    assetCurrency: '',
                    portfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
                    assetPrice: 0,
                  },
                  {
                    constituteId: '13996664-3774-4e5f-ca1b-443555555563',
                    assetName:
                      'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
                    securityExchangeCode: 'ARCX:AAXJ',
                    assetAllocation: 15.0,
                    assetCurrency: '',
                    portfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
                    assetPrice: 0,
                  },
                ],
              },
              {
                portfolioId: 'a1b8c3d4-e5f6-772b-8c3d-3e4f5a6b7c8d',
                assetClassName: 'Balanced Funds',
                assetClassAllocationPercentage: '30',
                investmentStrategyId: '440e8400-e30b-41d4-a716-137655440002',
                constitutes: [
                  {
                    constituteId: '33996661-3774-4e5f-ca1b-443555555563',
                    assetName: 'WisdomTree India Earnings Fund (EPI)',
                    securityExchangeCode: 'ARCX:EPI',
                    assetAllocation: 10.0,
                    assetCurrency: '',
                    portfolioId: 'a1b8c3d4-e5f6-772b-8c3d-3e4f5a6b7c8d',
                    assetPrice: 0,
                  },
                  {
                    constituteId: '33396662-3774-4e5f-ca1b-443555555563',
                    assetName: 'BlackRock Global Allocation Fund',
                    securityExchangeCode: 'NASDAQ:MDLOX',
                    assetAllocation: 10.0,
                    assetCurrency: '',
                    portfolioId: 'a1b8c3d4-e5f6-772b-8c3d-3e4f5a6b7c8d',
                    assetPrice: 0,
                  },
                ],
              },
            ],
            roiLowerLimit: 0,
            roiUpperLimit: 0,
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 0,
          sort: [],
          offset: 0,
          paged: false,
          unpaged: false,
        },
        totalElements: 0,
        totalPages: 0,
        last: false,
        first: false,
        size: 0,
        number: 0,
        sort: [],
        numberOfElements: 0,
        empty: false,
      };

      const riskScore = 0;
      expect(riskScore).toBe(0);

      strategyService.getStrategy(riskScore).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
        },
        error: () => {
          fail('to fetch strategy list ');
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/strategy?riskScore=${riskScore}`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should handle error if strategy not fetch', () => {
      const errorMessage = 'Bad Request';
      strategyService.getStrategy(riskScore).subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/strategy?riskScore=${riskScore}`,
      });

      mockRequest.flush(errorMessage, {
        status: 404,
        statusText: errorMessage,
      });
    });
  });

  describe('GetStrategyById', () => {
    it('should get strategy by Id  ', () => {
      const mockResponse: StrategyModelPorfolio = {
        strategyId: '440e8400-e30b-41d4-a716-137655440002',
        name: 'HC-Harmony',
        riskScoreLower: 32,
        riskScoreUpper: 35,
        riskProfile: 'Speculative',
        riskMetricId: '8b2d5ed5-770d-431b-8f6d-f6c82f80310f',
        modelPortfolios: [
          {
            portfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
            assetClassName: 'Equity Funds',
            assetClassAllocationPercentage: '40',
            investmentStrategyId: '440e8400-e30b-41d4-a716-137655440002',
            constitutes: [
              {
                constituteId: '13996664-3774-4e5f-ca1b-443555555563',
                assetName: 'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
                securityExchangeCode: 'ARCX:AAXJ',
                assetAllocation: 15.0,
                assetCurrency: '',
                portfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
                assetPrice: 0,
              },
              {
                constituteId: '13996664-3774-4e5f-ca1b-443555555563',
                assetName: 'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
                securityExchangeCode: 'ARCX:AAXJ',
                assetAllocation: 15.0,
                assetCurrency: '',
                portfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
                assetPrice: 0,
              },
            ],
          },
          {
            portfolioId: 'a1b8c3d4-e5f6-772b-8c3d-3e4f5a6b7c8d',
            assetClassName: 'Balanced Funds',
            assetClassAllocationPercentage: '30',
            investmentStrategyId: '440e8400-e30b-41d4-a716-137655440002',
            constitutes: [
              {
                constituteId: '33996661-3774-4e5f-ca1b-443555555563',
                assetName: 'WisdomTree India Earnings Fund (EPI)',
                securityExchangeCode: 'ARCX:EPI',
                assetAllocation: 10.0,
                assetCurrency: '',
                portfolioId: 'a1b8c3d4-e5f6-772b-8c3d-3e4f5a6b7c8d',
                assetPrice: 0,
              },
              {
                constituteId: '33396662-3774-4e5f-ca1b-443555555563',
                assetName: 'BlackRock Global Allocation Fund',
                securityExchangeCode: 'NASDAQ:MDLOX',
                assetAllocation: 10.0,
                assetCurrency: '',
                portfolioId: 'a1b8c3d4-e5f6-772b-8c3d-3e4f5a6b7c8d',
                assetPrice: 0,
              },
            ],
          },
        ],
        roiLowerLimit: 0,
        roiUpperLimit: 0,
      };
      strategyService.getStrategyById(strategyId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
        },
        error: () => {
          fail('to fetch strategy by Id');
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/strategy/${strategyId}`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should handle error if strategy by Id not fetch', () => {
      const errorMessage = 'Bad Request';

      strategyService.getStrategyById(strategyId).subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/strategy/${strategyId}`,
      });

      mockRequest.flush(errorMessage, {
        status: 404,
        statusText: errorMessage,
      });
    });
  });
});
