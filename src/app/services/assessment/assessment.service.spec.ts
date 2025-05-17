import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Status } from '@app/enum/enum';
import { AssessmentService } from '@app/services/assessment/assessment.service';
import { environment } from '@env/environment';
import { SubmitAssessment } from '@app/interface/interface';

describe('AssessmentService', () => {
  let assessmentService: AssessmentService;
  let httpMock: HttpTestingController;
  const assessmentId = 'df04d5e9-3868-4361-b185-123456789009';
  const userId = 'df04d5e9-3868-4361-b185-4cc9d83a9754';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AssessmentService],
    });
    assessmentService = TestBed.inject(AssessmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('GetAssessmentScore', () => {
    it('should get assessment scorce', () => {
      const mockResponse = {
        assessmentId: assessmentId,
        riskScore: 20,
        status: Status.COMPLETED,
      };

      assessmentService.getAssessmentScore(assessmentId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
        },
        error: () => fail('fail to get assessment scorce'),
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/assessment/${assessmentId}/risk-score`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should handle error to get assessment scorce', () => {
      const errorMessage = 'Bad Request';

      assessmentService.getAssessmentScore(assessmentId).subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/assessment/${assessmentId}/risk-score`,
      });

      mockRequest.flush(errorMessage, {
        status: 400,
        statusText: errorMessage,
      });
    });
  });

  describe('SubmitAssessment', () => {
    const mockRequestBody: SubmitAssessment = {
      assessmentId: assessmentId,
      userId: userId,
      answers: [
        {
          answerId: '0149b035-3e19-4456-85ee-da39bb6ad500',
          answerText: '18 - 35 years old',
          answered: true,
          questionId: 'ad3f27b7-7f85-41c8-8a96-0fb6cf9bb12c',
        },
      ],
    };

    it('should submit the assessment answer', () => {
      assessmentService.submitAssessment(mockRequestBody).subscribe({
        next: () => {
          expect(NaN).toBeNaN();
        },
        error: () => fail('fail to submit the assessment answer'),
      });
      const mockRequest = httpMock.expectOne({
        method: 'PUT',
        url: `${environment.BASE_URL}/assessment/${assessmentId}/answer`,
      });
      expect(mockRequest.request.body).toEqual(mockRequestBody);

      mockRequest.flush(NaN);
    });

    it('should skip the assessment answer', () => {
      const mockRequestBody: SubmitAssessment = {
        assessmentId: assessmentId,
        userId: userId,
        answers: [],
      };

      assessmentService.submitAssessment(mockRequestBody).subscribe({
        next: () => {
          expect(NaN).toBeNaN();
        },
        error: () => fail('fail to skip the assessment answer'),
      });
      const mockRequest = httpMock.expectOne({
        method: 'PUT',
        url: `${environment.BASE_URL}/assessment/${assessmentId}/answer`,
      });
      expect(mockRequest.request.body).toEqual(mockRequestBody);

      mockRequest.flush(NaN);
    });

    it('should handle error if assessment answer fail', () => {
      const errorMessage = 'Bad Request';

      assessmentService.submitAssessment(mockRequestBody).subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });
      const mockRequest = httpMock.expectOne({
        method: 'PUT',
        url: `${environment.BASE_URL}/assessment/${assessmentId}/answer`,
      });

      mockRequest.flush(errorMessage, {
        status: 400,
        statusText: errorMessage,
      });
    });
  });
});
