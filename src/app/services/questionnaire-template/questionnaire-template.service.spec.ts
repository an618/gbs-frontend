import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { QuestionnaireTemplateService } from '@app/services/questionnaire-template/questionnaire-template.service';
import { TestBed } from '@angular/core/testing';
import {
  Matrix,
  QuestionnaireTemplate,
  QuestionnaireTemplates,
} from '@app/interface/interface';
import { environment } from '@env/environment';

describe('QuestionnaireTemplateService', () => {
  let questionnaireTemplateService: QuestionnaireTemplateService;
  let httpMock: HttpTestingController;
  const questionnaireTemplateId = 'd501f602-f2d8-484e-b519-d547862d94f6';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuestionnaireTemplateService],
    });
    questionnaireTemplateService = TestBed.inject(QuestionnaireTemplateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('GetQuestionnaireTemplate', () => {
    it('should get the questionnaire template', () => {
      const mockResponse: QuestionnaireTemplates[] = [
        {
          id: 'd501f602-f2d8-484e-b519-d547862d94f6',
          name: 'RISK',
          order: 1,
          configValue: {
            total_screens: 8,
            total_questions: 8,
          },
        },
        {
          id: '7ded414a-b991-426a-8104-2079711f158a',
          name: 'SUITABILITY',
          order: 2,
          configValue: {
            total_screens: 7,
            total_questions: 7,
          },
        },
      ];

      questionnaireTemplateService.getQuestionnaireTemplate().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
        },
        error: () => {
          fail('to fetch questionnaire template');
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/questionnaire`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should handle error if questionnaire template not fetch', () => {
      const errorMessage = 'Bad Request';

      questionnaireTemplateService.getQuestionnaireTemplate().subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/questionnaire`,
      });

      mockRequest.flush(errorMessage, {
        status: 401,
        statusText: errorMessage,
      });
    });
  });

  describe('GetQuestionnaireTemplateByID', () => {
    it('should get the questionnaire template', () => {
      const mockResponse: QuestionnaireTemplate[] = [
        {
          questionId: 'ad3f27b7-7f85-41c8-8a96-0fb6cf9bb12c',
          parentQuestionId: null,
          templateId: 'd501f602-f2d8-484e-b519-d547862d94f6',
          description:
            'By understanding your current age, the investment advisor can recommend an appropriate asset allocation aligned with your stage of life. This ensures your investment portfolio is structured to support your long-term financial objectives while managing risk in a way that matches your time horizon. Selecting the age range that best reflects your current circumstances will enable the development of a tailored investment plan to meet your specific needs.',
          questionText: 'What Is Your Current Age?',
          order: 1,
          screenOrder: 1,
          questionType: 'RADIO_BUTTON_TEXT',
          answers: [
            {
              answerId: '321bb97c-caa9-4a62-ae4b-2cce0f2fd316',
              questionId: 'ad3f27b7-7f85-41c8-8a96-0fb6cf9bb12c',
              order: 1,
              description: '',
              answerText: 'Above 50 years old',
              score: 1,
              active: true,
            },
            {
              answerId: '64ef6991-a30e-4bb0-81f9-9cccabad3c6e',
              questionId: 'ad3f27b7-7f85-41c8-8a96-0fb6cf9bb12c',
              order: 2,
              description: '',
              answerText: '36 - 50 years old',
              score: 2,
              active: true,
            },
            {
              answerId: '0149b035-3e19-4456-85ee-da39bb6ad500',
              questionId: 'ad3f27b7-7f85-41c8-8a96-0fb6cf9bb12c',
              order: 3,
              description: '',
              answerText: '18 - 35 years old',
              score: 3,
              active: true,
            },
          ],
          nestedQuestions: [],
          configValue: {
            total_screens: 0,
            total_questions: 0,
          },
        },
      ];

      questionnaireTemplateService
        .getQuestionnaireTemplateByID(questionnaireTemplateId)
        .subscribe({
          next: (response) => {
            expect(response).toEqual(mockResponse);
          },
          error: () => {
            fail('to fetch questionnaire template by Id');
          },
        });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/questionnaire/${questionnaireTemplateId}/questions`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should handle error if questionnaire template by Id fetch', () => {
      const errorMessage = 'Bad Request';

      questionnaireTemplateService
        .getQuestionnaireTemplateByID(questionnaireTemplateId)
        .subscribe({
          next: () => fail('expected an error, not a successful response'),
          error: (error) => {
            expect(error.status).toBe(401);
            expect(error.error).toBe(errorMessage);
          },
        });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/questionnaire/${questionnaireTemplateId}/questions`,
      });

      mockRequest.flush(errorMessage, {
        status: 401,
        statusText: errorMessage,
      });
    });
  });

  describe('GetMetrix', () => {
    it('should get the list of metrix', () => {
      const mockResponse: Matrix[] = [
        {
          id: '6dd2bfd7-64b7-4cae-aab9-bcae9959162e',
          risk_score_lower: 8,
          risk_score_upper: 11,
          risk_profile: 'Secured',
          definition:
            'Risk: You do not want to accept any investment losses. Return: You are looking to generate return similar to fixed/term deposit rate.',
          color: '#009A06',
        },
        {
          id: '4e0d81bc-e4e4-48de-bd1a-7a5aec5f2cc7',
          risk_score_lower: 12,
          risk_score_upper: 16,
          risk_profile: 'Conservative',
          definition:
            'Risk: You can tolerate minimal level of risk and you prefer investment with limited negative price movement. Return: our target investments are looking to generate return slightly higher than fixed/term deposit rates.',
          color: '#F5B102',
        },
        {
          id: 'a8d14a28-ce47-4b62-9949-24e9e7b39172',
          risk_score_lower: 17,
          risk_score_upper: 21,
          risk_profile: 'Income',
          definition:
            'Risk: You can tolerate low levels of risk and you prefer investment that has low risk of losing entire value. Return: our target investments are focusing to provide regular income instead of capital appreciation.',
          color: '#1465DF',
        },
      ];

      questionnaireTemplateService.getMetrix().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
        },
        error: () => {
          fail('to fetch metrix list');
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/risk/metrics`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should handle error if metrix list not fetch', () => {
      const errorMessage = 'Bad Request';

      questionnaireTemplateService.getMetrix().subscribe({
        next: () => fail('expected an error, not a successful response'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/risk/metrics`,
      });

      mockRequest.flush(errorMessage, {
        status: 401,
        statusText: errorMessage,
      });
    });
  });
});
