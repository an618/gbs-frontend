import { AfterViewInit, Component, Input } from "@angular/core";
import { Chart, ChartConfiguration } from "chart.js/auto";

@Component({
  selector: "app-line-chart",
  standalone: true,
  imports: [],
  templateUrl: "./line-chart.component.html",
})
export class LineChartComponent implements AfterViewInit {
  lineChart!: Chart<"line">;
  @Input({ required: true }) lineChartConfig!: ChartConfiguration<"line">;
  @Input({ required: true }) lineChartLabels!: string;

  createChart() {
    try {
      if (!this.lineChart && this.lineChartConfig) {
        this.lineChart = new Chart(this.lineChartLabels, this.lineChartConfig);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.createChart());
  }
}
