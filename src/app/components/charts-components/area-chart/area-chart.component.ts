import { Component, Input, AfterViewInit } from "@angular/core";
import { Chart, ChartConfiguration } from "chart.js";

@Component({
  selector: "app-area-chart",
  standalone: true,
  imports: [],
  templateUrl: "./area-chart.component.html",
})
export class AreaChartComponent implements AfterViewInit {
  areaChart!: Chart<"line">;
  @Input({ required: true }) areaChartConfig!: ChartConfiguration<"line">;
  @Input({ required: true }) areaChartLabels!: string;

  createChart() {
    try {
      if (!this.areaChart && this.areaChartConfig) {
        this.areaChart = new Chart(this.areaChartLabels, this.areaChartConfig);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.createChart());
  }
}
