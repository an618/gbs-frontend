import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  GoalType,
  GoalName,
  GoalNameResponse,
  GoalStatus,
  GoalPending,
  GoalPendingContent,
} from '@app/interface/interface';

@Injectable({
  providedIn: 'root',
})
export class GoalSettingService {
  constructor(private http: HttpClient) {}

  getGoalSelection(): Observable<GoalType[]> {
    return this.http.get<GoalType[]>(`${environment.BASE_URL}/goals`);
  }

  goalName({
    goalName,
    configGoalTypeId,
    userId,
  }: GoalName): Observable<GoalNameResponse> {
    return this.http.post<GoalNameResponse>(
      `${environment.BASE_URL}/user-goal`,
      {
        goalName,
        configGoalTypeId,
        userId,
      }
    );
  }

  goalStatus({
    goalId,
    userId,
    state,
    status,
  }: GoalStatus): Observable<string> {
    return this.http.put<string>(`${environment.BASE_URL}/user/goal/status`, {
      goalId,
      userId,
      state,
      status,
    });
  }

  getGoalPending(
    userId: string,
    page: number = 0,
    size: number = 10
  ): Observable<GoalPendingContent> {
    return this.http.get<GoalPendingContent>(
      `${environment.BASE_URL}/user/goal/status/pending/${userId}?page=${page}&size=${size}`
    );
  }
}
