import { Component, Input } from '@angular/core';
import { StrategyModelPorfolio } from '@app/interface/interface';
import { DoubleDoughnutChartComponent } from '@app/components/charts-components/double-doughnut-chart/double-doughnut-chart.component';
import { ArcElement, ChartConfiguration } from 'chart.js';
import { LoaderService } from '@app/services/loader/loader.service';
import { LoaderComponent } from '@app/components/common-components/loader/loader.component';

@Component({
  selector: 'app-model-porfolio',
  standalone: true,
  imports: [DoubleDoughnutChartComponent, LoaderComponent],
  templateUrl: './model-porfolio.component.html',
})
export class ModelPorfolioComponent {
  @Input() strategyModelPorfolio: StrategyModelPorfolio = {
    modelPortfolios: [],
    strategyId: '',
    name: 'demo',
    riskScoreLower: 0,
    riskScoreUpper: 0,
    riskProfile: '',
    riskMetricId: '',
    roiLowerLimit: 0,
    roiUpperLimit: 0,
  };

  constructor(public loaderService: LoaderService) {}

  chart(name: string) {
    this.loaderService.setLoader(true);
    const strategyModelPorfolioData: number[] = [];
    const strategyModelPorfolioLabel: string[] = [];
    const strategyModelPorfolioLabelWithPercentage: string[] = [];
    if (this.strategyModelPorfolio) {
      for (const key in this.strategyModelPorfolio?.modelPortfolios) {
        strategyModelPorfolioData.push(
          Number(
            this.strategyModelPorfolio?.modelPortfolios[
              key as any
            ]?.assetClassAllocationPercentage.split('%')[0]
          )
        );
        strategyModelPorfolioLabelWithPercentage.push(
          this.strategyModelPorfolio?.modelPortfolios[key as any]
            ?.assetClassName +
            ' ' +
            this.strategyModelPorfolio?.modelPortfolios[key as any]
              ?.assetClassAllocationPercentage
        );
        strategyModelPorfolioLabel.push(
          this.strategyModelPorfolio?.modelPortfolios[key as any]
            ?.assetClassName
        );
      }
    }
    const recommendedPortfolioChart: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: strategyModelPorfolioLabel,
        datasets: [
          {
            type: 'doughnut',
            data: strategyModelPorfolioData,
            backgroundColor: [
              '#01058A',
              '#002BB4',
              '#1D76D2',
              '#1BA9EA',
              '#66A9E3',
            ],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
          },
        ],
      },
      options: {
        cutout: '70%',
        layout: {
          padding: 120,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
      plugins: [
        {
          id: name,
          afterDatasetsDraw: (chart) => {
            const { ctx } = chart;
            function wrapText(
              text: string,
              x: number,
              y: number,
              maxWidth: number,
              lineHeight: number
            ) {
              const words = text.split(' ');
              let line = '';
              let lineCount = 0;
              words.forEach((word) => {
                const testLine = line ? `${line} ${word}` : word;
                const testWidth = ctx.measureText(testLine).width;
                if (testWidth > maxWidth) {
                  ctx.fillText(line, x, y + lineCount * lineHeight);
                  line = word;
                  lineCount++;
                } else {
                  line = testLine;
                }
              });
              if (line) {
                ctx.fillText(line, x, y + lineCount * lineHeight);
              }
            }
            chart.getDatasetMeta(0).data.forEach((element, index) => {
              const arcElement = element as ArcElement;
              const centerX = arcElement.x;
              const centerY = arcElement.y;
              const startAngle = arcElement.startAngle;
              const endAngle = arcElement.endAngle;
              const centerAngle = (startAngle + endAngle) / 2;
              const outerRadius = arcElement.outerRadius + 50;
              const xCoordinate = centerX + outerRadius * Math.cos(centerAngle);
              const yCoordinate = centerY + outerRadius * Math.sin(centerAngle);
              ctx.save();
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#29314B';
              ctx.font = 'bold 13px Lato';
              wrapText(
                strategyModelPorfolioLabelWithPercentage[index],
                xCoordinate,
                yCoordinate,
                70,
                15
              );
              ctx.restore();
            });
          },
        },
      ],
    };

    this.loaderService.setLoader(false);
    return recommendedPortfolioChart;
  }
}
