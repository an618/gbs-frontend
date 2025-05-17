import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MonteCarloSimulationsService } from '@app/services/monte-carlo-simulations/monte-carlo-simulations.service';
import { environment } from '@env/environment';

describe('MonteCarloSimulationsService', () => {
  let monteCarloSimulationsService: MonteCarloSimulationsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MonteCarloSimulationsService],
    });
    monteCarloSimulationsService = TestBed.inject(MonteCarloSimulationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockRequestBoby = {
    portfolio: [
      {
        symbol: 'SPY',
        exchange: 'NYSE',
        one_time_investment: 10000,
        monthly_investment: 500,
        investment_duration_months: 120,
        asset_type: 'ETF',
      },
      {
        symbol: 'AAPL',
        exchange: 'NASDAQ',
        one_time_investment: 5000,
        monthly_investment: 300,
        investment_duration_months: 120,
        asset_type: 'Stock',
      },
      {
        symbol: 'VTI',
        exchange: 'NYSE',
        one_time_investment: 15000,
        monthly_investment: 1000,
        investment_duration_months: 120,
        asset_type: 'ETF',
      },
    ],
    simulation_parameters: {
      num_simulations: 10000,
      num_years: 1,
    },
  };

  it('should create the monte carlo image', () => {
    const mockBlob = new Blob(['mock-blob'], {
      type: 'image/png',
    });
    monteCarloSimulationsService
      .monteCarloSimulations(mockRequestBoby)
      .subscribe({
        next: (response) => {
          expect(response).toEqual(mockBlob);
        },
        error: () => {
          fail('to get monte carlo image ');
        },
      });

    const mockRequest = httpMock.expectOne({
      method: 'POST',
      url: `${environment.BASE_URL}/monte-carlo/generate/simulation`,
    });

    expect(mockRequest.request.body.data).toEqual(mockRequestBoby);

    mockRequest.flush(mockBlob);
  });

  it('should handle error if monte carlo simulation fails', () => {
    const errorMessage = 'Bad Request';

    const mockBlob = new Blob([], {
      type: 'image/png',
    });

    monteCarloSimulationsService
      .monteCarloSimulations(mockRequestBoby)
      .subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(mockBlob);
        },
      });

    const mockRequest = httpMock.expectOne({
      method: 'POST',
      url: `${environment.BASE_URL}/monte-carlo/generate/simulation`,
    });

    mockRequest.flush(mockBlob, {
      status: 400,
      statusText: errorMessage,
      headers: { 'Content-Type': 'image/png' },
    });
  });
});
