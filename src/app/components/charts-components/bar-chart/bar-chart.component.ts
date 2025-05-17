import { Component, Input, AfterViewInit } from "@angular/core";
import { Chart, ChartConfiguration } from "chart.js";

@Component({
  selector: "app-bar-chart",
  standalone: true,
  imports: [],
  templateUrl: "./bar-chart.component.html",
})
export class BarChartComponent implements AfterViewInit {
  barChart!: Chart<"bar">;
  @Input({ required: true }) barChartConfig!: ChartConfiguration<"bar">;
  @Input({ required: true }) barChartLabels!: string;

  createChart() {
    try {
      if (!this.barChart && this.barChartConfig) {
        this.barChart = new Chart(this.barChartLabels, this.barChartConfig);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.createChart());
  }
}
