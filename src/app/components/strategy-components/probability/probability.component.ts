import { Component, OnInit } from '@angular/core';
import { LineChartComponent } from '@app/components/charts-components/line-chart/line-chart.component';
import { ChartConfiguration } from 'chart.js';
import { Router } from '@angular/router';
import { ButtonComponent } from '@app/components/common-components/button/button.component';
import {
  ConstantService,
  GoalSettingService,
  LoggingService,
} from '@app/services';
import { State, Status } from '@app/enum/enum';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-probability',
  standalone: true,
  imports: [LineChartComponent, ButtonComponent, TranslateModule],
  templateUrl: './probability.component.html',
})
export class ProbabilityComponent implements OnInit {
  xLabelTimeLine: number[] = [];
  corpusAtEndOfMonth: number[][] = [];
  roiColors: string[] = [];
  roi: number = 0;
  constructor(
    private goalSettingService: GoalSettingService,
    private router: Router,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public constantService: ConstantService
  ) {}
  probability: ChartConfiguration<'line'> = {
    type: 'line',
    data: { xLabels: this.xLabelTimeLine, datasets: [] },
    options: {
      layout: {
        padding: 10,
      },
      plugins: { legend: { display: true } },
      responsive: true,
      scales: {
        x: {
          ticks: { font: { size: 14, weight: 'bold' } },
          title: {
            display: true,
            text: $localize`:@@Months:Months`,
            font: { size: 14, weight: 'normal' },
          },
        },
        y: {
          ticks: { font: { size: 14, weight: 'bold' } },
          title: {
            display: true,
            text: $localize`:@@PortfolioValue:Portfolio Value ($)`,
            font: { size: 14, weight: 'normal' },
          },
        },
      },
    },
  };
  ngOnInit(): void {
    const tenureYears = Number(
      JSON.parse(localStorage.getItem('strategyFinancialCalculator') || '{}')
        .timeHorizon || 0
    );
    const totalAmount = Number(
      localStorage.getItem('expectedFutureValue') || 0
    );
    this.roi = Number(localStorage.getItem('roi') || 0);
    for (let index = 1; index <= tenureYears * 12; index++) {
      this.xLabelTimeLine.push(index);
    }
    this.calculateSIPMonthlyCorpus(totalAmount, this.roi, tenureYears);
  }
  calculateSIPMonthlyCorpus(
    totalAmount: number,
    annualROI: number,
    tenureYears: number
  ) {
    let roiChanges = [];
    if (this.roi > 6) {
      roiChanges = [
        -6 + annualROI,
        -4 + annualROI,
        -2 + annualROI,
        annualROI,
        2 + annualROI,
        4 + annualROI,
        6 + annualROI,
      ];
    } else {
      roiChanges = [
        -4 + annualROI,
        -2 + annualROI,
        annualROI,
        2 + annualROI,
        4 + annualROI,
        6 + annualROI,
      ];
    }
    this.roiColors = roiChanges.map((roi) => {
      if (roi === annualROI - 6) return 'red';
      if (roi === annualROI - 4) return 'orange';
      if (roi === annualROI - 2) return 'yellow';
      if (roi === annualROI) return 'blue';
      if (roi === annualROI + 2) return '#90EE90';
      if (roi === annualROI + 4) return '#32CD32';
      if (roi === annualROI + 6) return '#006400';
      return 'lightgreen';
    });
    const monthlyROIs = roiChanges.map((change) => change / 100 / 12);
    const totalMonths = tenureYears * 12;
    monthlyROIs.forEach((monthlyROI) => {
      let corpus = 0;
      const corpusForThisROI: number[] = [];
      for (let month = 1; month <= totalMonths; month++) {
        corpus += totalAmount;
        corpus *= 1 + monthlyROI;
        corpusForThisROI.push(Math.round(corpus));
      }
      this.corpusAtEndOfMonth.push(corpusForThisROI);
    });
    this.probability.data.datasets = this.corpusAtEndOfMonth.map(
      (data, index) => ({
        data: data,
        label: $localize`:@@ROI:ROI ${roiChanges[index]}%`,
        borderColor: this.roiColors[index],
        backgroundColor: this.roiColors[index],
        yAxisID: 'y',
      })
    );
  }

  goBack() {
    this.router.navigateByUrl(`/investment-advisor/strategy`);
  }

  proceed() {
    const userGoalId = localStorage.getItem('userGoalId');
    const userId = localStorage.getItem('userId');
    if (userGoalId && userId) {
      this.loggingService.info('Requesting goal status update');
      this.goalSettingService
        .goalStatus({
          goalId: userGoalId,
          userId: userId,
          state: State.INVESTMENTS_STRATEGY,
          status: Status.COMPLETED,
        })
        .subscribe({
          next: () => {
            this.toastr.success('Goal status updated successfully');
            this.loggingService.info('Goal status updated successfully');
          },
          error: (error) => {
            this.toastr.error('Failed to update goal status');
            this.loggingService.error(
              'Failed to update goal status',
              'src/app/components/strategy-components/probability/probability.component.ts',
              'ProbabilityComponent',
              error.message
            );
          },
        });
    }
    localStorage.setItem('strategyStatus', JSON.stringify(true));
    this.router.navigateByUrl(`/investment-advisor/investment`);
  }
}
