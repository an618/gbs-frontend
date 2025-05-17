import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Matrix,
  QuestionnaireTemplate,
  QuestionnaireTemplates,
} from '@app/interface/interface';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireTemplateService {
  constructor(private http: HttpClient) {}

  getQuestionnaireTemplate(): Observable<QuestionnaireTemplates[]> {
    return this.http.get<QuestionnaireTemplates[]>(
      `${environment.BASE_URL}/questionnaire`
    );
  }

  getQuestionnaireTemplateByID(
    questionnaireTemplateId: string
  ): Observable<QuestionnaireTemplate[]> {
    return this.http.get<QuestionnaireTemplate[]>(
      `${environment.BASE_URL}/questionnaire/${questionnaireTemplateId}/questions`
    );
  }

  getMetrix(): Observable<Matrix[]> {
    return this.http.get<Matrix[]>(`${environment.BASE_URL}/risk/metrics`);
  }
}
