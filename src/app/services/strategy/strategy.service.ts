import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FinancialCalculator,
  StrategyModelPorfolio,
  StrategyModelPorfolioContent,
} from '@app/interface/interface';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StrategyService {
  constructor(private http: HttpClient) {}

  financialCalculator({
    userGoalId,
    userId,
    corpusCurrency,
    expectedInflation,
    timeHorizon,
    initialInvestment,
    initialInvestmentCurrency,
    monthlyInvestment,
    monthlyInvestmentCurrency,
    currentCorpusRequired,
    corpusWithInflation,
    expectedAnnualRateOfReturnSystemGenerated,
    assessmentId,
    isFinancialCalculatorSkipped,
  }: FinancialCalculator): Observable<FinancialCalculator> {
    return this.http.post<FinancialCalculator>(
      `${environment.BASE_URL}/financial-calc`,
      {
        userGoalId,
        userId,
        corpusCurrency,
        expectedInflation,
        timeHorizon,
        initialInvestment,
        initialInvestmentCurrency,
        monthlyInvestment,
        monthlyInvestmentCurrency,
        currentCorpusRequired,
        corpusWithInflation,
        expectedAnnualRateOfReturnSystemGenerated,
        assessmentId,
        isFinancialCalculatorSkipped,
      }
    );
  }

  getFinancialCalculator(userGoalId: string): Observable<FinancialCalculator> {
    return this.http.get<FinancialCalculator>(
      `${environment.BASE_URL}/financial-calc/goal/${userGoalId}`
    );
  }

  getStrategy(
    riskScore?: number,
    roi?: number,
    page: number = 0,
    size: number = 10
  ): Observable<StrategyModelPorfolioContent> {
    let url = `${environment.BASE_URL}/strategy`;
    if (riskScore) {
      url += `?riskScore=${riskScore}&roi=${roi}&page=${page}&size=${size}`;
    } else {
      url += `?riskScore=0&roi=0`;
    }
    return this.http.get<StrategyModelPorfolioContent>(url);
  }

  getStrategyById(strategyId: string): Observable<StrategyModelPorfolio> {
    return this.http.get<StrategyModelPorfolio>(
      `${environment.BASE_URL}/strategy/${strategyId}`
    );
  }

  updateGoalStrategy(goalId: string, strategyId: string): Observable<any> {
    return this.http.patch(
      `${environment.BASE_URL}/user/goal/status/update/strategy/${goalId}`,
      { strategyId }
    );
  }
}
