import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { InvestmentService } from '@app/services/investment/investment.service';
import { environment } from '@env/environment';
import {
  UpdatePorfolio,
  UpdatePorfolioResponse,
} from '@app/interface/interface';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoggingService } from '@app/services/logging/logging.service';

describe('InvestmentService', () => {
  let investmentService: InvestmentService;
  let httpMock: HttpTestingController;
  let loggingService: jasmine.SpyObj<LoggingService>;

  const goalId = '5f9c98c5-f1ad-4b7f-b092-5301eb6466dd';
  const userId = 'df04d5e9-3868-4361-b185-4cc9d83a9754';
  const strategyId = '550e8400-e30b-41d4-a716-137655440002';
  const userPortfolioId = 'GBS25000000003';

  beforeEach(() => {
    const loggingSpy = jasmine.createSpyObj('LoggingService', [
      'info',
      'warn',
      'error',
      'debug',
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InvestmentService,
        { provide: LoggingService, useValue: loggingSpy },
      ],
    });
    investmentService = TestBed.inject(InvestmentService);
    httpMock = TestBed.inject(HttpTestingController);
    loggingService = TestBed.inject(
      LoggingService
    ) as jasmine.SpyObj<LoggingService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('UpdateUserPortfolio', () => {
    const mockRequestUpdateUserPorfolio: UpdatePorfolio = {
      goalId: goalId,
      userId: userId,
      strategyId: strategyId,
      configInvestmentStrategy: strategyId,
      user_portfolio_id: null,
      portfolioConstituteDto: [
        {
          modelPortfolioId: 'a1b9c3d4-e5f6-771b-8c3d-3e4f5a6b7c8d',
          userPortfolioConstitutesDto: [
            {
              userPortfolioConstituteId: '543f2506-8fe2-487b-9950-acc51d409286',
              assetName: 'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
              securityExchangeCode: 'ARCX:AAXJ',
              assetAllocation: 30.0,
              assetCurrency: '',
              initialInvestment: 750,
              monthlyInvestment: 300,
            },
            {
              userPortfolioConstituteId: '23996664-3774-4e5f-ca1b-443555555563',
              assetAllocation: 0,
              assetCurrency: '',
              assetName: 'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
              securityExchangeCode: 'NASDAQ:AAXJ',
              initialInvestment: 750,
              monthlyInvestment: 0,
            },
          ],
        },
      ],
    };

    it('should update portfolio for user', () => {
      const mockResponse: UpdatePorfolioResponse = {
        userPortfolioConstitutes: [
          {
            userPortfolioConstituteId: '74679ac6-4dcf-410a-9471-458359c92723',
            assetName: 'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
            securityExchangeCode: 'ARCX:AAXJ',
            assetAllocation: 15.0,
            assetCurrency: '',
            initialInvestment: 750,
            monthlyInvestment: 150,
          },
          {
            userPortfolioConstituteId: '08a33ee6-d4ec-4890-866f-2ce959ad52f2',
            assetName: 'iShares MSCI All Country Asia ex Japan ETF (AAXJ)',
            securityExchangeCode: 'NASDAQ:AAXJ',
            assetAllocation: 15.0,
            assetCurrency: '',
            initialInvestment: 750,
            monthlyInvestment: 150,
          },
        ],
        userPortfolioDTO: {
          user_portfolio_id: '758a2def-5f87-4fe4-8229-f4bbbe966e3e',
          userId: 'Optional[df04d5e9-3868-4361-b185-4cc9d83a9754]',
          userGoalId: '0e7387b5-6717-4fa2-9579-e3c484439ef2',
          configInvestmentStrategy: '440e8400-e30b-41d4-a716-137655440002',
          portfolioId: 'GBS25000000004',
        },
      };

      investmentService
        .updateUserPortfolio(mockRequestUpdateUserPorfolio)
        .subscribe({
          next: (response) => {
            expect(response).toEqual(mockResponse);
          },
          error: () => {
            fail('to create user portfolio');
          },
        });

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/user/goal/portfolio`,
      });

      expect(mockRequest.request.body).toEqual(mockRequestUpdateUserPorfolio);

      mockRequest.flush(mockResponse);
    });

    it('should handle error if portfolio fail to update', () => {
      const errorMessage = 'Bad Request';
      investmentService
        .updateUserPortfolio(mockRequestUpdateUserPorfolio)
        .subscribe({
          next: () => fail('expected an error, not a successful response'),
          error: (error) => {
            expect(error.status).toBe(400);
            expect(error.error).toBe(errorMessage);
          },
        });

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/user/goal/portfolio`,
      });

      mockRequest.flush(errorMessage, {
        status: 400,
        statusText: errorMessage,
      });
    });
  });

  describe('ExportUserPortfolio', () => {
    it('should download the portfolio excel sheet while clicking the button with default fileName', () => {
      const mockBlob = new Blob(['mock-blob'], {
        type: 'application/octet-stream',
      });
      let headers = new HttpHeaders();
      headers = headers.append(
        'Content-Disposition',
        `form-data; name="attachment"; filename="portfolio_${userPortfolioId}.xlsx"`
      );
      headers = headers.append('Content-Type', 'application/octet-stream');
      const mockResponse = new HttpResponse<Blob>({
        body: mockBlob,
        headers: headers,
        url: `${environment.BASE_URL}/user/portfolio/${userPortfolioId}/export`,
      });

      let mockFileName = `Portfolio_${userPortfolioId}.xlsx`;

      const mockCreateObjectURLSpy = spyOn(
        window.URL,
        'createObjectURL'
      ).and.returnValue('blob-url');
      const mockRevokeObjectURLSpy = spyOn(window.URL, 'revokeObjectURL');

      const mockAnchorElement = document.createElement('a');
      const mockClickSpy = spyOn(mockAnchorElement, 'click');
      mockAnchorElement.href = window.URL.createObjectURL(mockResponse.body!);
      mockAnchorElement.download = mockFileName;
      mockAnchorElement.click();

      const mockCreateElementSpy = spyOn(
        document,
        'createElement'
      ).and.returnValue(mockAnchorElement);

      investmentService.exportUserPortfolio(userPortfolioId).subscribe({
        next: (response) => {
          expect(response.body).toBe(mockResponse.body);
          expect(loggingService.info).toHaveBeenCalledOnceWith(
            'User portfolio exported successfully'
          );
        },
        error: () => {
          fail('to download the portfolio excel sheet');
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/user/portfolio/${userPortfolioId}/export`,
      });

      mockRequest.flush(mockResponse.body);
      expect(mockCreateObjectURLSpy).toHaveBeenCalledWith(mockBlob);
      expect(mockCreateElementSpy).toHaveBeenCalled();
      expect(mockClickSpy).toHaveBeenCalled();
      expect(mockRevokeObjectURLSpy).toHaveBeenCalledWith('blob-url');
    });

    it('should show alert and log warning when response body is empty (no file content)', () => {
      const mockBlob = new Blob([], { type: 'application/octet-stream' });
      const mockAlert = spyOn(window, 'alert');
      const mockResponse = new HttpResponse<Blob>({
        body: mockBlob,
        headers: new HttpHeaders(),
        url: `${environment.BASE_URL}/user/portfolio/${userPortfolioId}/export`,
      });

      investmentService.exportUserPortfolio(userPortfolioId).subscribe({
        next: (response) => {
          expect(response.body).toBe(mockResponse.body);
          expect(mockAlert).toHaveBeenCalledWith('No file content found.');
          expect(loggingService.warn).toHaveBeenCalledWith(
            'No content found for user portfolio export'
          );
        },
        error: () => {
          fail('to download the portfolio excel sheet');
        },
      });
      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/user/portfolio/${userPortfolioId}/export`,
      });
      mockRequest.flush(mockBlob);
    });

    it('should handle error if portfolio excel sheet while clicking the button', () => {
      const mockAlert = spyOn(window, 'alert');
      const mockBlob = new Blob([], { type: 'application/octet-stream' });
      const errorMessage = 'Bad Request';
      investmentService.exportUserPortfolio(userPortfolioId).subscribe({
        next: () => fail('to download the portfolio excel sheet'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(mockBlob);
          expect(mockAlert).toHaveBeenCalledWith(
            'An error occurred while downloading the file.'
          );
          expect(loggingService.error).toHaveBeenCalledWith(
            'Failed to export user portfolio',
            'src/app/services/investment/investment.service.ts',
            'InvestmentService',
            error.message
          );
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/user/portfolio/${userPortfolioId}/export`,
      });

      mockRequest.flush(mockBlob, {
        status: 400,
        statusText: errorMessage,
      });
    });
  });
});
