import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubmitAssessment, AssessmentScore } from '@app/interface/interface';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  constructor(private http: HttpClient) {}

  submitAssessment({
    assessmentId,
    userId,
    answers,
  }: SubmitAssessment): Observable<SubmitAssessment> {
    return this.http.put<SubmitAssessment>(
      `${environment.BASE_URL}/assessment/${assessmentId}/answer`,
      {
        assessmentId,
        userId,
        answers,
      }
    );
  }

  getAssessmentScore(assessmentId: string) {
    return this.http.get<AssessmentScore>(
      `${environment.BASE_URL}/assessment/${assessmentId}/risk-score`
    );
  }
}
