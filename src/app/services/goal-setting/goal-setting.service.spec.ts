import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { State, Status } from '@app/enum/enum';
import {
  GoalName,
  GoalNameResponse,
  GoalPending,
  GoalStatus,
  GoalType,
} from '@app/interface/interface';
import { GoalSettingService } from '@app/services/goal-setting/goal-setting.service';
import { environment } from '@env/environment';

describe('GoalSettingService', () => {
  let goalSettingService: GoalSettingService;
  let httpMock: HttpTestingController;

  const userId = 'df04d5e9-3868-4361-b185-123456789009';
  const assessmentId = 'df04d5e9-3868-4361-b185-123456789009';
  const goalId = 'df04d5e9-3868-4361-b185-123456789009';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoalSettingService],
      imports: [HttpClientTestingModule],
    });
    goalSettingService = TestBed.inject(GoalSettingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('GetGoalPending', () => {
    it('should get the list of goal pending', () => {
      const mockResponse: GoalPending[] = [
        {
          goalId: goalId,
          userId: userId,
          goalName: 'goalName1',
          assessmentId: assessmentId,
          state: State.USER_PORTFOLIO,
          status: Status.COMPLETED,
        },
        {
          goalId: goalId,
          userId: userId,
          goalName: 'goalName2',
          assessmentId: assessmentId,
          state: State.RISK_PROFILE,
          status: Status.INCOMPLETE,
        },
        {
          goalId: goalId,
          userId: userId,
          goalName: 'goalName2',
          assessmentId: assessmentId,
          state: State.INVESTMENTS_STRATEGY,
          status: Status.COMPLETED,
        },
      ];

      goalSettingService.getGoalPending(userId).subscribe({
        next: (response) => {
          expect(response).toBe(mockResponse);
        },
        error: () => fail('to fetch list of goal pending'),
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/user/goal/status/pending/${userId}`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should get the empty list of goal pending', () => {
      const mockResponse: GoalPending[] = [];
      goalSettingService.getGoalPending(userId).subscribe({
        next: (response) => {
          expect(response).toBe(mockResponse);
        },
        error: () => fail('to fetch list of goal pending'),
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/user/goal/status/pending/${userId}`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should handle error if goal pending list not fetch', () => {
      const errorMessage = 'Bad Request';
      goalSettingService.getGoalPending(userId).subscribe({
        next: () => fail('to fetch list of goal pending'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/user/goal/status/pending/${userId}`,
      });

      mockRequest.flush(errorMessage, {
        status: 400,
        statusText: errorMessage,
      });
    });
  });

  describe('GetGoalSelection', () => {
    it('should get the list of goal name ', () => {
      const mockResponse: GoalType[] = [
        {
          goalTypeId: goalId,
          goalName: 'goalName',
          isActive: true,
          imagePath: 'imagePath',
        },
        {
          goalTypeId: goalId,
          goalName: 'goalName',
          isActive: true,
          imagePath: 'imagePath',
        },
        {
          goalTypeId: goalId,
          goalName: 'goalName',
          isActive: true,
          imagePath: 'imagePath',
        },
      ];
      goalSettingService.getGoalSelection().subscribe({
        next: (response) => {
          expect(response).toBe(mockResponse);
        },
        error: () => fail('to fetch list of goal name'),
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/goals`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should get the empty list of goal name ', () => {
      const mockResponse: GoalType[] = [];
      goalSettingService.getGoalSelection().subscribe({
        next: (response) => {
          expect(response).toBe(mockResponse);
        },
        error: () => fail('to fetch list of goal name'),
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/goals`,
      });

      mockRequest.flush(mockResponse);
    });

    it('should handle error if goal name list not fetch', () => {
      const errorMessage = 'Bad Request';
      goalSettingService.getGoalSelection().subscribe({
        next: () => fail('to fetch list of goal pending'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'GET',
        url: `${environment.BASE_URL}/goals`,
      });

      mockRequest.flush(errorMessage, {
        status: 400,
        statusText: errorMessage,
      });
    });
  });

  describe('GoalName', () => {
    it('should give the goal name ', () => {
      const mockRequestBody: GoalName = {
        configGoalTypeId: goalId,
        goalName: 'goalName',
        userId: userId,
      };
      const mockResponse: GoalNameResponse = {
        userGoalId: goalId,
        goalName: 'goalName',
        goalType: mockRequestBody,
        assessmentId: assessmentId,
      };
      goalSettingService.goalName(mockRequestBody).subscribe({
        next: (response) => {
          expect(response).toBe(mockResponse);
        },
        error: () => fail('to give goal name'),
      });

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/user-goal`,
      });
      expect(mockRequest.request.body).toEqual(mockRequestBody);

      mockRequest.flush(mockResponse);
    });

    it('should handle error if goal name  not post', () => {
      const mockRequestBody: GoalName = {
        configGoalTypeId: goalId,
        goalName: 'goalName',
        userId: userId,
      };

      const errorMessage = 'Bad Request';
      goalSettingService.goalName(mockRequestBody).subscribe({
        next: () => fail('to update goal name'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'POST',
        url: `${environment.BASE_URL}/user-goal`,
      });

      mockRequest.flush(errorMessage, {
        status: 400,
        statusText: errorMessage,
      });
    });
  });

  describe('GoalStatus', () => {
    it('should update the goal Status ', () => {
      const mockRequestBody: GoalStatus = {
        goalId: goalId,
        state: State.GOAL_DEFINATION,
        status: Status.NEW,
        userId: userId,
      };
      const mockResponse: string = 'goal status update successfully';
      goalSettingService.goalStatus(mockRequestBody).subscribe({
        next: (response) => {
          expect(response).toBe(mockResponse);
        },
        error: () => fail('to give update goal status'),
      });

      const mockRequest = httpMock.expectOne({
        method: 'PUT',
        url: `${environment.BASE_URL}/user/goal/status`,
      });
      expect(mockRequest.request.body).toEqual(mockRequestBody);

      mockRequest.flush(mockResponse);
    });

    it('should handle error if goal name  not post', () => {
      const mockRequestBody: GoalStatus = {
        goalId: goalId,
        state: State.GOAL_DEFINATION,
        status: Status.NEW,
        userId: userId,
      };
      const errorMessage = 'Bad Request';

      goalSettingService.goalStatus(mockRequestBody).subscribe({
        next: () => fail('to update goal status '),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });

      const mockRequest = httpMock.expectOne({
        method: 'PUT',
        url: `${environment.BASE_URL}/user/goal/status`,
      });

      mockRequest.flush(errorMessage, {
        status: 400,
        statusText: errorMessage,
      });
    });
  });
});
