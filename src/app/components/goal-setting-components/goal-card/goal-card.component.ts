import { Component, Input } from "@angular/core";

@Component({
  selector: "app-goal-card",
  standalone: true,
  imports: [],
  templateUrl: "./goal-card.component.html",
})
export class GoalCardComponent {
  @Input() title: string = "";
  @Input() img: string = "";
}
