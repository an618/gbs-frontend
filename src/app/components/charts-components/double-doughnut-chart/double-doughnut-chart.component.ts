import { AfterViewInit, Component, Input } from "@angular/core";
import Chart, { ChartConfiguration } from "chart.js/auto";

@Component({
  selector: "app-double-doughnut-chart",
  standalone: true,
  imports: [],
  templateUrl: "./double-doughnut-chart.component.html",
})
export class DoubleDoughnutChartComponent implements AfterViewInit {
  doubleDoughnutChart!: Chart<"doughnut">;
  @Input({ required: true })
  doubleDoughnutChartConfig!: ChartConfiguration<"doughnut">;
  @Input({ required: true }) doubleDoughnutChartLabels!: string;

  createChart() {
    try {
      if (!this.doubleDoughnutChart && this.doubleDoughnutChartConfig) {
        this.doubleDoughnutChart = new Chart<"doughnut">(
          this.doubleDoughnutChartLabels,
          this.doubleDoughnutChartConfig
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.createChart());
  }
}
